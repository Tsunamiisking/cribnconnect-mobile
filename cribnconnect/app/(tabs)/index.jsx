import { getEvents, getHotEvents } from "@/api/services/eventServices";
import EventCard from "@/components/EventCard";
import NormalHeader from "@/components/NormalHeader";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Match categories with backend event categories
const EVENT_CATEGORIES = [
  "All",
  "Entertainment & Nightlife",
  "Education & Professional",
  "Arts & Culture",
  "Sports & Fitness",
  "Food & Drink",
  "Lifestyle & Celebrations",
  "Faith & Community",
  "Special Interests",
];

export default function EventsScreen() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const [events, setEvents] = useState([]);
  const [hotEvents, setHotEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch events from API
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async (skipLoading = false) => {
    try {
      if (!skipLoading) {
        setLoading(true);
      }
      
      // Fetch all events
      const eventsData = await getEvents();
      // console.log("All Events from backend:", eventsData);
      setEvents(eventsData.events || []);
      
      // Fetch hot events (trending)
      const hotEventsData = await getHotEvents({ limit: 10 });
      // console.log("Hot Events from backend:", hotEventsData);
      setHotEvents(hotEventsData.events || []);
      
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      if (!skipLoading) {
        setLoading(false);
      }
    }
  };

  // Filter today's events
  const getTodaysEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return events.filter(event => {
      if (!event.date) return false;
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === today.getTime();
    });
  };

  const todaysEvents = getTodaysEvents();

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchEvents(true); // Skip loading indicator during refresh
    } catch (error) {
      console.error("Error refreshing events:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Filter events based on selected category (case-insensitive)
  const filteredEvents = selectedCategory === "All" 
    ? events 
    : events.filter(event => 
        event.category?.toLowerCase() === selectedCategory.toLowerCase()
      );

  const renderCategoryChip = ({ item: category }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === category && styles.activeCategoryChip
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text style={[
        styles.categoryText,
        selectedCategory === category && styles.activeCategoryText
      ]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  // Render carousel event card (horizontal)
  const renderCarouselEventCard = ({ item }) => {
    const formattedEvent = {
      id: item._id || item.id,
      imageUri: item.media?.[0]?.thumbnail_url || item.media?.[0]?.url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
      title: item.title,
      pricePerTicket: item.isFree 
        ? "Free" 
        : item.ticketTypes?.[0]?.price 
          ? `₦${item.ticketTypes[0].price.toLocaleString()}/ticket` 
          : "Price TBA",
      location: item.location?.venue || item.location?.city || "Location TBA",
      schedule: formatSchedule(item.date, item.time, item.endTime),
      timeOfDay: getTimeOfDay(item.time),
      category: item.category,
    };

    return (
      <View style={styles.carouselCard}>
        <EventCard
          imageUri={formattedEvent.imageUri}
          title={formattedEvent.title}
          pricePerTicket={formattedEvent.pricePerTicket}
          location={formattedEvent.location}
          schedule={formattedEvent.schedule}
          timeOfDay={formattedEvent.timeOfDay}
          liked={false}
          onLikeToggle={(liked) => {
            console.log("Event saved:", formattedEvent.id, liked);
          }}
          onPress={() => {
            router.push(`/(screens)/event-details/${formattedEvent.id}`);
          }}
        />
      </View>
    );
  };

  const renderEventCard = ({ item, index }) => {
    // Format the event data to match EventCard props
    const formattedEvent = {
      id: item._id || item.id,
      imageUri: item.media?.[0]?.thumbnail_url || item.media?.[0]?.url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
      title: item.title,
      pricePerTicket: item.isFree 
        ? "Free" 
        : item.ticketTypes?.[0]?.price 
          ? `₦${item.ticketTypes[0].price.toLocaleString()}/ticket` 
          : "Price TBA",
      location: item.location?.venue || item.location?.city || "Location TBA",
      schedule: formatSchedule(item.date, item.time, item.endTime),
      timeOfDay: getTimeOfDay(item.time),
      category: item.category,
    };

    return (
      <View style={[
        styles.eventCardContainer,
        index % 2 === 0 ? styles.leftCard : styles.rightCard
      ]}>
        <EventCard
          imageUri={formattedEvent.imageUri}
          title={formattedEvent.title}
          pricePerTicket={formattedEvent.pricePerTicket}
          location={formattedEvent.location}
          schedule={formattedEvent.schedule}
          timeOfDay={formattedEvent.timeOfDay}
          liked={false}
          onLikeToggle={(liked) => {
            console.log("Event saved:", formattedEvent.id, liked);
          }}
          onPress={() => {
            router.push(`/(screens)/event-details/${formattedEvent.id}`);
          }}
        />
      </View>
    );
  };

  // Helper function to format schedule
  const formatSchedule = (date, time, endTime) => {
    if (!date) return "Date TBA";
    const eventDate = new Date(date);
    const dateStr = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const timeStr = time ? `${time}${endTime ? ` - ${endTime}` : ''}` : '';
    return `${dateStr}${timeStr ? `, ${timeStr}` : ''}`;
  };

  // Helper function to determine time of day
  const getTimeOfDay = (time) => {
    if (!time) return 'day';
    const hour = parseInt(time.split(':')[0]);
    return hour >= 18 || hour < 6 ? 'night' : 'day';
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <NormalHeader title="Events" />
      
      {/* Loading State */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      ) : (
        <FlatList
          ListHeaderComponent={
            <>
              {/* Hot Events Carousel */}
              {hotEvents.length > 0 && (
                <View style={styles.carouselSection}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>🔥 Hot Events</Text>
                    <TouchableOpacity>
                      <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={hotEvents}
                    renderItem={renderCarouselEventCard}
                    keyExtractor={(item) => item._id || item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.carouselContent}
                  />
                </View>
              )}

              {/* Today's Events Carousel */}
              {todaysEvents.length > 0 && (
                <View style={styles.carouselSection}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>📅 Today's Events</Text>
                    <TouchableOpacity>
                      <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={todaysEvents}
                    renderItem={renderCarouselEventCard}
                    keyExtractor={(item) => item._id || item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.carouselContent}
                  />
                </View>
              )}

              {/* Categories Filter */}
              <View style={styles.categoriesContainer}>
                <Text style={styles.sectionTitle}>All Events</Text>
                <FlatList
                  data={EVENT_CATEGORIES}
                  renderItem={renderCategoryChip}
                  keyExtractor={(item) => item}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoriesContent}
                />
              </View>
            </>
          }
          data={filteredEvents}
          renderItem={renderEventCard}
          keyExtractor={(item) => item._id || item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.mainContainer}
          columnWrapperStyle={styles.row}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No events found</Text>
              <Text style={styles.emptySubtext}>
                {selectedCategory === "All" 
                  ? "Check back later for new events" 
                  : `No events in ${selectedCategory}`}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 10, 
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 85 : 60, // Match tab bar height
  },
  carouselSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Sora-Bold',
    fontSize: 18,
    color: Colors.gray900,
  },
  seeAllText: {
    fontFamily: 'Sora-Medium',
    fontSize: 14,
    color: Colors.primary,
  },
  carouselContent: {
    paddingHorizontal: 16,
  },
  carouselCard: {
    width: 200,
    marginRight: 16,
  },
  categoriesContainer: {
    paddingVertical: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  categoriesContent: {
    paddingHorizontal: 16,
    marginTop: 12,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    marginRight: 12,
  },
  activeCategoryChip: {
    backgroundColor: Colors.primary,
  },
  categoryText: {
    fontFamily: 'Sora-Medium',
    fontSize: 14,
    color: Colors.gray,
  },
  activeCategoryText: {
    color: Colors.white,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 4, // Reduce outer padding
  },
  eventCardContainer: {
    // marginTop: 10,
    flex: 0.50, 
    marginVertical: 8, 
  },
  leftCard: {
    marginRight: 4, // Reduce gap between cards
  },
  rightCard: {
    marginLeft: 4, // Reduce gap between cards
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontFamily: 'Sora-Regular',
    fontSize: 16,
    color: Colors.gray500,
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 18,
    color: Colors.gray700,
    marginBottom: 8,
  },
  emptySubtext: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: Colors.gray500,
    textAlign: 'center',
  },
});
