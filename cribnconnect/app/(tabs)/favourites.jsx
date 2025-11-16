import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  FlatList,
  Platform,
  ScrollView,
} from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import NormalHeader from '@/components/NormalHeader';
import ApartmentCard from '@/components/ApartmentCard';
import EventCard from '@/components/EventCard';
import { Colors } from '@/constants/Colors';
import { Heart, Building, Calendar } from 'lucide-react-native';

// Mock data - TODO: Replace with API integration for saved items
const SAVED_APARTMENTS = [
  {
    id: "1",
    title: "Modern Studio Downtown",
    pricePerNight: "$1,200/month",
    location: "Downtown Manhattan, 5th Avenue",
    type: "Studio",
    apartmentType: "full", // full apartment
    amenities: ["Gym", "Rooftop", "Laundry"],
    imageUri: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
    rating: 4.8,
    availability: "Available Now – Dec 31st",
    savedDate: "2 days ago",
  },
  {
    id: "2",
    title: "Luxury 2BR Apartment",
    pricePerNight: "$2,500/month",
    location: "Upper East Side, Park Avenue",
    type: "2 Bedroom",
    apartmentType: "service", // service apartment
    amenities: ["Doorman", "Pool", "Parking"],
    imageUri: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    rating: 4.9,
    availability: "Available Dec 1st – March 15th",
    savedDate: "1 week ago",
  },
  {
    id: "3",
    title: "Cozy 1BR with Balcony",
    pricePerNight: "$1,800/month",
    location: "Brooklyn Heights, Promenade Street",
    type: "1 Bedroom",
    apartmentType: "shared", // shared apartment - will show Users icon
    amenities: ["Balcony", "Pet Friendly", "Garden"],
    imageUri: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
    rating: 4.7,
    availability: "Available Now – Feb 28th",
    savedDate: "3 days ago",
  },
];

const SAVED_EVENTS = [
  {
    id: "1",
    title: "Rooftop Jazz Night",
    description: "Live jazz music under the stars with cocktails and city views",
    location: "Sky Lounge, Victoria Island",
    date: "December 15, 2024",
    time: "8:00 PM",
    price: "₦15,000",
    category: "Music",
    imageUri: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    attendees: "120+ attending",
    dayOrNight: "night",
    savedDate: "1 day ago",
  },
  {
    id: "2",
    title: "Weekend Farmers Market",
    description: "Fresh produce, artisanal foods, and local crafts from regional vendors",
    location: "Central Park, Abuja",
    date: "December 14, 2024",
    time: "9:00 AM",
    price: "Free",
    category: "Community",
    imageUri: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop",
    attendees: "200+ attending",
    dayOrNight: "day",
    savedDate: "4 days ago",
  },
  {
    id: "3",
    title: "Photography Workshop",
    description: "Learn street photography techniques with professional photographers",
    location: "Art District, Lagos",
    date: "December 20, 2024",
    time: "2:00 PM",
    price: "₦8,500",
    category: "Workshop",
    imageUri: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=300&fit=crop",
    attendees: "45+ attending",
    dayOrNight: "day",
    savedDate: "1 week ago",
  },
];

const BOOKMARK_TABS = [
  { id: 'apartments', title: 'Apartments', icon: Building },
  { id: 'events', title: 'Events', icon: Calendar },
];

export default function Bookmarkscreen() {
  const [selectedTab, setSelectedTab] = useState('apartments');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // TODO: Refresh bookmarks data from API
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getCurrentBookmarks = () => {
    switch (selectedTab) {
      case 'apartments': return SAVED_APARTMENTS;
      case 'events': return SAVED_EVENTS;
      default: return [];
    }
  };

  const renderTabButton = (tab) => (
    <TouchableOpacity
      key={tab.id}
      style={[
        styles.tabButton,
        selectedTab === tab.id && styles.activeTabButton
      ]}
      onPress={() => setSelectedTab(tab.id)}
    >
      <Text style={[
        styles.tabText,
        selectedTab === tab.id && styles.activeTabText
      ]}>
        {tab.title}
      </Text>
    </TouchableOpacity>
  );

  const renderApartmentCard = ({ item }) => (
    <View style={styles.cardContainer}>
      <ApartmentCard
        imageUri={item.imageUri}
        title={item.title}
        pricePerNight={item.pricePerNight}
        location={item.location}
        availability={item.availability}
        apartmentType={item.apartmentType}
        liked={true} // All bookmarked items are liked
        onLikeToggle={(liked) => {
          console.log("Bookmark toggled:", item.id, liked);
          // TODO: Remove from bookmarks if unliked
        }}
        onPress={() => {
          router.push(`/(screens)/apartment-details/${item.id}`);
        }}
      />
    </View>
  );

  const renderEventCard = ({ item }) => (
    <View style={styles.cardContainer}>
      <EventCard
        imageUri={item.imageUri}
        title={item.title}
        description={item.description}
        location={item.location}
        date={item.date}
        time={item.time}
        price={item.price}
        attendees={item.attendees}
        dayOrNight={item.dayOrNight}
        liked={true} // All bookmarked items are liked
        onLikeToggle={(liked) => {
          console.log("Event bookmark toggled:", item.id, liked);
          // TODO: Remove from bookmarks if unliked
        }}
        onPress={() => {
          router.push(`/(screens)/event-details/${item.id}`);
        }}
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <NormalHeader title="Bookmarks" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Tab Navigation */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabsContent}>
            {BOOKMARK_TABS.map(renderTabButton)}
          </View>
        </View>

        {/* Tab Content */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>
            {selectedTab === 'apartments' ? 'Saved Apartments' : 'Saved Events'}
          </Text>
          
          {getCurrentBookmarks().length > 0 ? (
            <FlatList
              data={getCurrentBookmarks()}
              renderItem={selectedTab === 'apartments' ? renderApartmentCard : renderEventCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            <View style={styles.emptyState}>
              <Heart size={48} color={Colors.gray400} />
              <Text style={styles.emptyTitle}>No saved {selectedTab} yet</Text>
              <Text style={styles.emptySubtitle}>
                {selectedTab === 'apartments' 
                  ? "Start saving apartments you're interested in to view them here!"
                  : "Save events you want to attend to keep track of them here!"
                }
              </Text>
              <TouchableOpacity 
                style={styles.exploreButton}
                onPress={() => {
                  if (selectedTab === 'apartments') {
                    router.push('/(tabs)'); // Navigate to home/apartments tab
                  } else {
                    router.push('/(tabs)/events'); // Navigate to events tab
                  }
                }}
              >
                <Text style={styles.exploreButtonText}>
                  Explore {selectedTab === 'apartments' ? 'Apartments' : 'Events'}
                </Text>
              </TouchableOpacity>
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
  tabsContainer: {
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  tabsContent: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.lightBackground,
    borderRadius: 20,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontFamily: 'Sora-Medium',
    fontSize: 14,
    color: Colors.gray500,
  },
  activeTabText: {
    color: Colors.white,
  },
  contentSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 20,
    color: Colors.gray900,
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  cardContainer: {
    marginBottom: 16,
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
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: 'Sora-Regular',
    fontSize: 16,
    color: Colors.gray500,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  exploreButtonText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    color: Colors.white,
  },
  bottomSpacing: {
    height: Platform.OS === 'ios' ? 85 : 60,
  },
});