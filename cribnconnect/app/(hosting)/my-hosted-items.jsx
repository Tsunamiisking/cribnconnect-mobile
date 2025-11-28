import { getMyApartments } from "@/api/services/apartmentServices";
import { getMyEvents } from "@/api/services/eventServices";
import ApartmentTab from "@/components/ApartmentTab";
import BackHeader from "@/components/BackHeader";
import EventTab from "@/components/EventTab";
import HostedTabSelector from "@/components/HostedTabSelector";
import ProcessingItemCard from "@/components/ProcessingItemCard";
import { Colors } from "@/constants/Colors";
import useProcessingStore from "@/stores/processingStore";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Apartment status categories
const APARTMENT_CATEGORIES = [
  "All",
  "Active", 
  "Inactive",
  "Unpublished",
  "Suspended"
];

// Event status categories
const EVENT_CATEGORIES = [
  "All",
  "Upcoming",
  "Completed", 
  "Draft",
  "Cancelled"
];


// Map backend status to frontend display
const getStatusMapping = (backendStatus) => {
  switch (backendStatus) {
    case "active": return "Active";
    case "inactive": return "Inactive";
    case "suspended": return "Suspended";
    default: return "Active";
  }
};

// Map event status to frontend display
const getEventStatusMapping = (backendStatus) => {
  switch (backendStatus) {
    case "upcoming": return "Upcoming";
    case "completed": return "Completed";
    case "draft": return "Draft";
    case "cancelled": return "Cancelled";
    default: return "Upcoming";
  }
};

