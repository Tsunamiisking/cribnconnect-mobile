import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const EventBottomBar = ({
  event,
  isAttending,
  formatPrice,
  onRSVP,
}) => {
  const minPrice =
    event.ticketTypes?.length > 0
      ? Math.min(
          ...event.ticketTypes
            .map((t) => parseFloat(t.price) || 0)
            .filter((p) => p > 0)
        )
      : 0;

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
      <TouchableOpacity
        style={[styles.rsvpButton, isAttending && styles.attendingButton]}
        onPress={onRSVP}
      >
        <Text style={styles.rsvpButtonText}>
          {isAttending ? 'Attending ✓' : 'RSVP Now'}
        </Text>
      </TouchableOpacity>
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
});

export default EventBottomBar;
