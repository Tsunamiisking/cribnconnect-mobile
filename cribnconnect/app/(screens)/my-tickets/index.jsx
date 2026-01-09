import { getMyTickets } from '@/api/services/ticketServices';
import BackHeader from '@/components/BackHeader';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { AlertCircle, Calendar, CheckCircle, Clock, MapPin, Ticket, XCircle } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all'); // all, PAID, HOLD, EXPIRED

  useEffect(() => {
    fetchTickets();
  }, [selectedStatus]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = selectedStatus === 'all' ? {} : { status: selectedStatus };
      const response = await getMyTickets(params);
      
      // Console log for debugging
    //   console.log('📋 Tickets Data:', JSON.stringify(response, null, 2));
    //   console.log('📊 Total Tickets:', response.tickets?.length || 0);
      
      setTickets(response.tickets || []);
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

  const getStatusConfig = (status) => {
    switch (status) {
      case 'PAID':
        return {
          label: 'Confirmed',
          color: Colors.success,
          bgColor: Colors.green50,
          icon: CheckCircle,
        };
      case 'HOLD':
        return {
          label: 'Pending Payment',
          color: Colors.warning,
          bgColor: Colors.amber50,
          icon: Clock,
        };
      case 'EXPIRED':
        return {
          label: 'Expired',
          color: Colors.error,
          bgColor: Colors.red50,
          icon: AlertCircle,
        };
      case 'CANCELLED':
        return {
          label: 'Cancelled',
          color: Colors.gray600,
          bgColor: Colors.gray100,
          icon: XCircle,
        };
      default:
        return {
          label: status,
          color: Colors.gray600,
          bgColor: Colors.gray100,
          icon: AlertCircle,
        };
    }
  };

  const StatusFilterButton = ({ status, label }) => {
    const isSelected = selectedStatus === status;
    return (
      <TouchableOpacity
        style={[
          styles.filterButton,
          isSelected && styles.filterButtonActive,
        ]}
        onPress={() => setSelectedStatus(status)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.filterButtonText,
            isSelected && styles.filterButtonTextActive,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const TicketCard = ({ ticket }) => {
    const statusConfig = getStatusConfig(ticket.status);
    const StatusIcon = statusConfig.icon;

    return (
      <TouchableOpacity
        style={styles.ticketCard}
        onPress={() => router.push(`/(screens)/my-tickets/${ticket._id}`)}
        activeOpacity={0.7}
      >
        {/* Event Image */}
        <Image
          source={{
            uri:
              ticket.event?.media?.[0]?.url ||
              ticket.event?.media?.[0]?.thumbnail_url ||
              'https://via.placeholder.com/400x200',
          }}
          style={styles.ticketImage}
          resizeMode="cover"
        />

        {/* Status Badge */}
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusConfig.bgColor },
          ]}
        >
          <StatusIcon size={14} color={statusConfig.color} />
          <Text style={[styles.statusBadgeText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </View>

        {/* Ticket Content */}
        <View style={styles.ticketContent}>
          {/* Event Title */}
          <Text style={styles.eventTitle} numberOfLines={2}>
            {ticket.event?.title || 'Event Title'}
          </Text>

          {/* Event Details */}
          <View style={styles.eventMeta}>
            <View style={styles.metaRow}>
              <Calendar size={14} color={Colors.gray600} />
              <Text style={styles.metaText}>
                {ticket.event?.date
                  ? new Date(ticket.event.date).toLocaleDateString('en-US', {
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
                {ticket.event?.location?.city ||
                  ticket.event?.location?.venue ||
                  'Location TBD'}
              </Text>
            </View>
          </View>

          {/* Ticket Info */}
          <View style={styles.ticketInfo}>
            <View style={styles.ticketInfoItem}>
              <Ticket size={16} color={Colors.primary} />
              <Text style={styles.ticketInfoText}>
                {ticket.quantity} × {ticket.ticketType}
              </Text>
            </View>
            <Text style={styles.ticketPrice}>
              ₦{ticket.totalAmount?.toLocaleString()}
            </Text>
          </View>

          {/* Access Code for PAID tickets */}
          {ticket.status === 'PAID' && ticket.accessCode && (
            <View style={styles.accessCodeContainer}>
              <Text style={styles.accessCodeLabel}>Access Code:</Text>
              <Text style={styles.accessCode}>{ticket.accessCode}</Text>
            </View>
          )}

          {/* Expiry Timer for HOLD status */}
          {ticket.status === 'HOLD' && ticket.expiresAt && (
            <View style={styles.expiryContainer}>
              <Clock size={14} color={Colors.warning} />
              <Text style={styles.expiryText}>
                Expires in{' '}
                {Math.max(
                  0,
                  Math.floor(
                    (new Date(ticket.expiresAt) - new Date()) / 60000
                  )
                )}{' '}
                minutes
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ticket size={64} color={Colors.gray400} />
      <Text style={styles.emptyStateTitle}>No Tickets Yet</Text>
      <Text style={styles.emptyStateText}>
        {selectedStatus === 'all'
          ? "You haven't purchased any tickets yet. Browse events to get started!"
          : `You don't have any ${selectedStatus.toLowerCase()} tickets.`}
      </Text>
      {selectedStatus !== 'all' && (
        <TouchableOpacity
          style={styles.emptyStateButton}
          onPress={() => setSelectedStatus('all')}
        >
          <Text style={styles.emptyStateButtonText}>View All Tickets</Text>
        </TouchableOpacity>
      )}
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

      {/* Status Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        <StatusFilterButton status="all" label="All" />
        <StatusFilterButton status="PAID" label="Confirmed" />
        <StatusFilterButton status="HOLD" label="Pending" />
        <StatusFilterButton status="EXPIRED" label="Expired" />
      </ScrollView>

      {/* Tickets List */}
      <FlatList
        data={tickets}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <TicketCard ticket={item} />}
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
  filterContainer: {
    maxHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  filterButtonText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 14,
    color: Colors.gray700,
  },
  filterButtonTextActive: {
    color: Colors.white,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  ticketCard: {
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
  ticketImage: {
    width: '100%',
    height: 160,
    backgroundColor: Colors.gray200,
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusBadgeText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 12,
  },
  ticketContent: {
    padding: 16,
  },
  eventTitle: {
    fontFamily: 'Sora-Bold',
    fontSize: 18,
    color: Colors.gray900,
    marginBottom: 8,
  },
  eventMeta: {
    gap: 6,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontFamily: 'Sora-Regular',
    fontSize: 13,
    color: Colors.gray600,
    flex: 1,
  },
  ticketInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  ticketInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ticketInfoText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 14,
    color: Colors.gray900,
  },
  ticketPrice: {
    fontFamily: 'Sora-Bold',
    fontSize: 18,
    color: Colors.primary,
  },
  accessCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: 12,
    backgroundColor: Colors.green50,
    borderRadius: 8,
  },
  accessCodeLabel: {
    fontFamily: 'Sora-Regular',
    fontSize: 13,
    color: Colors.gray700,
  },
  accessCode: {
    fontFamily: 'Sora-Bold',
    fontSize: 16,
    color: Colors.primary,
    letterSpacing: 2,
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    padding: 10,
    backgroundColor: Colors.amber50,
    borderRadius: 8,
  },
  expiryText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 13,
    color: Colors.warning,
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
  },
  emptyStateButton: {
    marginTop: 20,
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