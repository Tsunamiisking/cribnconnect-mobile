import { Colors } from "@/constants/Colors";
import { Users } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

export default function LinkupInfo({ linkup, isCreator = false, isAdmin = false }) {
  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{linkup.interest}</Text>
        </View>

        {/* Role Badge - Show if user is creator or admin */}
        {(isCreator || isAdmin) && (
          <View style={[styles.roleBadge, isCreator ? styles.creatorBadge : styles.adminBadge]}>
            <Text style={styles.roleBadgeText}>
              {isCreator ? "👑 Creator" : "⭐ Admin"}
            </Text>
          </View>
        )}
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
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 24,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    flexWrap: "wrap",
    gap: 8,
  },
  typeBadge: {
    backgroundColor: Colors.blue50,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 50,
  },
  typeText: {
    color: Colors.primary,
    fontSize: 14,
    fontFamily: "Sora-Medium",
  },
  roleBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.5,
    elevation: 2,
  },
  creatorBadge: {
    backgroundColor: Colors.emerald,
  },
  adminBadge: {
    backgroundColor: "#f59e0b",
  },
  roleBadgeText: {
    color: Colors.white,
    fontSize: 13,
    fontFamily: "Sora-Bold",
    letterSpacing: 0.3,
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
});
