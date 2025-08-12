import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  TextInput,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import BackHeader from "@/components/BackHeader";
import { Colors } from "@/constants/Colors";
import { MapPin, Search, MessageCircle } from "lucide-react-native";

// Extended mock data for people nearby - TODO: Replace with API integration
const ALL_NEARBY_PEOPLE = [
  {
    id: "1",
    name: "Sarah Chen",
    age: 24,
    gender: "female",
    location: "500m away",
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&crop=face",
    interests: ["Tech", "Coffee", "Reading"],
    status: "online",
    bio: "Software developer who loves good coffee and weekend coding projects",
    mutualFriends: 3,
  },
  {
    id: "2",
    name: "Mike Johnson",
    age: 28,
    gender: "male",
    location: "1.2km away",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    interests: ["Fitness", "Music", "Hiking"],
    status: "offline",
    bio: "Fitness enthusiast and guitar player. Always up for outdoor adventures",
    mutualFriends: 1,
  },
  {
    id: "3",
    name: "Emma Wilson",
    age: 26,
    gender: "female",
    location: "800m away",
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    interests: ["Art", "Travel", "Photography"],
    status: "online",
    bio: "Digital artist exploring the world one city at a time",
    mutualFriends: 5,
  },
  {
    id: "4",
    name: "David Kim",
    age: 30,
    gender: "male",
    location: "2.1km away",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    interests: ["Running", "Books", "Cooking"],
    status: "away",
    bio: "Marathon runner and book club organizer. Love trying new recipes",
    mutualFriends: 2,
  },
  {
    id: "5",
    name: "Lisa Rodriguez",
    age: 25,
    gender: "female",
    location: "1.5km away",
    profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    interests: ["Photography", "Nature", "Yoga"],
    status: "online",
    bio: "Nature photographer and yoga instructor seeking mindful connections",
    mutualFriends: 4,
  },
  {
    id: "6",
    name: "Alex Thompson",
    age: 27,
    gender: "male",
    location: "900m away",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    interests: ["Gaming", "Tech", "Movies"],
    status: "online",
    bio: "Game developer and movie buff. Always down for a good discussion",
    mutualFriends: 1,
  },
  {
    id: "7",
    name: "Maria Garcia",
    age: 29,
    gender: "female",
    location: "1.8km away",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    interests: ["Dance", "Music", "Food"],
    status: "away",
    bio: "Professional dancer who loves exploring local food scenes",
    mutualFriends: 0,
  },
  {
    id: "8",
    name: "James Wilson",
    age: 31,
    gender: "male",
    location: "2.5km away",
    profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
    interests: ["Business", "Networking", "Travel"],
    status: "offline",
    bio: "Entrepreneur building connections and exploring new opportunities",
    mutualFriends: 2,
  },
  {
    id: "9",
    name: "Sophie Brown",
    age: 23,
    gender: "female",
    location: "1.1km away",
    profileImage: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=face",
    interests: ["Art", "Design", "Coffee"],
    status: "online",
    bio: "Graphic designer with a passion for creative coffee shop conversations",
    mutualFriends: 3,
  },
  {
    id: "10",
    name: "Ryan Lee",
    age: 26,
    gender: "male",
    location: "1.7km away",
    profileImage: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop&crop=face",
    interests: ["Sports", "Fitness", "Music"],
    status: "online",
    bio: "Sports enthusiast and amateur musician looking for workout buddies",
    mutualFriends: 1,
  },
];

const GENDER_FILTERS = [
  { id: 'all', name: 'All', count: ALL_NEARBY_PEOPLE.length },
  { id: 'male', name: 'Males', count: ALL_NEARBY_PEOPLE.filter(p => p.gender === 'male').length },
  { id: 'female', name: 'Females', count: ALL_NEARBY_PEOPLE.filter(p => p.gender === 'female').length },
];

