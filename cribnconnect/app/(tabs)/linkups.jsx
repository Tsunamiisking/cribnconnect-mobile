import LinkupsTab from "@/components/LinkupsTab";
import NormalHeader from "@/components/NormalHeader";
import PeopleTab from "@/components/PeopleTab";
import TabSelector from "@/components/TabSelector";
import { Colors } from "@/constants/Colors";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data for people
const PEOPLE_DATA = [
  {
    id: "1",
    name: "Sarah Wilson",
    age: 24,
    bio: "Adventure seeker, coffee lover, and part-time photographer. Always looking for new experiences and great conversations!",
    interests: ["Photography", "Travel", "Coffee", "Hiking"],
    location: "Lagos, Nigeria",
    distance: "2 km away",
    images: [
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&w=400&h=600&fit=crop",
    ],
    isOnline: true,
    lastSeen: "Active now",
  },
  {
    id: "2",
    name: "David Chen",
    age: 28,
    bio: "Tech enthusiast and fitness junkie. Building the future one line of code at a time. Let's grab some healthy food!",
    interests: ["Tech", "Fitness", "Coding", "Healthy Living"],
    location: "Victoria Island, Lagos",
    distance: "5 km away",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=400&h=600&fit=crop",
    ],
    isOnline: false,
    lastSeen: "2 hours ago",
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    age: 26,
    bio: "Artist, dreamer, and foodie. Love exploring local art galleries and trying new restaurants. Life's too short for boring conversations!",
    interests: ["Art", "Food", "Museums", "Creative Writing"],
    location: "Lekki, Lagos",
    distance: "8 km away",
    images: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&w=400&h=600&fit=crop",
    ],
    isOnline: true,
    lastSeen: "Active now",
  },
];

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
    imageUri: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop",
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
    imageUri: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
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
    imageUri: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop",
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
    imageUri: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=300&fit=crop",
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
    imageUri: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
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
    imageUri: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop",
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

  const onRefresh = () => {
    setRefreshing(true);
    // TODO: Refresh data from API
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Filter linkups based on selected category and search query
  const filteredLinkups = ACTIVE_LINKUPS.filter(linkup => {
    const matchesCategory = selectedCategory === "All" || linkup.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      linkup.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      linkup.interest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      linkup.host.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  // Filter people based on search query
  const filteredPeople = PEOPLE_DATA.filter(person => {
    return searchQuery === "" || 
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.interests.some(interest => 
        interest.toLowerCase().includes(searchQuery.toLowerCase())
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
