import api from "@/api/api";
import BackHeader from "@/components/BackHeader";
import JoinCodeModal from "@/components/linkup/JoinCodeModal";
import JoinConfirmationModal from "@/components/linkup/JoinConfirmationModal";
import LinkupActionBar from "@/components/linkup/LinkupActionBar";
import LinkupDetails from "@/components/linkup/LinkupDetails";
import LinkupHeader from "@/components/linkup/LinkupHeader";
import LinkupInfo from "@/components/linkup/LinkupInfo";
import PendingRequestsModal from "@/components/linkup/PendingRequestsModal";
import { auth } from "@/config/firebase";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { addUserToLinkupChat, createLinkupGroupChat } from "@/services/linkupChatService";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LinkupDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { publicProfileId } = useAuth();
  const [linkup, setLinkup] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [joinCodeModalVisible, setJoinCodeModalVisible] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);

  useEffect(() => {
    const fetchLinkup = async () => {
      try {
        setLoading(true);
        setError(null);
        // console.log("Fetching linkup details for ID:", id);
        const response = await api.get(`/linkups/${id}`);
        const linkupData = response.data;
        
        const currentUserId = auth?.currentUser?.uid;
        
        // Check if current user is a member (members array contains PublicProfile ObjectIds)
        const isMember = publicProfileId && linkupData.members?.some(member => {
          // Members can be either ObjectId strings or populated objects
          const memberId = typeof member === 'string' ? member : member._id;
          return memberId === publicProfileId;
        });
        
        // Check if current user is the creator (compare Firebase uid with linkup.uid)
        const isGroupCreator = currentUserId === linkupData.uid;
      
        // For now, creator is the only admin (can be extended with admins array later)
        const isGroupAdmin = isGroupCreator;
        
        console.log('Debug - Current User Firebase UID:', currentUserId);
        console.log('Debug - Current User Public Profile ID:', publicProfileId);
        console.log('Debug - Linkup Creator UID:', linkupData.uid);
        console.log('Debug - Is Member:', isMember);
        console.log('Debug - Is Creator:', isGroupCreator);
        
        setIsCreator(isGroupCreator);
        setIsAdmin(isGroupAdmin)
        
        // Map database structure to component state
        setLinkup({
          id: linkupData._id,
          title: linkupData.name,
          interest: linkupData.interests?.[0] || "General",
          description: linkupData.description || "No description provided.",
          privacy: linkupData.privacy || "public",
          hostName: linkupData.createdBy?.username || "Unknown Host",
          hostId: linkupData.createdBy?._id,
          meetingFrequency: linkupData.meetingFrequency || "Not specified",
          groupSize: {
            current: linkupData.members?.length || 0,
            max: linkupData.maxPeople || 50,
          },
          activityLevel: "active", // Could be calculated based on recent messages/activity
          lastActive: new Date(linkupData.updatedAt).toLocaleString(),
          createdAt: linkupData.createdAt,
          imageUri: linkupData.photo?.url || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=500&fit=crop",
          isActive: true,
          memberCount: linkupData.members?.length || 0,
          maxMembers: linkupData.maxPeople || 50,
          online: 0, // Would need active status integration
          contactMethod: "App Messaging",
          allInterests: linkupData.interests || [],
          isPrivate: linkupData.isPrivate,
          members: linkupData.members || [],
        });
        
        setHasJoined(isMember);
        // setIsBookmarked would come from user's bookmarks if implemented
      } catch (error) {
        console.error('Error fetching linkup:', error);
        setError(error.response?.data?.message || 'Failed to load linkup details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLinkup();
    }
  }, [id]);

  const handleJoinGroup = async () => {
    if (hasJoined) {
      console.log("You are already a member of this group");
      return;
    }

    // Check if group is private
    if (linkup?.privacy === "private" || linkup?.isPrivate) {
      // Show request modal for private groups
      setJoinModalVisible(true);
    } else {
      // Public group - show confirmation popup
      setJoinModalVisible(true);
    }
  };

  // Handle joining public group after confirmation
  const handleConfirmPublicJoin = async () => {
    try {
      setIsJoining(true);
      const currentUser = auth?.currentUser;
      
      await api.post(`/linkups/${linkup.id}/join`);
      setHasJoined(true);
      
      // Add user to Firebase group chat
      if (currentUser) {
        try {
          // Fetch username from public profile
          let username = currentUser.displayName || 'Anonymous';
          try {
            const profileResponse = await api.get('/public-profiles/me');
            username = profileResponse.data?.username || username;
          } catch (profileError) {
            console.log('Could not fetch username, using displayName');
          }
          
          // First, ensure group chat exists (in case it wasn't created)
          await createLinkupGroupChat(
            linkup.id,
            {
              name: linkup.title,
              photo: linkup.imageUri,
              description: linkup.description,
            },
            linkup.hostId,
            {
              name: linkup.hostName,
              photoURL: null,
            }
          );
          
          // Then add the current user to the chat with their username
          await addUserToLinkupChat(
            linkup.id,
            currentUser.uid,
            {
              name: username,
              photoURL: currentUser.photoURL || null,
            }
          );
          
          console.log('User added to linkup group chat with username:', username);
        } catch (chatError) {
          console.error('Error adding user to group chat:', chatError);
          // Don't fail the join if chat fails
        }
      }
      
      // Update local state
      setLinkup(prev => ({
        ...prev,
        groupSize: {
          ...prev.groupSize,
          current: prev.groupSize.current + 1
        },
        memberCount: prev.memberCount + 1
      }));
      
      // Close modal
      setJoinModalVisible(false);
    } catch (error) {
      console.error('Error joining linkup:', error);
      setJoinError(error.response?.data?.message || 'Failed to join group');
      
      setTimeout(() => {
        setJoinError("");
      }, 3000);
    } finally {
      setIsJoining(false);
    }
  };

  // Handle sending join request for private groups
  const handleSubmitRequest = async () => {
    try {
      setIsJoining(true);
      // Send join request with notification to admin/creator
      await api.post(`/linkups/${linkup.id}/request`, {
        message: requestMessage,
        userId: auth?.currentUser?.uid,
        userName: auth?.currentUser?.displayName || 'Anonymous',
        userPhoto: auth?.currentUser?.photoURL || null,
      });

      console.log("Join request sent to group admin");

      // Show success state
      setRequestSent(true);

      // Close the modal after a delay
      setTimeout(() => {
        setJoinModalVisible(false);
        setRequestMessage("");
        setRequestSent(false);
      }, 3000);
    } catch (error) {
      console.error('Error sending join request:', error);
      setJoinError(error.response?.data?.message || 'Failed to send request');
      
      // Clear error after 3 seconds
      setTimeout(() => {
        setJoinError("");
      }, 3000);
    } finally {
      setIsJoining(false);
    }
  };

  // Handle joining with one-time code (for private groups after approval)
  const handleJoinWithCode = async () => {
    if (!joinCode.trim()) {
      setJoinError("Please enter the join code");
      setTimeout(() => setJoinError(""), 3000);
      return;
    }

    try {
      const currentUser = auth?.currentUser;
      
      // Verify and use the one-time code
      await api.post(`/linkups/${linkup.id}/join-with-code`, {
        code: joinCode.trim(),
      });
      
      setHasJoined(true);
      
      // Add user to Firebase group chat
      if (currentUser) {
        try {
          // Fetch username from public profile
          let username = currentUser.displayName || 'Anonymous';
          try {
            const profileResponse = await api.get('/public-profiles/me');
            username = profileResponse.data?.username || username;
          } catch (profileError) {
            console.log('Could not fetch username, using displayName');
          }
          
          await addUserToLinkupChat(
            linkup.id,
            currentUser.uid,
            {
              name: username,
              photoURL: currentUser.photoURL || null,
            }
          );
          
          console.log('User added to private linkup group chat with username:', username);
        } catch (chatError) {
          console.error('Error adding user to group chat:', chatError);
        }
      }
      
      // Update local state
      setLinkup(prev => ({
        ...prev,
        groupSize: {
          ...prev.groupSize,
          current: prev.groupSize.current + 1
        },
        memberCount: prev.memberCount + 1
      }));
      
      // Close modal and clear code
      setJoinCodeModalVisible(false);
      setJoinCode("");
    } catch (error) {
      console.error('Error joining with code:', error);
      setJoinError(error.response?.data?.message || 'Invalid or expired code');
      
      setTimeout(() => {
        setJoinError("");
      }, 3000);
    }
  };

  // Show code entry modal for users who have an approval code
  const handleEnterCode = () => {
    setJoinCodeModalVisible(true);
  };

  const handleBookmark = async () => {
    try {
      // TODO: Add API integration for bookmarking when endpoint is ready
      // await api.post(`/linkups/${id}/bookmark`, { bookmark: !isBookmarked });
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error updating bookmark:', error);
    }
  };

  const handleContactHost = () => {
    // TODO: Navigate to messaging or contact options based on contact method
    if (linkup?.contactMethod === "App Messaging") {
      router.push(`/(screens)/chat/${linkup?.id || "host"}`);
    } else {
      // Handle other contact methods
      console.log("Contact via:", linkup?.contactMethod);
    }
  };

  const handleShare = () => {
    // TODO: Implement sharing functionality
    console.log("Share linkup:", linkup?.title);
  };

  const handleViewMembers = () => {
    // TODO: Navigate to members list
    console.log("View members for linkup:", id);
  };

  const handleEditGroup = () => {
    // TODO: Navigate to edit group screen
    console.log("Edit linkup:", id);
    // router.push(`/(hosting)/edit-linkup/${id}`);
  };

  const handleLeaveGroup = async () => {
    try {
      setIsLeaving(true);
      
      if (isCreator) {
        setJoinError("Group creator cannot leave the group. Delete the group instead.");
        setTimeout(() => setJoinError(""), 3000);
        return;
      }

      // TODO: Show confirmation modal before leaving
      await api.post(`/linkups/${linkup.id}/leave`);
      
      setHasJoined(false);
      
      // Update local state
      setLinkup(prev => ({
        ...prev,
        groupSize: {
          ...prev.groupSize,
          current: Math.max(0, prev.groupSize.current - 1)
        },
        memberCount: Math.max(0, prev.memberCount - 1)
      }));

      console.log('Successfully left the group');
    } catch (error) {
      console.error('Error leaving group:', error);
      setJoinError(error.response?.data?.message || 'Failed to leave group');
      
      setTimeout(() => {
        setJoinError("");
      }, 3000);
    } finally {
      setIsLeaving(false);
    }
  };

  const handleManageRequests = () => {
    // Open the pending requests modal
    setShowRequestsModal(true);
  };

  const handleCloseJoinModal = () => {
    setJoinModalVisible(false);
    setRequestMessage("");
    setJoinError("");
  };

  const handleCloseCodeModal = () => {
    setJoinCodeModalVisible(false);
    setJoinCode("");
    setJoinError("");
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Group Details" showUser={false} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading linkup details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Group Details" showUser={false} />
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              setLoading(true);
              // Trigger re-fetch by changing a dependency
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!linkup) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Group Details" showUser={false} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Linkup not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Group Details" showUser={false} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cover Image */}
        <LinkupHeader 
          linkup={linkup}
          isBookmarked={isBookmarked}
          onBookmark={handleBookmark}
        />

        <View style={styles.detailsContainer}>
          {/* Header Info */}
          <LinkupInfo linkup={linkup} isCreator={isCreator} isAdmin={isAdmin} />

          {/* Details Sections */}
          <LinkupDetails
            linkup={linkup}
            onViewMembers={handleViewMembers}
            onContactHost={handleContactHost}
          />
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <LinkupActionBar
        hasJoined={hasJoined}
        requestSent={requestSent}
        isAdmin={isAdmin}
        isCreator={isCreator}
        isPrivate={linkup?.privacy === "private" || linkup?.isPrivate}
        isJoining={isJoining}
        isLeaving={isLeaving}
        onJoin={handleJoinGroup}
        onLeave={handleLeaveGroup}
        onEdit={handleEditGroup}
        onManageRequests={handleManageRequests}
        onShare={handleShare}
      />

      {/* Join Confirmation/Request Modal */}
      <JoinConfirmationModal
        visible={joinModalVisible}
        onClose={handleCloseJoinModal}
        linkup={linkup}
        isPrivate={linkup?.privacy === "private" || linkup?.isPrivate}
        requestMessage={requestMessage}
        onRequestMessageChange={setRequestMessage}
        requestSent={requestSent}
        joinError={joinError}
        isJoining={isJoining}
        onSubmitRequest={handleSubmitRequest}
        onConfirmPublicJoin={handleConfirmPublicJoin}
        onEnterCode={handleEnterCode}
      />

      {/* Join Code Entry Modal */}
      <JoinCodeModal
        visible={joinCodeModalVisible}
        onClose={handleCloseCodeModal}
        joinCode={joinCode}
        onJoinCodeChange={setJoinCode}
        joinError={joinError}
        onSubmit={handleJoinWithCode}
      />

      {/* Pending Requests Modal */}
      <PendingRequestsModal
        visible={showRequestsModal}
        onClose={() => setShowRequestsModal(false)}
        linkupId={linkup.id}
      />
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  loadingText: {
    color: Colors.gray500,
    fontFamily: "Sora-Regular",
    fontSize: 16,
    marginTop: 12,
  },
  errorText: {
    color: "#ef4444",
    fontFamily: "Sora-Regular",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.white,
    fontFamily: "Sora-SemiBold",
    fontSize: 15,
  },
  content: {
    flex: 1,
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
