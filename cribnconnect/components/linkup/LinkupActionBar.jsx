import { Colors } from "@/constants/Colors";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Share2 } from "lucide-react-native";

export default function LinkupActionBar({
  hasJoined,
  requestSent,
  onJoin,
  onShare,
}) {
  return (
    <View style={styles.actionBar}>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.shareButton} onPress={onShare}>
          <Share2 size={20} color={Colors.gray700} />
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.joinButton,
            hasJoined && styles.joinedButton,
            requestSent && styles.requestSentButton,
          ]}
          onPress={onJoin}
          disabled={requestSent}
        >
          <Text style={styles.joinButtonText}>
            {hasJoined
              ? "Joined ✓"
              : requestSent
                ? "Request Sent ✓"
                : "Join Group"}
          </Text>
        </TouchableOpacity>
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
});
