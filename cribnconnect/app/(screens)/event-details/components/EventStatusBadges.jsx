import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const EventStatusBadges = ({ event }) => {
  // Helper function to get status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return Colors.success;
      case 'pending':
        return Colors.warning || '#F59E0B';
      case 'rejected':
        return Colors.error;
      default:
        return Colors.gray500;
    }
  };

  return (
    <View style={styles.statusBadgeContainer}>
      {/* Active/Inactive Badge */}
      <View
        style={[
          styles.statusBadge,
          {
            backgroundColor: event.isActive ? Colors.success : Colors.error,
          },
        ]}
      >
        <View style={[styles.statusDot, { backgroundColor: Colors.white }]} />
        <Text style={styles.statusText}>
          {event.isActive ? 'Active' : 'Inactive'}
        </Text>
      </View>

      {/* Moderation Status Badge */}
      {event.status && (
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: getStatusColor(event.status),
            },
          ]}
        >
          <View style={[styles.statusDot, { backgroundColor: Colors.white }]} />
          <Text style={styles.statusText}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  statusBadgeContainer: {
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 12,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginVertical: 5,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Sora-Medium',
    color: Colors.white,
  },
});

export default EventStatusBadges;
