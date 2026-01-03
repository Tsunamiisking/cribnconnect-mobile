import { acceptChatRequest, ignoreChatRequest } from "@/api/services/chatServices";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { Check, MessageCircle, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ChatRequestCard = ({ request, onAccept, onIgnore }) => {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isIgnoring, setIsIgnoring] = useState(false);

  const handleAccept = async () => {
    try {
      setIsAccepting(true);
      await acceptChatRequest(request.conversationId);
      
      Alert.alert(
        "Chat Accepted!",
        `You can now chat with ${request.otherUser?.name || 'this user'}`,
        [
          {
            text: "Open Chat",
            onPress: () => router.push(`/(screens)/private-chat/${request.conversationId}`),
          },
          { text: "Later", style: "cancel" },
        ]
      );
      
      if (onAccept) onAccept(request.conversationId);
    } catch (error) {
      console.error("Error accepting chat:", error);
      Alert.alert("Error", "Failed to accept chat request");
    } finally {
      setIsAccepting(false);
    }
  };

  const handleIgnore = async () => {
    Alert.alert(
      "Ignore Request?",
      `This will prevent ${request.otherUser?.name || 'this user'} from sending more messages. You can still view the conversation later.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Ignore",
          style: "destructive",
          onPress: async () => {
            try {
              setIsIgnoring(true);
              await ignoreChatRequest(request.conversationId);
              
              if (onIgnore) onIgnore(request.conversationId);
            } catch (error) {
              console.error("Error ignoring chat:", error);
              Alert.alert("Error", "Failed to ignore chat request");
            } finally {
              setIsIgnoring(false);
            }
          },
        },
      ]
    );
  };

  const getInitiatorPhoto = () => {
    const otherUser = request.otherUser;
    if (!otherUser) return null;
    
    if (otherUser.photoURL) return otherUser.photoURL;
    // Add more fallback logic if needed based on your user data structure
    return null;
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffMs = now - messageTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return messageTime.toLocaleDateString();
  };

  const photoUrl = getInitiatorPhoto();

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => router.push(`/(screens)/private-chat/${request.conversationId}`)}
        activeOpacity={0.9}
      >
        {/* Profile Photo */}
        <View style={styles.photoContainer}>
          {photoUrl ? (
            <Image source={{ uri: photoUrl }} style={styles.photo} />
          ) : (
            <View style={[styles.photo, styles.photoPlaceholder]}>
              <Text style={styles.photoPlaceholderText}>
                {request.otherUser?.name?.[0]?.toUpperCase() || "?"}
              </Text>
            </View>
          )}
          <View style={styles.badge}>
            <MessageCircle size={12} color={Colors.white} />
          </View>
        </View>

        {/* Request Info */}
        <View style={styles.infoContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.username} numberOfLines={1}>
              {request.otherUser?.name || 'Unknown User'}
            </Text>
            <Text style={styles.time}>{getTimeAgo(request.createdAt)}</Text>
          </View>
          
          <Text style={styles.message} numberOfLines={2}>
            {request.lastMessage?.text || request.firstMessage?.text || 'New message'}
          </Text>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.ignoreButton]}
              onPress={handleIgnore}
              disabled={isIgnoring || isAccepting}
            >
              {isIgnoring ? (
                <ActivityIndicator size="small" color={Colors.gray600} />
              ) : (
                <>
                  <X size={16} color={Colors.gray600} />
                  <Text style={styles.ignoreButtonText}>Ignore</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.acceptButton]}
              onPress={handleAccept}
              disabled={isAccepting || isIgnoring}
            >
              {isAccepting ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <>
                  <Check size={16} color={Colors.white} />
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.primary + "20",
  },
  cardContent: {
    flexDirection: "row",
    padding: 16,
  },
  photoContainer: {
    position: "relative",
    marginRight: 12,
  },
  photo: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  photoPlaceholder: {
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  photoPlaceholderText: {
    fontSize: 20,
    fontFamily: "Sora-Bold",
    color: Colors.white,
  },
  badge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.white,
  },
  infoContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  username: {
    fontSize: 16,
    fontFamily: "Sora-SemiBold",
    color: Colors.gray900,
    flex: 1,
    marginRight: 8,
  },
  time: {
    fontSize: 12,
    fontFamily: "Sora-Regular",
    color: Colors.gray500,
  },
  message: {
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
    lineHeight: 20,
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  ignoreButton: {
    backgroundColor: Colors.gray100,
    borderWidth: 1,
    borderColor: Colors.gray300,
  },
  ignoreButtonText: {
    fontSize: 14,
    fontFamily: "Sora-SemiBold",
    color: Colors.gray700,
  },
  acceptButton: {
    backgroundColor: Colors.primary,
  },
  acceptButtonText: {
    fontSize: 14,
    fontFamily: "Sora-SemiBold",
    color: Colors.white,
  },
});

export default ChatRequestCard;
