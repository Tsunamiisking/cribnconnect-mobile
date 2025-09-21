import BackHeader from "@/components/BackHeader";
import { Colors } from "@/constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import {
  Globe,
  Heart,
  Lock,
  Mail,
  Share2,
  Users
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LinkupDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [linkup, setLinkup] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [joinError, setJoinError] = useState("");
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    // TODO: Fetch linkup details from API
    // Example API call:
    // const fetchLinkup = async () => {
    //   try {
    //     const response = await api.getLinkup(id);
    //     setLinkup(response.data);
    //     setIsBookmarked(response.data.isBookmarked);
    //     setHasJoined(response.data.isMember);
    //   } catch (error) {
    //     console.error('Error fetching linkup:', error);
    //   }
    // };
    // fetchLinkup();

    // Mock data for now
    setLinkup({
      id: id,
      title: "Tech Enthusiasts Hub",
      interest: "Tech & Programming",
      description:
        "A community for developers, designers, and tech enthusiasts to discuss the latest trends, share resources, and help each other grow professionally.",
      privacy: "private", // 'public' or 'private'
      hostName: "Alex Chen",
      meetingFrequency: "Weekly virtual meetups",
      groupSize: {
        current: 48,
        max: 100,
      },
      activityLevel: "very-active", // 'low', 'active', 'very-active'
      lastActive: "10 minutes ago",
      createdAt: "2023-12-15",
      imageUri:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=500&fit=crop",
      isActive: true,
      memberCount: 48,
      maxMembers: 100,
      online: 5,
      contactMethod: "App Messaging",
    });
  }, [id]);

  const handleJoinGroup = () => {
    if (hasJoined) {
      // If already joined, perhaps show leave group confirmation
      console.log("You are already a member of this group");
      return;
    }

    // Check if group is private or requires approval
    if (linkup?.privacy === "private") {
      setJoinModalVisible(true);
    } else if (linkup?.privacy === "request") {
      // Send join request to admin
      console.log("Join request sent to group admin");
      // In a real app, this would make an API call

      // For demo purposes, we'll just show success
      setHasJoined(true);
    } else {
      // Public group - join immediately
      // In a real app, this would make an API call

      // For demo purposes, we'll just show success
      setHasJoined(true);
    }
  };

  const handleSubmitPassword = () => {
    // In a real app, verify password with API
    if (passwordInput === "1234") {
      // Demo password
      setHasJoined(true);
      setJoinModalVisible(false);
      setPasswordInput("");
      setJoinError("");
    } else {
      setJoinError(
        "Incorrect password. Please try again or contact the group admin."
      );
    }
  };

  const handleBookmark = () => {
    // TODO: Add API integration for bookmarking
    // Example API call:
    // try {
    //   const response = await api.bookmarkLinkup(id, !isBookmarked);
    //   setIsBookmarked(!isBookmarked);
    // } catch (error) {
    //   console.error('Error updating bookmark:', error);
    // }

    setIsBookmarked(!isBookmarked);
  };

  const handleContactHost = () => {
    // TODO: Navigate to messaging or contact options based on contact method
    if (linkup?.contactMethod === "App Messaging") {
      router.push(`/(screens)/chat/${linkup?.id || "host"}`);
      setJoinModalVisible(false);
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

  if (!linkup) {
    return (
      <View
        style={styles.loadingContainer}
        className="flex-1 justify-center items-center bg-white"
      >
        <Text style={styles.loadingText}>Loading linkup details...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Group Details" showUser={false} />

      {/* Join Group Password Modal */}
      <Modal
        visible={joinModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setJoinModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Private Group</Text>
            <Text style={styles.modalText}>
              This group requires a password to join. Please enter the password
              or contact the group admin for access.
            </Text>

            <TextInput
              style={styles.passwordInput}
              placeholder="Enter group password"
              secureTextEntry
              value={passwordInput}
              onChangeText={setPasswordInput}
              placeholderTextColor={Colors.gray500}
            />

            {joinError ? (
              <Text style={styles.errorText}>{joinError}</Text>
            ) : null}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setJoinModalVisible(false);
                  setPasswordInput("");
                  setJoinError("");
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitPassword}
              >
                <Text style={styles.submitButtonText}>Join Group</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.contactAdminButton}
              onPress={handleContactHost}
            >
              <Mail size={16} color={Colors.primary} />
              <Text style={styles.contactAdminText}>Contact Admin</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cover Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: linkup.imageUri }}
            style={styles.coverImage}
            resizeMode="cover"
          />

          {/* Bookmark Button Overlay */}
          <TouchableOpacity
            style={styles.bookmarkButton}
            onPress={handleBookmark}
          >
            <Heart
              size={24}
              color={isBookmarked ? Colors.white : Colors.white}
              fill={isBookmarked ? Colors.emerald : "transparent"}
            />
          </TouchableOpacity>

          {/* Privacy Badge Overlay */}
          <View style={styles.privacyBadge}>
            {linkup.privacy === "private" ? (
              <Lock size={16} color={Colors.white} />
            ) : (
              <Globe size={16} color={Colors.white} />
            )}
            <Text style={styles.privacyText}>
              {linkup.privacy === "private" ? "Private Group" : "Public Group"}
            </Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          {/* Header Info */}
          <View style={styles.header}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{linkup.interest}</Text>
            </View>

            <Text style={styles.title}>{linkup.title}</Text>

            <Text style={styles.host}>Hosted by {linkup.hostName}</Text>

            {/* Status Indicators */}
            <View style={styles.statusRow}>
              <View style={styles.statusItem}>
                <Users size={16} color={Colors.gray700} />
                <Text style={styles.statusText}>
                  {linkup.groupSize.current}/{linkup.groupSize.max} members
                </Text>
              </View>

              {linkup.online > 0 && (
                <View style={styles.onlineStatusItem}>
                  <View style={styles.onlineIndicator} />
                  <Text style={styles.onlineStatusText}>
                    {linkup.online} online now
                  </Text>
                </View>
              )}

              {linkup.isActive && (
                <View
                  style={[
                    styles.activeBadge,
                    linkup.activityLevel === "very-active"
                      ? styles.veryActiveBadge
                      : linkup.activityLevel === "active"
                        ? styles.activeBadge
                        : styles.lowActivityBadge,
                  ]}
                >
                  <Text style={styles.activeText}>
                    {linkup.activityLevel === "very-active"
                      ? "Very Active"
                      : linkup.activityLevel === "active"
                        ? "Active"
                        : "Low Activity"}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>About This Group</Text>
            <Text style={styles.description}>{linkup.description}</Text>
          </View>

          {/* Key Details */}
          <View style={styles.keyDetails}>
            <Text style={styles.sectionTitle}>Group Details</Text>

            <View style={styles.detailGrid}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Interest/Topic</Text>
                <Text style={styles.detailValue}>{linkup.interest}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Meeting Frequency</Text>
                <Text style={styles.detailValue}>
                  {linkup.meetingFrequency}
                </Text>
              </View>


              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Privacy</Text>
                <Text style={styles.detailValue}>
                  {linkup.privacy === "private" ? "Private" : "Public"}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Group Size</Text>
                <Text style={styles.detailValue}>
                  {linkup.groupSize.current}/{linkup.groupSize.max} members
                </Text>
              </View>
            </View>
          </View>

          {/* No additional sections to match the minimalist approach */}

          {/* Members Section */}
          <View style={styles.membersSection}>
            <View style={styles.membersHeader}>
              <Text style={styles.sectionTitle}>Group Members</Text>
              <TouchableOpacity onPress={handleViewMembers}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.memberPreview}>
              <Text style={styles.memberCount}>
                {linkup.groupSize.current} current members,{" "}
                {linkup.groupSize.max - linkup.groupSize.current} spots
                available
              </Text>
            </View>
          </View>

          {/* Contact Section */}
          <View style={styles.contactSection}>
            <Text style={styles.sectionTitle}>Contact Host</Text>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={handleContactHost}
            >
              <View>
                <Text style={styles.contactName}>{linkup.hostName}</Text>
                <Text style={styles.contactInfo}>
                  Message via {linkup.contactMethod}
                </Text>
              </View>
              <Text style={styles.contactArrow}>→</Text>
            </TouchableOpacity>
          </View>

  </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.actionBar}>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Share2 size={20} color={Colors.gray700} />
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.joinButton, hasJoined && styles.joinedButton]}
            onPress={handleJoinGroup}
          >
            <Text style={styles.joinButtonText}>
              {hasJoined ? "Joined ✓" : "Join Group"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    height: 220,
    width: "100%",
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  bookmarkButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.4)",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  privacyBadge: {
    position: "absolute",
    bottom: 16,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  privacyText: {
    color: Colors.white,
    marginLeft: 6,
    fontFamily: "Sora-Medium",
    fontSize: 14,
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    marginBottom: 24,
  },
  typeBadge: {
    backgroundColor: Colors.blue50,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 50,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  typeText: {
    color: Colors.primary,
    fontSize: 14,
    fontFamily: "Sora-Medium",
  },
  title: {
    fontSize: 24,
    fontFamily: "Urbanist-Bold",
    color: Colors.gray900,
    marginBottom: 8,
  },
  host: {
    color: Colors.gray600,
    fontFamily: "Sora-Regular",
    marginBottom: 16,
    fontSize: 15,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  onlineStatusItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.emerald,
    marginRight: 6,
  },
  statusText: {
    color: Colors.gray700,
    fontSize: 14,
    fontFamily: "Sora-Regular",
    marginLeft: 8,
  },
  onlineStatusText: {
    color: Colors.emerald,
    fontSize: 14,
    fontFamily: "Sora-Medium",
  },
  activeBadge: {
    backgroundColor: Colors.blue50,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  veryActiveBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  lowActivityBadge: {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
  },
  activeText: {
    fontFamily: "Sora-Medium",
    fontSize: 12,
    color: Colors.primary,
  },
  lastActive: {
    fontSize: 13,
    fontFamily: "Sora-Regular",
    color: Colors.gray500,
  },
  descriptionSection: {
    marginBottom: 24,
    paddingTop: 16,
  },
  keyDetails: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Urbanist-Bold",
    color: Colors.primary,
    marginBottom: 16,
  },
  description: {
    color: Colors.gray700,
    lineHeight: 22,
    fontFamily: "Sora-Regular",
    fontSize: 15,
  },
  detailGrid: {
    backgroundColor: Colors.gray50,
    borderRadius: 12,
    overflow: "hidden",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  detailLabel: {
    color: Colors.gray600,
    fontFamily: "Sora-Medium",
    fontSize: 14,
  },
  detailValue: {
    color: Colors.gray900,
    fontFamily: "Sora-SemiBold",
    fontSize: 14,
  },
  topicsSection: {
    marginBottom: 24,
  },
  topicsList: {
    backgroundColor: Colors.gray50,
    borderRadius: 12,
    padding: 12,
  },
  topicItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  topicIcon: {
    marginRight: 12,
  },
  topicText: {
    fontFamily: "Sora-Regular",
    fontSize: 15,
    color: Colors.gray800,
  },
  rulesSection: {
    marginBottom: 24,
  },
  rulesList: {
    backgroundColor: Colors.gray50,
    borderRadius: 12,
    padding: 12,
  },
  ruleItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
  },
  ruleNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    color: Colors.white,
    textAlign: "center",
    lineHeight: 24,
    marginRight: 12,
    fontFamily: "Sora-Medium",
    fontSize: 12,
  },
  ruleText: {
    flex: 1,
    fontFamily: "Sora-Regular",
    fontSize: 15,
    color: Colors.gray800,
    lineHeight: 22,
  },
  interestsSection: {
    marginBottom: 24,
  },
  interestsTags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  interestTag: {
    backgroundColor: Colors.blue50,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    color: Colors.primary,
    fontFamily: "Sora-Medium",
    fontSize: 14,
  },
  membersSection: {
    marginBottom: 24,
  },
  membersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  viewAllText: {
    color: Colors.primary,
    fontFamily: "Sora-SemiBold",
    fontSize: 14,
  },
  memberPreview: {
    backgroundColor: Colors.gray50,
    padding: 16,
    borderRadius: 12,
  },
  memberCount: {
    color: Colors.gray700,
    fontFamily: "Sora-Regular",
    fontSize: 15,
  },
  contactSection: {
    marginBottom: 24,
  },
  contactButton: {
    backgroundColor: Colors.gray50,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  contactName: {
    color: Colors.gray900,
    fontFamily: "Sora-SemiBold",
    fontSize: 15,
  },
  contactInfo: {
    color: Colors.gray600,
    fontFamily: "Sora-Regular",
    fontSize: 13,
  },
  contactArrow: {
    color: Colors.gray400,
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Urbanist-Bold",
    color: Colors.gray900,
    marginBottom: 10,
  },
  modalText: {
    color: Colors.gray700,
    fontFamily: "Sora-Regular",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: "Sora-Regular",
    fontSize: 16,
    color: Colors.gray900,
    marginBottom: 10,
  },
  errorText: {
    color: "#ef4444",
    fontFamily: "Sora-Regular",
    fontSize: 14,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.gray100,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: Colors.gray700,
    fontFamily: "Sora-SemiBold",
    fontSize: 15,
  },
  submitButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: Colors.white,
    fontFamily: "Sora-SemiBold",
    fontSize: 15,
  },
  contactAdminButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  contactAdminText: {
    color: Colors.primary,
    fontFamily: "Sora-Medium",
    fontSize: 14,
    marginLeft: 6,
  },
  bottomSpacing: {
    height: 100,
  },
  actionBar: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderTopColor: Colors.gray200,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: Colors.gray100,
    marginRight: 12,
  },
  shareButtonText: {
    color: Colors.gray700,
    fontFamily: "Sora-SemiBold",
    fontSize: 15,
    marginLeft: 8,
  },
  joinButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  joinedButton: {
    backgroundColor: Colors.emerald,
  },
  joinButtonText: {
    color: Colors.white,
    fontFamily: "Sora-Bold",
    fontSize: 16,
  },
});
