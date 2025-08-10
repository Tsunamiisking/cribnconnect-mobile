import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  FlatList,
} from "react-native";
import { useState } from "react";
import { Link, router } from "expo-router";
import ApartmentCard from "@/components/ApartmentCard";
// import { NormalHeader } from "@/components/NormalHeader";
import { SafeAreaView } from "react-native-safe-area-context";

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

export default function ApartmentsScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // TODO: Refresh apartments data from API
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderApartmentCard = ({ item }) => (
    <View style={styles.cardContainer}>
      <ApartmentCard
        imageUri={item.imageUri}
        title={item.title}
        pricePerNight={item.pricePerNight}
        location={item.location}
        availability={item.availability}
        liked={false} // TODO: Replace with actual bookmark status from API
        onLikeToggle={(liked) => {
          // TODO: Add API integration for bookmarking
          console.log("Bookmark toggled:", item.id, liked);
        }}
        onPress={() => {
          router.push(`/(screens)/apartment-details/${item.id}`);
        }}
        className="w-full"
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      
      <FlatList
        data={FEATURED_APARTMENTS}
        horizontal={true}
        renderItem={renderApartmentCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100, // Extra space for tab bar
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardContainer: {
    flex: 1,
    maxWidth: '48%', // Ensures 2 columns with some spacing
  },
});
