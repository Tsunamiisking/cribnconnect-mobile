import { Colors } from "@/constants/Colors";
import useHostingStore from "@/stores/hostingStore";
import {
  Camera,
  Car,
  Coffee,
  Gift,
  Music,
  Sparkles,
  Star,
  Users,
  Utensils,
  Wifi,
  Wine,
  Zap,
  Mic,
  Cookie,
  Beer,
  Moon,
  Share,
  Crown,
  Bus,
  Wind,
  Heart,
  Sofa,
  Shield,
  Badge,
  Lock,
  Gamepad
} from "lucide-react-native";
import React from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

const EventSpecialPerks = ({ styles }) => {
  const { eventData, updateEventData, nextStep, previousStep } =
    useHostingStore();

  const perkCategories = {
    Entertainment: [
      { id: "live_music", name: "Live Music", icon: Music },
      { id: "live_dj", name: "Live DJ / Set", icon: Zap },
      { id: "mc_host", name: "MC / Host", icon: Mic },
      { id: "photo_booth", name: "Photo Booth / Content Setup", icon: Camera },
      { id: "games", name: "Games & Fun Activities", icon: Gamepad },
      { id: "performances", name: "Guest Performances", icon: Star },
    ],

    "Food & Drink": [
      { id: "catering", name: "Food Catering", icon: Utensils },
      { id: "open_bar", name: "Open Bar", icon: Wine },
      { id: "snacks_pastries", name: "Snacks & Small Chops", icon: Cookie },
      { id: "welcome_drinks", name: "Welcome Drinks", icon: Gift },
      { id: "bottle_service", name: "VIP / Bottle Service", icon: Beer },
    ],

    Experience: [
      { id: "vip_access", name: "VIP Access", icon: Crown },
      { id: "afterparty", name: "Afterparty Access", icon: Moon },
      { id: "meet_greet", name: "Meet & Greet", icon: Users },
      {
        id: "exclusive_content",
        name: "Exclusive Photos / Recap",
        icon: Sparkles,
      },
      { id: "networking", name: "Networking Sessions", icon: Share },
    ],

    "Comfort & Convenience": [
      { id: "wifi", name: "Free WiFi", icon: Wifi },
      { id: "parking", name: "Parking Available", icon: Car },
      { id: "shuttle", name: "Shuttle/Transport to Venue", icon: Bus },
      { id: "ac", name: "AC / Climate Control", icon: Wind },
      { id: "first_aid", name: "On-site First Aid / Medical", icon: Heart },
      { id: "rest_areas", name: "Rest Area / Lounge Space", icon: Sofa },
    ],

    "Security & Logistics": [
      { id: "security_team", name: "Security Team Present", icon: Shield },
      { id: "id_check", name: "ID / Verification at Gate", icon: Badge },
      { id: "bag_check", name: "Bag Check & Controlled Entry", icon: Lock },
      { id: "crowd_control", name: "Hostess & Crowd Management", icon: Users },
    ],
  };

  const togglePerk = (perkId) => {
    const currentPerks = eventData.eventSpecialPerks || [];
    const updatedPerks = currentPerks.includes(perkId)
      ? currentPerks.filter((id) => id !== perkId)
      : [...currentPerks, perkId];

    updateEventData("eventSpecialPerks", updatedPerks);
  };

  const handleCapacityChange = (value) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      updateEventData("capacity", numValue);
    } else if (value === "") {
      updateEventData("capacity", "");
    }
  };

  const handleNext = () => {
    if (!eventData.capacity || eventData.capacity === "") {
      Alert.alert("Required Field", "Please enter the event capacity");
      return;
    }
    nextStep();
  };

  const renderPerkCategory = (categoryName, perks) => (
    <View key={categoryName} style={{ marginVertical: 10 }}>
      <Text style={[styles.label, { marginBottom: 12 }]}>{categoryName}</Text>
      <View style={styles.verticalOptions}>
        {perks.map((perk) => {
          const isSelected = eventData.eventSpecialPerks?.includes(perk.id);
          const IconComponent = perk.icon;

          return (
            <TouchableOpacity
              key={perk.id}
              onPress={() => togglePerk(perk.id)}
              style={[
                styles.typeOption,
                isSelected && styles.selectedTypeOption,
              ]}
            >
              <View style={styles.typeOptionRow}>
                <IconComponent
                  size={20}
                  color={isSelected ? Colors.primary : Colors.gray600}
                />
                <Text
                  style={[
                    styles.labelText,
                    isSelected && styles.selectedTypeOptionText,
                  ]}
                >
                  {perk.name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Special Perks & Capacity</Text>
      <Text style={styles.sectionSubtitle}>
        Add special perks to make your event more attractive and set the maximum
        capacity
      </Text>

      {/* Capacity Input */}
      <View style={{ marginBottom: 32 }}>
        <Text style={styles.label}>Event Capacity *</Text>
        <TextInput
          style={styles.input}
          placeholder="Maximum number of attendees"
          value={eventData.capacity?.toString() || ""}
          onChangeText={handleCapacityChange}
          keyboardType="numeric"
          maxLength={5}
        />
      </View>

      {/* Special Perks */}
      <Text style={styles.label}>Special Perks (Optional)</Text>
      <Text style={styles.typeOptionDescription}>
        Select perks that will be available at your event
      </Text>

      {Object.entries(perkCategories).map(([categoryName, perks]) =>
        renderPerkCategory(categoryName, perks)
      )}

      {/* Selected Perks Summary */}
      {eventData.eventSpecialPerks &&
        eventData.eventSpecialPerks.length > 0 && (
          <View
            style={[
              styles.typeOption,
              { marginTop: 16, backgroundColor: Colors.blue50 },
            ]}
          >
            <Text
              style={[
                styles.labelText,
                { color: Colors.primary, marginBottom: 8 },
              ]}
            >
              Selected Perks ({eventData.eventSpecialPerks.length})
            </Text>
            <Text style={styles.typeOptionDescription}>
              {eventData.eventSpecialPerks
                .map((perkId) => {
                  const allPerks = Object.values(perkCategories).flat();
                  const perk = allPerks.find((p) => p.id === perkId);
                  return perk?.name;
                })
                .filter(Boolean)
                .join(", ")}
            </Text>
          </View>
        )}
    </View>
  );
};

export default EventSpecialPerks;
