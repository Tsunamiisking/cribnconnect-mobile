import api from "@/api/api";
import { Colors } from "@/constants/Colors";
import { Check, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PendingRequestsModal({ visible, onClose, linkupId }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    if (visible && linkupId) {
      fetchRequests();
    }
  }, [visible, linkupId]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/linkups/${linkupId}/requests`);
      // Filter only pending requests
      
      const pendingRequests = response.data.requests.filter(
        (req) => req.status === "pending"
      );
      setRequests(pendingRequests);
    } catch (error) {
      console.error("Error fetching requests:", error);
      Alert.alert("Error", "Failed to load pending requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId, userId, userName) => {
    try {
      setProcessingId(requestId);
      const response = await api.post(
        `/linkups/${linkupId}/approve-request`,
        {
          requestId,
          userId,
        }
      );

      // Show success with join code
      Alert.alert(
        "Request Approved",
        `${userName}'s request has been approved.\n\nJoin Code: ${response.data.joinCode}\n\nThe code has been sent to the user and is valid for 24 hours.`,
        [
          {
            text: "OK",
            onPress: () => {
              // Remove from list
              setRequests((prev) =>
                prev.filter((req) => req._id !== requestId)
              );
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error approving request:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to approve request"
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId, userName) => {
    Alert.alert(
      "Reject Request",
      `Are you sure you want to reject ${userName}'s request to join?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reject",
          style: "destructive",
          onPress: async () => {
            try {
              setProcessingId(requestId);
              await api.post(`/linkups/${linkupId}/reject-request`, {
                requestId,
              });

              Alert.alert("Request Rejected", `${userName}'s request has been rejected.`);

              // Remove from list
              setRequests((prev) =>
                prev.filter((req) => req._id !== requestId)
              );
            } catch (error) {
              console.error("Error rejecting request:", error);
              Alert.alert(
                "Error",
                error.response?.data?.message || "Failed to reject request"
              );
            } finally {
              setProcessingId(null);
            }
          },
        },
      ]
    );
  };

  const renderRequestItem = ({ item }) => {
    const isProcessing = processingId === item._id;
    const userName = item.user?.username || item.userName || "Unknown User";
    const userPhoto = item.user?.profilePhoto || item.userPhoto;
    const message = item.message;
    const requestDate = new Date(item.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View style={styles.requestItem}>
        <View style={styles.requestHeader}>
          <View style={styles.userInfo}>
            {userPhoto ? (
              <Image source={{ uri: userPhoto }} style={styles.userPhoto} />
            ) : (
              <View style={styles.userPhotoPlaceholder}>
                <Text style={styles.userPhotoPlaceholderText}>
                  {userName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.requestDate}>{requestDate}</Text>
            </View>
          </View>
        </View>

        {message && (
          <View style={styles.messageContainer}>
            <Text style={styles.messageLabel}>Message:</Text>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        )}

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.rejectButton,
              isProcessing && styles.disabledButton,
            ]}
            onPress={() => handleReject(item._id, userName)}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#ef4444" />
            ) : (
              <>
                <X size={18} color="#ef4444" />
                <Text style={styles.rejectButtonText}>Reject</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.approveButton,
              isProcessing && styles.disabledButton,
            ]}
            onPress={() => handleApprove(item._id, item.user?._id || item.userId, userName)}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <>
                <Check size={18} color={Colors.white} />
                <Text style={styles.approveButtonText}>Approve</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Pending Requests</Text>
            <Text style={styles.headerSubtitle}>
              {requests.length} {requests.length === 1 ? "request" : "requests"}
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.gray700} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading requests...</Text>
          </View>
        ) : requests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No pending requests</Text>
            <Text style={styles.emptySubtext}>
              When users request to join your private group, they'll appear here
            </Text>
          </View>
        ) : (
          <FlatList
            data={requests}
            keyExtractor={(item) => item._id}
            renderItem={renderRequestItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Urbanist-Bold",
    color: Colors.gray900,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
    marginTop: 4,
  },
  closeButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: "Urbanist-Bold",
    color: Colors.gray900,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
    textAlign: "center",
    lineHeight: 20,
  },
  listContent: {
    padding: 20,
  },
  requestItem: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.gray200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userPhoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userPhotoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  userPhotoPlaceholderText: {
    fontSize: 20,
    fontFamily: "Urbanist-Bold",
    color: Colors.white,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontFamily: "Urbanist-Bold",
    color: Colors.gray900,
    marginBottom: 2,
  },
  requestDate: {
    fontSize: 12,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
  },
  messageContainer: {
    backgroundColor: Colors.gray50,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  messageLabel: {
    fontSize: 12,
    fontFamily: "Sora-SemiBold",
    color: Colors.gray700,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.gray900,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#fee2e2",
    gap: 6,
  },
  rejectButtonText: {
    fontSize: 15,
    fontFamily: "Sora-SemiBold",
    color: "#ef4444",
  },
  approveButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    gap: 6,
  },
  approveButtonText: {
    fontSize: 15,
    fontFamily: "Sora-SemiBold",
    color: Colors.white,
  },
  disabledButton: {
    opacity: 0.6,
  },
});
