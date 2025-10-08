import { Colors } from '@/constants/Colors';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Bath,
  Bed,
  Building2,
  Caravan,
  ChevronLeft,
  ChevronRight,
  Container,
  Grid3X3,
  Heart,
  Hotel,
  House,
  MapPin,
  Play,
  Share2,
  Ship,
  Star,
  Tent,
  Trees,
  Users,
  X,
  ZoomIn
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import amenity icons (using same structure as Step6.jsx)
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

const { width: screenWidth } = Dimensions.get('window');

// Apartment type icons mapping
const apartmentTypeIcons = {
  "House": House,
  "Apartment": Building2,
  "Boat": Ship,
  "Hotel": Hotel,
  "Camper": Caravan,
  "Container": Container,
  "Cabin": Trees,
  "Tent": Tent,
};

// Amenity icons mapping (same as Step6.jsx)
const amenityIcons = {
  "WIFI": Wifi,
  "TV": Tv,
  "Smart Lock": SmartLock,
  "Air Conditioning": AirVent,
  "Refrigerator": Refrigerator,
  "Kitchen": Kitchen,
  "Washer": Washer,
  "Indoor Dining": IndoorDining,
  "Electricity": Electricity,
  "Clean Water": Water,
  "Workspace": Workspace,
  "Beach/Lake Access": Beach,
  "Pool Ball": PoolBall,
  "Outdoor Dining": OutdoorDining,
  "Fireplace": Fireplace,
  "Private Gym": Gym,
  "Private Pool": Pool,
  "Private Parking": Parking,
  "BBQ Grill": BBQGrill,
  "Voice Assistant": HomeAssistant,
  "Indoor Piano": Piano,
  "Bathtub": BathTub,
  "Shared Pool": Pool,
  "Shared Gym": Gym,
  "Shared Workspace": Workspace,
  "Security": Security,
  "Shared Parking": Parking,
  "Generator": Generator,
};

const ApartmentDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullScreenMedia, setShowFullScreenMedia] = useState(false);
  const [fullScreenIndex, setFullScreenIndex] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  
  // Create refs for FlatLists
  const fullScreenFlatListRef = React.useRef(null);
  const mainFlatListRef = React.useRef(null);

  // Mock apartment data - in real app, fetch based on id
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setApartment(mockApartmentData);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleShare = () => {
    Alert.alert('Share', 'Share functionality will be implemented here');
  };

  const handleBooking = () => {
    Alert.alert('Booking', 'Booking functionality will be implemented here');
  };

  const openFullScreenMedia = (index) => {
    setFullScreenIndex(index);
    setShowFullScreenMedia(true);
    // Scroll to the correct index after modal opens
    setTimeout(() => {
      if (fullScreenFlatListRef.current) {
        fullScreenFlatListRef.current.scrollToIndex({
          index: index,
          animated: false,
        });
      }
    }, 100);
  };

  const openAllPhotos = () => {
    setShowAllPhotos(true);
  };

  const closeFullScreenMedia = () => {
    setShowFullScreenMedia(false);
  };

  const closeAllPhotos = () => {
    setShowAllPhotos(false);
  };

  // Navigate to previous image
  const goToPrevious = () => {
    if (fullScreenIndex > 0 && fullScreenFlatListRef.current) {
      const newIndex = fullScreenIndex - 1;
      try {
        fullScreenFlatListRef.current.scrollToIndex({
          index: newIndex,
          animated: true,
        });
        setFullScreenIndex(newIndex);
      } catch (error) {
        console.log('Error scrolling to previous:', error);
        // Fallback: scroll by offset
        fullScreenFlatListRef.current.scrollToOffset({
          offset: newIndex * screenWidth,
          animated: true,
        });
        setFullScreenIndex(newIndex);
      }
    }
  };

  // Navigate to next image
  const goToNext = () => {
    if (fullScreenIndex < apartment.media.length - 1 && fullScreenFlatListRef.current) {
      const newIndex = fullScreenIndex + 1;
      try {
        fullScreenFlatListRef.current.scrollToIndex({
          index: newIndex,
          animated: true,
        });
        setFullScreenIndex(newIndex);
      } catch (error) {
        console.log('Error scrolling to next:', error);
        // Fallback: scroll by offset
        fullScreenFlatListRef.current.scrollToOffset({
          offset: newIndex * screenWidth,
          animated: true,
        });
        setFullScreenIndex(newIndex);
      }
    }
  };

  // Get image dimensions and determine if it's portrait/landscape
  const getImageAspectRatio = (item) => {
    // Default to landscape if no dimensions available
    if (!item.width || !item.height) return 'landscape';
    const ratio = item.width / item.height;
    if (ratio > 1.3) return 'landscape';
    if (ratio < 0.75) return 'portrait';
    return 'square';
  };

  // Enhanced media rendering with improved layout
  const renderEnhancedMediaItem = ({ item, index }) => {
    const aspectRatio = getImageAspectRatio(item);
    const isPortrait = aspectRatio === 'portrait';
    
    return (
      <TouchableOpacity 
        style={[styles.mediaContainer, isPortrait && styles.portraitMediaContainer]}
        onPress={() => openFullScreenMedia(index)}
        activeOpacity={0.9}
      >
        {item.resource_type === 'video' ? (
          <View style={styles.videoContainer}>
            <Image 
              source={{ uri: item.localThumbnail || item.localUri }} 
              style={[
                styles.mediaImage,
                isPortrait ? styles.portraitImage : styles.landscapeImage
              ]}
              resizeMode={isPortrait ? "contain" : "cover"}
            />
            <View style={styles.playButton}>
              <Play size={24} color={Colors.white} />
            </View>
            <View style={styles.videoLabel}>
              <Play size={16} color={Colors.white} />
              <Text style={styles.videoLabelText}>Video</Text>
            </View>
          </View>
        ) : (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: item.localUri || item.url }} 
              style={[
                styles.mediaImage,
                isPortrait ? styles.portraitImage : styles.landscapeImage
              ]}
              resizeMode={isPortrait ? "contain" : "cover"}
            />
            <View style={styles.zoomIndicator}>
              <ZoomIn size={16} color={Colors.white} />
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Grid view for all photos modal
  const renderGridItem = ({ item, index }) => (
    <TouchableOpacity 
      style={styles.gridItem}
      onPress={() => {
        closeAllPhotos();
        openFullScreenMedia(index);
      }}
    >
      <Image 
        source={{ uri: item.localThumbnail || item.localUri || item.url }} 
        style={styles.gridImage}
        resizeMode="cover"
      />
      {item.resource_type === 'video' && (
        <View style={styles.gridVideoIndicator}>
          <Play size={16} color={Colors.white} />
        </View>
      )}
    </TouchableOpacity>
  );

  // Full-screen media viewer
  const renderFullScreenMedia = ({ item, index }) => {
    return (
      <View style={styles.fullScreenContainer} key={`fullscreen-${index}`}>
        {item.resource_type === 'video' ? (
          <TouchableOpacity style={styles.fullScreenVideoContainer}>
            <Image 
              source={{ uri: item.localThumbnail || item.localUri }} 
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
            <View style={styles.fullScreenPlayButton}>
              <Play size={40} color={Colors.white} />
            </View>
          </TouchableOpacity>
        ) : (
          <Image 
            source={{ uri: item.localUri || item.url }} 
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
        )}
      </View>
    );
  };

  const renderMediaItem = ({ item, index }) => (
    <View style={styles.mediaContainer}>
      {item.resource_type === 'video' ? (
        <View style={styles.videoContainer}>
          <Image 
            source={{ uri: item.localThumbnail || item.localUri }} 
            style={styles.mediaImage}
            resizeMode="cover"
          />
          <View style={styles.playButton}>
            <Play size={24} color={Colors.white} />
          </View>
        </View>
      ) : (
        <Image 
          source={{ uri: item.localUri || item.url }} 
          style={styles.mediaImage}
          resizeMode="cover"
        />
      )}
    </View>
  );

  const renderAmenity = (amenityName) => {
    const IconComponent = amenityIcons[amenityName];
    return (
      <View key={amenityName} style={styles.amenityItem}>
        {IconComponent && <IconComponent width={24} height={24} />}
        <Text style={styles.amenityText}>{amenityName}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
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
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const ApartmentTypeIcon = apartmentTypeIcons[apartment.apartmentType];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <ArrowLeft size={24} color={Colors.black} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
            <Share2 size={24} color={Colors.black} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setIsLiked(!isLiked)} 
            style={styles.headerButton}
          >
            <Heart 
              size={24} 
              color={isLiked ? Colors.emerald : Colors.black}
              fill={isLiked ? Colors.emerald : 'transparent'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Media Gallery */}
        {apartment.media && apartment.media.length > 0 && (
          <View style={styles.mediaSection}>
            <FlatList
              data={apartment.media}
              renderItem={renderEnhancedMediaItem}
              keyExtractor={(item, index) => index.toString()}
              ref={mainFlatListRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
                setCurrentImageIndex(index);
              }}
            />
            {apartment.media.length > 1 && (
              <View style={styles.mediaIndicator}>
                <Text style={styles.mediaIndicatorText}>
                  {currentImageIndex + 1} / {apartment.media.length}
                </Text>
              </View>
            )}
            {apartment.media.length > 1 && (
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={openAllPhotos}
              >
                <Grid3X3 size={16} color={Colors.white} />
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Apartment Info */}
        <View style={styles.infoSection}>
          {/* Title and Type */}
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{apartment.details.title}</Text>
              <View style={styles.typeContainer}>
                {ApartmentTypeIcon && (
                  <ApartmentTypeIcon size={20} color={Colors.primary} />
                )}
                <Text style={styles.typeText}>{apartment.apartmentType}</Text>
              </View>
            </View>
            <Text style={styles.spaceType}>{apartment.space}</Text>
          </View>

          {/* Location */}
          <View style={styles.locationSection}>
            <MapPin size={16} color={Colors.gray600} />
            <Text style={styles.locationText}>
              {apartment.location.complexName && `${apartment.location.complexName}, `}
              {apartment.location.city}, {apartment.location.state}
            </Text>
          </View>

          {/* Rating and Reviews */}
          <View style={styles.ratingSection}>
            <Star size={16} color={Colors.amber} fill={Colors.amber} />
            <Text style={styles.ratingText}>4.8 (124 reviews)</Text>
          </View>

          {/* Room Details */}
          <View style={styles.roomSection}>
            <View style={styles.roomRow}>
              <View style={styles.roomItem}>
                <Bed size={20} color={Colors.gray600} />
                <Text style={styles.roomText}>{apartment.rooms.beds} Beds</Text>
              </View>
              <View style={styles.roomItem}>
                <Users size={20} color={Colors.gray600} />
                <Text style={styles.roomText}>{apartment.rooms.rooms} Rooms</Text>
              </View>
              <View style={styles.roomItem}>
                <Bath size={20} color={Colors.gray600} />
                <Text style={styles.roomText}>
                  {(parseInt(apartment.rooms.privateBathIn || 0) + 
                    parseInt(apartment.rooms.privateBathOut || 0) + 
                    parseInt(apartment.rooms.sharedBath || 0))} Baths
                </Text>
              </View>
              <View style={styles.roomItem}>
                <Users size={20} color={Colors.gray600} />
                <Text style={styles.roomText}>Max {apartment.maxGuests} guests</Text>
              </View>
            </View>
          </View>

          {/* Pricing */}
          <View style={styles.pricingSection}>
            <Text style={styles.priceText}>
              ₦{parseInt(apartment.pricing.perNight || 0).toLocaleString()}
              <Text style={styles.priceUnit}> / night</Text>
            </Text>
            {apartment.pricing.perWeek && (
              <Text style={styles.weeklyPrice}>
                ₦{parseInt(apartment.pricing.perWeek).toLocaleString()} / week
              </Text>
            )}
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>About this space</Text>
            <Text style={styles.description}>{apartment.details.description}</Text>
          </View>

          {/* Amenities */}
          {apartment.amenities.selected.length > 0 && (
            <View style={styles.amenitiesSection}>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.amenitiesGrid}>
                {apartment.amenities.selected.map(renderAmenity)}
              </View>
              {apartment.amenities.other && (
                <View style={styles.otherAmenities}>
                  <Text style={styles.otherAmenitiesTitle}>Other amenities:</Text>
                  <Text style={styles.otherAmenitiesText}>{apartment.amenities.other}</Text>
                </View>
              )}
            </View>
          )}

          {/* House Rules */}
          {apartment.houseRules.length > 0 && (
            <View style={styles.rulesSection}>
              <Text style={styles.sectionTitle}>House Rules</Text>
              <Text style={styles.rulesText}>{apartment.houseRules[0]}</Text>
            </View>
          )}

          {/* Host Info */}
          <View style={styles.hostSection}>
            <Text style={styles.sectionTitle}>Meet your host</Text>
            <View style={styles.hostInfo}>
              <View style={styles.hostAvatar}>
                <Text style={styles.hostInitial}>JD</Text>
              </View>
              <View style={styles.hostDetails}>
                <Text style={styles.hostName}>John Doe</Text>
                <Text style={styles.hostJoined}>Joined in 2023</Text>
                <View style={styles.hostRating}>
                  <Star size={14} color={Colors.amber} fill={Colors.amber} />
                  <Text style={styles.hostRatingText}>4.9 (47 reviews)</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Booking Bar */}
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

      {/* Full Screen Media Modal */}
      <Modal
        visible={showFullScreenMedia}
        transparent={true}
        animationType="fade"
        onRequestClose={closeFullScreenMedia}
        onShow={() => {
          // Ensure the FlatList scrolls to the correct position when modal opens
          setTimeout(() => {
            if (fullScreenFlatListRef.current && fullScreenIndex < apartment.media.length) {
              fullScreenFlatListRef.current.scrollToIndex({
                index: fullScreenIndex,
                animated: false,
              });
            }
          }, 100);
        }}
      >
        <View style={styles.fullScreenModal}>
          <StatusBar hidden />
          
          {/* Header */}
          <View style={styles.fullScreenHeader}>
            <TouchableOpacity 
              style={styles.fullScreenCloseButton}
              onPress={closeFullScreenMedia}
            >
              <X size={24} color={Colors.white} />
            </TouchableOpacity>
            <Text style={styles.fullScreenCounter}>
              {fullScreenIndex + 1} / {apartment.media.length}
            </Text>
          </View>

          {/* Media Content */}
          <FlatList
            data={apartment.media}
            renderItem={renderFullScreenMedia}
            keyExtractor={(item, index) => `fullscreen-${index}`}
            ref={fullScreenFlatListRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={fullScreenIndex}
            getItemLayout={(data, index) => ({
              length: screenWidth,
              offset: screenWidth * index,
              index,
            })}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
              if (index >= 0 && index < apartment.media.length) {
                setFullScreenIndex(index);
              }
            }}
            onScrollToIndexFailed={(info) => {
              // Handle scroll to index failure with better error recovery
              console.log('Scroll to index failed:', info);
              const wait = new Promise(resolve => setTimeout(resolve, 500));
              wait.then(() => {
                if (fullScreenFlatListRef.current && info.index < apartment.media.length) {
                  fullScreenFlatListRef.current.scrollToOffset({
                    offset: info.index * screenWidth,
                    animated: false,
                  });
                }
              });
            }}
            removeClippedSubviews={false}
            maxToRenderPerBatch={3}
            windowSize={3}
            initialNumToRender={3}
          />

          {/* Navigation Arrows */}
          {apartment.media.length > 1 && (
            <>
              {fullScreenIndex > 0 && (
                <TouchableOpacity 
                  style={[styles.fullScreenNavButton, styles.fullScreenPrevButton]}
                  onPress={goToPrevious}
                >
                  <ChevronLeft size={32} color={Colors.white} />
                </TouchableOpacity>
              )}
              
              {fullScreenIndex < apartment.media.length - 1 && (
                <TouchableOpacity 
                  style={[styles.fullScreenNavButton, styles.fullScreenNextButton]}
                  onPress={goToNext}
                >
                  <ChevronRight size={32} color={Colors.white} />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </Modal>

      {/* All Photos Grid Modal */}
      <Modal
        visible={showAllPhotos}
        animationType="slide"
        onRequestClose={closeAllPhotos}
      >
        <SafeAreaView style={styles.allPhotosModal}>
          {/* Header */}
          <View style={styles.allPhotosHeader}>
            <TouchableOpacity 
              style={styles.allPhotosCloseButton}
              onPress={closeAllPhotos}
            >
              <X size={24} color={Colors.black} />
            </TouchableOpacity>
            <Text style={styles.allPhotosTitle}>
              All Photos ({apartment.media.length})
            </Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Grid */}
          <FlatList
            data={apartment.media}
            renderItem={renderGridItem}
            keyExtractor={(item, index) => `grid-${index}`}
            numColumns={2}
            contentContainerStyle={styles.gridContainer}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

// Mock data matching the apartment steps structure
const mockApartmentData = {
  apartmentType: "Apartment",
  space: "Whole Space",
  rooms: {
    beds: "2",
    rooms: "3",
    privateBathIn: "1",
    privateBathOut: "0",
    sharedBath: "1",
  },
  location: {
    complexType: "yes",
    complexName: "Pearl Towers Kuje",
    address: "123 Main Street",
    state: "Abuja",
    city: "Kuje",
    zip: "900108",
    country: "Nigeria",
  },
  details: {
    title: "Beautiful 3-Bedroom Apartment in Pearl Towers",
    description: "Experience luxury living in this stunning 3-bedroom apartment located in the prestigious Pearl Towers complex. The space features modern amenities, beautiful views, and is perfect for families or groups looking for a comfortable stay in Abuja.",
  },
  amenities: {
    selected: ["WIFI", "TV", "Air Conditioning", "Kitchen", "Washer", "Private Parking", "Security", "Generator"],
    other: "Solar panels, Pet-friendly area, Balcony with city view",
  },
  pricing: {
    perNight: "25000",
    perWeek: "150000",
  },
  media: [
    {
      resource_type: "image",
      localUri: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      width: 2340,
      height: 1560,
    },
    {
      resource_type: "image", 
      localUri: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      width: 2340,
      height: 1560,
    },
    {
      resource_type: "image", 
      localUri: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      width: 1000,
      height: 1500,
    },
    {
      resource_type: "video",
      localUri: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
      localThumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2341&q=80",
      width: 1280,
      height: 720,
    },
    {
      resource_type: "image", 
      localUri: "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      width: 1000,
      height: 1333,
    },
  ],
  houseRules: ["No smoking inside the apartment. Quiet hours from 10 PM to 7 AM. Please keep the space clean and tidy."],
  maxGuests: "6",
  isAvailable: true,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  content: {
    flex: 1,
  },
  mediaSection: {
    position: 'relative',
  },
  mediaContainer: {
    width: screenWidth,
    height: 250,
  },
  portraitMediaContainer: {
    height: 300, // Slightly taller for portrait images
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  portraitImage: {
    width: '100%',
    height: '100%',
  },
  landscapeImage: {
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  videoContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -24 }],
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoLabel: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  videoLabelText: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: 'Sora-Medium',
  },
  zoomIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 6,
    borderRadius: 8,
  },
  mediaIndicator: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mediaIndicatorText: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: 'Sora-Medium',
  },
  viewAllButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  viewAllText: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: 'Sora-Medium',
  },
  // Full Screen Modal Styles
  fullScreenModal: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  fullScreenHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  fullScreenCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenCounter: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Sora-Medium',
  },
  fullScreenContainer: {
    width: screenWidth,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: screenWidth,
    height: '100%',
  },
  fullScreenVideoContainer: {
    width: screenWidth,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenPlayButton: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenNavButton: {
    position: 'absolute',
    top: '50%',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateY: -25 }],
  },
  fullScreenPrevButton: {
    left: 20,
  },
  fullScreenNextButton: {
    right: 20,
  },
  // All Photos Grid Modal Styles
  allPhotosModal: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  allPhotosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  allPhotosCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  allPhotosTitle: {
    fontSize: 18,
    fontFamily: 'Sora-SemiBold',
    color: Colors.black,
  },
  gridContainer: {
    padding: 16,
  },
  gridItem: {
    width: (screenWidth - 48) / 2,
    height: 150,
    marginHorizontal: 8,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridVideoIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 4,
    borderRadius: 6,
  },
  infoSection: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Sora-Bold',
    color: Colors.black,
    flex: 1,
    marginRight: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  typeText: {
    fontSize: 12,
    fontFamily: 'Sora-Medium',
    color: Colors.primary,
  },
  spaceType: {
    fontSize: 16,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
    flex: 1,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Sora-Medium',
    color: Colors.black,
  },
  roomSection: {
    marginBottom: 20,
  },
  roomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  roomText: {
    fontSize: 12,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
  },
  pricingSection: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  priceText: {
    fontSize: 28,
    fontFamily: 'Sora-Bold',
    color: Colors.primary,
  },
  priceUnit: {
    fontSize: 16,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
  },
  weeklyPrice: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Sora-SemiBold',
    color: Colors.black,
    marginBottom: 12,
  },
  descriptionSection: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Sora-Regular',
    color: Colors.gray700,
    lineHeight: 24,
  },
  amenitiesSection: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
    marginBottom: 8,
  },
  amenityText: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray700,
  },
  otherAmenities: {
    marginTop: 16,
    padding: 16,
    backgroundColor: Colors.gray50,
    borderRadius: 12,
  },
  otherAmenitiesTitle: {
    fontSize: 14,
    fontFamily: 'Sora-Medium',
    color: Colors.black,
    marginBottom: 4,
  },
  otherAmenitiesText: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
  },
  rulesSection: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  rulesText: {
    fontSize: 16,
    fontFamily: 'Sora-Regular',
    color: Colors.gray700,
    lineHeight: 24,
  },
  hostSection: {
    marginBottom: 24,
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  hostAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hostInitial: {
    fontSize: 20,
    fontFamily: 'Sora-Bold',
    color: Colors.white,
  },
  hostDetails: {
    flex: 1,
  },
  hostName: {
    fontSize: 18,
    fontFamily: 'Sora-SemiBold',
    color: Colors.black,
    marginBottom: 4,
  },
  hostJoined: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
    marginBottom: 4,
  },
  hostRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hostRatingText: {
    fontSize: 12,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontFamily: 'Sora-Bold',
    color: Colors.primary,
  },
  bottomPriceUnit: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
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
    fontFamily: 'Sora-SemiBold',
    color: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Sora-SemiBold',
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
    fontFamily: 'Sora-SemiBold',
    color: Colors.white,
  },
});

export default ApartmentDetailsScreen;