import { checkExistingConversation, initiateChat } from "@/api/services/chatServices";
import InitiateChatModal from "@/components/InitiateChatModal";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import {
  Heart,
  MapPin,
  MessageCircle
} from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function PersonCard({ person, onPress }) {
  const [showChatModal, setShowChatModal] = useState(false);
  const [sendingLike, setSendingLike] = useState(false);
  const [checkingChat, setCheckingChat] = useState(false);
  
  // We now have just one image per person
  const handleImagePress = () => {
    if (onPress) {
      onPress(person);
    }
  };

  const handleLike = async () => {
    try {
      setSendingLike(true);
      
      // Call the like API endpoint
      const response = await api.post(`/public-profiles/${person.uid}/like`);
      
      Alert.alert(
        "Like Sent! 💝",
        `${person.username} will be notified that you liked their profile!`
      );
      
      console.log("Profile liked:", person.username, response.data);
    } catch (error) {
      console.error("Error sending like:", error);
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        const message = error.response.data.message;
        if (message.includes("already liked")) {
          Alert.alert("Already Liked", "You've already liked this profile!");
        } else if (message.includes("your own profile")) {
          Alert.alert("Not Allowed", "You cannot like your own profile.");
        } else {
          Alert.alert("Error", message);
        }
      } else {
        Alert.alert("Error", "Failed to send like. Please try again.");
      }
    } finally {
      setSendingLike(false);
    }
  };

  const handleMessage = async () => {
    try {
      setCheckingChat(true);
      
      // Check if conversation already exists
      const conversation = await checkExistingConversation(person.uid);
      
      if (conversation) {
        // Conversation exists, handle based on status
        if (conversation.status === "pending") {
          if (conversation.isRecipient) {
            // We received the request, navigate to chat to accept/ignore
            router.push(`/(screens)/private-chat/${conversation.conversationId}`);
          } else {
            // We sent the request
            Alert.alert(
              "Request Pending",
              `Your chat request to ${person.username} is pending. ${conversation.canSendMessages ? "You can send one message." : "Waiting for them to accept."}`,
              [
                { text: "Cancel", style: "cancel" },
                { text: "View Chat", onPress: () => router.push(`/(screens)/private-chat/${conversation.conversationId}`) }
              ]
            );
          }
        } else if (conversation.status === "accepted") {
          // Active conversation, go to chat
          router.push(`/(screens)/private-chat/${conversation.conversationId}`);
        } else if (conversation.status === "ignored") {
          Alert.alert(
            "Chat Unavailable",
            "This conversation has been closed."
          );
        }
      } else {
        // No conversation exists, show initiate modal
        setShowChatModal(true);
      }
    } catch (error) {
      console.error("Error checking conversation:", error);
      Alert.alert("Error", "Failed to check conversation status");
    } finally {
      setCheckingChat(false);
    }
  };

  const handleSendInitialMessage = async (message) => {
    try {
      const response = await initiateChat(person.uid, message);
      
      Alert.alert(
        "Request Sent!",
        `Your message has been sent to ${person.username}. They'll be notified and can accept your chat request.`,
        [
          {
            text: "OK",
            onPress: () => {
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
    <TouchableOpacity 
      style={styles.personCard}
      onPress={handleImagePress}
    >
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: person.image }} 
          style={styles.personImage}
          defaultSource={require('@/assets/images/default-avatar.jpg')}
        />

        <View style={styles.distanceOverlay}>
          <MapPin size={14} color={Colors.white} />
          <Text style={styles.distanceText}>{person.distance}</Text>
        </View>
      </View>

      {/* Person Info */}
      <View style={styles.personInfo}>
        <View style={styles.personHeader}>
          <Text style={styles.personName}>{person.username}</Text>
        </View>

        <Text style={styles.personBio} numberOfLines={2}>{person.bio}</Text>

        {/* Interests */}
        <View style={styles.interestsContainer}>
          {person.interests?.slice(0, 3).map((interest, index) => (
            <View key={index} style={styles.interestTag}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
          {person.interests?.length > 3 && (
            <Text style={styles.moreInterests}>+{person.interests.length - 3} more</Text>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.likeButton, sendingLike && styles.buttonDisabled]} 
            onPress={handleLike}
            disabled={sendingLike}
          >
            {sendingLike ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <Heart size={24} color={Colors.white} />
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.messageButton, checkingChat && styles.buttonDisabled]} 
            onPress={handleMessage}
            disabled={checkingChat}
          >
            {checkingChat ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <MessageCircle size={24} color={Colors.white} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <InitiateChatModal
        visible={showChatModal}
        onClose={() => setShowChatModal(false)}
        recipientName={person.username}
        onSendMessage={handleSendInitialMessage}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  personCard: {
    backgroundColor: Colors.white,
    marginBottom: 20,
    borderRadius: 20,
    marginHorizontal: 16,
    elevation: 3,
    shadowColor: Colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  imageContainer: {
    height: 400,
    position: 'relative',
    backgroundColor: Colors.gray100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  personImage: {
    width: '100%',
    height: '100%',
  },
  distanceOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  distanceText: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: 'Sora-Regular',
  },
  personInfo: {
    padding: 20,
    backgroundColor: Colors.white,
  },
  personHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  personName: {
    fontSize: 24,
    fontFamily: 'Sora-Bold',
    color: Colors.gray900,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  personBio: {
    fontSize: 16,
    fontFamily: 'Sora-Regular',
    color: Colors.gray700,
    lineHeight: 24,
    marginBottom: 16,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  interestTag: {
    backgroundColor: Colors.lightBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  interestText: {
    fontSize: 14,
    fontFamily: 'Sora-Medium',
    color: Colors.primary,
  },
  moreInterests: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray500,
    alignSelf: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  likeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  messageButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.emerald,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});