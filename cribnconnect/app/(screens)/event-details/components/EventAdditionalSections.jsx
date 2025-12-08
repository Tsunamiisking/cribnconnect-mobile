import { Colors } from "@/constants/Colors";
import { Star } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const EventAdditionalSections = ({ event, handleContactOrganizer }) => {
  // Get host information
  const host = event?.host;
  const hostName =
    host?.displayName ||
    `${host?.firstName || ""} ${host?.lastName || ""}`.trim() ||
    "Event Organizer";
  const hostInitials = hostName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
  const hostRating = host?.rating || 0;
  const hostEmail = host?.email || "";

  return (
    <>
      {/* Safety Tips / House Rules */}
      {(event.eventSafetyTips || event.safetyTips) &&
        (event.eventSafetyTips || event.safetyTips).length > 0 && (
          <View style={styles.rulesSection}>
            <Text style={styles.sectionTitle}>Safety Guidelines</Text>
            {(event.eventSafetyTips || event.safetyTips).map((tip, index) => (
              <Text key={index} style={styles.rulesText}>
                • {tip}
              </Text>
            ))}
          </View>
        )}

      {/* Ticket Policies */}
      {event.ticketPolicies && (
        <View style={styles.policiesSection}>
          <Text style={styles.sectionTitle}>Ticket Policies</Text>
          <View style={styles.policiesList}>
            {event.ticketPolicies.refundable && (
              <View style={styles.policyItem}>
                <Text style={styles.policyIcon}>✓</Text>
                <Text style={styles.policyText}>Refundable tickets</Text>
              </View>
            )}
            {event.ticketPolicies.upgradable && (
              <View style={styles.policyItem}>
                <Text style={styles.policyIcon}>✓</Text>
                <Text style={styles.policyText}>Upgradable tickets</Text>
              </View>
            )}
            {event.ticketPolicies.transferable && (
              <View style={styles.policyItem}>
                <Text style={styles.policyIcon}>✓</Text>
                <Text style={styles.policyText}>Transferable tickets</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Organizer Info */}
      <View style={styles.organizerSection}>
        <Text style={styles.sectionTitle}>Event Organizer</Text>
        <TouchableOpacity
          style={styles.organizerInfo}
          onPress={handleContactOrganizer}
        >
          <View style={styles.organizerAvatar}>
            <Text style={styles.organizerInitial}>{hostInitials}</Text>
          </View>
          <View style={styles.organizerDetails}>
            <Text style={styles.organizerName}>{hostName}</Text>
            <Text style={styles.organizerContact}>
              {hostEmail || "Tap to contact"}
            </Text>
            {
              <View style={styles.organizerRating}>
                <Star size={14} color={Colors.amber} fill={Colors.amber} />
                <Text style={styles.organizerRatingText}>
                  {hostRating > 0
                    ? `${hostRating.toFixed(1)} rating`
                    : "(No ratings yet)"}
                </Text>
              </View>
            }
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  rulesSection: {
    marginBottom: 24,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Sora-SemiBold",
    color: Colors.black,
    marginBottom: 12,
  },
  rulesText: {
    fontSize: 16,
    fontFamily: "Sora-Regular",
    color: Colors.gray700,
    lineHeight: 24,
  },
  policiesSection: {
    marginBottom: 24,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  policiesList: {
    gap: 8,
  },
  policyItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  policyIcon: {
    fontSize: 16,
    color: Colors.primary,
    fontFamily: "Sora-Bold",
  },
  policyText: {
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.gray700,
  },
  organizerSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  organizerInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray50,
    padding: 16,
    borderRadius: 12,
    gap: 16,
  },
  organizerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  organizerInitial: {
    fontSize: 20,
    fontFamily: "Sora-Bold",
    color: Colors.white,
  },
  organizerDetails: {
    flex: 1,
  },
  organizerName: {
    fontSize: 18,
    fontFamily: "Sora-SemiBold",
    color: Colors.black,
    marginBottom: 4,
  },
  organizerContact: {
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
    marginBottom: 4,
  },
  organizerRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  organizerRatingText: {
    fontSize: 12,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
  },
});

export default EventAdditionalSections;
