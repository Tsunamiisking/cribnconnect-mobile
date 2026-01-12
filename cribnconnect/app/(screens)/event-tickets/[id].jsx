import { getEventTickets } from '@/api/services/ticketServices';
import BackHeader from '@/components/BackHeader';
import { Colors } from '@/constants/Colors';
import { useLocalSearchParams } from 'expo-router';
import { Calendar, CheckCircle, Clock, MapPin, XCircle } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const EventTicketsScreen = () => {
  const { id } = useLocalSearchParams(); // Event ID
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventTickets();
  }, [id]);

  const fetchEventTickets = async () => {
    try {
      setLoading(true);
      const response = await getEventTickets(id);
      // console.log('🎟️ Event Tickets Data:', response);
      setEventData(response);
    } catch (error) {
      console.error('❌ Error fetching event tickets:', error);
      Alert.alert('Error', 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleViewQR = (ticket, index) => {
    Alert.alert(
      `Ticket #${index + 1}`,
      `Code: ${ticket.code}\n\nLong press the QR code to save it to your device`,
      [{ text: 'OK' }]
    );
  };

  const handleShareAllTickets = async () => {
    try {
      const { event, tickets } = eventData;
      const message = `My tickets for ${event.title}\n\nEvent: ${event.title}\nDate: ${new Date(event.date).toLocaleDateString()}\nTotal Tickets: ${tickets.length}\n\nTicket Codes:\n${tickets.map((t, i) => `${i + 1}. ${t.code}`).join('\n')}`;
      
      await Share.share({
        message,
        title: 'Event Tickets'
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Event Tickets" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading tickets...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!eventData || !eventData.event) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Event Tickets" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No tickets found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { event, tickets, totalTickets } = eventData;

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Event Tickets" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Event Header */}
        <View style={styles.eventHeader}>
          {(event.media?.[0]?.url || event.media?.[0]?.thumbnail_url) && (
            <Image
              source={{ uri: event.media[0].url || event.media[0].thumbnail_url }}
              style={styles.eventImage}
              resizeMode="cover"
            />
          )}
          <Text style={styles.eventTitle}>{event.title}</Text>
          <View style={styles.eventMeta}>
            <View style={styles.metaRow}>
              <Calendar size={16} color={Colors.gray600} />
              <Text style={styles.metaText}>
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Clock size={16} color={Colors.gray600} />
              <Text style={styles.metaText}>{event.time || 'TBD'}</Text>
            </View>
            <View style={styles.metaRow}>
              <MapPin size={16} color={Colors.gray600} />
              <Text style={styles.metaText}>
                {event.location?.venue || event.location?.city || 'Location TBD'}
              </Text>
            </View>
          </View>
        </View>

        {/* Tickets Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total Tickets</Text>
          <Text style={styles.summaryValue}>{totalTickets}</Text>
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={handleShareAllTickets}
          >
            <Text style={styles.shareButtonText}>Share All Tickets</Text>
          </TouchableOpacity>
        </View>

        {/* All Tickets with QR Codes */}
        <View style={styles.ticketsSection}>
          <Text style={styles.sectionTitle}>Your Tickets</Text>
          <Text style={styles.sectionSubtitle}>
            Show these QR codes at the event entrance
          </Text>

          {tickets.map((ticket, index) => (
            <View key={ticket.code} style={styles.ticketCard}>
              {/* Ticket Header */}
              <View style={styles.ticketHeader}>
                <View>
                  <Text style={styles.ticketNumber}>Ticket #{ticket.ticketNumber || index + 1}</Text>
                  <Text style={styles.ticketType}>{ticket.ticketType}</Text>
                </View>
                {ticket.used ? (
                  <View style={styles.usedBadge}>
                    <CheckCircle size={16} color={Colors.success} />
                    <Text style={styles.usedText}>Used</Text>
                  </View>
                ) : (
                  <View style={styles.validBadge}>
                    <Text style={styles.validText}>✓ Valid</Text>
                  </View>
                )}
              </View>

              {/* QR Code */}
              <TouchableOpacity 
                activeOpacity={0.9}
                onLongPress={() => handleViewQR(ticket, index)}
              >
                <View style={styles.qrContainer}>
                  <Image
                    source={{ uri: ticket.qrCode }}
                    style={styles.qrImage}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>

              {/* Ticket Code */}
              <Text style={styles.ticketCode}>{ticket.code}</Text>
              <Text style={styles.saveHint}>Long press QR code to save</Text>

              {/* Purchase Info */}
              <View style={styles.purchaseInfo}>
                <Text style={styles.purchaseLabel}>Purchased:</Text>
                <Text style={styles.purchaseDate}>
                  {new Date(ticket.purchaseDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Text>
              </View>

              {/* Used Info */}
              {ticket.used && ticket.usedAt && (
                <View style={styles.usedInfo}>
                  <XCircle size={14} color={Colors.gray500} />
                  <Text style={styles.usedInfoText}>
                    Used on {new Date(ticket.usedAt).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <Text style={styles.helpText}>
            If you have any issues with your tickets, please contact the event organizer or our support team.
          </Text>
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
  eventHeader: {
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
  eventMeta: {
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontFamily: 'Sora-Regular',
    fontSize: 15,
    color: Colors.gray700,
    flex: 1,
  },
  summaryCard: {
    margin: 20,
    padding: 20,
    backgroundColor: Colors.blue50,
    borderRadius: 12,
    alignItems: 'center',
  },
  summaryTitle: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: Colors.gray600,
    marginBottom: 4,
  },
  summaryValue: {
    fontFamily: 'Sora-Bold',
    fontSize: 36,
    color: Colors.primary,
    marginBottom: 16,
  },
  shareButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  shareButtonText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 15,
    color: Colors.white,
  },
  ticketsSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  sectionTitle: {
    fontFamily: 'Sora-Bold',
    fontSize: 20,
    color: Colors.gray900,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: Colors.gray600,
    marginBottom: 20,
  },
  ticketCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.gray200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ticketNumber: {
    fontFamily: 'Sora-Bold',
    fontSize: 16,
    color: Colors.gray900,
  },
  ticketType: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: Colors.gray600,
    marginTop: 2,
  },
  validBadge: {
    backgroundColor: Colors.green50,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  validText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 12,
    color: Colors.success,
  },
  usedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.gray100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  usedText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 12,
    color: Colors.gray600,
  },
  qrContainer: {
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
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    color: Colors.gray900,
    textAlign: 'center',
    marginTop: 12,
    letterSpacing: 1,
  },
  saveHint: {
    fontFamily: 'Sora-Regular',
    fontSize: 12,
    color: Colors.gray500,
    textAlign: 'center',
    marginTop: 4,
  },
  purchaseInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  purchaseLabel: {
    fontFamily: 'Sora-Regular',
    fontSize: 13,
    color: Colors.gray600,
  },
  purchaseDate: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 13,
    color: Colors.gray900,
  },
  usedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    padding: 10,
    backgroundColor: Colors.gray50,
    borderRadius: 8,
  },
  usedInfoText: {
    fontFamily: 'Sora-Regular',
    fontSize: 12,
    color: Colors.gray600,
  },
  helpSection: {
    margin: 20,
    padding: 16,
    backgroundColor: Colors.blue50,
    borderRadius: 12,
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

export default EventTicketsScreen;
