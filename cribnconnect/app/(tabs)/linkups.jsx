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
  const [linkups, setLinkups] = useState([]);
  const [currentUserLocation, setCurrentUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [linkupsLoading, setLinkupsLoading] = useState(true);

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

  // Load users function
  const loadUsers = async () => {
    try {
      setLoading(true);
      const URL = "https://cribnconnect-api.onrender.com/api/public-profiles";
      const response = await axios.get(URL);
      
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
          image: user.images?.[0]?.secure_url || user.images?.[0]?.url || null,
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

  // Load users from API when location is available
  useEffect(() => {
    if (currentUserLocation) {
      loadUsers();
    }
  }, [currentUserLocation]);

  // Load linkups from API
  const loadLinkups = async () => {
    try {
      setLinkupsLoading(true);
      const URL = "https://cribnconnect-api.onrender.com/api/linkups";
      const response = await axios.get(URL);
      
      // Map the API response to match LinkupCard props
      const formattedLinkups = response.data.map(linkup => ({
        id: linkup._id,
        title: linkup.name,
        interest: linkup.interests?.[0] || "General", // Use first interest or "General"
        description: linkup.description || "",
        memberCount: `${linkup.members?.length || 0} ${linkup.members?.length === 1 ? 'member' : 'members'}`,
        privacy: linkup.privacy || "public",
        host: linkup.createdBy?.username || "Unknown",
        imageUri: linkup.photo?.url || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop",
        category: linkup.interests?.[0] || "Social", // Use first interest as category
        // Store original data for filtering
        interests: linkup.interests || [],
        maxPeople: linkup.maxPeople,
        isPrivate: linkup.isPrivate,
      }));

      setLinkups(formattedLinkups);
    } catch (error) {
      console.error("Error loading linkups:", error);
      setLinkups([]);
    } finally {
      setLinkupsLoading(false);
    }
  };

  // Load linkups on component mount
  useEffect(() => {
    loadLinkups();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadUsers(), loadLinkups()]);
    setRefreshing(false);
  };

  // Filter linkups based on selected category and search query
  const filteredLinkups = linkups.filter((linkup) => {
    const matchesCategory =
      selectedCategory === "All" || 
      linkup.category === selectedCategory ||
      linkup.interests.includes(selectedCategory);
    
    const matchesSearch =
      searchQuery === "" ||
      linkup.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      linkup.interests.some(interest => 
        interest.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      linkup.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
