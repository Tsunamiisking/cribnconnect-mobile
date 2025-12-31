import { registerForEvent, unregisterFromEvent } from '@/api/services/eventServices';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const EventBottomBar = ({
  event,
  isAttending,
  formatPrice,
  onRegistrationUpdate,
}) => {
  const [loading, setLoading] = useState(false);

  const minPrice =
    event.ticketTypes?.length > 0
      ? Math.min(
          ...event.ticketTypes
            .map((t) => parseFloat(t.price) || 0)
            .filter((p) => p > 0)
        )
      : 0;

  const handleGetTickets = () => {
    // Navigate to ticket purchase screen
    router.push(`/(screens)/ticket-purchase/${event._id}`);
  };

  const handleRegister = async () => {
    if (loading) return;

    try {
      setLoading(true);

      if (isAttending) {
        // Unregister
        Alert.alert(
          'Unregister',
          'Are you sure you want to unregister from this event?',
          [
            { text: 'Cancel', style: 'cancel', onPress: () => setLoading(false) },
            {
              text: 'Unregister',
              style: 'destructive',
              onPress: async () => {
                try {
                  await unregisterFromEvent(event._id);
                  onRegistrationUpdate(false);
                  Alert.alert('Success', 'You have been unregistered from this event');
                } catch (error) {
                  const message = error.response?.data?.message || 'Failed to unregister';
                  Alert.alert('Error', message);
                } finally {
                  setLoading(false);
                }
              }
            }
          ]
        );
      } else {
        // Register
        const data = await registerForEvent(event._id);
        
        onRegistrationUpdate(true);
        
        // Show success message with chat option
        Alert.alert(
          'Registration Successful!',
          data.addedToChat 
            ? 'You have been registered and added to the event chat. Would you like to open the chat?'
            : 'You have been successfully registered for this event',
          data.addedToChat ? [
            { text: 'Later', style: 'cancel' },
            { 
              text: 'Open Chat', 
              onPress: () => router.push(`/(screens)/chat/${event._id}?type=event`)
            }
          ] : [{ text: 'OK' }]
        );
        
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error('Registration error:', error);
      
      const errorData = error.response?.data;
      
      // Handle specific error cases
      if (errorData?.requiresPayment) {
        Alert.alert(
          'Paid Event',
          'This is a paid event. Please purchase tickets instead.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Buy Tickets', 
              onPress: () => router.push(`/(screens)/ticket-purchase/${event._id}`)
            }
          ]
        );
      } else if (errorData?.alreadyRegistered) {
        Alert.alert('Already Registered', 'You are already registered for this event');
        onRegistrationUpdate(true);
      } else if (errorData?.isFull) {
        Alert.alert('Event Full', 'This event has reached full capacity');
      } else {
        const message = errorData?.message || 'Failed to register for event';
        Alert.alert('Error', message);
      }
    }
  };

  // Determine which button to show
  const showTicketButton = !event.isFree && event.ticketTypes?.length > 0;

  return (
    <View style={styles.bottomBar}>
      <View style={styles.bottomPricing}>
        <Text style={styles.bottomPrice}>
          {event.isFree ? 'Free Event' : `From ${formatPrice(minPrice.toString())}`}
        </Text>
        <Text style={styles.bottomAttendance}>
          {Array.isArray(event.attendees)
            ? event.attendees.length
            : event.attendees || 0}{' '}
          attending
        </Text>
      </View>
      
      {showTicketButton ? (
        // Paid event - Show "Get Tickets" button
        <TouchableOpacity
          style={styles.ticketButton}
          onPress={handleGetTickets}
          disabled={loading}
        >
          <Text style={styles.ticketButtonText}>Get Tickets</Text>
        </TouchableOpacity>
      ) : (
        // Free event - Show Register/Unregister button
        <TouchableOpacity
          style={[
            styles.rsvpButton, 
            isAttending && styles.attendingButton,
            loading && styles.disabledButton
          ]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Text style={styles.rsvpButtonText}>
              {isAttending ? 'Registered ✓' : 'Register Free'}
            </Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  ticketButton: {
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
  ticketButtonText: {
    fontSize: 16,
    fontFamily: 'Sora-SemiBold',
    color: Colors.white,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default EventBottomBar;
