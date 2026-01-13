import BackHeader from "@/components/BackHeader";
import NotificationBadge from "@/components/NotificationBadge";
import { Colors } from "@/constants/Colors";
import { router, useFocusEffect } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const options = [
  {
    name: "Host",
    route: "/(hosting)",
    description: "List your apartment or create events",
  },
  {
    name: "Profile",
    route: "/edit-profile",
    description: "View and edit your profile information",
  },
  {
    name: "Notifications",
    route: "/(screens)/notification",
    description: "Manage your notification preferences",
    showBadge: true,
  },
    {
    name: "My Tickets",
    route: "/(screens)/my-tickets",
    description: "Manage your tickets",
    showBadge: true,
  },
  {
    name: "Verification",
    route: "/(verification)/index",
    description: "Verify your account for more features",
  },
  {
    name: "Contact Support",
    route: "/(support)/index",
    description: "Get help or contact our support team",
  },
  {
    name: "Scan Event QR Code",
    route: "/(screens)/qr-scan",
    description: "Scan to join or check-in to events",
  },
];

const SettingsScreen = () => {
  const [badgeRefresh, setBadgeRefresh] = useState(0);

  // Refresh badge when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setBadgeRefresh(prev => prev + 1);
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <BackHeader title="Settings" showUser={false} />
      <View style={styles.container}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={() => router.push(option.route)}
            activeOpacity={0.8}
          >
            <View style={styles.textContainer}>
              <View style={styles.titleRow}>
                <Text style={styles.optionText}>{option.name}</Text>
                {option.showBadge && (
                  <NotificationBadge 
                    size="small" 
                    style={styles.notificationBadge}
                    refresh={badgeRefresh}
                  />
                )}
              </View>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </View>
            <ChevronRight color={Colors.primary} />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    // paddingTop: 8,
    paddingHorizontal: 16,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: "white",
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  notificationBadge: {
    position: "relative",
    top: 0,
    right: 0,
    marginLeft: 8,
  },
  optionText: {
    fontSize: 16,
    fontFamily: "Sora-SemiBold",
    color: Colors.primary,
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 13,
    color: Colors.gray500,
    fontFamily: "Sora-Regular",
    lineHeight: 18,
  },
});