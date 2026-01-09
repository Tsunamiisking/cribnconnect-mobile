import { approveJoinRequest, markAsRead, rejectJoinRequest } from '@/api/services/notificationServices';
import BackHeader from '@/components/BackHeader';
import { Colors } from '@/constants/Colors';
import Clipboard from '@react-native-clipboard/clipboard';
import { router, useLocalSearchParams } from 'expo-router';
import { CheckCircle, Copy, ExternalLink, XCircle } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    const code = notification?.joinCode || notification?.metadata?.joinCode;
    if (code) {
      Clipboard.setString(code);
      Alert.alert('Copied!', 'Join code copied to clipboard');
    } else {
      Alert.alert('Error', 'No join code available to copy');
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
          style={[styles.actionButton, styles.approveButton, actionLoading && styles.buttonDisabled]}
          onPress={handleApproveRequest}
          disabled={actionLoading}
          activeOpacity={0.7}
        >
          {actionLoading ? (
            <>
              <ActivityIndicator size="small" color={Colors.white} />
              <Text style={styles.approveButtonText}>Approving...</Text>
            </>
          ) : (
            <>
              <CheckCircle size={20} color={Colors.white} />
              <Text style={styles.approveButtonText}>Approve Request</Text>
            </>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.rejectButton, actionLoading && styles.buttonDisabled]}
          onPress={handleRejectRequest}
          disabled={actionLoading}
          activeOpacity={0.7}
        >
          {actionLoading ? (
            <ActivityIndicator size="small" color="#ef4444" />
          ) : (
            <>
              <XCircle size={20} color="#ef4444" />
              <Text style={styles.rejectButtonText}>Reject</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderJoinCode = () => (
    <View style={styles.codeContainer}>
      <View style={styles.codeHeader}>
        <Text style={styles.codeLabel}>Your Join Code</Text>
        <View style={styles.validityBadge}>
          <Text style={styles.validityText}>Valid 24hrs</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.codeBox}
        onPress={handleCopyCode}
        activeOpacity={0.7}
      >
        <View style={styles.codeContent}>
          <Text style={styles.codeText}>{notification.joinCode || notification.metadata?.joinCode || 'N/A'}</Text>
          <View style={styles.copyIconContainer}>
            <Copy size={20} color={Colors.primary} />
          </View>
        </View>
      </TouchableOpacity>
      
      <Text style={styles.codeInfo}>
        Tap the code box to copy. Share this code with the approved user to let them join the linkup.
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
    fontFamily: 'Urbanist-Bold',
    fontSize: 24,
    color: Colors.gray900,
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
    backgroundColor: Colors.gray50,
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
    color: Colors.gray900,
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
  buttonDisabled: {
    opacity: 0.6,
  },
  approveButton: {
    backgroundColor: Colors.primary,
  },
  approveButtonText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    color: Colors.white,
  },
  rejectButton: {
    backgroundColor: Colors.red50,
    borderWidth: 1,
    borderColor: Colors.red100,
  },
  rejectButtonText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    color: Colors.error,
  },
  codeContainer: {
    marginTop: 20,
    backgroundColor: Colors.gray50,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  codeLabel: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 18,
    color: Colors.gray900,
  },
  validityBadge: {
    backgroundColor: Colors.green50,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  validityText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 12,
    color: Colors.green600,
  },
  codeBox: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    padding: 20,
    marginBottom: 12,
  },
  codeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  codeText: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 36,
    color: Colors.primary,
    letterSpacing: 8,
  },
  copyIconContainer: {
    padding: 8,
    backgroundColor: Colors.gray100,
    borderRadius: 8,
  },
  codeInfo: {
    fontFamily: 'Sora-Regular',
    fontSize: 13,
    color: Colors.gray600,
    textAlign: 'center',
    lineHeight: 18,
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
    backgroundColor: Colors.gray200,
  },
  typeText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 12,
    color: Colors.white,
    textTransform: 'capitalize',
  },
  join_requestBadge: {
    backgroundColor: Colors.primary,
  },
  join_approvedBadge: {
    backgroundColor: Colors.success,
  },
  request_approved_confirmationBadge: {
    backgroundColor: Colors.success,
  },
  user_joinedBadge: {
    backgroundColor: Colors.primary,
  },
  request_rejectedBadge: {
    backgroundColor: Colors.error,
  },
  infoBadge: {
    backgroundColor: Colors.blue500,
  },
  warningBadge: {
    backgroundColor: Colors.warning,
  },
  successBadge: {
    backgroundColor: Colors.success,
  },
  bookingBadge: {
    backgroundColor: Colors.green50,
  },
  eventBadge: {
    backgroundColor: Colors.blue50,
  },
  updateBadge: {
    backgroundColor: Colors.amber50,
  },
  payoutBadge: {
    backgroundColor: Colors.green100,
  },
  analyticsBadge: {
    backgroundColor: Colors.purple50,
  },
});