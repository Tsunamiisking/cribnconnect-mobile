import api from "@/api/api";
import { checkExistingConversation, initiateChat } from "@/api/services/chatServices";
import BackHeader from "@/components/BackHeader";
import InitiateChatModal from "@/components/InitiateChatModal";
import MediaViewer from "@/components/MediaViewer";
import { Colors } from "@/constants/Colors";
import { useLocationString } from "@/hooks/useLocationString";
import { router, useLocalSearchParams } from "expo-router";
import { MessageCircle, Play } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const PublicProfileID = () => {
  const { id } = useLocalSearchParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { locationString } = useLocationString(profile?.location);
  const [showMediaViewer, setShowMediaViewer] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [checkingConversation, setCheckingConversation] = useState(false);
  const [existingConversation, setExistingConversation] = useState(null);

  const allMedia = useMemo(() => {
    if (!profile) return [];
    const media = [];
    
    // Add images
    if (profile.images) {
      media.push(...profile.images.map(image => ({
        type: 'image',
        url: image.url,
        resource_type: image.resource_type,
        isPrimary: image.isPrimary
      })));
    }
    
    // Add video if exists
    if (profile.video) {
      media.push({
        type: 'video',
        url: profile.video.url,
        resource_type: profile.video.resource_type,
        isPrimary: profile.video.isPrimary,
        thumbnailUrl: profile.video.thumbnail_url // If there's a thumbnail URL
      });
    }
    
    return media;
  }, [profile]);

  const handleMediaPress = (index) => {
    setSelectedMediaIndex(index);
    setShowMediaViewer(true);
  };

  useEffect(() => {
    loadProfile();
    checkForExistingConversation();
  }, [id]);

  const checkForExistingConversation = async () => {
    try {
      const conversation = await checkExistingConversation(id);
      setExistingConversation(conversation);
    } catch (error) {
      console.error("Error checking conversation:", error);
    }
  };

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/public-profiles/${id}`);
      setProfile(response.data);
      // console.log("Loaded profile:", response.data);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessagePress = async () => {
    try {
      setCheckingConversation(true);
      
      // Check if conversation already exists
      const conversation = await checkExistingConversation(id);
      
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
              `Your chat request to ${profile.username} is pending. ${conversation.canSendMessages ? "You can send one message." : "Waiting for them to accept."}`,
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
      console.error("Error handling message press:", error);
      Alert.alert("Error", "Failed to check conversation status");
    } finally {
      setCheckingConversation(false);
    }
  };

  const handleSendInitialMessage = async (message) => {
    try {
      const response = await initiateChat(id, message);
      
      Alert.alert(
        "Request Sent!",
        `Your message has been sent to ${profile.username}. They'll be notified and can accept your chat request.`,
        [
          {
            text: "OK",
            onPress: () => {
              // Update existing conversation state
              setExistingConversation(response.conversation);
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Profile" />
        <View style={styles.loading}>
          <Text>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Profile" />
        <View style={styles.loading}>
          <Text>Profile not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title={profile.username} />
      
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Media Section */}
        <View style={styles.mediaSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mediaScroll}
          >
            {profile.images?.map((image, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.mediaItem}
                onPress={() => handleMediaPress(index)}
              >
                <Image
                  source={{ uri: image.secure_url || image.url }}
                  style={styles.mediaImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
            {profile.video && (
              <TouchableOpacity 
                style={styles.mediaItem}
                onPress={() => handleMediaPress(profile.images?.length || 0)}
              >
                {/* Show video thumbnail if available, otherwise first frame of video */}
                <Image
                  source={{ 
                    uri: profile.video.thumbnail_url || 
                         profile.video.url.replace('.mov', '.jpg') // Fallback to default thumbnail if no specific one
                  }}
                  style={styles.mediaImage}
                  resizeMode="cover"
                />
                <View style={styles.videoOverlay}>
                  <View style={styles.playButton}>
                    <Play size={24} color={Colors.white} />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        {/* Profile Info */}
        <View style={styles.infoContainer}>
          {/* Bio Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>About</Text>
            </View>
            <Text style={styles.bioText}>{profile.bio}</Text>
          </View>

          {/* Location Section */}
          {profile.location && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Location</Text>
              </View>
              <Text style={styles.locationText}>{locationString}</Text>
            </View>
          )}

          {profile.interests && profile.interests.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Interests</Text>
              </View>
              <View style={styles.interestsContainer}>
                {profile.interests.map((interest, index) => (
                  <View key={index} style={styles.interestTag}>
                    <Text style={styles.interestText}>{interest}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Message Button */}
      <View style={styles.actionButtonContainer}>
        <TouchableOpacity
          style={[styles.messageButton, checkingConversation && styles.messageButtonDisabled]}
          onPress={handleMessagePress}
          disabled={checkingConversation}
        >
          {checkingConversation ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <>
              <MessageCircle size={20} color={Colors.white} />
              <Text style={styles.messageButtonText}>
                {existingConversation?.status === "active" 
                  ? "Send Message" 
                  : "Start Chat"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <MediaViewer
        visible={showMediaViewer}
        onClose={() => setShowMediaViewer(false)}
        media={allMedia}
        initialIndex={selectedMediaIndex || 0}
      />

      <InitiateChatModal
        visible={showChatModal}
        onClose={() => setShowChatModal(false)}
        recipientName={profile.username}
        onSendMessage={handleSendInitialMessage}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  mediaSection: {
    marginVertical: 16,
  },
  mediaScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  mediaItem: {
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: Colors.gray100,
  },
  mediaImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    padding: 20,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Sora-SemiBold",
    color: Colors.gray900,
  },
  bioText: {
    fontSize: 16,
    fontFamily: "Sora-Regular",
    color: Colors.gray800,
    lineHeight: 26,
  },
  locationText: {
    fontSize: 16,
    fontFamily: "Sora-Regular",
    color: Colors.gray800,
    lineHeight: 24,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  interestTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.gray100,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  interestText: {
    fontSize: 14,
    fontFamily: "Sora-Medium",
    color: Colors.gray700,
  },
  actionButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  messageButton: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  messageButtonDisabled: {
    opacity: 0.6,
  },
  messageButtonText: {
    fontSize: 16,
    fontFamily: "Sora-SemiBold",
    color: Colors.white,
  },
});

export default PublicProfileID;