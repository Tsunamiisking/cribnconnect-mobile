import { getEventById } from '@/api/services/eventServices';
import { Colors } from '@/constants/Colors';
import { router, useLocalSearchParams } from 'expo-router';
import { getAuth } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MediaCarousel from '../apartment-details/components/MediaCarousel';
import EventAdditionalSections from './components/EventAdditionalSections';
import EventBottomBar from './components/EventBottomBar';
import EventDetailsContent from './components/EventDetailsContent';
import EventHeader from './components/EventHeader';
import EventLoadingSkeleton from './components/EventLoadingSkeleton';
import EventPerksSection from './components/EventPerksSection';
import EventStatusBadges from './components/EventStatusBadges';
import { eventCategoryIcons, formatDate, formatPrice } from './utils/eventHelpers';

// Event category icons mapping
const eventCategoryIcons = {
  "Concerts & Live Music": Music,
  "Club Night / Rave": Zap,
  "House Party": Users,
  "Karaoke Night": Music,
  "Comedy Show": Star,
  "Open Mic": Music,
  "Tech Conference": Users,
  "Networking Event": Users,
  "Workshops & Training": Star,
  "Startup Pitch Event": Star,
  "Career Fair": Users,
  "Art Exhibition": Star,
  "Poetry Slams": Star,
  "Cultural Festival": Star,
  "Photography Show": Camera,
  "Football Match / Viewing Party": Users,
  "Marathons & Runs": Star,
  "Fitness Bootcamp": Star,
  "Yoga / Wellness Sessions": Star,
  "Esports Tournament": Zap,
  "Food & Drink": Utensils,
  "Wine / Cocktail Tasting": Wine,
  "Cooking Classes": Utensils,
  "Pop-up Restaurants": Utensils,
  "Wedding": Heart,
  "Birthday": Gift,
  "Anniversary": Heart,
  "Fashion show": Star,
  "Charity Gala": Star,
  "Book Club": Star,
  "Gaming Meetup": Zap,
  "Dance Classes": Music,
  "Language Exchange": Users,
  "Travel and Adventure trips": Star,
};

// Event perks icons mapping
const eventPerksIcons = {
  // Entertainment
  "live_music": Music,
  "live_dj": Zap,
  "mc_host": Mic,
  "photo_booth": Camera,
  "games": Gamepad,
  "performances": Star,
  
  // Food & Drink
  "catering": Utensils,
  "open_bar": Wine,
  "snacks_pastries": Cookie,
  "welcome_drinks": Gift,
  "bottle_service": Beer,
  
  // Experience
  "vip_access": Crown,
  "afterparty": Moon,
  "meet_greet": Users,
  "exclusive_content": Sparkles,
  "networking": Share,
  
  // Comfort & Convenience
  "wifi": Wifi,
  "parking": Car,
  "shuttle": Bus,
  "ac": Wind,
  "first_aid": HeartIcon,
  "rest_areas": Sofa,
  
  // Security & Logistics
  "security_team": Shield,
  "id_check": Badge,
  "bag_check": Lock,
  "crowd_control": Users,
  
  // Legacy/Deprecated (for backwards compatibility)
  "photography": Camera,
  "bar_service": Wine,
  "coffee_station": Coffee,
  "accessibility": Star,
  "coat_check": Gift,
};

const EventDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAttending, setIsAttending] = useState(false);
  const [isHost, setIsHost] = useState(false);
  
  // Perks modal state
  const [showEditPerksModal, setShowEditPerksModal] = useState(false);
  const [selectedPerks, setSelectedPerks] = useState([]);
  const [initialPerks, setInitialPerks] = useState([]);
  
  // Shimmer animation
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  // Fetch event data from API
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Start shimmer animation
        const shimmerLoop = Animated.loop(
          Animated.sequence([
            Animated.timing(shimmerAnimation, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: false,
            }),
            Animated.timing(shimmerAnimation, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: false,
            }),
          ])
        );
        shimmerLoop.start();

        const eventData = await getEventById(id);
        
        // Check if current user is the host
        const auth = getAuth();
        const currentUserId = auth?.currentUser?.uid;
        
        // Handle host field - it can be:
        // 1. A populated user object with uid field (most common)
        // 2. An object with $oid (MongoDB ObjectId)
        // 3. A plain string ID
        let hostId;
        if (typeof eventData.host === 'object') {
          if (eventData.host?.uid) {
            // Populated user object with Firebase UID
            hostId = eventData.host.uid;
          } else if (eventData.host?.$oid) {
            // MongoDB ObjectId format
            hostId = eventData.host.$oid;
          } else if (eventData.host?._id) {
            // Fallback to _id field
            hostId = eventData.host._id;
          }
        } else {
          // Plain string ID
          hostId = eventData.host;
        }
        
        // console.log('=== HOST DETECTION DEBUG ===');
        // console.log('Current User ID:', currentUserId);
        // console.log('Event Host (raw):', eventData.host);
        // console.log('Event Host ID (processed):', hostId);
        // console.log('Is Host:', currentUserId === hostId);
        // console.log('===========================');
        
        setIsHost(currentUserId === hostId);
        
        setEvent(eventData);
        setLoading(false);
        shimmerLoop.stop();
      } catch (error) {
        console.error('Error fetching event:', error);
        Alert.alert('Error', 'Failed to load event details. Please try again.');
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleEventUpdate = (updatedEvent) => {
    setEvent(updatedEvent);
  };

  const handleEventDelete = () => {
    console.log('Event deleted, navigating back');
    router.back();
  };

  // Perks categories (same as EventSpecialPerks)
  const perkCategories = {
    Entertainment: [
      { id: "live_music", name: "Live Music", icon: Music },
      { id: "live_dj", name: "Live DJ / Set", icon: Zap },
      { id: "mc_host", name: "MC / Host", icon: Mic },
      { id: "photo_booth", name: "Photo Booth / Content Setup", icon: Camera },
      { id: "games", name: "Games & Fun Activities", icon: Gamepad },
      { id: "performances", name: "Guest Performances", icon: Star },
    ],
    "Food & Drink": [
      { id: "catering", name: "Food Catering", icon: Utensils },
      { id: "open_bar", name: "Open Bar", icon: Wine },
      { id: "snacks_pastries", name: "Snacks & Small Chops", icon: Cookie },
      { id: "welcome_drinks", name: "Welcome Drinks", icon: Gift },
      { id: "bottle_service", name: "VIP / Bottle Service", icon: Beer },
    ],
    Experience: [
      { id: "vip_access", name: "VIP Access", icon: Crown },
      { id: "afterparty", name: "Afterparty Access", icon: Moon },
      { id: "meet_greet", name: "Meet & Greet", icon: Users },
      { id: "exclusive_content", name: "Exclusive Photos / Recap", icon: Sparkles },
      { id: "networking", name: "Networking Sessions", icon: Share },
    ],
    "Comfort & Convenience": [
      { id: "wifi", name: "Free WiFi", icon: Wifi },
      { id: "parking", name: "Parking Available", icon: Car },
      { id: "shuttle", name: "Shuttle/Transport to Venue", icon: Bus },
      { id: "ac", name: "AC / Climate Control", icon: Wind },
      { id: "first_aid", name: "On-site First Aid / Medical", icon: HeartIcon },
      { id: "rest_areas", name: "Rest Area / Lounge Space", icon: Sofa },
    ],
    "Security & Logistics": [
      { id: "security_team", name: "Security Team Present", icon: Shield },
      { id: "id_check", name: "ID / Verification at Gate", icon: Badge },
      { id: "bag_check", name: "Bag Check & Controlled Entry", icon: Lock },
      { id: "crowd_control", name: "Hostess & Crowd Management", icon: Users },
    ],
  };

  const handleOpenPerksModal = () => {
    const currentPerks = event.eventSpecialPerks || event.specialPerks || [];
    setInitialPerks(currentPerks);
    setSelectedPerks(currentPerks);
    setShowEditPerksModal(true);
  };

  const handleTogglePerk = (perkId) => {
    setSelectedPerks((prev) =>
      prev.includes(perkId) ? prev.filter((id) => id !== perkId) : [...prev, perkId]
    );
  };

  const handleSavePerks = async () => {
    try {
      const response = await api.put(`/events/${event._id || event.id}`, {
        eventSpecialPerks: selectedPerks,
      });

      if (response.data) {
        Alert.alert("Success", "Special perks updated successfully");
        setEvent({ ...event, eventSpecialPerks: selectedPerks });
        setShowEditPerksModal(false);
      }
    } catch (error) {
      console.error("Error updating perks:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update special perks"
      );
    }
  };

  // Shimmer component
  const ShimmerView = ({ style, children }) => {
    const shimmerOpacity = shimmerAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.8],
    });

    const shimmerTranslateX = shimmerAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [-100, 100],
    });

    return (
      <View style={[styles.skeleton, style]}>
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              opacity: shimmerOpacity,
              transform: [{ translateX: shimmerTranslateX }],
              backgroundColor: Colors.white,
            },
          ]}
        />
        {children}
      </View>
    );
  };

  const handleShare = () => {
    Alert.alert('Share', 'Share functionality will be implemented here');
  };

  const handleRSVP = () => {
    setIsAttending(!isAttending);
    Alert.alert('RSVP', isAttending ? 'RSVP cancelled' : 'RSVP confirmed!');
  };

  const handleContactOrganizer = () => {
    Alert.alert('Contact', 'Contact organizer functionality will be implemented here');
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatPrice = (price) => {
    if (!price || price === "0") return "Free";
    return `₦${parseInt(price).toLocaleString()}`;
  };

  const renderPerk = (perkId) => {
    const IconComponent = eventPerksIcons[perkId];
    const perkNames = {
      // Entertainment
      "live_music": "Live Music",
      "live_dj": "Live DJ / Set",
      "mc_host": "MC / Host",
      "photo_booth": "Photo Booth / Content Setup",
      "games": "Games & Fun Activities",
      "performances": "Guest Performances",
      
      // Food & Drink
      "catering": "Food Catering",
      "open_bar": "Open Bar",
      "snacks_pastries": "Snacks & Small Chops",
      "welcome_drinks": "Welcome Drinks",
      "bottle_service": "VIP / Bottle Service",
      
      // Experience
      "vip_access": "VIP Access",
      "afterparty": "Afterparty Access",
      "meet_greet": "Meet & Greet",
      "exclusive_content": "Exclusive Photos / Recap",
      "networking": "Networking Sessions",
      
      // Comfort & Convenience
      "wifi": "Free WiFi",
      "parking": "Parking Available",
      "shuttle": "Shuttle/Transport to Venue",
      "ac": "AC / Climate Control",
      "first_aid": "On-site First Aid / Medical",
      "rest_areas": "Rest Area / Lounge Space",
      
      // Security & Logistics
      "security_team": "Security Team Present",
      "id_check": "ID / Verification at Gate",
      "bag_check": "Bag Check & Controlled Entry",
      "crowd_control": "Hostess & Crowd Management",
      
      // Legacy/Deprecated (for backwards compatibility)
      "photography": "Professional Photography",
      "bar_service": "Bar Service",
      "coffee_station": "Coffee Station",
      "accessibility": "Wheelchair Accessible",
      "coat_check": "Coat Check",
    };

    return (
      <View key={perkId} style={styles.perkItem}>
        {IconComponent && <IconComponent size={24} color={Colors.primary} />}
        <Text style={styles.perkText}>{perkNames[perkId] || perkId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header Skeleton */}
        <View style={styles.header}>
          <ShimmerView style={styles.headerButton} />
          <View style={styles.headerActions}>
            <ShimmerView style={styles.headerButton} />
            <ShimmerView style={styles.headerButton} />
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Media Skeleton */}
          <ShimmerView style={styles.mediaContainer} />

          {/* Content Skeleton */}
          <View style={styles.infoSection}>
            {/* Title Skeleton */}
            <View style={styles.titleSection}>
              <View style={styles.titleRow}>
                <ShimmerView style={styles.skeletonTitle} />
                <ShimmerView style={styles.skeletonCategory} />
              </View>
              <ShimmerView style={styles.skeletonSubtitle} />
            </View>

            {/* Event Details Skeleton */}
            <View style={styles.detailsSection}>
              {[1, 2, 3, 4].map((item) => (
                <View key={item} style={styles.detailRow}>
                  <ShimmerView style={styles.skeletonIcon} />
                  <View style={styles.detailContent}>
                    <ShimmerView style={styles.skeletonDetailLabel} />
                    <ShimmerView style={styles.skeletonDetailValue} />
                  </View>
                </View>
              ))}
            </View>

            {/* Description Skeleton */}
            <View style={styles.descriptionSection}>
              <ShimmerView style={styles.skeletonSectionTitle} />
              <ShimmerView style={styles.skeletonDescriptionLine} />
              <ShimmerView style={styles.skeletonDescriptionLine} />
              <ShimmerView style={styles.skeletonDescriptionLineShort} />
            </View>

            {/* Tickets Skeleton */}
            <View style={styles.ticketsSection}>
              <ShimmerView style={styles.skeletonSectionTitle} />
              {[1, 2].map((item) => (
                <ShimmerView key={item} style={styles.skeletonTicket} />
              ))}
            </View>

            {/* Perks Skeleton */}
            <View style={styles.perksSection}>
              <ShimmerView style={styles.skeletonSectionTitle} />
              <View style={styles.perksGrid}>
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <ShimmerView key={item} style={styles.skeletonPerk} />
                ))}
              </View>
            </View>

            {/* Organizer Skeleton */}
            <View style={styles.organizerSection}>
              <ShimmerView style={styles.skeletonSectionTitle} />
              <View style={styles.organizerInfo}>
                <ShimmerView style={styles.skeletonOrganizerAvatar} />
                <View style={styles.organizerDetails}>
                  <ShimmerView style={styles.skeletonOrganizerName} />
                  <ShimmerView style={styles.skeletonOrganizerContact} />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Bar Skeleton */}
        <View style={styles.bottomBar}>
          <View style={styles.bottomPricing}>
            <ShimmerView style={styles.skeletonBottomPrice} />
          </View>
          <ShimmerView style={styles.skeletonRSVPButton} />
        </View>
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Event not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const EventTypeIcon = eventCategoryIcons[event.eventType];
  const minPrice = event.ticketTypes?.length > 0 
    ? Math.min(...event.ticketTypes.map(t => parseFloat(t.price) || 0).filter(p => p > 0))
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <ArrowLeft size={24} color={Colors.black} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          {isHost ? (
            <EventHostManagement
              event={event}
              isHost={isHost}
              onEventUpdate={handleEventUpdate}
              onEventDelete={handleEventDelete}
            />
          ) : (
            <>
              <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
                <Share2 size={24} color={Colors.black} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setIsLiked(!isLiked)} 
                style={styles.headerButton}
              >
                <Heart 
                  size={24} 
                  color={isLiked ? Colors.primary : Colors.black}
                  fill={isLiked ? Colors.primary : 'transparent'}
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Event Images with Carousel */}
        {event.media && event.media.length > 0 && (
          <MediaCarousel 
            media={event.media.map(item => ({
              url: item.url,
              localUri: item.url,
              localThumbnail: item.thumbnail_url,
              resource_type: item.resource_type || 'image',
              width: item.width,
              height: item.height
            }))} 
          />
        )}

        {/* Status badges for hosts (below media, above title) */}
        {isHost && (
          <View style={styles.statusBadgeContainer}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: event.isActive
                    ? Colors.success
                    : Colors.error,
                },
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: Colors.white },
                ]}
              />
              <Text style={styles.statusText}>
                {event.isActive ? "Active" : "Inactive"}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: event.isPublished
                    ? Colors.success
                    : Colors.gray500,
                },
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: Colors.white },
                ]}
              />
              <Text style={styles.statusText}>
                {event.isPublished ? "Published" : "Unpublished"}
              </Text>
            </View>
          </View>
        )}

        {/* Event Info */}
        <View style={styles.infoSection}>
          {/* Title and Category */}
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{event.title}</Text>
              <View style={styles.categoryContainer}>
                {EventTypeIcon && (
                  <EventTypeIcon size={20} color={Colors.primary} />
                )}
                <Text style={styles.categoryText}>{event.category}</Text>
              </View>
            </View>
            <Text style={styles.eventType}>{event.eventType}</Text>
          </View>

          {/* Event Details */}
          <View style={styles.detailsSection}>
            {/* Date & Time */}
            <View style={styles.detailRow}>
              <Calendar size={20} color={Colors.gray600} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Date & Time</Text>
                <Text style={styles.detailValue}>
                  {formatDate(event.date)}
                </Text>
                <Text style={styles.detailSubtext}>
                  {event.time} - {event.endTime}
                </Text>
              </View>
            </View>

            {/* Location */}
            <View style={styles.detailRow}>
              <MapPin size={20} color={Colors.gray600} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>
                  {event.location.venue}
                </Text>
                <Text style={styles.detailSubtext}>
                  {event.location.street}, {event.location.city}, {event.location.state}
                </Text>
              </View>
            </View>

            {/* Capacity */}
            <View style={styles.detailRow}>
              <Users size={20} color={Colors.gray600} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Attendance</Text>
                <Text style={styles.detailValue}>
                  {Array.isArray(event.attendees) ? event.attendees.length : (event.attendees || 0)} attending
                </Text>
                <Text style={styles.detailSubtext}>
                  {event.capacity} capacity • {event.capacity - (Array.isArray(event.attendees) ? event.attendees.length : (event.attendees || 0))} spots left
                </Text>
              </View>
            </View>

            {/* Price */}
            <View style={styles.detailRow}>
              <Ticket size={20} color={Colors.gray600} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Price</Text>
                <Text style={styles.detailValue}>
                  {event.isFree ? "Free Event" : `From ${formatPrice(minPrice.toString())}`}
                </Text>
              </View>
            </View>
          </View>

          {/* Description */}
          {event.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>About This Event</Text>
              <Text style={styles.description}>{event.description}</Text>
            </View>
          )}

          {/* Ticket Types */}
          {!event.isFree && event.ticketTypes && event.ticketTypes.length > 0 && (
            <View style={styles.ticketsSection}>
              <Text style={styles.sectionTitle}>Ticket Types</Text>
              {event.ticketTypes.map((ticket, index) => (
                <View key={ticket.id || index} style={styles.ticketItem}>
                  <View style={styles.ticketInfo}>
                    <Text style={styles.ticketName}>{ticket.name}</Text>
                    <Text style={styles.ticketPrice}>
                      {formatPrice(ticket.price)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Special Perks */}
          {(event.eventSpecialPerks || event.specialPerks) && (event.eventSpecialPerks || event.specialPerks).length > 0 && (
            <View style={styles.perksSection}>
              <Text style={styles.sectionTitle}>Special Perks</Text>
              <View style={styles.perksGrid}>
                {(event.eventSpecialPerks || event.specialPerks).map(renderPerk)}
                {isHost && (
                  <TouchableOpacity
                    style={styles.perkItem}
                    onPress={handleOpenPerksModal}
                  >
                    <Text style={styles.perkText}>
                      Add/Remove Special Perks
                    </Text>
                    <Edit size={16} color={Colors.black} strokeWidth={2.5} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* Safety Tips / House Rules */}
          {(event.eventSafetyTips || event.safetyTips) && (event.eventSafetyTips || event.safetyTips).length > 0 && (
            <View style={styles.rulesSection}>
              <Text style={styles.sectionTitle}>Safety Guidelines</Text>
              {(event.eventSafetyTips || event.safetyTips).map((tip, index) => (
                <Text key={index} style={styles.rulesText}>• {tip}</Text>
              ))}
            </View>
          )}

          {/* Ticket Policies */}
          {event.ticketPolicies && (
            <View style={styles.policiesSection}>
              <Text style={styles.sectionTitle}>Ticket Policies</Text>
              <View style={styles.policiesList}>
                {event.ticketPolicies.refundable && (
                  <View style={styles.policyItem}>
                    <Text style={styles.policyIcon}>✓</Text>
                    <Text style={styles.policyText}>Refundable tickets</Text>
                  </View>
                )}
                {event.ticketPolicies.upgradable && (
                  <View style={styles.policyItem}>
                    <Text style={styles.policyIcon}>✓</Text>
                    <Text style={styles.policyText}>Upgradable tickets</Text>
                  </View>
                )}
                {event.ticketPolicies.transferable && (
                  <View style={styles.policyItem}>
                    <Text style={styles.policyIcon}>✓</Text>
                    <Text style={styles.policyText}>Transferable tickets</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Organizer Info */}
          <View style={styles.organizerSection}>
            <Text style={styles.sectionTitle}>Event Organizer</Text>
            <TouchableOpacity style={styles.organizerInfo} onPress={handleContactOrganizer}>
              <View style={styles.organizerAvatar}>
                <Text style={styles.organizerInitial}>EO</Text>
              </View>
              <View style={styles.organizerDetails}>
                <Text style={styles.organizerName}>Event Organizer</Text>
                <Text style={styles.organizerContact}>Tap to contact</Text>
                <View style={styles.organizerRating}>
                  <Star size={14} color={Colors.amber} fill={Colors.amber} />
                  <Text style={styles.organizerRatingText}>4.8 (32 reviews)</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar - Only visible to guests */}
      {!isHost && (
        <View style={styles.bottomBar}>
          <View style={styles.bottomPricing}>
            <Text style={styles.bottomPrice}>
              {event.isFree ? "Free Event" : `From ${formatPrice(minPrice.toString())}`}
            </Text>
            <Text style={styles.bottomAttendance}>
              {Array.isArray(event.attendees) ? event.attendees.length : (event.attendees || 0)} attending
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.rsvpButton, isAttending && styles.attendingButton]} 
            onPress={handleRSVP}
          >
            <Text style={styles.rsvpButtonText}>
              {isAttending ? 'Attending ✓' : 'RSVP Now'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Edit Perks Modal */}
      <Modal
        visible={showEditPerksModal}
        animationType="slide"
        onRequestClose={() => setShowEditPerksModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowEditPerksModal(false)}
              style={styles.closeButton}
            >
              <X size={24} color={Colors.gray700} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Special Perks</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.modalSubtitle}>
              Select perks that will be available at your event
            </Text>

            {Object.entries(perkCategories).map(([categoryName, perks]) => (
              <View key={categoryName} style={styles.perkCategory}>
                <Text style={styles.perkCategoryTitle}>{categoryName}</Text>
                <View style={styles.perksGridModal}>
                  {perks.map((perk) => {
                    const isSelected = selectedPerks.includes(perk.id);
                    const IconComponent = perk.icon;

                    return (
                      <TouchableOpacity
                        key={perk.id}
                        onPress={() => handleTogglePerk(perk.id)}
                        style={[
                          styles.perkCardModal,
                          isSelected && styles.perkCardModalSelected,
                        ]}
                      >
                        <View style={styles.perkCardContent}>
                          {IconComponent && (
                            <IconComponent
                              size={24}
                              color={isSelected ? Colors.white : Colors.gray600}
                            />
                          )}
                          <Text
                            style={[
                              styles.perkCardTextModal,
                              isSelected && styles.perkCardTextModalSelected,
                            ]}
                          >
                            {perk.name}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}

            {/* Selected Perks Summary */}
            {selectedPerks.length > 0 && (
              <View style={styles.selectedPerksInfo}>
                <Sparkles size={18} color={Colors.primary} />
                <Text style={styles.selectedPerksText}>
                  {selectedPerks.length} perk{selectedPerks.length !== 1 ? 's' : ''} selected
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Footer: Save / Cancel */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonSecondary]}
              onPress={() => {
                setSelectedPerks(initialPerks);
                setShowEditPerksModal(false);
              }}
            >
              <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonPrimary]}
              onPress={handleSavePerks}
            >
              <Text style={styles.modalButtonTextPrimary}>Save</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
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
  infoSection: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 24,
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
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Sora-Medium',
    color: Colors.primary,
  },
  eventType: {
    fontSize: 16,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
  },
  detailsSection: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Sora-Medium',
    color: Colors.gray600,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'Sora-SemiBold',
    color: Colors.black,
    marginBottom: 2,
  },
  detailSubtext: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray500,
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
  ticketsSection: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  ticketItem: {
    backgroundColor: Colors.gray50,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  ticketInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketName: {
    fontSize: 16,
    fontFamily: 'Sora-SemiBold',
    color: Colors.black,
  },
  ticketPrice: {
    fontSize: 16,
    fontFamily: 'Sora-Bold',
    color: Colors.primary,
  },
  perksSection: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  perksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  perkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
    marginBottom: 8,
  },
  perkText: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray700,
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
  policiesSection: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  policiesList: {
    gap: 8,
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  policyIcon: {
    fontSize: 16,
    color: Colors.primary,
    fontFamily: 'Sora-Bold',
  },
  policyText: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray700,
  },
  organizerSection: {
    marginBottom: 24,
  },
  organizerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
    padding: 16,
    borderRadius: 12,
    gap: 16,
  },
  organizerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  organizerInitial: {
    fontSize: 20,
    fontFamily: 'Sora-Bold',
    color: Colors.white,
  },
  organizerDetails: {
    flex: 1,
  },
  organizerName: {
    fontSize: 18,
    fontFamily: 'Sora-SemiBold',
    color: Colors.black,
    marginBottom: 4,
  },
  organizerContact: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
    marginBottom: 4,
  },
  organizerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  organizerRatingText: {
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
  bottomAttendance: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
    marginTop: 2,
  },
  rsvpButton: {
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
  attendingButton: {
    backgroundColor: Colors.emerald,
  },
  rsvpButtonText: {
    fontSize: 16,
    fontFamily: 'Sora-SemiBold',
    color: Colors.white,
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
  // Skeleton Styles
  skeleton: {
    backgroundColor: Colors.gray200,
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  mediaContainer: {
    width: screenWidth,
    height: 300,
    backgroundColor: Colors.gray200,
  },
  skeletonTitle: {
    height: 28,
    flex: 1,
    marginRight: 16,
    borderRadius: 6,
  },
  skeletonCategory: {
    height: 32,
    width: 100,
    borderRadius: 8,
  },
  skeletonSubtitle: {
    height: 20,
    width: '60%',
    borderRadius: 4,
  },
  skeletonIcon: {
    height: 20,
    width: 20,
    borderRadius: 10,
  },
  skeletonDetailLabel: {
    height: 16,
    width: 80,
    borderRadius: 4,
    marginBottom: 6,
  },
  skeletonDetailValue: {
    height: 18,
    width: '100%',
    borderRadius: 4,
    marginBottom: 4,
  },
  skeletonSectionTitle: {
    height: 20,
    width: 150,
    borderRadius: 4,
    marginBottom: 12,
  },
  skeletonDescriptionLine: {
    height: 16,
    width: '100%',
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonDescriptionLineShort: {
    height: 16,
    width: '70%',
    borderRadius: 4,
  },
  skeletonTicket: {
    height: 60,
    width: '100%',
    borderRadius: 12,
    marginBottom: 12,
  },
  skeletonPerk: {
    height: 40,
    width: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  skeletonOrganizerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  skeletonOrganizerName: {
    height: 20,
    width: 120,
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonOrganizerContact: {
    height: 16,
    width: 100,
    borderRadius: 4,
  },
  skeletonBottomPrice: {
    height: 20,
    width: 150,
    borderRadius: 4,
  },
  skeletonRSVPButton: {
    height: 48,
    width: 120,
    borderRadius: 12,
  },
  // Status Badge Styles (for hosts)
  statusBadgeContainer: {
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 12,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  statusBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginVertical: 5,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Sora-Medium",
    color: Colors.white,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Sora-Bold",
    color: Colors.black,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
    marginBottom: 24,
    lineHeight: 20,
  },
  perkCategory: {
    marginBottom: 24,
  },
  perkCategoryTitle: {
    fontSize: 15,
    fontFamily: "Sora-SemiBold",
    color: Colors.primary,
    marginBottom: 12,
  },
  perksGridModal: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  perkCardModal: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray50,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  perkCardModalSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  perkCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  perkCardTextModal: {
    fontSize: 13,
    fontFamily: "Sora-Medium",
    color: Colors.gray700,
  },
  perkCardTextModalSelected: {
    color: Colors.white,
  },
  selectedPerksInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.blue50,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  selectedPerksText: {
    fontSize: 14,
    fontFamily: "Sora-Medium",
    color: Colors.primary,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonSecondary: {
    backgroundColor: Colors.gray100,
  },
  modalButtonPrimary: {
    backgroundColor: Colors.primary,
  },
  modalButtonTextSecondary: {
    fontSize: 16,
    fontFamily: "Sora-SemiBold",
    color: Colors.gray700,
  },
  modalButtonTextPrimary: {
    fontSize: 16,
    fontFamily: "Sora-SemiBold",
    color: Colors.white,
  },
});

export default EventDetailsScreen;
