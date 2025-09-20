import BackHeader from '@/components/BackHeader';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Sample notification data - replace with your actual data source
const SAMPLE_NOTIFICATIONS = [
  {
    id: '1',
    title: 'New Apartment Booking',
    message: 'You have a new booking request for your Downtown Loft',
    time: '2 min ago',
    read: false,
  },
  {
    id: '2',
    title: 'Event Reminder',
    message: 'Your hosted event "Networking Mixer" starts in 24 hours',
    time: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    title: 'Property Update Required',
    message: 'Please update your property amenities information',
    time: 'Yesterday',
    read: true,
  },
  {
    id: '4',
    title: 'Payout Processed',
    message: 'Your payout of $750 has been processed successfully',
    time: '2 days ago',
    read: true,
  },
  {
    id: '5',
    title: 'Listing Performance',
    message: 'Your apartment listing has received 24 new views this week',
    time: '3 days ago',
    read: true,
  },
];

const NotificationScreen = () => {
  const handleNotificationPress = (id) => {
    // Navigate to notification detail screen
    router.push(`/(screens)/notification/${id}`);
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={styles.notificationItem}
      onPress={() => handleNotificationPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Notifications" showUser={false} />
      
      {SAMPLE_NOTIFICATIONS.length > 0 ? (
        <FlatList
          data={SAMPLE_NOTIFICATIONS}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No notifications yet</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  list: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.white,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    position: 'relative',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    marginLeft: 8,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: 'Sora-SemiBold',
    color: Colors.black,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray700,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    fontFamily: 'Sora-Regular',
    color: Colors.gray500,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Sora-Regular',
    color: Colors.gray500,
  },
});

export default NotificationScreen;