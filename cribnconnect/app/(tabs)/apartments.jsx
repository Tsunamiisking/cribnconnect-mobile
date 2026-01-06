import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  FlatList,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { Link, router } from "expo-router";
import ApartmentCard from "@/components/ApartmentCard";
import { SafeAreaView } from "react-native-safe-area-context";
import NormalHeader from "@/components/NormalHeader";
import BackHeader from "@/components/BackHeader";
import { Colors } from "@/constants/Colors";
import SearchInput from "@/components/SearchInput";
import { getHotApartments, getNearbyApartments } from "@/api/services/apartmentServices";
import * as Location from 'expo-location';

export default function ApartmentsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hotApartments, setHotApartments] = useState([]);
  const [nearbyApartments, setNearbyApartments] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);

  // Get user's location
  useEffect(() => {
    getUserLocation();
  }, []);

  // Fetch apartments data
  useEffect(() => {
    fetchApartmentsData();
  }, [userLocation]);

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
      
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationPermission(false);
    }
  };

  const fetchApartmentsData = async () => {
    try {
      setLoading(true);

      // Fetch hot apartments
      const hotResponse = await getHotApartments({ limit: 10 });
      setHotApartments(hotResponse.apartments || []);

      // Fetch nearby apartments if location is available
      if (userLocation) {
        const nearbyResponse = await getNearbyApartments({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          radius: 10, // 10km radius
          limit: 10,
        });
        setNearbyApartments(nearbyResponse.apartments || []);
      }

    } catch (error) {
      console.error('Error fetching apartments:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchApartmentsData();
    setRefreshing(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchApartmentsData();
    setRefreshing(false);
  };

  const formatApartmentData = (apartment) => {
    const firstImage = apartment.media?.[0]?.url || null;
    const locationText = `${apartment.address?.city || ''}, ${apartment.address?.state || ''}`.trim();
    
    return {
      id: apartment._id,
      title: apartment.title,
      pricePerNight: `₦${apartment.pricePerNight?.toLocaleString()}/night`,
      location: locationText,
      availability: apartment.isAvailable ? "Available Now" : "Not Available",
      apartmentType: apartment.apartmentCategory,
      rating: apartment.rating || 0,
      imageUri: firstImage,
      liked: false, // TODO: Check if user has bookmarked
    };
  };

  const renderCarouselCard = ({ item }) => {
    const formattedItem = formatApartmentData(item);
    
    return (
      <View style={styles.carouselCardContainer}>
        <ApartmentCard
          imageUri={formattedItem.imageUri}
          title={formattedItem.title}
          pricePerNight={formattedItem.pricePerNight}
          location={formattedItem.location}
          availability={formattedItem.availability}
          apartmentType={formattedItem.apartmentType}
          liked={formattedItem.liked}
          onLikeToggle={(liked) => {
            console.log("Bookmark toggled:", item._id, liked);
          }}
          onPress={() => {
            router.push(`/(screens)/apartment-details/${item._id}`);
          }}
        />
      </View>
    );
  };

  const renderNearbySection = () => {
    if (!userLocation || nearbyApartments.length === 0) return null;

    return (
      <View style={styles.carouselSection}>
        <TouchableOpacity style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🏘️ Apartments Near You</Text>
        </TouchableOpacity>
        
        <FlatList
          data={nearbyApartments}
          renderItem={renderCarouselCard}
          keyExtractor={(item) => `nearby-${item._id}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContainer}
        />
      </View>
    );
  };

  const renderHotSection = () => {
    if (hotApartments.length === 0) return null;

    return (
      <View style={styles.carouselSection}>
        <TouchableOpacity 
          style={styles.sectionHeader}
          onPress={() => {
            // TODO: Navigate to all hot apartments
            console.log('View all hot apartments');
          }}
        >
          <Text style={styles.sectionTitle}>🔥 Hot Apartments</Text>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
        
        <FlatList
          data={hotApartments}
          renderItem={renderCarouselCard}
          keyExtractor={(item) => `hot-${item._id}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContainer}
        />
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <NormalHeader title="Apartments" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading apartments...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <NormalHeader title="Apartments" />
      
      <View style={styles.searchContainer}>
        <SearchInput 
          placeholder="Search apartments..."
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderNearbySection()}
        {renderHotSection()}

        {nearbyApartments.length === 0 && hotApartments.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No apartments available at the moment</Text>
            <Text style={styles.emptySubtext}>Pull to refresh</Text>
          </View>
        )}
      </ScrollView>
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
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowOpacity: 0.08,
    // shadowRadius: 6,
    // elevation: 3,
    // zIndex: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  carouselSection: {
    marginVertical: 4,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Sora-Bold",
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
