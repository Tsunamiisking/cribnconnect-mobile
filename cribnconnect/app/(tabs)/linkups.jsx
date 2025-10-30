import LinkupsTab from "@/components/LinkupsTab";
import NormalHeader from "@/components/NormalHeader";
import PeopleTab from "@/components/PeopleTab";
import TabSelector from "@/components/TabSelector";
import { auth } from "@/config/firebase";
import { Colors } from "@/constants/Colors";
import { calculateDistance } from "@/utils/distanceCalculator";
import { getUserLocation } from "@/utils/userLocation";
import axios from "axios";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data for linkups (keeping existing data)
const ACTIVE_LINKUPS = [
  {
    id: "1",
    title: "Coffee & Code Buddies",
    interest: "Tech & Programming",
    location: "Downtown Cafe, Lagos",
    schedule: "Every Wednesday, 2:00 PM",
    memberCount: "12 members",
    privacy: "public",
    host: "Emma Wilson",
    imageUri:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop",
    category: "Professional",
  },
  {
    id: "2",
    title: "Morning Runners Club",
    interest: "Fitness & Health",
    location: "Central Park, Victoria Island",
    schedule: "Daily, 7:00 AM",
    memberCount: "8 members",
    privacy: "public",
    host: "David Kim",
    imageUri:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
    category: "Fitness",
  },
  {
    id: "3",
    title: "Board Game Enthusiasts",
    interest: "Games & Strategy",
    location: "Game Lounge, Ikoyi",
    schedule: "Saturdays, 6:30 PM",
    memberCount: "18 members",
    privacy: "private",
    host: "Lisa Chen",
    imageUri:
      "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop",
    category: "Social",
  },
  {
    id: "4",
    title: "Football Fans Chat",
    interest: "Sports & Discussion",
    location: "", // Online group - no location
    schedule: "Match days & weekends",
    memberCount: "34 members",
    privacy: "public",
    host: "Mark Johnson",
    imageUri:
      "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=300&fit=crop",
    category: "Social",
  },
  {
    id: "5",
    title: "Book Club Readers",
    interest: "Literature & Discussion",
    location: "Library, Yaba",
    schedule: "Bi-weekly, Thursdays 7:00 PM",
    memberCount: "15 members",
    privacy: "public",
    host: "Sarah Mitchell",
    imageUri:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
    category: "Social",
  },
  {
    id: "6",
    title: "Startup Network",
    interest: "Business & Networking",
    location: "Co-working Space, Lekki",
    schedule: "Monthly, First Friday 6:00 PM",
    memberCount: "25 members",
    privacy: "private",
    host: "Tech Hub Lagos",
    imageUri:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop",
    category: "Professional",
  },
];

const LINKUP_CATEGORIES = [
  "All",
  "Professional",
  "Social",
  "Fitness",
  "Creative",
  "Food & Drink",
  "Tech",
];

export default function LinkupsScreen() {
  const [activeTab, setActiveTab] = useState("people");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [people, setPeople] = useState([]);
  const [currentUserLocation, setCurrentUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get current user's location
  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        const location = await getUserLocation();
        setCurrentUserLocation({
          type: "Point",
          coordinates: [location.longitude, location.latitude]
        });
      } catch (error) {
        console.error("Error getting current location:", error);
      }
    };

    getCurrentLocation();
  }, []);

  // Load users from API
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const URL = "https://cribnconnect-api.onrender.com/api/public-profiles";
        const response = await axios.get(URL);
        console.log("Public profiles response:", response.data);
        // Filter out current user and add distance information
        const currentUserId = auth?.currentUser?.uid;
        const otherUsers = response.data.filter(profile => profile.uid !== currentUserId);
        
        const usersWithDistance = otherUsers.map(user => {
          const distance = currentUserLocation 
            ? calculateDistance(currentUserLocation, user.location)
            : null;

          return {
            id: user._id,
            uid: user.uid,
            username: user.username,
            bio: user.bio,
            interests: user.interests,
            image: user.images?.[0]?.secure_url || user.images?.[0]?.url || null, // Get first image secure_url or url
            location: user.location,
            distance: distance?.formatted || 'Distance unknown'
          };
        });

        setPeople(usersWithDistance);
      } catch (error) {
        console.error("Error loading users:", error);
        setPeople([]);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [currentUserLocation]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const URL = "https://cribnconnect-api.onrender.com/api/public-profiles";
      const response = await axios.get(URL);
      
      // Filter out current user and add distance information
      const currentUserId = auth?.currentUser?.uid;
      const otherUsers = response.data.filter(profile => profile.uid !== currentUserId);
      
      console.log("Current user location:", currentUserLocation);
      
      const usersWithDistance = otherUsers.map(user => {
        console.log("User location:", user.location);
        const distance = currentUserLocation 
          ? calculateDistance(currentUserLocation, user.location)
          : null;

        return {
          id: user._id,
          uid: user.uid,
          username: user.username,
          bio: user.bio,
          interests: user.interests,
          image: user.images?.[0]?.url || null,
          location: user.location,
          distance: distance?.formatted || 'Distance unknown'
        };
      });

      setPeople(usersWithDistance);
    } catch (error) {
      console.error("Error loading users:", error);
      setPeople([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  // Filter linkups based on selected category and search query
  const filteredLinkups = ACTIVE_LINKUPS.filter((linkup) => {
    const matchesCategory =
      selectedCategory === "All" || linkup.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      linkup.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      linkup.interest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      linkup.host.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Filter people based on search query
  const filteredPeople = people.filter((person) => {
    return (
      searchQuery === "" ||
      person.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.interests.some((interest) =>
        interest.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
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
  };

  return (
    <SafeAreaView style={styles.container}>
      <NormalHeader title="Linkups" />

      <TabSelector activeTab={activeTab} onTabChange={handleTabChange} />

      <View style={styles.tabContentContainer}>
        {activeTab === "people" ? (
          <PeopleTab
            filteredPeople={filteredPeople}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onClearSearch={clearSearch}
            refreshing={refreshing}
            onRefresh={onRefresh}
            loading={loading}
            onPersonPress={(person) => {
              router.push(`/(screens)/public-profile/${person.uid}`);
            }}
          />
        ) : (
          <LinkupsTab
            filteredLinkups={filteredLinkups}
            categories={LINKUP_CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
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
