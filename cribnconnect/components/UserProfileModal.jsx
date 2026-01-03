import { Colors } from '@/constants/Colors';
import { MessageCircle, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { checkExistingConversation, initiateChat } from '@/api/services/chatServices';
import InitiateChatModal from './InitiateChatModal';

export default function UserProfileModal({ 
  visible, 
  onClose, 
  userData, 
  loading
}) {
  const router = useRouter();
  const [checkingChat, setCheckingChat] = useState(false);
  const [showInitiateChatModal, setShowInitiateChatModal] = useState(false);

  if (!visible) return null;

  const handleSendMessage = async () => {
    if (!userData?.uid) {
      Alert.alert("Error", "User information not available");
      return;
    }

    try {
      setCheckingChat(true);
      
      // Check if conversation already exists
      const conversation = await checkExistingConversation(userData.uid);
      
      if (conversation) {
        // Conversation exists, handle based on status
        if (conversation.status === "pending") {
          if (conversation.isRecipient) {
            // We received the request, navigate to chat to accept/ignore
            onClose(); // Close modal first
            router.push(`/(screens)/private-chat/${conversation.conversationId}`);
          } else {
            // We sent the request
            const username = userData.username || userData.firstName || 'this user';
            Alert.alert(
              "Request Pending",
              `Your chat request to ${username} is pending. ${conversation.canSendMessages ? "You can send one message." : "Waiting for them to accept."}`,
              [
                { text: "Cancel", style: "cancel" },
                { 
                  text: "View Chat", 
                  onPress: () => {
                    onClose();
                    router.push(`/(screens)/private-chat/${conversation.conversationId}`);
                  }
                }
              ]
            );
          }
        } else if (conversation.status === "accepted") {
          // Active conversation, go to chat
          onClose(); // Close modal first
          router.push(`/(screens)/private-chat/${conversation.conversationId}`);
        } else if (conversation.status === "ignored") {
          Alert.alert(
            "Chat Unavailable",
            "This conversation has been closed."
          );
        }
      } else {
        // No conversation exists, show initiate modal
        setShowInitiateChatModal(true);
      }
    } catch (error) {
      console.error("Error checking conversation:", error);
      Alert.alert("Error", "Failed to check conversation status");
    } finally {
      setCheckingChat(false);
    }
  };

  const handleInitiateChatClose = () => {
    setShowInitiateChatModal(false);
  };

  const handleSendInitialMessage = async (message) => {
    try {
      const response = await initiateChat(userData.uid, message);
      
      const username = userData.username || userData.firstName || 'User';
      
      Alert.alert(
        "Request Sent!",
        `Your message has been sent to ${username}. They'll be notified and can accept your chat request.`,
        [
          {
            text: "OK",
            onPress: () => {
              setShowInitiateChatModal(false);
              onClose(); // Close user modal
              
              // Navigate to the chat
              if (response.conversationId) {
                router.push(`/(screens)/private-chat/${response.conversationId}`);
              }
            }
          }
        ]
      );
    } catch (error) {
      throw error; // Re-throw to be handled by the modal
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity 
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <X size={24} color={Colors.gray600} />
          </TouchableOpacity>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
          ) : userData ? (
            <>
              {/* Profile Photo */}
              <View style={styles.photoContainer}>
                {(() => {
                  // Try to get profile photo from different sources
                  let photoUrl = null;
                  
                  // 1. Check for profilePicture or photoURL (direct properties)
                  if (userData.profilePicture || userData.photoURL) {
                    photoUrl = userData.profilePicture || userData.photoURL;
                  }
                  // 2. Check for images array (public profile)
                  else if (userData.images && userData.images.length > 0) {
                    // Find primary image or use first image
                    const primaryImage = userData.images.find(img => img.isPrimary);
                    const imageToUse = primaryImage || userData.images[0];
                    photoUrl = imageToUse.url || imageToUse.thumbnail_url;
                  }
                  // 3. Fallback to video thumbnail if no images
                  else if (userData.video && userData.video.thumbnail_url) {
                    photoUrl = userData.video.thumbnail_url;
                  }
                  
                  return photoUrl ? (
                    <Image
                      source={{ uri: photoUrl }}
                      style={styles.profilePhoto}
                    />
                  ) : (
                    <View style={styles.profilePhotoPlaceholder}>
                      <Text style={styles.profilePhotoInitial}>
                        {(userData.firstName || userData.username || userData.displayName || 'U')
                          .charAt(0)
                          .toUpperCase()}
                      </Text>
                    </View>
                  );
                })()}
              </View>

              {/* User Info */}
              <View style={styles.infoContainer}>
                <Text style={styles.userName}>
                  {userData.firstName && userData.lastName
                    ? `${userData.firstName} ${userData.lastName}`
                    : userData.username || userData.displayName || 'Unknown User'}
                </Text>
                
                {userData.username && (
                  <Text style={styles.userHandle}>@{userData.username}</Text>
                )}

                {userData.bio && (
                  <Text style={styles.userBio} numberOfLines={3}>
                    {userData.bio}
                  </Text>
                )}
              </View>

              {/* Action Button */}
              <TouchableOpacity
                style={[
                  styles.messageButton,
                  checkingChat && styles.messageButtonDisabled
                ]}
                onPress={handleSendMessage}
                activeOpacity={0.8}
                disabled={checkingChat}
              >
                {checkingChat ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <>
                    <MessageCircle size={20} color={Colors.white} />
                    <Text style={styles.messageButtonText}>Send Message</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Unable to load user profile</Text>
            </View>
          )}
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Initiate Chat Modal */}
      {userData && (
        <InitiateChatModal
          visible={showInitiateChatModal}
          onClose={handleInitiateChatClose}
          recipientId={userData.uid}
          recipientName={userData.username || userData.firstName || 'User'}
          onSendMessage={handleSendInitialMessage}
        />
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingBottom: 40,
    paddingHorizontal: 24,
    minHeight: 300,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
  },
  photoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.gray200,
  },
  profilePhotoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePhotoInitial: {
    fontSize: 40,
    fontFamily: 'Sora-Bold',
    color: Colors.white,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  userName: {
    fontSize: 22,
    fontFamily: 'Sora-Bold',
    color: Colors.gray900,
    marginBottom: 4,
  },
  userHandle: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
    marginBottom: 12,
  },
  userBio: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray700,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  messageButtonDisabled: {
    opacity: 0.6,
  },
  messageButtonText: {
    fontSize: 16,
    fontFamily: 'Sora-SemiBold',
    color: Colors.white,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.red500,
  },
});
