import { getMyEvents } from '@/api/services/eventServices';
import { getMyScanRequests, getMyStaffEvents, respondToInvitation } from '@/api/services/ticketServices';
import BackHeader from '@/components/BackHeader';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { Calendar, Check, ChevronRight, Clock, QrCode, Shield, ShieldCheck, Ticket, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const EventScanScreen = () => {
  const [activeTab, setActiveTab] = useState('my-events');
  const [myEvents, setMyEvents] = useState([]);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [acceptedStaffEvents, setAcceptedStaffEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [respondingTo, setRespondingTo] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const userId = auth?.currentUser?.uid;
    setCurrentUserId(userId);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadMyEvents(), loadPendingInvitations(), loadAcceptedStaffEvents()]);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const loadMyEvents = async () => {
    try {
      const response = await getMyEvents({
        sortBy: 'date',
        order: 'desc',
      });

      // Backend can return either 'events' or 'data' array
      const allEvents = response.events || response.data || [];

      // Filter for upcoming events only
      const upcomingEvents = allEvents.filter(event => {
        const eventDate = new Date(event.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return eventDate >= today && event.status !== 'cancelled';
      });

      setMyEvents(upcomingEvents);
    } catch (error) {
      console.error('Error loading my events:', error);
    }
  };

  const loadPendingInvitations = async () => {
    try {
      const response = await getMyScanRequests();
    //   console.log("🔵 Pending scan requests response:", response);
      
      // Backend returns 'requests' array, need to map to expected format
      const invitations = response.requests || [];
      
      // Map backend format to frontend format
      const mappedInvitations = invitations.map(request => ({
        _id: request.eventId,
        title: request.eventTitle,
        date: request.eventDate,
        time: request.eventTime,
        capacity: request.capacity,
        attendees: Array(request.attendeeCount).fill({}), // Create array with attendeeCount length
        status: 'published', // Assume published if it's in requests
        invitationRole: request.invitation?.role || 'validator',
        host: request.host,
        venue: request.location,
      }));
      
    //   console.log("🔵 Mapped invitations:", mappedInvitations);
      
      // Filter for upcoming events only
      const upcomingInvitations = mappedInvitations.filter(event => {
        const eventDate = new Date(event.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return eventDate >= today && event.status !== 'cancelled';
      });

      setPendingInvitations(upcomingInvitations);
    } catch (error) {
      console.error('Error loading pending invitations:', error);
      
      // Check if it's a 520 error (server down/starting up)
      if (error.response?.status === 520) {
        console.log('⚠️ Server is starting up or down. Will retry automatically on refresh.');
      }
      
      // Don't show alert - this is not critical, just set empty array
      setPendingInvitations([]);
    }
  };

  const loadAcceptedStaffEvents = async () => {
    try {
      const response = await getMyStaffEvents({
        sortBy: 'date',
        order: 'asc',
      });

    //   console.log("🔵 Accepted staff events response:", response);

      // Check if response has 'events' array (backend format) or 'data' array (expected format)
      const events = response.events || response.data || [];
      
      // Map backend format to frontend format if needed
      const mappedEvents = events.map(event => {
        // If event already has _id, title, date - it's in correct format
        if (event._id && event.title && event.date) {
          return event;
        }
        
        // Otherwise map from backend format
        return {
          _id: event.eventId || event._id,
          title: event.eventTitle || event.title,
          date: event.eventDate || event.date,
          time: event.eventTime || event.time,
          capacity: event.capacity,
          attendees: event.attendees || Array(event.attendeeCount || 0).fill({}),
          status: event.status || 'published',
          staffRole: event.staffRole || event.role || 'validator',
          host: event.host,
          venue: event.location || event.venue,
        };
      });
      
    //   console.log("🔵 Mapped staff events:", mappedEvents);

      // Filter for upcoming events only
      const upcomingEvents = mappedEvents.filter(event => {
        const eventDate = new Date(event.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return eventDate >= today && event.status !== 'cancelled';
      });

      setAcceptedStaffEvents(upcomingEvents);
    } catch (error) {
      console.error('Error loading accepted staff events:', error);
      
      // Check if it's a 520 error (server down/starting up)
      if (error.response?.status === 520) {
        console.log('⚠️ Server is starting up or down. Will retry automatically on refresh.');
      }
      
      // Don't show alert - this is not critical
      setAcceptedStaffEvents([]);
    }
  };

  const handleInvitationResponse = async (eventId, response) => {
    setRespondingTo(eventId);
    try {
      await respondToInvitation(eventId, response);
      
      // Show success message
      Alert.alert(
        'Success',
        response === 'accept' 
          ? 'Invitation accepted! You can now scan tickets for this event.'
          : 'Invitation declined.'
      );

      // Reload both lists
      await Promise.all([loadPendingInvitations(), loadAcceptedStaffEvents()]);
    } catch (error) {
      console.error('Error responding to invitation:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to respond to invitation. Please try again.'
      );
    } finally {
      setRespondingTo(null);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleEventPress = (event, isHost = true) => {
    router.push({
      pathname: '/(screens)/qr-scan/[id]',
      params: {
        id: event._id,
        eventTitle: event.title,
        isHost: isHost ? 'true' : 'false',
      },
    });
  };

  const renderEventCard = ({ item: event, isHost = true }) => {
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const formattedTime = event.time ? new Date(`2000-01-01T${event.time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }) : '';

    return (
      <TouchableOpacity
        style={styles.eventCard}
        onPress={() => handleEventPress(event, isHost)}
        activeOpacity={0.7}
      >
        <View style={styles.eventIconContainer}>
          <QrCode size={32} color={Colors.primary} />
        </View>

        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle} numberOfLines={2}>
            {event.title}
          </Text>
          
          <View style={styles.eventMetaRow}>
            <Calendar size={14} color={Colors.gray600} />
            <Text style={styles.eventMeta}>
              {formattedDate} {formattedTime && `• ${formattedTime}`}
            </Text>
          </View>

          <View style={styles.eventMetaRow}>
            <Ticket size={14} color={Colors.gray600} />
            <Text style={styles.eventMeta}>
              {event.attendees?.length || 0} / {event.capacity} attendees
            </Text>
          </View>

          {!isHost && event.staffRole && (
            <View style={styles.roleBadgeContainer}>
              {event.staffRole === 'manager' ? (
                <>
                  <ShieldCheck size={14} color={Colors.success} />
                  <Text style={[styles.roleBadgeText, { color: Colors.success }]}>
                    Manager
                  </Text>
                </>
              ) : (
                <>
                  <Shield size={14} color={Colors.primary} />
                  <Text style={[styles.roleBadgeText, { color: Colors.primary }]}>
                    Validator
                  </Text>
                </>
              )}
            </View>
          )}
        </View>

        <ChevronRight size={24} color={Colors.gray400} />
      </TouchableOpacity>
    );
  };

  const renderInvitationCard = ({ item: event }) => {
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const formattedTime = event.time ? new Date(`2000-01-01T${event.time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }) : '';

    const isResponding = respondingTo === event._id;

    return (
      <View style={styles.invitationCard}>
        {/* Header with Role Badge */}
        <View style={styles.invitationTopBadge}>
          {event.invitationRole === 'manager' ? (
            <>
              <ShieldCheck size={16} color={Colors.white} />
              <Text style={styles.topBadgeText}>MANAGER INVITATION</Text>
            </>
          ) : (
            <>
              <Shield size={16} color={Colors.white} />
              <Text style={styles.topBadgeText}>VALIDATOR INVITATION</Text>
            </>
          )}
        </View>

        {/* Event Details */}
        <View style={styles.invitationContent}>
          <View style={styles.invitationIconContainer}>
            <QrCode size={40} color={Colors.primary} />
          </View>

          <View style={styles.invitationMainInfo}>
            <Text style={styles.invitationEventTitle} numberOfLines={2}>
              {event.title}
            </Text>
            
            <View style={styles.invitationMetaContainer}>
              <View style={styles.invitationMetaRow}>
                <View style={styles.metaIconWrapper}>
                  <Calendar size={16} color={Colors.primary} />
                </View>
                <Text style={styles.invitationMetaText}>
                  {formattedDate}
                </Text>
              </View>

              {formattedTime && (
                <View style={styles.invitationMetaRow}>
                  <View style={styles.metaIconWrapper}>
                    <Clock size={16} color={Colors.primary} />
                  </View>
                  <Text style={styles.invitationMetaText}>
                    {formattedTime}
                  </Text>
                </View>
              )}

              <View style={styles.invitationMetaRow}>
                <View style={styles.metaIconWrapper}>
                  <Ticket size={16} color={Colors.primary} />
                </View>
                <Text style={styles.invitationMetaText}>
                  {event.attendees?.length || 0} / {event.capacity}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.invitationActions}>
          <TouchableOpacity
            style={[styles.invitationActionButton, styles.declineButton, isResponding && styles.buttonDisabled]}
            onPress={() => handleInvitationResponse(event._id, 'decline')}
            disabled={isResponding}
          >
            {isResponding ? (
              <ActivityIndicator size="small" color={Colors.error} />
            ) : (
              <>
                <X size={20} color={Colors.error} strokeWidth={2.5} />
                <Text style={styles.declineButtonText}>Decline</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.invitationActionButton, styles.acceptButton, isResponding && styles.buttonDisabled]}
            onPress={() => handleInvitationResponse(event._id, 'accept')}
            disabled={isResponding}
          >
            {isResponding ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <>
                <Check size={20} color={Colors.white} strokeWidth={2.5} />
                <Text style={styles.acceptButtonText}>Accept</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const EmptyState = ({ message, description }) => (
    <View style={styles.emptyState}>
      <QrCode size={64} color={Colors.gray400} />
      <Text style={styles.emptyStateTitle}>{message}</Text>
      <Text style={styles.emptyStateText}>{description}</Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="QR Scanner" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Select Event to Scan" />

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'my-events' && styles.activeTab]}
          onPress={() => setActiveTab('my-events')}
        >
          <Text style={[styles.tabText, activeTab === 'my-events' && styles.activeTabText]}>
            My Events
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'scan-requests' && styles.activeTab]}
          onPress={() => setActiveTab('scan-requests')}
        >
          <Text style={[styles.tabText, activeTab === 'scan-requests' && styles.activeTabText]}>
            Scan Requests
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'my-events' ? (
          <FlatList
            data={myEvents}
            keyExtractor={(item) => item._id}
            renderItem={(props) => renderEventCard({ ...props, isHost: true })}
            ListEmptyComponent={
              <EmptyState
                message="No Upcoming Events"
                description="You don't have any upcoming events to scan tickets for. Create an event to start scanning tickets."
              />
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Colors.primary]}
                tintColor={Colors.primary}
              />
            }
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <ScrollView
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Colors.primary]}
                tintColor={Colors.primary}
              />
            }
          >
            {/* Pending Invitations Section */}
            {pendingInvitations.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Shield size={20} color={Colors.warning} />
                  <Text style={styles.sectionTitle}>
                    Pending Invitations ({pendingInvitations.length})
                  </Text>
                </View>
                {pendingInvitations.map((event) => (
                  <View key={event._id}>
                    {renderInvitationCard({ item: event })}
                  </View>
                ))}
              </View>
            )}

            {/* Accepted Staff Events Section */}
            {acceptedStaffEvents.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <ShieldCheck size={20} color={Colors.success} />
                  <Text style={styles.sectionTitle}>
                    My Staff Events ({acceptedStaffEvents.length})
                  </Text>
                </View>
                {acceptedStaffEvents.map((event) => (
                  <View key={event._id}>
                    {renderEventCard({ item: event, isHost: false })}
                  </View>
                ))}
              </View>
            )}

            {/* Empty State */}
            {pendingInvitations.length === 0 && acceptedStaffEvents.length === 0 && (
              <EmptyState
                message="No Scan Requests"
                description="You haven't been invited to scan tickets for any events yet. Event hosts can add you as a validator or manager."
              />
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Sora-Regular',
    fontSize: 16,
    color: Colors.gray600,
    marginTop: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: Colors.white,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray100,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 14,
    color: Colors.gray600,
  },
  activeTabText: {
    color: Colors.white,
  },
  content: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.gray200,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  eventIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: Colors.blue50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontFamily: 'Sora-Bold',
    fontSize: 16,
    color: Colors.gray900,
    marginBottom: 6,
  },
  eventMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  eventMeta: {
    fontFamily: 'Sora-Regular',
    fontSize: 13,
    color: Colors.gray600,
  },
  roleBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  roleBadgeText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontFamily: 'Sora-Bold',
    fontSize: 20,
    color: Colors.gray900,
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: Colors.gray600,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontFamily: 'Sora-Bold',
    fontSize: 16,
    color: Colors.gray900,
    marginLeft: 8,
  },
  invitationCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  invitationTopBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
  },
  topBadgeText: {
    fontFamily: 'Sora-Bold',
    fontSize: 12,
    color: Colors.white,
    letterSpacing: 1,
  },
  invitationContent: {
    flexDirection: 'row',
    padding: 20,
    gap: 16,
  },
  invitationIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Colors.blue50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  invitationMainInfo: {
    flex: 1,
  },
  invitationEventTitle: {
    fontFamily: 'Sora-Bold',
    fontSize: 18,
    color: Colors.gray900,
    marginBottom: 12,
    lineHeight: 24,
  },
  invitationMetaContainer: {
    gap: 8,
  },
  invitationMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  metaIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.blue50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  invitationMetaText: {
    fontFamily: 'Sora-Medium',
    fontSize: 14,
    color: Colors.gray700,
  },
  invitationActions: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 0,
    gap: 12,
  },
  invitationActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  acceptButton: {
    backgroundColor: Colors.success,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  acceptButtonText: {
    fontFamily: 'Sora-Bold',
    fontSize: 15,
    color: Colors.white,
  },
  declineButton: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.error,
  },
  declineButtonText: {
    fontFamily: 'Sora-Bold',
    fontSize: 15,
    color: Colors.error,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default EventScanScreen;