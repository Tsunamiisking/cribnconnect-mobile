import BackHeader from "@/components/BackHeader";
import { Colors } from "@/constants/Colors";
import useHostingStore from "@/stores/hostingStore";
import { router } from "expo-router";
import { Building2, List, Tickets } from "lucide-react-native";
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
        <TouchableOpacity
          style={[styles.optionCard, styles.dashboardCard]}
          activeOpacity={0.85}
          onPress={handleViewHostedItems}
        >
          <View className="mr-4">
            <List size={24} color={Colors.primary} />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Host Dashboard</Text>
            <Text style={styles.optionDesc}>
              Manage your listings, bookings, and drafts
            </Text>
          </View>
          {drafts.length > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>{drafts.length}</Text>
            </View>
          )}
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
  dashboardCard: {
    borderLeftWidth: 6,
    borderLeftColor: Colors.primary,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.error,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: 'Sora-SemiBold',
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
