import { getEventById } from '@/api/services/eventServices';
import { Colors } from '@/constants/Colors';
import { router, useLocalSearchParams } from 'expo-router';
import { getAuth } from 'firebase/auth';
import {
  ArrowLeft,
  Calendar,
  Camera,
  Car,
  Coffee,
  Gift,
  Heart,
  MapPin,
  Music,
  Share2,
  Sparkles,
  Star,
  Ticket,
  Users,
  Utensils,
  Wifi,
  Wine,
  Zap
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MediaCarousel from '../apartment-details/components/MediaCarousel';
import EventHostManagement from './components/EventHostManagement';

const { width: screenWidth } = Dimensions.get('window');

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
  "live_music": Music,
  "photography": Camera,
  "live_dj": Zap,
  "games": Star,
  "catering": Utensils,
  "bar_service": Wine,
  "coffee_station": Coffee,
  "welcome_drinks": Gift,
  "vip_access": Star,
  "meet_greet": Users,
  "exclusive_content": Sparkles,
  "networking": Users,
  "wifi": Wifi,
  "parking": Car,
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
        setIsHost(currentUserId === eventData.hostId);
        
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
      "live_music": "Live Music",
      "photography": "Professional Photography", 
      "live_dj": "Live DJ",
      "games": "Games & Activities",
      "catering": "Catering Service",
      "bar_service": "Bar Service",
      "coffee_station": "Coffee Station",
      "welcome_drinks": "Welcome Drinks",
      "vip_access": "VIP Access",
      "meet_greet": "Meet & Greet",
      "exclusive_content": "Exclusive Content",
      "networking": "Networking Session",
      "wifi": "Free WiFi",
      "parking": "Parking Available",
      "accessibility": "Wheelchair Accessible",
      "coat_check": "Coat Check",
    };

    return (
      <View key={perkId} style={styles.perkItem}>
        {IconComponent && <IconComponent size={24} color={Colors.primary} />}
        <Text style={styles.perkText}>{perkNames[perkId] || perkId}</Text>
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
          <View style={styles.mediaSection}>
            <ShimmerView style={styles.mediaContainer} />
          </View>

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
          {isHost && (
            <EventHostManagement
              event={event}
              isHost={isHost}
              onEventUpdate={handleEventUpdate}
              onEventDelete={handleEventDelete}
            />
          )}
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
                  {event.attendees || 0} attending
                </Text>
                <Text style={styles.detailSubtext}>
                  {event.capacity} capacity • {event.capacity - (event.attendees || 0)} spots left
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
          {event.specialPerks && event.specialPerks.length > 0 && (
            <View style={styles.perksSection}>
              <Text style={styles.sectionTitle}>Special Perks</Text>
              <View style={styles.perksGrid}>
                {event.specialPerks.map(renderPerk)}
              </View>
            </View>
          )}

          {/* Safety Tips / House Rules */}
          {event.safetyTips && event.safetyTips.length > 0 && (
            <View style={styles.rulesSection}>
              <Text style={styles.sectionTitle}>House Rules</Text>
              <Text style={styles.rulesText}>{event.safetyTips[0]}</Text>
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

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPricing}>
          <Text style={styles.bottomPrice}>
            {event.isFree ? "Free Event" : `From ${formatPrice(minPrice.toString())}`}
          </Text>
          <Text style={styles.bottomAttendance}>
            {event.attendees || 0} attending
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
    </SafeAreaView>
  );
};

// Mock data matching the event steps structure
const mockEventData = {
  category: "Entertainment & Nightlife",
  eventType: "House Party",
  title: "Summer Rooftop Celebration",
  description: "Join us for an amazing sunset rooftop party with great music, drinks, and city views. This will be an unforgettable night with DJs, photo booths, and networking opportunities. Experience the best of nightlife with stunning panoramic views and premium entertainment.",
  date: "2025-12-15T00:00:00.000Z",
  time: "7:00 PM",
  endTime: "11:00 PM",
  location: {
    street: "123 Manhattan Avenue",
    city: "Lagos",
    state: "Lagos",
    zip: "100001",
    country: "Nigeria",
    venue: "Sky Lounge Lagos"
  },
  capacity: 150,
  attendees: 87,
  isFree: false,
  ticketTypes: [
    { id: 'regular', name: 'Regular', price: '15000' },
    { id: 'vip', name: 'VIP', price: '25000' },
    { id: 'vvip', name: 'VVIP', price: '40000' }
  ],
  specialPerks: ["live_music", "photography", "bar_service", "vip_access", "wifi", "parking"],
  safetyTips: ["Please arrive on time. Dress code: Smart casual. Valid ID required for entry. No outside food or drinks allowed."],
  ticketPolicies: {
    refundable: true,
    transferable: false,
    upgradable: true,
    termsAccepted: true
  },
  images: [
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  ],
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
});

export default EventDetailsScreen;
