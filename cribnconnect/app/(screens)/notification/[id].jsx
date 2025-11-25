import BackHeader from '@/components/BackHeader';
import { Colors } from '@/constants/Colors';
import { useLocalSearchParams, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Clipboard, ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { markAsRead, approveJoinRequest, rejectJoinRequest } from '@/api/services/notificationServices';
import { CheckCircle, XCircle, Copy, ExternalLink } from 'lucide-react-native';

export default function NotificationDetails() {
  const { id, notification: notificationParam } = useLocalSearchParams();
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const loadNotification = async () => {
      try {
        // Parse notification from params if provided
        if (notificationParam) {
          const parsed = JSON.parse(notificationParam);
          setNotification(parsed);
          
          // Mark as read if not already
          if (!parsed.isRead) {
            await markAsRead(parsed._id);
          }
        }
      } catch (error) {
        console.error('Error loading notification:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotification();
  }, [id, notificationParam]);

  const handleApproveRequest = async () => {
    if (!notification?.linkupId || !notification?.requestId) {
      Alert.alert('Error', 'Invalid notification data');
      return;
    }

    try {
      setActionLoading(true);
      const response = await approveJoinRequest(
        notification.linkupId,
        notification.requestId
      );
      
      Alert.alert(
        'Request Approved',
        `Join code ${response.joinCode} has been sent to ${notification.requesterData?.userName}`,
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to approve request'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectRequest = async () => {
    if (!notification?.linkupId || !notification?.requestId) {
      Alert.alert('Error', 'Invalid notification data');
      return;
    }

    Alert.alert(
      'Reject Request',
      `Are you sure you want to reject ${notification.requesterData?.userName}'s request?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              setActionLoading(true);
              await rejectJoinRequest(
                notification.linkupId,
                notification.requestId
              );
              
              Alert.alert(
                'Request Rejected',
                'The join request has been rejected',
                [
                  {
                    text: 'OK',
                    onPress: () => router.back()
                  }
                ]
              );
            } catch (error) {
              Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to reject request'
              );
            } finally {
              setActionLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleCopyCode = () => {
    if (notification?.joinCode) {
      Clipboard.setString(notification.joinCode);
      Alert.alert('Copied', 'Join code copied to clipboard');
    }
  };

  const handleViewLinkup = () => {
    if (notification?.linkupId) {
      router.push(`/(screens)/linkup-details/${notification.linkupId}`);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Notification" showUser={false} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!notification) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Notification" showUser={false} />
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Notification not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderJoinRequestActions = () => (
    <View style={styles.actionsContainer}>
      {notification.requesterData?.message && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageLabel}>Message from user:</Text>
          <Text style={styles.messageText}>{notification.requesterData.message}</Text>
        </View>
      )}
      
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.approveButton]}
          onPress={handleApproveRequest}
          disabled={actionLoading}
        >
          {actionLoading ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <>
              <CheckCircle size={20} color={Colors.white} />
              <Text style={styles.actionButtonText}>Approve Request</Text>
            </>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.rejectButton]}
          onPress={handleRejectRequest}
          disabled={actionLoading}
        >
          <XCircle size={20} color={Colors.white} />
          <Text style={styles.actionButtonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderJoinCode = () => (
    <View style={styles.codeContainer}>
      <Text style={styles.codeLabel}>Your Join Code</Text>
      <View style={styles.codeBox}>
        <Text style={styles.codeText}>{notification.joinCode}</Text>
        <TouchableOpacity onPress={handleCopyCode} style={styles.copyButton}>
          <Copy size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      <Text style={styles.codeInfo}>
        This code is valid for 24 hours. Tap to copy and use it to join the linkup.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Notification" showUser={false} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{notification.title}</Text>
          <Text style={styles.time}>
            {new Date(notification.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.message}>{notification.message}</Text>
          
          {notification.type === 'join_request' && renderJoinRequestActions()}
          {notification.type === 'join_approved' && renderJoinCode()}
          
          {notification.linkupId && (
            <TouchableOpacity 
              style={styles.viewLinkupButton}
              onPress={handleViewLinkup}
            >
              <ExternalLink size={18} color={Colors.primary} />
              <Text style={styles.viewLinkupText}>View Linkup Details</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.typeContainer}>
          <View style={[styles.typeBadge, styles[`${notification.type}Badge`]]}>
            <Text style={styles.typeText}>{notification.type?.replace('_', ' ')}</Text>
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
  errorText: {
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
    fontFamily: 'Sora-Regular',
    fontSize: 16,
    color: Colors.gray700,
    lineHeight: 24,
    marginBottom: 16,
  },
  actionsContainer: {
    marginTop: 20,
    gap: 16,
  },
  messageContainer: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  messageLabel: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 14,
    color: Colors.gray700,
    marginBottom: 8,
  },
  messageText: {
    fontFamily: 'Sora-Regular',
    fontSize: 15,
    lineHeight: 22,
    color: Colors.black,
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  approveButton: {
    backgroundColor: '#10B981',
  },
  rejectButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    color: Colors.white,
  },
  codeContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  codeLabel: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    color: Colors.gray700,
    marginBottom: 12,
  },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    gap: 12,
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    letterSpacing: 4,
  },
  copyButton: {
    padding: 8,
  },
  codeInfo: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: Colors.gray500,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  viewLinkupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
    marginTop: 20,
  },
  viewLinkupText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    color: Colors.primary,
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
    color: Colors.white,
    textTransform: 'capitalize',
  },
  join_requestBadge: {
    backgroundColor: '#F59E0B',
  },
  join_approvedBadge: {
    backgroundColor: '#10B981',
  },
  user_joinedBadge: {
    backgroundColor: '#3B82F6',
  },
  infoBadge: {
    backgroundColor: '#3B82F6',
  },
  warningBadge: {
    backgroundColor: '#F59E0B',
  },
  successBadge: {
    backgroundColor: '#10B981',
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