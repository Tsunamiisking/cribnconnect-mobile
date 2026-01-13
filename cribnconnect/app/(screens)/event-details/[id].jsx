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
import EventTicketSection from './components/EventTicketSection';
import { eventCategoryIcons, formatDate, formatPrice } from './utils/eventHelpers';


const EventDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const [isLiked, setIsLiked] = useState(false);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAttending, setIsAttending] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Fetch event data from API
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const eventData = await getEventById(id);
        console.log('Fetched event data:', eventData);
        // Check if current user is the host
        const auth = getAuth();
        const userId = auth?.currentUser?.uid;
        setCurrentUserId(userId);
        
        // Handle host field - it can be:
        // 1. A populated user object with uid field (most common)
        // 2. An object with $oid (MongoDB ObjectId)
        // 3. A plain string ID
        let hostId;
        if (typeof eventData.host === 'object') {
          if (eventData.host?.uid) {
            hostId = eventData.host.uid;
          } else if (eventData.host?.$oid) {
            hostId = eventData.host.$oid;
          } else if (eventData.host?._id) {
            hostId = eventData.host._id;
          }
        } else {
          hostId = eventData.host;
        }
        
        setIsHost(userId === hostId);
        
        // Check if user is registered/attending
        const registered = eventData.attendees?.some(
          attendee => {
            // Handle different attendee structure formats
            const attendeeUserId = attendee.user?.uid || attendee.user?._id || attendee.user;
            return attendeeUserId === userId;
          }
        );
        setIsAttending(registered);
        
        setEvent(eventData);
        setLoading(false);
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

  const handleShare = () => {
    Alert.alert('Share', 'Share functionality will be implemented here');
  };

  const handleRSVP = async () => {
    // This will be handled by EventBottomBar
  };

  const handleRegistrationUpdate = (newStatus) => {
    setIsAttending(newStatus);
  };

  const handleContactOrganizer = () => {
    Alert.alert('Contact', 'Contact organizer functionality will be implemented here');
  };

  if (loading) {
    return <EventLoadingSkeleton />;
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <EventHeader
        isHost={isHost}
        isLiked={isLiked}
        onBack={() => router.back()}
        onShare={handleShare}
        onLikeToggle={() => setIsLiked(!isLiked)}
        event={event}
        onEventUpdate={handleEventUpdate}
        onEventDelete={handleEventDelete}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Event Images with Carousel */}
        {event.media && event.media.length > 0 && (
          <MediaCarousel
            media={event.media.map((item) => ({
              url: item.url,
              localUri: item.url,
              localThumbnail: item.thumbnail_url,
              resource_type: item.resource_type || 'image',
              width: item.width,
              height: item.height,
            }))}
          />
        )}

        {/* Status badges for hosts (below media, above title) */}
        {isHost && <EventStatusBadges event={event} />}

        {/* Event Details Content */}
        <EventDetailsContent
          event={event}
          eventCategoryIcons={eventCategoryIcons}
          formatDate={formatDate}
          formatPrice={formatPrice}
          handleContactOrganizer={handleContactOrganizer}
        />

        {/* Ticket Information Section with Edit Modal */}
        <EventTicketSection
          event={event}
          isHost={isHost}
          onTicketUpdate={handleEventUpdate}
          formatPrice={formatPrice}
        />

        {/* Special Perks Section with Edit Modal */}
        <EventPerksSection
          event={event}
          isHost={isHost}
          onPerksUpdate={handleEventUpdate}
        />

        {/* Safety, Policies, and Organizer Info */}
        <EventAdditionalSections
          event={event}
          handleContactOrganizer={handleContactOrganizer}
        />
      </ScrollView>

      {/* Bottom Action Bar - Only visible to guests */}
      {!isHost && (
        <EventBottomBar
          event={event}
          isAttending={isAttending}
          formatPrice={formatPrice}
          onRegistrationUpdate={handleRegistrationUpdate}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
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
  hostActionsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.gray50,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  scanButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scanButtonText: {
    fontFamily: 'Sora-Bold',
    fontSize: 15,
    color: Colors.white,
  },
  statsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.white,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  statsButtonText: {
    fontFamily: 'Sora-Bold',
    fontSize: 15,
    color: Colors.primary,
  },
});

export default EventDetailsScreen;
