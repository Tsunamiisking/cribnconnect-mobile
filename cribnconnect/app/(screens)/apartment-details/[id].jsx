import {
  getApartmentById,
  updateApartment,
} from "@/api/services/apartmentServices";
import { Colors } from "@/constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import { getAuth } from "firebase/auth";
import {
  ArrowLeft,
  Building2,
  Caravan,
  Container,
  Heart,
  Hotel,
  House,
  Share2,
  Ship,
  Tent,
  Trees,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { transformApartmentData } from "./utils/transformApartmentData";

// Import components
import AmenitiesSection from "./components/AmenitiesSection";
import ApartmentInfo from "./components/ApartmentInfo";
import HostInfo from "./components/HostInfo";
import HostManagement from "./components/HostManagement";
import MediaCarousel from "./components/MediaCarousel";

// Import amenity icons
import AirVent from "@/components/svgs/airVent";
import BathTub from "@/components/svgs/bathTub";
import BBQGrill from "@/components/svgs/bbqGrill";
import Beach from "@/components/svgs/beach";
import Electricity from "@/components/svgs/electricity";
import Fireplace from "@/components/svgs/fireplace";
import Generator from "@/components/svgs/generator";
import Gym from "@/components/svgs/gym";
import HomeAssistant from "@/components/svgs/homeAssistant";
import IndoorDining from "@/components/svgs/indoorDining";
import Kitchen from "@/components/svgs/kichen";
import OutdoorDining from "@/components/svgs/outdoorDining";
import Parking from "@/components/svgs/parking";
import Piano from "@/components/svgs/piano";
import Pool from "@/components/svgs/pool";
import PoolBall from "@/components/svgs/poolBall";
import Refrigerator from "@/components/svgs/refrigerator";
import Security from "@/components/svgs/security";
import SmartLock from "@/components/svgs/smartLock";
import Tv from "@/components/svgs/tv";
import Washer from "@/components/svgs/washer";
import Water from "@/components/svgs/water";
import Wifi from "@/components/svgs/wifi";
import Workspace from "@/components/svgs/workspace";

// Apartment type icons mapping
const apartmentTypeIcons = {
  House: House,
  Apartment: Building2,
  Boat: Ship,
  Hotel: Hotel,
  Camper: Caravan,
  Container: Container,
  Cabin: Trees,
  Tent: Tent,
};

// Amenity icons mapping
const amenityIcons = {
  WIFI: Wifi,
  TV: Tv,
  "Smart Lock": SmartLock,
  "Air Conditioning": AirVent,
  Refrigerator: Refrigerator,
  Kitchen: Kitchen,
  Washer: Washer,
  "Indoor Dining": IndoorDining,
  Electricity: Electricity,
  "Clean Water": Water,
  Workspace: Workspace,
  "Beach/Lake Access": Beach,
  "Pool Ball": PoolBall,
  "Outdoor Dining": OutdoorDining,
  Fireplace: Fireplace,
  "Private Gym": Gym,
  "Private Pool": Pool,
  "Private Parking": Parking,
  "BBQ Grill": BBQGrill,
  "Voice Assistant": HomeAssistant,
  "Indoor Piano": Piano,
  Bathtub: BathTub,
  "Shared Pool": Pool,
  "Shared Gym": Gym,
  "Shared Workspace": Workspace,
  Security: Security,
  "Shared Parking": Parking,
  Generator: Generator,
};

const ApartmentDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const [isLiked, setIsLiked] = useState(false);
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHost, setIsHost] = useState(false);

  const fetchApartment = async () => {
    try {
      console.log("Fetching apartment with ID:", id);

      // Fetch real apartment data from API
      const rawApartmentData = await getApartmentById(id);

      // console.log('=== RAW APARTMENT DATA FROM API ===');
      // console.log('Raw Data:', JSON.stringify(rawApartmentData, null, 2));
      // console.log('===================================');

      // Transform the data to match component expectations
      const apartmentData = transformApartmentData(rawApartmentData);

      // console.log('=== TRANSFORMED APARTMENT DATA ===');
      // console.log('Apartment ID:', id);
      // console.log('Apartment Type:', apartmentData.apartmentType);
      // console.log('Space Type:', apartmentData.space);
      // console.log('Host ID:', apartmentData.hostId);
      // console.log('Location:', apartmentData.location);
      // console.log('Pricing:', apartmentData.pricing);
      // console.log('Rooms:', apartmentData.rooms);
      // console.log('Amenities - Basic:', apartmentData.amenities.basic);
      // console.log('Amenities - Luxury:', apartmentData.amenities.luxury);
      // console.log('Amenities - Shared:', apartmentData.amenities.shared);
      // console.log('Amenities - Other:', apartmentData.amenities.other);
      // console.log('Media Count:', apartmentData.media?.length || 0);
      // console.log('Is Published:', apartmentData.isPublished);
      // console.log('Stats:', apartmentData.stats);
      // console.log('===================================');

      setApartment(apartmentData);

      // Check if current user is the host
      const auth = getAuth();
      const currentUserId = auth?.currentUser?.uid;
      // console.log('=== HOST DETECTION ===');
      // console.log('Current User ID:', currentUserId);
      // console.log('Apartment Host ID:', apartmentData.hostId);
      // console.log('Host ID Type:', typeof apartmentData.hostId);
      // console.log('User ID Type:', typeof currentUserId);
      // console.log('Are they equal?:', currentUserId === apartmentData.hostId);
      // console.log('Is Host:', currentUserId === apartmentData.hostId);
      // console.log('======================');

      setIsHost(currentUserId === apartmentData.hostId);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching apartment:", error);
      console.error("Error details:", error.response?.data || error.message);
      Alert.alert(
        "Error",
        "Failed to load apartment details. Please try again."
      );
      setLoading(false);
    }
  };
  // Fetch apartment data
  useEffect(() => {
    fetchApartment();
  }, [id]);

  const handleShare = () => {
    Alert.alert("Share", "Share functionality will be implemented here");
  };

  const handleBooking = () => {
    Alert.alert("Booking", "Booking functionality will be implemented here");
  };

  const handleApartmentUpdate = (updatedApartment) => {
    // console.log("Apartment updated:", updatedApartment);
    setApartment(updatedApartment);
  };

  const handleApartmentDelete = () => {
    console.log("Apartment deleted, navigating back");
    router.back();
  };

  const handleAmenitiesUpdate = async (category, list) => {
    try {
      const payload = {};
      if (category === "basic")
        payload.basicAmenities = Array.isArray(list) ? list : [];
      if (category === "luxury")
        payload.luxuryAmenities = Array.isArray(list) ? list : [];
      if (category === "shared")
        payload.sharedAmenities = Array.isArray(list) ? list : [];

      const updated = await updateApartment(id, payload);

      if (updated) {
        fetchApartment();
      }

      console.log("Amenities updated successfully:");
    } catch (err) {
      console.error(
        "Failed to Update amenities:",
        err.response?.data || err.message || err
      );
      Alert.alert("Error", "Failed to save amenities. Please try again.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading apartment details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!apartment) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Apartment not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerButton}
        >
          <ArrowLeft size={24} color={Colors.black} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          {isHost ? (
            <HostManagement
              apartment={apartment}
              isHost={isHost}
              onApartmentUpdate={handleApartmentUpdate}
              onApartmentDelete={handleApartmentDelete}
              section="menuButton"
            />
          ) : (
            <>
              <TouchableOpacity
                onPress={handleShare}
                style={styles.headerButton}
              >
                <Share2 size={24} color={Colors.black} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsLiked(!isLiked)}
                style={styles.headerButton}
              >
                <Heart
                  size={24}
                  color={isLiked ? Colors.emerald : Colors.black}
                  fill={isLiked ? Colors.emerald : "transparent"}
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* availability badge moved below media carousel (see below) */}

      {/* Stats Banner - Below header for hosts */}
      {isHost && (
        <HostManagement
          apartment={apartment}
          isHost={isHost}
          onApartmentUpdate={handleApartmentUpdate}
          onApartmentDelete={handleApartmentDelete}
          section="statsBanner"
        />
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Media Carousel */}
        {apartment.media && apartment.media.length > 0 && (
          <MediaCarousel media={apartment.media} />
        )}

        {/* Availability badge for hosts (below media, above title) */}
        {isHost && (
          <>
            <View style={styles.availabilityBadgeContainer}>
              <View
                style={[
                  styles.availabilityBadge,
                  {
                    backgroundColor: apartment.isAvailable
                      ? Colors.success
                      : Colors.error,
                  },
                ]}
              >
                <View
                  style={[
                    styles.availabilityDot,
                    { backgroundColor: Colors.white },
                  ]}
                />
                <Text style={styles.availabilityText}>
                  {apartment.isAvailable ? "Available" : "Unavailable"}
                </Text>
              </View>

              <View
                style={[
                  styles.availabilityBadge,
                  {
                    backgroundColor: apartment.isPublished
                      ? Colors.success
                      : Colors.gray500,
                  },
                ]}
              >
                <View
                  style={[
                    styles.availabilityDot,
                    { backgroundColor: Colors.white },
                  ]}
                />
                <Text style={styles.availabilityText}>
                  {apartment.isPublished ? "Published" : "Unpublished"}
                </Text>
              </View>
            </View>
          </>
        )}

        {/* Apartment Info */}
        <ApartmentInfo
          apartment={apartment}
          apartmentTypeIcons={apartmentTypeIcons}
        />

        {/* Amenities */}
        <AmenitiesSection
          amenities={apartment.amenities}
          amenityIcons={amenityIcons}
          isHost={isHost}
          onSaveAmenities={handleAmenitiesUpdate}
        />

        {/* Host Info - Only visible to guests */}
        {!isHost && <HostInfo houseRules={apartment.houseRules} />}

        {/* Quick Actions - Below Host Info for hosts */}
        {/* {isHost && (
          <HostManagement 
            apartment={apartment}
            isHost={isHost}
            onApartmentUpdate={handleApartmentUpdate}
            onApartmentDelete={handleApartmentDelete}
            section="quickActions"
          />
        )} */}
      </ScrollView>

      {/* Bottom Bar - Only visible to guests */}
      {!isHost && (
        <View style={styles.bottomBar}>
          <View style={styles.bottomPricing}>
            <Text style={styles.bottomPrice}>
              ₦{parseInt(apartment.pricing.perNight || 0).toLocaleString()}
              <Text style={styles.bottomPriceUnit}> / night</Text>
            </Text>
          </View>
          <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
            <Text style={styles.bookButtonText}>Check Availability</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    justifyContent: "center",
    alignItems: "center",
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  content: {
    flex: 1,
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomPricing: {
    flex: 1,
  },
  bottomPrice: {
    fontSize: 18,
    fontFamily: "Sora-Bold",
    color: Colors.primary,
  },
  bottomPriceUnit: {
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
  },
  bookButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  bookButtonText: {
    fontSize: 16,
    fontFamily: "Sora-SemiBold",
    color: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    fontFamily: "Sora-SemiBold",
    color: Colors.gray700,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: "Sora-SemiBold",
    color: Colors.white,
  },
  availabilityBadgeContainer: {
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 12,
    justifyContent: "space-between",
    flexDirection: "row"

  },
  availabilityBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginVertical: 5,
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  availabilityText: {
    fontSize: 12,
    fontFamily: "Sora-Medium",
    color: Colors.white,
  },
});

export default ApartmentDetailsScreen;
