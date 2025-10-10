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
      <BackHeader title="Host" showUser={false} />
      
      {/* Main Content Container */}
      <View style={styles.mainContainer}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Host on CribnConnect</Text>
          <Text style={styles.subtitle}>Choose what you want to host</Text>
          
          {/* Host Dashboard Bar */}
          <TouchableOpacity
            style={styles.dashboardBar}
            onPress={handleViewHostedItems}
            activeOpacity={0.7}
          >
            <View style={styles.dashboardContent}>
              <View style={styles.dashboardIconContainer}>
                <List size={16} color={Colors.primary} />
              </View>
              <Text style={styles.dashboardText}>Host Dashboard</Text>
            </View>
            {drafts.length > 0 && (
              <View style={styles.dashboardBadge}>
                <Text style={styles.dashboardBadgeText}>{drafts.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Hosting Options */}
        <View style={styles.optionsContainer}>
          <Text style={styles.optionsTitle}>Start Hosting</Text>
          
          <TouchableOpacity
            style={[styles.optionCard, styles.apartmentCard]}
            activeOpacity={0.85}
            onPress={handleNewApartment}
          >
            <View style={styles.optionIconContainer}>
              <Building2 size={24} color={Colors.primary} />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>List an Apartment</Text>
              <Text style={styles.optionDesc}>Share your space for short or long-term stays</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionCard, styles.eventCard]}
            activeOpacity={0.85}
            onPress={handleNewEvent}
          >
            <View style={styles.optionIconContainer}>
              <Tickets size={24} color={Colors.emerald} />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Host an Event</Text>
              <Text style={styles.optionDesc}>Create memorable experiences and bring people together</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerSection: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 28,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  title: {
    color: Colors.primary,
    fontSize: 28,
    fontWeight: "700",
    fontFamily: "Urbanist-Bold",
    textAlign: "left",
    marginBottom: 6,
  },
  subtitle: {
    color: Colors.gray600,
    fontSize: 15,
    fontFamily: "Sora-Regular",
    textAlign: "left",
    marginBottom: 20,
    lineHeight: 22,
  },
  dashboardBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.blue50,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.primary + '12',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  dashboardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dashboardIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  dashboardText: {
    fontSize: 16,
    fontFamily: 'Sora-SemiBold',
    color: Colors.primary,
    letterSpacing: -0.2,
  },
  dashboardBadge: {
    backgroundColor: Colors.error,
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  dashboardBadgeText: {
    color: Colors.white,
    fontSize: 11,
    fontFamily: 'Sora-Bold',
  },
  optionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    backgroundColor: Colors.white,
  },
  optionsTitle: {
    fontSize: 20,
    fontFamily: 'Sora-Bold',
    color: Colors.primary,
    marginBottom: 24,
    letterSpacing: -0.3,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 24,
    marginBottom: 20,
    shadowColor: Colors.gray400,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  apartmentCard: {
    backgroundColor: Colors.white,
    borderColor: Colors.gray200,
    borderWidth: 1,
  },
  eventCard: {
    backgroundColor: Colors.white,
    borderColor: Colors.gray200,
    borderWidth: 1,
  },
  optionIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.blue50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 1,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: "Sora-SemiBold",
    fontSize: 18,
    color: Colors.primary,
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  optionDesc: {
    fontFamily: "Sora-Regular",
    fontSize: 14,
    color: Colors.gray600,
    lineHeight: 21,
    letterSpacing: -0.1,
  },
});
