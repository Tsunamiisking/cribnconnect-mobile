import BackHeader from "@/components/BackHeader";
import { Colors } from "@/constants/Colors";
import useHostingStore from "@/stores/hostingStore";
import { router } from "expo-router";
import { Building2, FileText, List, Tickets } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HostTypeScreen() {
  const { drafts, setHostingType } = useHostingStore();

  const handleNewApartment = () => {
    setHostingType('apartment');
    router.push("/(hosting)/add-apartment");
  };

  const handleNewEvent = () => {
    setHostingType('event');
    router.push("/(hosting)/add-event");
  };

  const handleViewDrafts = () => {
    // TODO: Create a drafts screen
    router.push("/(hosting)/drafts");
  };

  const handleViewHostedItems = () => {
    router.push("/(hosting)/my-hosted-items");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* <StatusBar barStyle="dark-content" backgroundColor="white" /> */}
      <BackHeader title="Host" showUser={true} />
      <View style={styles.headerSection}>
        <Text style={styles.title}>Host on CribnConnect</Text>
        <Text style={styles.subtitle}>Choose what you want to host</Text>
      </View>

      <View style={styles.optionsContainer}>
        <View style={{ alignItems: "flex-end", width: "100%" }}>
          {drafts.length > 0 && (
            <TouchableOpacity
              style={styles.draftsContainer}
              onPress={handleViewDrafts}
            >
              <FileText size={20} color={Colors.primary} />
              <Text style={styles.draftsText}>
                {drafts.length} Draft{drafts.length !== 1 ? "s" : ""} saved
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.optionCard, styles.managementCard]}
          activeOpacity={0.85}
          onPress={handleViewHostedItems}
        >
          <View className="mr-4">
            <List size={24} color={Colors.success} />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>My Hosted Items</Text>
            <Text style={styles.optionDesc}>
              View and manage your apartments & events
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionCard]}
          activeOpacity={0.85}
          onPress={handleNewApartment}
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
          onPress={handleNewEvent}
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
  managementCard: {
    borderLeftWidth: 6,
    borderLeftColor: Colors.success,
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
  draftsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: Colors.cardBackground,
    backgroundColor: Colors.blue50,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    maxWidth: 150,
  },
  draftsText: {
    marginLeft: 8,
    color: Colors.primary,
    fontFamily: "Sora-Medium",
    fontSize: 14,
  },
});
