import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Tickets, Building2 } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackHeader from "@/components/BackHeader";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function HostTypeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <BackHeader title="Host" />
      <View style={styles.headerSection}>
        <Text style={styles.title}>Host on CribnConnect</Text>
        <Text style={styles.subtitle}>Choose what you want to host</Text>
      </View>

      <View style={styles.optionsContainer}>
        <View className="items-end mr-6 mb-2 ">
          <Text className="text-[#007AFF] text-lg">Go to drafts?</Text>
        </View>
        <TouchableOpacity
          style={[styles.optionCard]}
          activeOpacity={0.85}
          onPress={() => router.push("/(hosting)/add-apartment")}
        >
          <View className="mr-4">
            <Building2 />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Apartment</Text>
            <Text style={styles.optionDesc}>List a place for rent or stay</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionCard]}
          activeOpacity={0.85}
          onPress={() => router.push("/(hosting)/add-event")}
        >
          <View className="mr-4">
            <Tickets />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Event</Text>
            <Text style={styles.optionDesc}>
              Host a party, meetup, or gathering
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerSection: {
    marginTop: 24,
    marginBottom: 16,
    marginLeft: 16,
  },
  title: {
    color: Colors.primary,
    fontSize: 32,
    fontWeight: "700",
    fontFamily: "Urbanist-Bold",
    textAlign: "left",
  },
  subtitle: {
    color: Colors.darkgray,
    fontSize: 16,
    fontFamily: "Sora-Regular",
    fontWeight: "500",
    marginTop: 4,
    textAlign: "left",
  },
  optionsContainer: {
    flex: 1,
    justifyContent: "center",
    // marginTop: 60,
    gap: 18,
    marginHorizontal: 12,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  apartmentCard: {
    borderLeftWidth: 6,
    borderLeftColor: Colors.primary,
  },
  eventCard: {
    borderLeftWidth: 6,
    borderLeftColor: Colors.emerald,
  },
  optionIcon: {
    fontSize: 32,
    marginRight: 18,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: "Sora-SemiBold",
    fontSize: 18,
    color: Colors.primary,
    marginBottom: 2,
  },
  optionDesc: {
    fontFamily: "Sora-Regular",
    fontSize: 13,
    color: Colors.darkgray,
  },
});
