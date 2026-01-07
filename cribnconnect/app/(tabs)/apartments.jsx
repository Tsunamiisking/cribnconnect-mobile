import { getApartments, getHotApartments } from "@/api/services/apartmentServices";
import ApartmentCard from "@/components/ApartmentCard";
import NormalHeader from "@/components/NormalHeader";
import SearchInput from "@/components/SearchInput";
import { ApartmentCardSkeleton } from "@/components/SkeletonLoader";
import { Colors } from "@/constants/Colors";
import { reverseGeocode } from '@/utils/geocodingUtils';
import * as Location from 'expo-location';
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ApartmentsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hotApartments, setHotApartments] = useState([]);
  const [nearbyApartments, setNearbyApartments] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [userCity, setUserCity] = useState(null);
  const [locationChecked, setLocationChecked] = useState(false);

  // Get user's location on mount
  useEffect(() => {
    getUserLocation();
  }, []);

  // Fetch apartments data after location is checked
  useEffect(() => {
    if (locationChecked) {
      fetchApartmentsData();
    }
  }, [locationChecked]);

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
      setLocationChecked(true);
    }
  };

  const fetchApartmentsData = async () => {
    try {
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
      setInitialLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchApartmentsData();
    } finally {
      setRefreshing(false);
    }
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

  if (initialLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <NormalHeader title="Apartments" />
        
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.searchContainer}>
            <SearchInput 
              placeholder="Search apartments..."
              editable={false}
            />
          </View>

          {/* Nearby Apartments Skeleton */}
          <View style={styles.carouselSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.skeletonTitle} />
              <View style={styles.skeletonSeeAll} />
            </View>
            <FlatList
              data={[1, 2]}
              renderItem={() => (
                <View style={styles.carouselCardContainer}>
                  <ApartmentCardSkeleton style={{ width: '100%' }} />
                </View>
              )}
              keyExtractor={(item) => `skeleton-nearby-${item}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselContainer}
            />
          </View>

          {/* Hot Apartments Skeleton */}
          <View style={styles.carouselSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.skeletonTitle} />
              <View style={styles.skeletonSeeAll} />
            </View>
            <FlatList
              data={[1, 2]}
              renderItem={() => (
                <View style={styles.carouselCardContainer}>
                  <ApartmentCardSkeleton style={{ width: '100%' }} />
                </View>
              )}
              keyExtractor={(item) => `skeleton-hot-${item}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselContainer}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <NormalHeader title="Apartments" />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
            progressBackgroundColor="#ffffff"
          />
        }
      >
        <View style={styles.searchContainer}>
          <SearchInput 
            placeholder="Search apartments..."
          />
        </View>

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
  scrollContent: {
    flexGrow: 1,
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
  skeletonTitle: {
    width: 120,
    height: 20,
    backgroundColor: Colors.gray200,
    borderRadius: 4,
  },
  skeletonSeeAll: {
    width: 60,
    height: 16,
    backgroundColor: Colors.gray200,
    borderRadius: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    fontFamily: 'Sora-Medium',
    color: Colors.gray700,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Sora-SemiBold',
    color: Colors.gray700,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray500,
    textAlign: 'center',
  },
});
