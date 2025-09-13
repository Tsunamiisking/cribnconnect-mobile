import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import BackHeader from "@/components/BackHeader";
import { ChevronRight } from "lucide-react-native";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";

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
    route: "/(notifications)/index",
    description: "Manage your notification preferences",
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
    route: "/(support)/index",
    description: "Scan to join or check-in to events",
  },
];

const SettingsScreen = () => {
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
              <Text style={styles.optionText}>{option.name}</Text>
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