import BackHeader from '@/components/BackHeader';
import { Colors } from '@/constants/Colors';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Sample notifications data - replace with your actual data source/API
const SAMPLE_NOTIFICATIONS = [
  {
    id: '1',
    title: 'New Apartment Booking',
    message: 'You have a new booking request for your Downtown Loft',
    time: '2 min ago',
    read: false,
    details: 'A user has submitted a booking request for your Downtown Loft property from October 15-22, 2025. The reservation is for 2 guests. You have 24 hours to review and approve this request before it expires. You can view full details in your host dashboard.',
    type: 'booking'
  },
  {
    id: '2',
    title: 'Event Reminder',
    message: 'Your hosted event "Networking Mixer" starts in 24 hours',
    time: '1 hour ago',
    read: false,
    details: 'This is a reminder that your hosted event "Networking Mixer" is scheduled to begin tomorrow at 7:00 PM at The Grand Hall, 123 Main Street. Currently, 45 guests have RSVP\'d as attending. Please ensure all preparations are complete. Attendees will receive an automatic reminder 3 hours before the event starts.',
    type: 'event'
  },
  {
    id: '3',
    title: 'Property Update Required',
    message: 'Please update your property amenities information',
    time: 'Yesterday',
    read: true,
    details: 'We\'ve updated our amenities categories to provide more detailed information to potential guests. Please review and update your property listings to include information about smart home features, accessibility options, and sustainability practices. Properties with complete amenities information receive 30% more booking requests on average.',
    type: 'update'
  },
  {
    id: '4',
    title: 'Payout Processed',
    message: 'Your payout of $750 has been processed successfully',
    time: '2 days ago',
    read: true,
    details: 'A payout of $750.00 has been successfully processed to your linked bank account for recent bookings. This amount represents earnings from 2 completed stays at your property minus the platform fee (10%). Please allow 2-3 business days for the funds to appear in your account. Your detailed earnings report is available in your financial dashboard.',
    type: 'payout'
  },
  {
    id: '5',
    title: 'Listing Performance',
    message: 'Your apartment listing has received 24 new views this week',
    time: '3 days ago',
    read: true,
    details: 'Your "Modern Downtown Studio" listing has received 24 views in the past 7 days, which is 15% higher than the previous week. Your listing has appeared in search results 120 times, with a click-through rate of 20%. You\'ve received 3 new booking requests during this period. Consider updating your listing photos or offering a special discount to increase your conversion rate further.',
    type: 'analytics'
  }
];

export default function NotificationDetails() {
  const { id } = useLocalSearchParams();
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch the notification details from your API
    // For now, we'll simulate that with our sample data
    const fetchNotification = () => {
      const found = SAMPLE_NOTIFICATIONS.find(n => n.id === id);
      
      // Simulate API delay
      setTimeout(() => {
        setNotification(found || { 
          title: 'Notification not found',
          message: 'The notification you are looking for does not exist.',
          details: '',
          time: '',
          actions: []
        });
        setLoading(false);
      }, 300);
    };

    fetchNotification();
  }, [id]);

  // Mark notification as read when viewed
  useEffect(() => {
    if (notification && !notification.read) {
      // In a real app, you would update the read status in your backend
      console.log(`Marking notification ${id} as read`);
    }
  }, [notification, id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Notification" showUser={false} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Notification" showUser={false} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{notification.title}</Text>
          <Text style={styles.time}>{notification.time}</Text>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.message}>{notification.message}</Text>
          <Text style={styles.details}>{notification.details}</Text>
        </View>
        
        <View style={styles.typeContainer}>
          <View style={[styles.typeBadge, styles[`${notification.type}Badge`]]}>
            <Text style={styles.typeText}>{notification.type}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  },
  scrollContent: {
    padding: 16,
    flexGrow: 1,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Sora-Bold',
    fontSize: 24,
    color: Colors.black,
    marginBottom: 8,
  },
  time: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: Colors.gray500,
  },
  content: {
    marginBottom: 32,
  },
  message: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 18,
    color: Colors.primary,
    marginBottom: 16,
  },
  details: {
    fontFamily: 'Sora-Regular',
    fontSize: 16,
    color: Colors.gray700,
    lineHeight: 24,
  },
  typeContainer: {
    marginTop: 24,
    alignItems: 'flex-start',
  },
  typeBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
  },
  typeText: {
    fontFamily: 'Sora-Medium',
    fontSize: 12,
    color: Colors.gray700,
    textTransform: 'capitalize',
  },
  bookingBadge: {
    backgroundColor: '#DCFCE7',
  },
  eventBadge: {
    backgroundColor: '#DBEAFE',
  },
  updateBadge: {
    backgroundColor: '#FEF3C7',
  },
  payoutBadge: {
    backgroundColor: '#D1FAE5',
  },
  analyticsBadge: {
    backgroundColor: '#EDE9FE',
  },
});