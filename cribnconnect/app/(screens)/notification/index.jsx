import { getNotifications, markAllAsRead, markAsRead } from '@/api/services/notificationServices';
import BackHeader from '@/components/BackHeader';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { Bell, CheckCircle, User, Users } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pagination, setPagination] = useState(null);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      if (data) {
        // console.log("Fetched notifications:", JSON.stringify(data));
        // Handle the response structure with notifications array
        if (data.notifications) {
          setNotifications(data.notifications);
          setUnreadCount(data.unreadCount || 0);
          setPagination(data.pagination || null);
        } else {
          // Fallback if response is just an array
          setNotifications(Array.isArray(data) ? data : []);
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'join_request':
        return <User size={20} color={Colors.primary} />;
      case 'join_approved':
      case 'request_approved_confirmation':
        return <CheckCircle size={20} color="#10b981" />;
      case 'user_joined':
        return <Users size={20} color={Colors.primary} />;
      case 'request_rejected':
        return <User size={20} color="#ef4444" />;
      default:
        return <Bell size={20} color={Colors.gray600} />;
    }
  };

  const handleNotificationPress = async (notification) => {
    // Mark as read if unread
    if (!notification.isRead) {
      try {
        await markAsRead(notification._id);
        // Update local state
        setNotifications(prevNotifications =>
          prevNotifications.map(n =>
            n._id === notification._id ? { ...n, isRead: true } : n
          )
        );
        // Decrement unread count
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }

    // Navigate to notification details
    router.push({
      pathname: `/(screens)/notification/${notification._id}`,
      params: { notification: JSON.stringify(notification) }
    });
  };

  const handleMarkAllAsRead = async () => {
    const currentUnreadCount = notifications.filter(n => !n.isRead).length;
    
    if (currentUnreadCount === 0) {
      Alert.alert('No Unread Notifications', 'All notifications are already read.');
      return;
    }

    Alert.alert(
      'Mark All as Read',
      `Are you sure you want to mark all ${currentUnreadCount} unread notification${currentUnreadCount > 1 ? 's' : ''} as read?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Mark All Read',
          onPress: async () => {
            try {
              setMarkingAllRead(true);
              await markAllAsRead();
              // Update local state
              setNotifications(prevNotifications =>
                prevNotifications.map(n => ({ ...n, isRead: true }))
              );
              setUnreadCount(0);
              Alert.alert('Success', 'All notifications marked as read.');
            } catch (error) {
              console.error('Error marking all as read:', error);
              Alert.alert('Error', 'Failed to mark all notifications as read.');
            } finally {
              setMarkingAllRead(false);
            }
          },
        },
      ]
    );
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !item.isRead && styles.unreadNotification
      ]}
      onPress={() => handleNotificationPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {getNotificationIcon(item.type)}
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.notificationTime}>
          {new Date(item.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
      </View>
      {!item.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Notifications" showUser={false} />
      
      {loading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : notifications.length > 0 ? (
        <>
          <FlatList
            data={notifications}
            keyExtractor={(item) => item._id}
            renderItem={renderNotification}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
          {/* Mark All as Read Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.markAllButton,
                markingAllRead && styles.markAllButtonDisabled
              ]}
              onPress={handleMarkAllAsRead}
              disabled={markingAllRead}
              activeOpacity={0.7}
            >
              {markingAllRead ? (
                <>
                  <ActivityIndicator size="small" color={Colors.white} />
                  <Text style={styles.markAllButtonText}>Marking all as read...</Text>
                </>
              ) : (
                <>
                  <CheckCircle size={20} color={Colors.white} />
                  <Text style={styles.markAllButtonText}>Mark All as Read</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Bell size={48} color={Colors.gray400} />
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
    padding: 10,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.white,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    alignItems: 'center',
    position: 'relative',
  },
  unreadNotification: {
    // backgroundColor: '#F0F9FF',
    // borderColor: Colors.primary + '20',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
    marginTop: 12,
  },
  footer: {
    padding: 16,
    paddingBottom: 8,
    backgroundColor: Colors.white,
    // borderTopWidth: 1,
    // borderTopColor: '#E5E7EB',
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  markAllButtonDisabled: {
    opacity: 0.6,
  },
  markAllButtonText: {
    fontSize: 16,
    fontFamily: 'Sora-SemiBold',
    color: Colors.white,
  },
});

export default NotificationScreen;