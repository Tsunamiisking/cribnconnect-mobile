import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import BackHeader from "@/components/BackHeader";
import { ChevronRight } from "lucide-react-native";

const SettingsScreen = () => {
  const options = [
    { name: "Host", route: "/(hosting)/index" },
    { name: "Profile", route: "/(profile)/index" },
    { name: "Notifications", route: "/(notifications)/index" },
    { name: "Contact Support", route: "/(support)/index" },
    // {name: "Verification", route: "/(verification)/index"},
  ];
  return (
    <SafeAreaView className="flex-1 bg-white">
      <BackHeader title="Settings" showUser={false} />
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.option}
          onPress={() => router.push(option.route)}
        >
          <Text
            style={styles.optionText}
            onPress={() => router.push(option.route)}
          >
            {option.name}
          </Text>
          <ChevronRight />
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  option: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    // borderBottomWidth: 1,
    // borderBottomColor: "#eee",
  },
  optionText: {
    padding: 16,
    fontSize: 16,
    fontFamily: "Sora-SemiBold",
  },
});