export default function MyHostedItemsScreen() {
  const [activeTab, setActiveTab] = useState("apartments");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApartmentCategory, setSelectedApartmentCategory] = useState("All");
  const [selectedEventCategory, setSelectedEventCategory] = useState("All");
  const [showProcessing, setShowProcessing] = useState(true);
  
  // State for actual data
  const [apartments, setApartments] = useState([]);
  const [events, setEvents] = useState([]);
  
  // Get processing items from store
  const { getProcessingItems, getProcessingCount, removeProcessingItem } = useProcessingStore();
  const processingItems = getProcessingItems();
  const processingCount = getProcessingCount();

  // Fetch apartments
  const fetchApartments = async () => {
    try {
      const response = await getMyApartments({
        sortBy: 'createdAt',
        order: 'desc'
      });
      
      // Transform backend data to match frontend format
      const transformedApartments = response.data?.map(apt => {
        // Get display images (prioritize images over videos, use thumbnails for videos)
        const displayImages = apt.media?.map(m => {
          if (m.resource_type === 'image') {
            return m.url;
          } else if (m.resource_type === 'video' && m.thumbnail_url) {
            return m.thumbnail_url;
          }
          return null;
        }).filter(Boolean) || [];
        
        return {
          id: apt._id,
          title: apt.title,
          location: `${apt.address.city}, ${apt.address.state}`,
          price: `₦${apt.pricePerNight.toLocaleString()}/night`,
          status: apt.isPublished ? (apt.isAvailable ? 'active' : 'inactive') : 'draft',
          category: apt.apartmentCategory,
          bookings: apt.bookingCount || 0,
          rating: apt.averageRating || 0,
          reviews: apt.reviewCount || 0,
          images: displayImages,
          dateCreated: apt.createdAt,
          lastBooked: apt.lastBookedAt || null,
          earnings: `₦${(apt.totalEarnings || 0).toLocaleString()}`,
        };
      }) || [];
      
      setApartments(transformedApartments);
    } catch (error) {
      console.error('Error fetching apartments:', error);
      Alert.alert('Error', 'Failed to load apartments. Please try again.');
    }
  };

  // Fetch events
  const fetchEvents = async () => {
    try {
      // console.log('Starting to fetch events...');
      const response = await getMyEvents({
        sortBy: 'date',
        order: 'desc'
      });
      
      // console.log('Raw response from getMyEvents:', response);
      // console.log('Response.events:', response.events);
      // console.log('Response.events type:', typeof response.events);
      // console.log('Response.events is array:', Array.isArray(response.events));
      
      // Transform backend data to match frontend format
      const transformedEvents = response.events?.map(event => {
        // console.log('Transforming event:', event._id, event.title);
        
        // Get display images (prioritize images over videos, use thumbnails for videos)
        const displayImages = event.media?.map(m => {
          if (m.resource_type === 'image') {
            return m.url;
          } else if (m.resource_type === 'video' && m.thumbnail_url) {
            return m.thumbnail_url;
          }
          return null;
        }).filter(Boolean) || [];
        
        // Determine status based on isPublished, isActive, and date
        let displayStatus;
        if (!event.isPublished || !event.isActive) {
          displayStatus = 'draft';
        } else if (event.status === 'cancelled') {
          displayStatus = 'cancelled';
        } else {
          // Check if event date has passed
          displayStatus = new Date(event.date) > new Date() ? 'upcoming' : 'completed';
        }
        
        return {
          id: event._id,
          title: event.title,
          category: event.category,
          eventType: event.eventType,
          location: `${event.location.venue}, ${event.location.city}`,
          date: new Date(event.date).toISOString().split('T')[0],
          time: event.time,
          price: event.isFree ? 'Free' : `₦${Math.min(...event.ticketTypes.map(t => t.price)).toLocaleString()}`,
          status: displayStatus,
          attendees: event.attendees?.length || 0,
          capacity: event.capacity,
          revenue: `₦${(event.ticketTypes.reduce((sum, t) => sum + (t.sold * t.price), 0)).toLocaleString()}`,
          images: displayImages,
          dateCreated: event.createdAt,
        };
      }) || [];
      
      // console.log('Transformed events count:', transformedEvents.length);
      // console.log('Transformed events:', transformedEvents);
      setEvents(transformedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      console.error('Error details:', error.response?.data);
      Alert.alert('Error', 'Failed to load events. Please try again.');
    }
  };

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchApartments(), fetchEvents()]);
      setLoading(false);
    };
    
    loadData();
  }, []);
  
  // Auto-refresh when processing items complete
  useEffect(() => {
    const hasCompleted = processingItems.some(item => item.status === 'completed');
    if (hasCompleted) {
      // Refresh the appropriate data
      const timer = setTimeout(() => {
        if (activeTab === 'apartments') {
          fetchApartments();
        } else {
          fetchEvents();
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [processingItems, activeTab]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (activeTab === 'apartments') {
      await fetchApartments();
    } else {
      await fetchEvents();
    }
    setRefreshing(false);
  };

  // Filter apartments based on search query and status
  const filteredApartments = apartments.filter(apartment => {
    const matchesSearch = searchQuery === "" || 
      apartment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apartment.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Convert both to same case for comparison
    const matchesCategory = selectedApartmentCategory === "All" || 
      selectedApartmentCategory.toLowerCase() === apartment.status.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  // Filter events based on search query and status
  const filteredEvents = events.filter(event => {
    const matchesSearch = searchQuery === "" || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Convert both to same case for comparison
    const matchesCategory = selectedEventCategory === "All" || 
      selectedEventCategory.toLowerCase() === event.status.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  const handleSearchChange = (text) => {
    setSearchQuery(text);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery(""); // Clear search when switching tabs
    if (tab === "apartments") {
      setSelectedApartmentCategory("All"); // Reset apartment category when switching to apartments
    } else if (tab === "events") {
      setSelectedEventCategory("All"); // Reset event category when switching to events
    }
  };
  
  const handleRetryUpload = async (item) => {
    Alert.alert(
      'Retry Upload',
      `Do you want to retry uploading "${item.title || 'this item'}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Retry',
          onPress: () => {
            // TODO: Implement retry logic
            // For now, just remove the failed item
            removeProcessingItem(item.id);
            Alert.alert('Info', 'Please re-submit your listing from the Add Apartment/Event screen.');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Host Dashboard" showUser={false} />
      
      {/* Processing Items Banner */}
      {processingCount > 0 && (
        <View style={styles.processingBanner}>
          <View style={styles.processingHeader}>
            <View style={styles.processingTitleRow}>
              <Ionicons name="sync-circle" size={20} color={Colors.primary} />
              <Text style={styles.processingTitle}>
                Processing Items ({processingCount})
              </Text>
            </View>
            <TouchableOpacity onPress={() => setShowProcessing(!showProcessing)}>
              <Ionicons 
                name={showProcessing ? "chevron-up" : "chevron-down"} 
                size={20} 
                color={Colors.gray600} 
              />
            </TouchableOpacity>
          </View>
          
          {showProcessing && (
            <ScrollView 
              style={styles.processingList}
              showsVerticalScrollIndicator={false}
            >
              {processingItems.map((item, index) => (
                <ProcessingItemCard 
                  key={item.id || `processing-${index}`}
                  item={item}
                  onRetry={handleRetryUpload}
                />
              ))}
            </ScrollView>
          )}
        </View>
      )}
      
      <HostedTabSelector activeTab={activeTab} onTabChange={handleTabChange} />

      <View style={styles.tabContentContainer}>
        {activeTab === "apartments" ? (
          <ApartmentTab
            filteredApartments={filteredApartments}
            categories={APARTMENT_CATEGORIES}
            selectedCategory={selectedApartmentCategory}
            onSelectCategory={setSelectedApartmentCategory}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onClearSearch={clearSearch}
            refreshing={refreshing}
            onRefresh={onRefresh}
            loading={loading}
            totalApartments={apartments.length}
          />
        ) : (
          <EventTab
            filteredEvents={filteredEvents}
            categories={EVENT_CATEGORIES}
            selectedCategory={selectedEventCategory}
            onSelectCategory={setSelectedEventCategory}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onClearSearch={clearSearch}
            refreshing={refreshing}
            onRefresh={onRefresh}
            loading={loading}
            totalEvents={events.length}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  processingBanner: {
    backgroundColor: Colors.gray50,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  processingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  processingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  processingTitle: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 14,
    color: Colors.gray900,
  },
  processingList: {
    maxHeight: 250,
  },
  tabContentContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});