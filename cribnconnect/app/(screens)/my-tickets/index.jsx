import { getTicketsByEvent } from '@/api/services/ticketServices';
import BackHeader from '@/components/BackHeader';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { Calendar, MapPin, Ticket } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MyTickets = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await getTicketsByEvent();
      
      console.log('📋 Events with Tickets:', response);
      console.log('� Total Events:', response.totalEvents || 0);
      console.log('🎟️ Total Tickets:', response.totalTickets || 0);
      
      setEvents(response.events || []);
    } catch (error) {
      console.error('❌ Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTickets();
    setRefreshing(false);
  };

  const EventTicketCard = ({ eventData }) => {
    const { event, totalTickets, totalAmount, currency } = eventData;

    return (
      <TouchableOpacity
        style={styles.eventCard}
        onPress={() => router.push(`/(screens)/event-tickets/${event._id}`)}
        activeOpacity={0.7}
      >
        {/* Event Image */}
        <Image
          source={{
            uri:
              event.media?.[0]?.url ||
              event.media?.[0]?.thumbnail_url ||
              'https://via.placeholder.com/400x200',
          }}
          style={styles.eventImage}
          resizeMode="cover"
        />

        {/* Event Content */}
        <View style={styles.eventContent}>
          {/* Event Title */}
          <Text style={styles.eventTitle} numberOfLines={2}>
            {event.title || 'Event Title'}
          </Text>

          {/* Event Details */}
          <View style={styles.eventMeta}>
            <View style={styles.metaRow}>
              <Calendar size={14} color={Colors.gray600} />
              <Text style={styles.metaText}>
                {event.date
                  ? new Date(event.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'TBD'}
              </Text>
            </View>

            <View style={styles.metaRow}>
              <MapPin size={14} color={Colors.gray600} />
              <Text style={styles.metaText} numberOfLines={1}>
                {event.location?.city ||
                  event.location?.venue ||
                  'Location TBD'}
              </Text>
            </View>
          </View>

          {/* Ticket Count and Amount */}
          <View style={styles.ticketSummary}>
            <View style={styles.ticketCount}>
              <Ticket size={18} color={Colors.primary} />
              <Text style={styles.ticketCountText}>
                {totalTickets} {totalTickets === 1 ? 'Ticket' : 'Tickets'}
              </Text>
            </View>
            <Text style={styles.totalAmount}>
              {currency === 'NGN' ? '₦' : '$'}{totalAmount?.toLocaleString()}
            </Text>
          </View>

          {/* View Tickets Button */}
          <View style={styles.viewButton}>
            <Text style={styles.viewButtonText}>View All Tickets</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ticket size={64} color={Colors.gray400} />
      <Text style={styles.emptyStateTitle}>No Tickets Yet</Text>
      <Text style={styles.emptyStateText}>
        You haven't purchased any tickets yet. Browse events to get started!
      </Text>
      <TouchableOpacity
        style={styles.emptyStateButton}
        onPress={() => router.push('/(tabs)/')}
      >
        <Text style={styles.emptyStateButtonText}>Browse Events</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="My Tickets" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading your tickets...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BackHeader title="My Tickets" />

      {/* Events List */}
      <FlatList
        data={events}
        keyExtractor={(item) => item.event._id}
        renderItem={({ item }) => <EventTicketCard eventData={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<EmptyState />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
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
    color: Colors.gray500,
    marginTop: 12,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  eventCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.gray100,
  },
  eventImage: {
    width: '100%',
    height: 180,
    backgroundColor: Colors.gray200,
  },
  eventContent: {
    padding: 16,
  },
  eventTitle: {
    fontFamily: 'Sora-Bold',
    fontSize: 18,
    color: Colors.gray900,
    marginBottom: 12,
  },
  eventMeta: {
    gap: 8,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: Colors.gray600,
    flex: 1,
  },
  ticketSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
    marginBottom: 12,
  },
  ticketCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ticketCountText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 15,
    color: Colors.gray900,
  },
  totalAmount: {
    fontFamily: 'Sora-Bold',
    fontSize: 20,
    color: Colors.primary,
  },
  viewButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  viewButtonText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 15,
    color: Colors.white,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontFamily: 'Sora-Bold',
    fontSize: 20,
    color: Colors.gray900,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontFamily: 'Sora-Regular',
    fontSize: 15,
    color: Colors.gray600,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  emptyStateButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    borderRadius: 12,
  },
  emptyStateButtonText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 15,
    color: Colors.white,
  },
});

export default MyTickets;