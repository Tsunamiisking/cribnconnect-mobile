import { cancelReservation, getTicketById } from '@/api/services/ticketServices';
import BackHeader from '@/components/BackHeader';
import { Colors } from '@/constants/Colors';
import { router, useLocalSearchParams } from 'expo-router';
import { AlertCircle, CheckCircle, Clock, Share2, X, XCircle } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Linking,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MyTicketDetailScreen = () => {
  const { id } = useLocalSearchParams(); // Ticket ID
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    fetchTicketDetails();
  }, [id]);

  useEffect(() => {
    // Timer for HOLD status
    if (ticket?.status === 'HOLD' && ticket?.expiresAt) {
      const interval = setInterval(() => {
        updateTimeRemaining();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [ticket]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const ticketData = await getTicketById(id);
      setTicket(ticketData);
      updateTimeRemaining(ticketData);
    } catch (error) {
      console.error('Error fetching ticket:', error);
      Alert.alert('Error', 'Failed to load ticket details');
    } finally {
      setLoading(false);
    }
  };

  const updateTimeRemaining = (ticketData = ticket) => {
    if (!ticketData || ticketData.status !== 'HOLD' || !ticketData.expiresAt) {
      setTimeRemaining('');
      return;
    }

    const now = new Date().getTime();
    const expiresAt = new Date(ticketData.expiresAt).getTime();
    const diff = expiresAt - now;

    if (diff <= 0) {
      setTimeRemaining('Expired');
      // Refresh to get updated status
      fetchTicketDetails();
      return;
    }

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
  };

  const handleCancelReservation = async () => {
    Alert.alert(
      'Cancel Reservation',
      'Are you sure you want to cancel this reservation? This action cannot be undone.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              setCancelling(true);
              await cancelReservation(ticket._id);
              Alert.alert('Cancelled', 'Your reservation has been cancelled', [
                { text: 'OK', onPress: () => router.back() }
              ]);
            } catch (error) {
              console.error('Cancel error:', error);
              Alert.alert('Error', 'Failed to cancel reservation');
            } finally {
              setCancelling(false);
            }
          }
        }
      ]
    );
  };

  const handleViewQR = (qrCode, index) => {
    // Simple alert showing the ticket code - users can screenshot
    Alert.alert(
      `Ticket #${index + 1}`,
      'Take a screenshot of this QR code to save it to your device',
      [{ text: 'OK' }]
    );
  };

  const handleShareTicket = async () => {
    try {
      const message = `My ticket for ${ticket.event?.title}\n\nEvent: ${ticket.event?.title}\nDate: ${new Date(ticket.event?.date).toLocaleDateString()}\nTime: ${ticket.event?.time}\nTicket Type: ${ticket.ticketType}\nQuantity: ${ticket.quantity}\n\nAccess Code: ${ticket.accessCode}`;
      
      await Share.share({
        message,
        title: 'Event Ticket'
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'PAID':
        return {
          label: 'Confirmed',
          color: Colors.success,
          bgColor: Colors.green50,
          icon: CheckCircle
        };
      case 'HOLD':
        return {
          label: 'Payment Pending',
          color: Colors.warning,
          bgColor: Colors.amber50,
          icon: Clock
        };
      case 'EXPIRED':
        return {
          label: 'Expired',
          color: Colors.error,
          bgColor: Colors.red50,
          icon: AlertCircle
        };
      case 'CANCELLED':
        return {
          label: 'Cancelled',
          color: Colors.gray600,
          bgColor: Colors.gray100,
          icon: XCircle
        };
      default:
        return {
          label: status,
          color: Colors.gray600,
          bgColor: Colors.gray100,
          icon: AlertCircle
        };
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Ticket Details" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading ticket...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!ticket) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Ticket Details" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Ticket not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const statusConfig = getStatusConfig(ticket.status);
  const StatusIcon = statusConfig.icon;

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Ticket Details" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Banner */}
        <View style={[styles.statusBanner, { backgroundColor: statusConfig.bgColor }]}>
          <StatusIcon size={24} color={statusConfig.color} />
          <View style={styles.statusContent}>
            <Text style={[styles.statusLabel, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
            {ticket.status === 'HOLD' && timeRemaining && (
              <Text style={[styles.statusTimer, { color: statusConfig.color }]}>
                ⏰ Time remaining: {timeRemaining}
              </Text>
            )}
          </View>
        </View>

        {/* Event Information */}
        <View style={styles.section}>
          <Image
            source={{ uri: ticket.event?.media?.[0]?.url || ticket.event?.media?.[0]?.thumbnail_url }}
            style={styles.eventImage}
            resizeMode="cover"
          />
          <Text style={styles.eventTitle}>{ticket.event?.title}</Text>
          <View style={styles.eventDetails}>
            <Text style={styles.eventDetailText}>
              📅 {new Date(ticket.event?.date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </Text>
            <Text style={styles.eventDetailText}>
              🕐 {ticket.event?.time}
            </Text>
            <Text style={styles.eventDetailText}>
              📍 {ticket.event?.location?.venue || ticket.event?.location?.city}
            </Text>
          </View>
        </View>

        {/* Ticket Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ticket Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ticket Type</Text>
              <Text style={styles.infoValue}>{ticket.ticketType}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Quantity</Text>
              <Text style={styles.infoValue}>{ticket.quantity} ticket{ticket.quantity > 1 ? 's' : ''}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Total Paid</Text>
              <Text style={styles.infoValue}>₦{ticket.totalAmount?.toLocaleString()}</Text>
            </View>
            {ticket.accessCode && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Access Code</Text>
                <Text style={[styles.infoValue, styles.accessCode]}>{ticket.accessCode}</Text>
              </View>
            )}
          </View>
        </View>

        {/* QR Codes - Only show for PAID tickets */}
        {ticket.status === 'PAID' && ticket.tickets?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Tickets</Text>
            <Text style={styles.sectionSubtitle}>
              Show these QR codes at the event entrance
            </Text>
            
            {ticket.tickets.map((ticketItem, index) => (
              <View key={index} style={styles.qrCard}>
                <View style={styles.qrCardHeader}>
                  <Text style={styles.qrCardTitle}>Ticket #{index + 1}</Text>
                  <Text style={styles.screenshotHint}>Long press to save</Text>
                </View>
                
                <TouchableOpacity 
                  activeOpacity={0.9}
                  onLongPress={() => handleViewQR(ticketItem.qrCode, index)}
                >
                  <View style={styles.qrImageContainer}>
                    <Image
                      source={{ uri: ticketItem.qrCode }}
                      style={styles.qrImage}
                      resizeMode="contain"
                    />
                  </View>
                </TouchableOpacity>
                
                <Text style={styles.ticketCode}>{ticketItem.code}</Text>
                
                {ticketItem.used && (
                  <View style={styles.usedBadge}>
                    <Text style={styles.usedBadgeText}>✓ Used</Text>
                    {ticketItem.usedAt && (
                      <Text style={styles.usedDate}>
                        {new Date(ticketItem.usedAt).toLocaleString()}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.section}>
          {ticket.status === 'PAID' && (
            <TouchableOpacity style={styles.actionButton} onPress={handleShareTicket}>
              <Share2 size={20} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Share Ticket</Text>
            </TouchableOpacity>
          )}
          
          {ticket.status === 'HOLD' && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.actionButtonPrimary]}
                onPress={() => {
                  // Redirect back to payment
                  if (ticket.payment?.authorizationUrl) {
                    Linking.openURL(ticket.payment.authorizationUrl);
                  }
                }}
              >
                <Text style={styles.actionButtonTextWhite}>Complete Payment</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.actionButtonDanger, cancelling && styles.actionButtonDisabled]}
                onPress={handleCancelReservation}
                disabled={cancelling}
              >
                {cancelling ? (
                  <ActivityIndicator size="small" color={Colors.error} />
                ) : (
                  <>
                    <X size={20} color={Colors.error} />
                    <Text style={[styles.actionButtonText, styles.actionButtonTextDanger]}>
                      Cancel Reservation
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Help Section */}
        <View style={styles.section}>
          <View style={styles.helpCard}>
            <Text style={styles.helpTitle}>Need Help?</Text>
            <Text style={styles.helpText}>
              If you have any issues with your ticket, please contact the event organizer or our support team.
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontFamily: 'Sora-Regular',
    fontSize: 16,
    color: Colors.gray500,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  statusContent: {
    flex: 1,
  },
  statusLabel: {
    fontFamily: 'Sora-Bold',
    fontSize: 18,
  },
  statusTimer: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 14,
    marginTop: 4,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  eventImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  eventTitle: {
    fontFamily: 'Sora-Bold',
    fontSize: 22,
    color: Colors.gray900,
    marginBottom: 12,
  },
  eventDetails: {
    gap: 8,
  },
  eventDetailText: {
    fontFamily: 'Sora-Regular',
    fontSize: 15,
    color: Colors.gray700,
  },
  sectionTitle: {
    fontFamily: 'Sora-Bold',
    fontSize: 18,
    color: Colors.gray900,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: Colors.gray600,
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: Colors.gray50,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontFamily: 'Sora-Regular',
    fontSize: 15,
    color: Colors.gray600,
  },
  infoValue: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 15,
    color: Colors.gray900,
  },
  accessCode: {
    fontFamily: 'Sora-Bold',
    fontSize: 18,
    color: Colors.primary,
    letterSpacing: 2,
  },
  qrCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.gray200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  qrCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  qrCardTitle: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    color: Colors.gray900,
  },
  screenshotHint: {
    fontFamily: 'Sora-Regular',
    fontSize: 12,
    color: Colors.gray500,
  },
  qrImageContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  qrImage: {
    width: 200,
    height: 200,
  },
  ticketCode: {
    fontFamily: 'Sora-Medium',
    fontSize: 14,
    color: Colors.gray700,
    textAlign: 'center',
    marginTop: 12,
    letterSpacing: 1,
  },
  usedBadge: {
    marginTop: 12,
    padding: 12,
    backgroundColor: Colors.green50,
    borderRadius: 8,
    alignItems: 'center',
  },
  usedBadgeText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 14,
    color: Colors.success,
  },
  usedDate: {
    fontFamily: 'Sora-Regular',
    fontSize: 12,
    color: Colors.gray600,
    marginTop: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: 8,
    marginBottom: 12,
  },
  actionButtonPrimary: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  actionButtonDanger: {
    borderColor: Colors.error,
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionButtonText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 15,
    color: Colors.primary,
  },
  actionButtonTextWhite: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 15,
    color: Colors.white,
  },
  actionButtonTextDanger: {
    color: Colors.error,
  },
  helpCard: {
    backgroundColor: Colors.blue50,
    borderRadius: 12,
    padding: 16,
  },
  helpTitle: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    color: Colors.gray900,
    marginBottom: 8,
  },
  helpText: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: Colors.gray700,
    lineHeight: 20,
  },
});

export default MyTicketDetailScreen;