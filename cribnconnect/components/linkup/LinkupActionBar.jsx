import { Colors } from "@/constants/Colors";
import { Share2 } from "lucide-react-native";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function LinkupActionBar({
  hasJoined,
  requestSent,
  isAdmin = false,
  isCreator = false,
  isPrivate = false,
  isJoining = false,
  isLeaving = false,
  onJoin,
  onLeave,
  onEdit,
  onManageRequests,
  onShare,
}) {
  // Determine what buttons to show
  const showEditButton = isAdmin; // Show edit for admins and creator
  const showJoinButton = !hasJoined && !isAdmin; // Show join only if not joined and not admin
  const showLeaveButton = hasJoined && !isCreator; // Show leave if joined but not creator
  const showManageRequestsButton = isAdmin && isPrivate; // Show manage requests for admins of private groups

  return (
    <View style={styles.actionBar}>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.shareButton} onPress={onShare}>
          <Share2 size={20} color={Colors.gray700} />
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>

        {/* Join Button - Only for non-members who are not admins */}
        {showJoinButton && (
          <TouchableOpacity
            style={[
              styles.joinButton,
              requestSent && styles.requestSentButton,
              isJoining && styles.disabledButton,
            ]}
            onPress={onJoin}
            disabled={requestSent || isJoining}
          >
            {isJoining ? (
              <>
                <ActivityIndicator size="small" color={Colors.white} />
                <Text style={[styles.joinButtonText, { marginLeft: 8 }]}>
                  Joining...
                </Text>
              </>
            ) : (
              <Text style={styles.joinButtonText}>
                {requestSent ? "Request Sent ✓" : "Join Group"}
              </Text>
            )}
          </TouchableOpacity>
        )}

        {/* Leave Button - For members who are not creators */}
        {showLeaveButton && (
          <TouchableOpacity
            style={[
              styles.leaveButton,
              isLeaving && styles.disabledButton,
            ]}
            onPress={onLeave}
            disabled={isLeaving}
          >
            {isLeaving ? (
              <>
                <ActivityIndicator size="small" color={Colors.white} />
                <Text style={[styles.leaveButtonText, { marginLeft: 8 }]}>
                  Leaving...
                </Text>
              </>
            ) : (
              <Text style={styles.leaveButtonText}>Leave Group</Text>
            )}
          </TouchableOpacity>
        )}

        {/* Edit Button - For admins and creator */}
        {showEditButton && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={onEdit}
          >
            <Text style={styles.editButtonText}>Edit Group</Text>
          </TouchableOpacity>
        )}

        {/* Manage Requests Button - For admins of private groups */}
        {showManageRequestsButton && (
          <TouchableOpacity
            style={styles.manageButton}
            onPress={onManageRequests}
          >
            <Text style={styles.manageButtonText}>Manage Requests</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    flexDirection: "row",
  },
  joinedButton: {
    backgroundColor: Colors.emerald,
  },
  requestSentButton: {
    backgroundColor: Colors.amber,
  },
  joinButtonText: {
    color: Colors.white,
    fontFamily: "Sora-Bold",
    fontSize: 16,
  },
  leaveButton: {
    flex: 1,
    backgroundColor: "#ef4444",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  leaveButtonText: {
    color: Colors.white,
    fontFamily: "Sora-Bold",
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.7,
  },
  editButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  editButtonText: {
    color: Colors.white,
    fontFamily: "Sora-Bold",
    fontSize: 16,
  },
  manageButton: {
    backgroundColor: Colors.amber,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  manageButtonText: {
    color: Colors.white,
    fontFamily: "Sora-SemiBold",
    fontSize: 14,
  },
});