export default function NearbyPeopleScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // TODO: Refresh people data from API
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Filter people based on search query and selected filter
  const filteredPeople = ALL_NEARBY_PEOPLE.filter(person => {
    const matchesSearch = searchQuery === "" || 
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.interests.some(interest => 
        interest.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      person.bio.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (selectedFilter === 'male') {
      matchesFilter = person.gender === 'male';
    } else if (selectedFilter === 'female') {
      matchesFilter = person.gender === 'female';
    }
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return Colors.emerald;
      case 'away': return Colors.amber;
      case 'offline': return Colors.gray500;
      default: return Colors.gray500;
    }
  };

  const renderPersonCard = ({ item }) => (
    <TouchableOpacity
      style={styles.personCard}
      onPress={() => {
        router.push(`/(screens)/profile/${item.id}`);
      }}
      accessibilityRole="button"
    >
      {/* Profile Image with Status */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.profileImage }}
          style={styles.profileImage}
          resizeMode="cover"
        />
        <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]} />
      </View>

      {/* Person Details */}
      <View style={styles.personDetails}>
        <View style={styles.nameRow}>
          <Text style={styles.personName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.personAge}>
            {item.age}
          </Text>
        </View>
        
        <View style={styles.locationRow}>
          <MapPin size={14} color={Colors.gray500} />
          <Text style={styles.locationText}>
            {item.location}
          </Text>
        </View>

        <Text style={styles.bioText} numberOfLines={2}>
          {item.bio}
        </Text>

        {/* Interests */}
        <View style={styles.interestsContainer}>
          {item.interests.slice(0, 3).map((interest, index) => (
            <View key={index} style={styles.interestTag}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </View>

        {/* Mutual Friends */}
        {item.mutualFriends > 0 && (
          <Text style={styles.mutualFriendsText}>
            {item.mutualFriends} mutual friend{item.mutualFriends > 1 ? 's' : ''}
          </Text>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.messageButton]}
          onPress={() => {
            router.push(`/(screens)/chat/${item.id}`);
          }}
        >
          <MessageCircle size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderFilterChip = ({ item: filter }) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        selectedFilter === filter.id && styles.activeFilterChip
      ]}
      onPress={() => setSelectedFilter(filter.id)}
    >
      <Text style={[
        styles.filterText,
        selectedFilter === filter.id && styles.activeFilterText
      ]}>
        {filter.name} ({filter.count})
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="People Nearby" />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={Colors.gray500} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, interests, or bio..."
              placeholderTextColor={Colors.gray500}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Text style={styles.clearButton}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter Chips */}
        <View style={styles.filtersContainer}>
          <FlatList
            data={GENDER_FILTERS}
            renderItem={renderFilterChip}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContent}
          />
        </View>

        {/* Results Header */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>
            {searchQuery ? `Search Results (${filteredPeople.length})` : `${filteredPeople.length} People Nearby`}
          </Text>
          {searchQuery && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Text style={styles.clearSearchText}>Clear Search</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* People List */}
        <View style={styles.peopleContainer}>
          {filteredPeople.length > 0 ? (
            <FlatList
              data={filteredPeople}
              renderItem={renderPersonCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No people found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery 
                  ? `No people match "${searchQuery}". Try adjusting your search or filters.`
                  : "No people found with the current filter. Try changing your filter settings."
                }
              </Text>
              {searchQuery && (
                <TouchableOpacity 
                  style={styles.clearSearchButton} 
                  onPress={() => setSearchQuery("")}
                >
                  <Text style={styles.clearSearchButtonText}>Clear Search</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Bottom spacing for safe area */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
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
  filtersContainer: {
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  filtersContent: {
    paddingHorizontal: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.lightBackground,
    borderRadius: 20,
    marginRight: 12,
  },
  activeFilterChip: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontFamily: 'Sora-Medium',
    fontSize: 14,
    color: Colors.gray500,
  },
  activeFilterText: {
    color: Colors.white,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.white,
  },
  resultsTitle: {
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
  peopleContainer: {
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
  },
  listContainer: {
    paddingBottom: 16,
  },
  personCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: Colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  imageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  personDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  personName: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 18,
    color: Colors.gray900,
    flex: 1,
  },
  personAge: {
    fontFamily: 'Sora-Medium',
    fontSize: 16,
    color: Colors.gray500,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: Colors.gray500,
    marginLeft: 4,
  },
  bioText: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: Colors.gray700,
    lineHeight: 20,
    marginBottom: 8,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 6,
  },
  interestTag: {
    backgroundColor: Colors.lightBackground,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  interestText: {
    fontFamily: 'Sora-Medium',
    fontSize: 12,
    color: Colors.gray700,
  },
  mutualFriendsText: {
    fontFamily: 'Sora-Medium',
    fontSize: 12,
    color: Colors.primary,
  },
  actionButtons: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.lightBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageButton: {
    backgroundColor: Colors.primary,
  },
  emptyState: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  emptyTitle: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 18,
    color: Colors.gray900,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
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
    height: Platform.OS === 'ios' ? 20 : 10,
  },
});
