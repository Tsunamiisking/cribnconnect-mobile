import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const EventStatusBadges = ({ event }) => {
  return (
    <View style={styles.statusBadgeContainer}>
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

      <View
        style={[
          styles.statusBadge,
          {
            backgroundColor: event.isPublished
              ? Colors.success
              : Colors.gray500,
          },
        ]}
      >
        <View style={[styles.statusDot, { backgroundColor: Colors.white }]} />
        <Text style={styles.statusText}>
          {event.isPublished ? 'Published' : 'Unpublished'}
        </Text>
      </View>
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
