import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  FlatList,
  Platform,
} from "react-native";
import { useState } from "react";
import { Link, router } from "expo-router";
import ApartmentCard from "@/components/ApartmentCard";
import { SafeAreaView } from "react-native-safe-area-context";
import NormalHeader from "@/components/NormalHeader";
import BackHeader from "@/components/BackHeader";
import { Colors } from "@/constants/Colors";
import SearchInput from "@/components/SearchInput";

// Mock data - TODO: Replace with API integration
const FEATURED_APARTMENTS = [
  {
    id: "1",
    title: "Modern Studio Downtown",
    pricePerNight: "$1,200/month",
    location: "Downtown Manhattan, 5th Avenue",
    type: "Studio",
    amenities: ["Gym", "Rooftop", "Laundry"],
    imageUri:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
    rating: 4.8,
    availability: "Available Now – Dec 31st",
  },
  {
    id: "2",
    title: "Luxury 2BR Apartment",
    pricePerNight: "$2,500/month",
    location: "Upper East Side, Park Avenue",
    type: "2 Bedroom",
    amenities: ["Doorman", "Pool", "Parking"],
    imageUri:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    rating: 4.9,
    availability: "Available Dec 1st – March 15th",
  },
  {
    id: "3",
    title: "Cozy 1BR with Balcony",
    pricePerNight: "$1,800/month",
    location: "Brooklyn Heights, Promenade Street",
    type: "1 Bedroom",
    amenities: ["Balcony", "Pet Friendly", "Garden"],
    imageUri:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
    rating: 4.7,
    availability: "Available Now – Feb 28th",
  },
];

// Carousel sections data
const CAROUSEL_SECTIONS = [
  {
    id: "hot",
    title: "Hot apartments Near you! 🔥",
    apartments: FEATURED_APARTMENTS,
  },
  {
    id: "kuje",
    title: "See more in Kuje, Abuja >",
    apartments: FEATURED_APARTMENTS.slice(0, 2),
  },
  {
    id: "central",
    title: "Central Area Listings >",
    apartments: FEATURED_APARTMENTS,
  },
  {
    id: "luxury",
    title: "Luxury Apartments >",
    apartments: FEATURED_APARTMENTS.slice(1),
  },
];

export default function ApartmentsScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // TODO: Refresh apartments data from API
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderCarouselCard = ({ item }) => (
    <View style={styles.carouselCardContainer}>
      <ApartmentCard
        imageUri={item.imageUri}
        title={item.title}
        pricePerNight={item.pricePerNight}
        location={item.location}
        availability={item.availability}
        liked={false}
        onLikeToggle={(liked) => {
          console.log("Bookmark toggled:", item.id, liked);
        }}
        onPress={() => {
          router.push(`/(screens)/apartment-details/${item.id}`);
        }}
      />
    </View>
  );

  const renderCarouselSection = ({ item: section }) => (
    <View style={styles.carouselSection}>
      <TouchableOpacity style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </TouchableOpacity>
      
      <FlatList
        data={section.apartments}
        renderItem={renderCarouselCard}
        keyExtractor={(item) => `${section.id}-${item.id}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContainer}
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <NormalHeader title="Apartments" />
      
      <View style={styles.searchContainer}>
        <SearchInput 
          placeholder="What are you looking for?"
        />
      </View>

      <FlatList
        data={CAROUSEL_SECTIONS}
        renderItem={renderCarouselSection}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingBottom: Platform.OS === 'ios' ? 85 : 60, // Match tab bar height
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
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
  carouselSection: {
    marginVertical: 4,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Sora-SemiBold",
    color: Colors.black,
  },
  carouselContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  carouselCardContainer: {
    width: 200,
    marginRight: 16,
  },
});
