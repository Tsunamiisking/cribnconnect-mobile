import api from "@/api/api";
import LinkupsTab from "@/components/LinkupsTab";
import NormalHeader from "@/components/NormalHeader";
import PeopleTab from "@/components/PeopleTab";
import TabSelector from "@/components/TabSelector";
import { auth } from "@/config/firebase";
import { Colors } from "@/constants/Colors";
import { calculateDistance } from "@/utils/distanceCalculator";
import { getUserLocation } from "@/utils/userLocation";
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
  
  // Pagination states
  const [peoplePage, setPeoplePage] = useState(1);
  const [linkupsPage, setLinkupsPage] = useState(1);
  const [peopleHasMore, setPeopleHasMore] = useState(true);
  const [linkupsHasMore, setLinkupsHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

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

  // Load users function with pagination and shuffle
  const loadUsers = async (pageNum = 1, append = false) => {
    try {
      if (!append) setLoading(true);
      
      const response = await api.get("/public-profiles", {
        params: {
          page: pageNum,
          limit: 20,
          shuffle: true // Use shuffle for discovery
        }
      });
      
      // console.log("Public Profiles API Response:", response.data);
      
      // Handle new paginated response structure
      // Check if response has pagination structure
      let profiles;
      let pagination;
      
      if (response.data.data && response.data.pagination) {
        // New paginated structure
        profiles = response.data.data;
        pagination = response.data.pagination;
      } else if (Array.isArray(response.data)) {
        // Old structure - direct array
        profiles = response.data;
        pagination = { hasNextPage: false };
      } else {
        console.error("Unexpected response structure:", response.data);
        profiles = [];
        pagination = { hasNextPage: false };
      }
      
      // Filter out current user and add distance information
      const currentUserId = auth?.currentUser?.uid;
      const otherUsers = profiles.filter(profile => profile.uid !== currentUserId);
      
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

      if (append) {
        setPeople(prev => [...prev, ...usersWithDistance]);
      } else {
        setPeople(usersWithDistance);
      }
      
      setPeopleHasMore(pagination.hasNextPage || false);
      setPeoplePage(pageNum);
    } catch (error) {
      console.error("Error loading users:", error);
      if (!append) setPeople([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load users from API when location is available
  useEffect(() => {
    if (currentUserLocation) {
      loadUsers();
    }
  }, [currentUserLocation]);

  // Load linkups from API with pagination and shuffle
  const loadLinkups = async (pageNum = 1, append = false) => {
    try {
      if (!append) setLinkupsLoading(true);
      
      const currentUser = auth?.currentUser;
      // console.log("🔍 Making linkups request as user:", {
      //   uid: currentUser?.uid,
      //   email: currentUser?.email
      // });
      
      const response = await api.get("/linkups", {
        params: {
          page: pageNum,
          limit: 20,
          shuffle: true // Use shuffle for discovery
        }
      });


      // console.log("📦 Raw API Response:", JSON.stringify(response.data, null, 2));
      
      // Handle new paginated response structure
      // Check if response has pagination structure
      let linkupsData;
      let pagination;
      
      if (response.data.data && response.data.pagination) {
        // New paginated structure
        linkupsData = response.data.data;
        // console.log("📊 Processed linkups data:", linkupsData);
        // console.log("👥 First linkup members:", linkupsData[0]?.members);
        pagination = response.data.pagination;
      } else if (Array.isArray(response.data)) {
        // Old structure - direct array
        linkupsData = response.data;
        pagination = { hasNextPage: false };
      } else {
        console.error("Unexpected response structure:", response.data);
        linkupsData = [];
        pagination = { hasNextPage: false };
      }
      
      const currentUserId = auth?.currentUser?.uid;
      
      // Map the API response to match LinkupCard props
      // Filter out linkups created by current user (they see those in Messages tab)
      const formattedLinkups = linkupsData
        .filter(linkup => linkup.uid !== currentUserId) // Exclude user's own linkups
        .map(linkup => {
          // Use activeMemberCount if available (virtual field), otherwise fall back to members.length
          const count = linkup.activeMemberCount ?? linkup.members?.length ?? 0;
          
          return {
          id: linkup._id,
          title: linkup.name,
          interest: linkup.interests?.[0] || "General",
          description: linkup.description || "",
          memberCount: `${count} ${count === 1 ? 'member' : 'members'}`,
          privacy: linkup.privacy || "public",
          host: linkup.createdBy?.username || "Unknown",
          imageUri: linkup.photo?.url || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop",
          category: linkup.interests?.[0] || "Social",
          interests: linkup.interests || [],
          maxPeople: linkup.maxPeople,
          isPrivate: linkup.isPrivate,
        };
        });

      if (append) {
        setLinkups(prev => [...prev, ...formattedLinkups]);
      } else {
        setLinkups(formattedLinkups);
      }
      
      setLinkupsHasMore(pagination.hasNextPage || false);
      setLinkupsPage(pageNum);
    } catch (error) {
      console.error("Error loading linkups:", error);
      if (!append) setLinkups([]);
    } finally {
      setLinkupsLoading(false);
      setLoadingMore(false);
    }
  };

  // Load users from API when location is available
  useEffect(() => {
    if (currentUserLocation) {
      loadUsers(1, false);
    }
  }, [currentUserLocation]);

  // Load linkups on component mount
  useEffect(() => {
    loadLinkups(1, false);
  }, []);

  // Load more people
  const loadMorePeople = () => {
    if (!loadingMore && peopleHasMore) {
      setLoadingMore(true);
      loadUsers(peoplePage + 1, true);
    }
  };

  // Load more linkups
  const loadMoreLinkups = () => {
    if (!loadingMore && linkupsHasMore) {
      setLoadingMore(true);
      loadLinkups(linkupsPage + 1, true);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Reset to page 1 and get fresh shuffled data
    await Promise.all([
      loadUsers(1, false),
      loadLinkups(1, false)
    ]);
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
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
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
            loadingMore={loadingMore}
            hasMore={peopleHasMore}
            onLoadMore={loadMorePeople}
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
            loading={linkupsLoading}
            loadingMore={loadingMore}
            hasMore={linkupsHasMore}
            onLoadMore={loadMoreLinkups}
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
