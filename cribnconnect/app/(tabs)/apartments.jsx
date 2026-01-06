import { getApartments, getHotApartments } from "@/api/services/apartmentServices";
import ApartmentCard from "@/components/ApartmentCard";
import NormalHeader from "@/components/NormalHeader";
import SearchInput from "@/components/SearchInput";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from 'expo-location';
import { reverseGeocode } from '@/utils/geocodingUtils';

export default function ApartmentsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hotApartments, setHotApartments] = useState([]);
  const [nearbyApartments, setNearbyApartments] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [userCity, setUserCity] = useState(null);

  // Get user's location on mount
  useEffect(() => {
    getUserLocation();
  }, []);

  // Fetch apartments data
  useEffect(() => {
    if (!loading || userCity) {
      fetchApartmentsData();
    }
  }, [userCity]);

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        // Get city name from coordinates
        try {
          const address = await reverseGeocode([
            location.coords.longitude,
            location.coords.latitude
          ]);
          
          // Extract city from address string (format: "City, State, Country")
          const cityMatch = address.match(/^([^,]+)/);
          if (cityMatch) {
            setUserCity(cityMatch[1].trim());
          }
        } catch (error) {
          console.error('Error getting city name:', error);
        }
      }
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      // Always fetch data even if location fails
      if (!userCity) {
        fetchApartmentsData();
      }
    }
  };

  const fetchApartmentsData = async () => {
    try {
      // Only show loading spinner on initial load, not on refresh
      if (!refreshing) {
        setLoading(true);
      }

      // Fetch hot apartments and nearby apartments in parallel
      const promises = [
        getHotApartments({ limit: 10 })
      ];

      // If we have user's city, fetch apartments in that city
      if (userCity) {
        promises.push(getApartments({ city: userCity, limit: 10 }));
      } else {
        // Otherwise just fetch all apartments
        promises.push(getApartments({ limit: 10 }));
      }

      const [hotResponse, nearbyResponse] = await Promise.all(promises);

      setHotApartments(hotResponse.apartments || []);
      setNearbyApartments(nearbyResponse.apartments || []);

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
    if (nearbyApartments.length === 0) return null;

    const sectionTitle = userCity 
      ? `🏘️ Apartments in ${userCity}` 
      : '🏘️ Available Apartments';

    return (
      <View style={styles.carouselSection}>
        <TouchableOpacity 
          style={styles.sectionHeader}
          onPress={() => {
            // TODO: Navigate to all apartments in city
            console.log('View all apartments in', userCity);
          }}
        >
          <Text style={styles.sectionTitle}>{sectionTitle}</Text>
          <Text style={styles.seeAllText}>See All</Text>
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
        <View style={styles.searchContainer}>
          <SearchInput 
            placeholder="Search apartments..."
          />
        </View>
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
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        {renderNearbySection()}
        {renderHotSection()}

        {nearbyApartments.length === 0 && hotApartments.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No apartments available at the moment</Text>
            <Text style={styles.emptySubtext}>Pull down to refresh</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingBottom: Platform.OS === 'ios' ? 85 : 60,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  carouselSection: {
    marginVertical: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Sora-Bold",
    color: Colors.black,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: "Sora-Medium",
    color: Colors.primary,
  },
  carouselContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  carouselCardContainer: {
    width: 200,
    marginRight: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Sora-SemiBold',
    color: Colors.gray700,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray500,
  },
});
