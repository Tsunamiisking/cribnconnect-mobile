import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  FlatList,
  Platform,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import EventCard from "@/components/EventCard";
import { SafeAreaView } from "react-native-safe-area-context";
import NormalHeader from "@/components/NormalHeader";
import { Colors } from "@/constants/Colors";

// Mock data - TODO: Replace with API integration
const FEATURED_EVENTS = [
  {
    id: "1",
    title: "Rooftop Networking Mixer",
    pricePerTicket: "Free",
    location: "Downtown Rooftop Bar, Lagos",
    schedule: "Dec 15, 7:00 PM - 10:00 PM",
    timeOfDay: "night",
    imageUri: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
    category: "Networking",
    host: "Sarah Chen",
  },
  {
    id: "2",
    title: "Community Game Night",
    pricePerTicket: "₦2,000/ticket",
    location: "Community Center, Ikoyi",
    schedule: "Dec 18, 6:30 PM - 9:30 PM",
    timeOfDay: "night",
    imageUri: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop",
    category: "Social",
    host: "Mike Johnson",
  },
  {
    id: "3",
    title: "Fitness Bootcamp",
    pricePerTicket: "₦5,000/ticket",
    location: "Central Park, Victoria Island",
    schedule: "Dec 20, 8:00 AM - 9:00 AM",
    timeOfDay: "day",
    imageUri: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    category: "Fitness",
    host: "Alex Rivera",
  },
  {
    id: "4",
    title: "Live Music Concert",
    pricePerTicket: "₦15,000/ticket",
    location: "Terra Kulture, VI",
    schedule: "Dec 22, 8:00 PM - 11:00 PM",
    timeOfDay: "night",
    imageUri: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    category: "Entertainment",
    host: "Music Collective",
  },
  {
    id: "5",
    title: "Wine Tasting Evening",
    pricePerTicket: "₦12,000/ticket",
    location: "Sky Restaurant, Ikoyi",
    schedule: "Dec 24, 6:00 PM - 9:00 PM",
    timeOfDay: "night",
    imageUri: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop",
    category: "Food & Drink",
    host: "Wine Society",
  },
  {
    id: "6",
    title: "Morning Yoga Session",
    pricePerTicket: "₦3,000/ticket",
    location: "Tafawa Balewa Square",
    schedule: "Dec 25, 7:00 AM - 8:30 AM",
    timeOfDay: "day",
    imageUri: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
    category: "Fitness",
    host: "Wellness Hub",
  },
];

const EVENT_CATEGORIES = [
  "All",
  "Networking", 
  "Social", 
  "Fitness", 
  "Food & Drink", 
  "Entertainment",
  "Business",
];

export default function EventsScreen() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // TODO: Refresh events data from API
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Filter events based on selected category
  const filteredEvents = selectedCategory === "All" 
    ? FEATURED_EVENTS 
    : FEATURED_EVENTS.filter(event => event.category === selectedCategory);

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

  const renderEventCard = ({ item, index }) => (
    <View style={[
      styles.eventCardContainer,
      index % 2 === 0 ? styles.leftCard : styles.rightCard
    ]}>
      <EventCard
        imageUri={item.imageUri}
        title={item.title}
        pricePerTicket={item.pricePerTicket}
        location={item.location}
        schedule={item.schedule}
        timeOfDay={item.timeOfDay}
        liked={false}
        onLikeToggle={(liked) => {
          console.log("Event saved:", item.id, liked);
        }}
        onPress={() => {
          router.push(`/(screens)/event-details/${item.id}`);
        }}
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <NormalHeader title="Events" />
      
      {/* Categories Filter */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={EVENT_CATEGORIES}
          renderItem={renderCategoryChip}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        />
      </View>

      {/* Events Grid */}
      <FlatList
        data={filteredEvents}
        renderItem={renderEventCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainContainer}
        columnWrapperStyle={styles.row}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 10, 
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 85 : 60, // Match tab bar height
  },
  categoriesContainer: {
    paddingVertical: 20,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  categoriesContent: {
    paddingHorizontal: 16,
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
});
