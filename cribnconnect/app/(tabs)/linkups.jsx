import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  FlatList,
  Platform,
  ScrollView,
  TextInput,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import LinkupCard from "@/components/LinkupCard";
import UserLinkupsCarousel from "@/components/UserLinkupsCarousel";
import { SafeAreaView } from "react-native-safe-area-context";
import NormalHeader from "@/components/NormalHeader";
import { Colors } from "@/constants/Colors";
import { Plus, Search } from "lucide-react-native";

// Mock data - TODO: Replace with API integration
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
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const onRefresh = () => {
    setRefreshing(true);
    // TODO: Refresh linkups data from API
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

  const handleCreateLinkup = () => {
    // Navigate to simplified create linkup flow
    router.push("/(screens)/create-linkup");
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <NormalHeader title="Linkups" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* User's Active Linkups Carousel */}
        <UserLinkupsCarousel />

        {/* Create Linkup Button */}
        <View style={styles.createSection}>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={handleCreateLinkup}
          >
            <Plus size={20} color={Colors.white} />
            <Text style={styles.createButtonText}>Create New Linkup</Text>
          </TouchableOpacity>
          <Text style={styles.createHint}>
            Start your own community around shared interests
          </Text>
        </View>

        {/* Categories Filter */}
        <View style={styles.categoriesContainer}>
          <FlatList
            data={LINKUP_CATEGORIES}
            renderItem={renderCategoryChip}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContent}
          />
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={Colors.gray500} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search linkups, interests..."
              placeholderTextColor={Colors.gray500}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch}>
                <Text style={styles.clearButton}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {searchQuery ? `Search Results (${filteredLinkups.length})` : "Discover Linkups Near You"}
          </Text>
          {searchQuery && (
            <TouchableOpacity onPress={clearSearch}>
              <Text style={styles.clearSearchText}>Clear Search</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Linkups List */}
        <View style={styles.linkupsContainer}>
          {filteredLinkups.length > 0 ? (
            filteredLinkups.map((item) => (
              <View key={item.id} style={styles.linkupCardContainer}>
                <LinkupCard
                  imageUri={item.imageUri}
                  title={item.title}
                  interest={item.interest}
                  location={item.location}
                  schedule={item.schedule}
                  memberCount={item.memberCount}
                  privacy={item.privacy}
                  host={item.host}
                  liked={false}
                  onLikeToggle={(liked) => {
                    console.log("Linkup saved:", item.id, liked);
                  }}
                  onPress={() => {
                    router.push(`/(screens)/linkup-details/${item.id}`);
                  }}
                />
              </View>
            ))
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsTitle}>No linkups found</Text>
              <Text style={styles.noResultsText}>
                {searchQuery 
                  ? `No linkups match "${searchQuery}". Try a different search term or browse categories above.`
                  : "No linkups available in this category. Try selecting a different category or create your own linkup!"
                }
              </Text>
              {searchQuery && (
                <TouchableOpacity style={styles.clearSearchButton} onPress={clearSearch}>
                  <Text style={styles.clearSearchButtonText}>Clear Search</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Bottom spacing for tab bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  createSection: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 8,
    elevation: 2,
    shadowColor: Colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  createButtonText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    color: Colors.white,
    marginLeft: 8,
  },
  createHint: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: Colors.gray500,
    textAlign: 'center',
  },
  categoriesContainer: {
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  categoriesContent: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.lightBackground,
    borderRadius: 20,
    marginRight: 12,
  },
  activeCategoryChip: {
    backgroundColor: Colors.primary,
  },
  categoryText: {
    fontFamily: 'Sora-Medium',
    fontSize: 14,
    color: Colors.gray500,
  },
  activeCategoryText: {
    color: Colors.white,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 16,
    backgroundColor: Colors.lightBackground,
    borderRadius: 24,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Sora-Regular',
    fontSize: 16,
    color: Colors.gray900,
    marginLeft: 12,
  },
  clearButton: {
    fontSize: 18,
    color: Colors.gray500,
    paddingHorizontal: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: Colors.white,
  },
  sectionTitle: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 20,
    color: Colors.gray900,
    flex: 1,
  },
  clearSearchText: {
    fontFamily: 'Sora-Medium',
    fontSize: 14,
    color: Colors.primary,
  },
  linkupsContainer: {
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
  },
  linkupCardContainer: {
    marginBottom: 16,
  },
  noResultsContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  noResultsTitle: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 18,
    color: Colors.gray900,
    marginBottom: 8,
    textAlign: 'center',
  },
  noResultsText: {
    fontFamily: 'Sora-Regular',
    fontSize: 16,
    color: Colors.gray500,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  clearSearchButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  clearSearchButtonText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 14,
    color: Colors.white,
  },
  bottomSpacing: {
    height: Platform.OS === 'ios' ? 85 : 60,
  },
});
