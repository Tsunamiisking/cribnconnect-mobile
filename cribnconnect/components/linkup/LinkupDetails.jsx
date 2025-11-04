import { Colors } from "@/constants/Colors";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function LinkupDetails({
  linkup,
  onViewMembers,
  onContactHost,
}) {
  return (
    <>
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
            <Text style={styles.detailValue}>{linkup.meetingFrequency}</Text>
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

      {/* Interests Section */}
      {linkup.allInterests && linkup.allInterests.length > 0 && (
        <View style={styles.interestsSection}>
          <Text style={styles.sectionTitle}>Group Interests</Text>
          <View style={styles.interestsTags}>
            {linkup.allInterests.map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Members Section */}
      <View style={styles.membersSection}>
        <View style={styles.membersHeader}>
          <Text style={styles.sectionTitle}>Group Members</Text>
          <TouchableOpacity onPress={onViewMembers}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.memberPreview}>
          <Text style={styles.memberCount}>
            {linkup.groupSize.current} current members,{" "}
            {linkup.groupSize.max - linkup.groupSize.current} spots available
          </Text>
        </View>
      </View>

      {/* Contact Section */}
      <View style={styles.contactSection}>
        <Text style={styles.sectionTitle}>Contact Host</Text>
        <TouchableOpacity style={styles.contactButton} onPress={onContactHost}>
          <View>
            <Text style={styles.contactName}>{linkup.hostName}</Text>
            <Text style={styles.contactInfo}>
              Message via {linkup.contactMethod}
            </Text>
          </View>
          <Text style={styles.contactArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
});
