import { Colors } from '@/constants/Colors';
import { getUnreadCount } from '@/api/services/notificationServices';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * NotificationBadge - Shows unread notification count
 * @param {boolean} show - Whether to show the badge
 * @param {number} count - Custom count (optional, will fetch if not provided)
 * @param {string} size - Badge size: 'small', 'medium', 'large'
 */
export default function NotificationBadge({ 
  show = true, 
  count = null,
  size = 'medium',
  style 
}) {
  const [unreadCount, setUnreadCount] = useState(count);
  const [loading, setLoading] = useState(count === null);

  useEffect(() => {
    // If count is provided as prop, use it
    if (count !== null) {
      setUnreadCount(count);
      setLoading(false);
      return;
    }

    // Otherwise fetch from API
    if (show) {
      fetchUnreadCount();
    }
  }, [show, count]);

  const fetchUnreadCount = async () => {
    try {
      setLoading(true);
      const response = await getUnreadCount();
      setUnreadCount(response.count || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Don't show badge if no unread notifications or loading
  if (!show || loading || !unreadCount || unreadCount === 0) {
    return null;
  }

  // Size configurations
  const sizeConfig = {
    small: {
      badgeSize: 16,
      fontSize: 10,
    },
    medium: {
      badgeSize: 20,
      fontSize: 12,
    },
    large: {
      badgeSize: 24,
      fontSize: 14,
    },
  };

  const config = sizeConfig[size] || sizeConfig.medium;

  return (
    <View 
      style={[
        styles.badge,
        {
          width: config.badgeSize,
          height: config.badgeSize,
          borderRadius: config.badgeSize / 2,
        },
        style
      ]}
    >
      <Text 
        style={[
          styles.badgeText,
          { fontSize: config.fontSize }
        ]}
        numberOfLines={1}
      >
        {unreadCount > 99 ? '99+' : unreadCount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  badgeText: {
    color: Colors.white,
    fontFamily: 'Sora-Bold',
    textAlign: 'center',
  },
});
