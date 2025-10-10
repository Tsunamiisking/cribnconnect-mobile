import ApartmentTab from "@/components/ApartmentTab";
import BackHeader from "@/components/BackHeader";
import EventTab from "@/components/EventTab";
import HostedTabSelector from "@/components/HostedTabSelector";
import { Colors } from "@/constants/Colors";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data for hosted apartments
const HOSTED_APARTMENTS = [
  {
    id: "1",
    title: "Modern Studio in Victoria Island",
    location: "Victoria Island, Lagos",
    price: "₦50,000/night",
    status: "active",
    category: "whole-space",
    bookings: 15,
    rating: 4.8,
    reviews: 12,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
    ],
    dateCreated: "2024-08-15",
    lastBooked: "2024-10-05",
    earnings: "₦750,000",
  },
  {
    id: "2",
    title: "Luxury Apartment in Lekki",
    location: "Lekki Phase 1, Lagos",
    price: "₦80,000/night",
    status: "active",
    category: "whole-space",
    bookings: 8,
    rating: 4.9,
    reviews: 7,
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop",
    ],
    dateCreated: "2024-09-20",
    lastBooked: "2024-10-08",
    earnings: "₦640,000",
  },
  {
    id: "3",
    title: "Cozy Room in Ikeja",
    location: "Ikeja GRA, Lagos",
    price: "₦25,000/night",
    status: "inactive",
    category: "private-room",
    bookings: 3,
    rating: 4.5,
    reviews: 3,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    ],
    dateCreated: "2024-07-10",
    lastBooked: "2024-09-15",
    earnings: "₦75,000",
  },
  {
    id: "4",
    title: "Shared Duplex in Surulere",
    location: "Surulere, Lagos",
    price: "₦18,000/night",
    status: "active",
    category: "shared-room",
    bookings: 22,
    rating: 4.3,
    reviews: 18,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
    ],
    dateCreated: "2024-06-12",
    lastBooked: "2024-10-09",
    earnings: "₦396,000",
  },
  {
    id: "5",
    title: "Executive Suite - High-rise Building", 
    location: "Ikoyi Towers, Lagos",
    price: "₦35,000/night",
    status: "active",
    category: "private-room",
    bookings: 11,
    rating: 4.7,
    reviews: 9,
    images: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop",
    ],
    dateCreated: "2024-07-28",
    lastBooked: "2024-10-07",
    earnings: "₦385,000",
  },
  {
    id: "6",
    title: "Penthouse - Marina District",
    location: "Marina, Lagos Island",
    price: "₦120,000/night",
    status: "suspended",
    category: "whole-space",
    bookings: 0,
    rating: 0,
    reviews: 0,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop",
    ],
    dateCreated: "2024-09-15",
    lastBooked: null,
    earnings: "₦0",
  },
];

// Apartment status categories
const APARTMENT_CATEGORIES = [
  "All",
  "Active", 
  "Inactive",
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

// Mock data for hosted events
const HOSTED_EVENTS = [
  {
    id: "1",
    title: "Tech Meetup Lagos",
    category: "technology",
    eventType: "meetup",
    location: "Co-working Space, Lekki",
    date: "2024-10-15",
    time: "18:00",
    price: "₦5,000",
    status: "upcoming",
    attendees: 45,
    capacity: 60,
    revenue: "₦225,000",
    images: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
    ],
    dateCreated: "2024-09-20",
  },
  {
    id: "2",
    title: "Friday Night Jazz",
    category: "music",
    eventType: "concert",
    location: "Jazz Lounge, Victoria Island",
    date: "2024-10-11",
    time: "20:00",
    price: "₦8,000",
    status: "completed",
    attendees: 80,
    capacity: 100,
    revenue: "₦640,000",
    images: [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    ],
    dateCreated: "2024-09-05",
  },
  {
    id: "3",
    title: "Startup Pitch Night",
    category: "business",
    eventType: "pitch",
    location: "Business Hub, Ikeja",
    date: "2024-11-20",
    time: "17:30",
    price: "Free",
    status: "draft",
    attendees: 0,
    capacity: 50,
    revenue: "₦0",
    images: [
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop",
    ],
    dateCreated: "2024-10-08",
  },
  {
    id: "4",
    title: "Photography Workshop",
    category: "arts",
    eventType: "workshop",
    location: "Art Center, Yaba",
    date: "2024-09-30",
    time: "14:00",
    price: "₦12,000",
    status: "completed",
    attendees: 25,
    capacity: 30,
    revenue: "₦300,000",
    images: [
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=300&fit=crop",
    ],
    dateCreated: "2024-08-25",
  },
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApartmentCategory, setSelectedApartmentCategory] = useState("All");
  const [selectedEventCategory, setSelectedEventCategory] = useState("All");

  const onRefresh = () => {
    setRefreshing(true);
    // TODO: Refresh data from API
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Filter apartments based on search query and status
  const filteredApartments = HOSTED_APARTMENTS.filter(apartment => {
    const matchesSearch = searchQuery === "" || 
      apartment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apartment.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedApartmentCategory === "All" || 
      getStatusMapping(apartment.status) === selectedApartmentCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Filter events based on search query and status
  const filteredEvents = HOSTED_EVENTS.filter(event => {
    const matchesSearch = searchQuery === "" || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedEventCategory === "All" || 
      getEventStatusMapping(event.status) === selectedEventCategory;
    
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

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Host Dashboard" showUser={false} />
      
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
  tabContentContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});