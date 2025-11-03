import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { isUserOnline, getStatusText } from '@/utils/activeStatusUtils';

/**
 * ActiveStatusIndicator Component
 * Shows visual indicator and text for user's active status
 * 
 * @param {Date|string} lastSeen - User's last seen timestamp
 * @param {boolean} isOnline - Optional: explicit online status
 * @param {boolean} showText - Whether to show status text (default: true)
 * @param {boolean} showDot - Whether to show status dot (default: true)
 * @param {string} dotSize - Size of the dot: 'small' | 'medium' | 'large' (default: 'medium')
 */
export const ActiveStatusIndicator = ({ 
  lastSeen, 
  isOnline = null,
  showText = true,
  showDot = true,
  dotSize = 'medium',
  style 
}) => {
  // Determine if user is online
  const userIsOnline = isOnline !== null ? isOnline : isUserOnline(lastSeen);
  const statusText = getStatusText(lastSeen, userIsOnline);

  const dotSizes = {
    small: 6,
    medium: 8,
    large: 10,
  };

  const dotDimension = dotSizes[dotSize] || dotSizes.medium;

  return (
    <View style={[styles.container, style]}>
      {showDot && (
        <View 
          style={[
            styles.dot, 
            { width: dotDimension, height: dotDimension, borderRadius: dotDimension / 2 },
            userIsOnline ? styles.dotOnline : styles.dotOffline
          ]} 
        />
      )}
      {showText && (
        <Text style={[styles.text, userIsOnline && styles.textOnline]}>
          {statusText}
        </Text>
      )}
    </View>
  );
};

/**
 * ActiveStatusDot Component
 * Simple dot indicator (good for avatars)
 * 
 * @param {boolean} isOnline - Whether user is online
 * @param {string} size - 'small' | 'medium' | 'large'
 * @param {object} style - Custom styles
 */
export const ActiveStatusDot = ({ isOnline, size = 'medium', style }) => {
  const dotSizes = {
    small: 8,
    medium: 12,
    large: 16,
  };

  const dimension = dotSizes[size] || dotSizes.medium;

  return (
    <View 
      style={[
        styles.statusDot,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
        },
        isOnline ? styles.dotOnline : styles.dotOffline,
        style
      ]} 
    />
  );
};

/**
 * GroupActiveCount Component
 * Shows count of active members in a group
 * 
 * @param {number} count - Number of active members
 * @param {number} total - Total members (optional)
 */
export const GroupActiveCount = ({ count, total, style }) => {
  return (
    <View style={[styles.groupCountContainer, style]}>
      <View style={styles.dotOnline} />
      <Text style={styles.groupCountText}>
        {count} {count === 1 ? 'member' : 'members'} active
        {total ? ` of ${total}` : ''}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotOnline: {
    backgroundColor: Colors.success || '#10B981',
  },
  dotOffline: {
    backgroundColor: Colors.gray400 || '#9CA3AF',
  },
  text: {
    fontSize: 12,
    color: Colors.gray500 || '#6B7280',
    fontFamily: 'Sora-Regular',
  },
  textOnline: {
    color: Colors.success || '#10B981',
    fontFamily: 'Sora-Medium',
  },
  statusDot: {
    borderWidth: 2,
    borderColor: Colors.white || '#FFFFFF',
  },
  groupCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.gray50 || '#F9FAFB',
    borderRadius: 12,
  },
  groupCountText: {
    fontSize: 12,
    color: Colors.gray700 || '#374151',
    fontFamily: 'Sora-Medium',
  },
});
