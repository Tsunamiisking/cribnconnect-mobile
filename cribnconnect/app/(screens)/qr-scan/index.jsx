import { getMyEvents } from '@/api/services/eventServices';
import BackHeader from '@/components/BackHeader';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { Calendar, ChevronRight, QrCode, Shield, ShieldCheck, Ticket } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const EventScanScreen = () => {
  const [activeTab, setActiveTab] = useState('my-events');
  const [myEvents, setMyEvents] = useState([]);
  const [scanRequests, setScanRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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
      await Promise.all([loadMyEvents(), loadScanRequests()]);
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

      // Filter for upcoming events only
      const upcomingEvents = response.data?.filter(event => {
        const eventDate = new Date(event.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return eventDate >= today && event.status !== 'cancelled';
      }) || [];

      setMyEvents(upcomingEvents);
    } catch (error) {
      console.error('Error loading my events:', error);
    }
  };

  const loadScanRequests = async () => {
    try {
      // This would be a new API endpoint that returns events where current user is staff
      // For now, we'll leave it empty and implement when backend is ready
      // const response = await getMyStaffEvents();
      setScanRequests([]);
    } catch (error) {
      console.error('Error loading scan requests:', error);
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
          <FlatList
            data={scanRequests}
            keyExtractor={(item) => item._id}
            renderItem={(props) => renderEventCard({ ...props, isHost: false })}
            ListEmptyComponent={
              <EmptyState
                message="No Scan Requests"
                description="You haven't been invited to scan tickets for any events yet. Event hosts can add you as a validator or manager."
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
});

export default EventScanScreen;