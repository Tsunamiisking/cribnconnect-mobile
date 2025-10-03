import useHostingStore from "@/stores/hostingStore";
import {
    Accessibility,
    Armchair,
    Bird,
    BookOpen,
    Camera,
    CameraIcon,
    CupSoda,
    Flame,
    Gift,
    GlassWater,
    Guitar,
    HandPlatter,
    Handshake,
    Headphones,
    Mic,
    Mic2,
    Music,
    ParkingCircle,
    Popcorn,
    Shield,
    Shirt,
    ShoppingBag,
    Snowflake,
    Soup,
    Star,
    Toilet,
    Trophy,
    Utensils,
    Video,
    Wifi,
    Wine
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function EventSpecialPerks({ styles }) {
  const { eventData, updateEventData, updateEventNestedData } =
    useHostingStore();
  const [selectedPerks, setSelectedPerks] = useState(
    eventData.specialPerks || []
  );

  // Update store when selectedPerks changes
  useEffect(() => {
    updateEventData("specialPerks", selectedPerks);
  }, [selectedPerks]);

  const handleMaxCapacityChange = (text) => {
    // Only allow numbers
    const numericValue = text.replace(/[^0-9]/g, "");
    updateEventNestedData("ticket", "capacity", numericValue);
  };

  const entertainmentPerks = [
    { name: "Live Music", icon: Music },
    { name: "DJ Performance", icon: Headphones },
    { name: "Live Band", icon: Guitar },
    { name: "Photography", icon: Camera },
    { name: "Video Recording", icon: Video },
    { name: "Photo Booth", icon: CameraIcon },
    { name: "Dancing", icon: Music }, // closest match
    { name: "Karaoke", icon: Mic },
  ];

  const foodAndDrinkPerks = [
    { name: "Free Food", icon: Utensils },
    { name: "Free Drinks", icon: CupSoda },
    { name: "Alcohol Available", icon: Wine },
    { name: "Catering Service", icon: Soup },
    { name: "Welcome Drinks", icon: GlassWater },
    { name: "Snacks Included", icon: Popcorn },
    { name: "BBQ/Grill", icon: Flame },
    { name: "Buffet Style", icon: HandPlatter },
  ];

  const experiencePerks = [
    { name: "Networking", icon: Handshake },
    { name: "Workshop/Training", icon: BookOpen },
    { name: "Guest Speaker", icon: Mic2 },
    { name: "Prize/Giveaways", icon: Gift },
    { name: "Certificates", icon: Trophy },
    { name: "Goodie Bag", icon: ShoppingBag },
    { name: "VIP Access", icon: Star },
    { name: "Early Bird Benefits", icon: Bird },
  ];

  const facilitiesPerks = [
    { name: "Free Parking", icon: ParkingCircle },
    { name: "Air Conditioning", icon: Snowflake },
    { name: "WiFi Access", icon: Wifi },
    { name: "Seating Provided", icon: Armchair },
    { name: "Restroom Access", icon: Toilet },
    { name: "Coat Check", icon: Shirt },
    { name: "Security", icon: Shield },
    { name: "Accessibility", icon: Accessibility },
  ];

  // Helper to split array into rows of 2
  function toRows(arr) {
    const rows = [];
    for (let i = 0; i < arr.length; i += 2) {
      rows.push(arr.slice(i, i + 2));
    }
    return rows;
  }

  const handleSelect = (name) => {
    setSelectedPerks((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>
        What special perks does your event offer?
      </Text>
      <Text style={styles.sectionSubtitle}>
        Select all perks and features that make your event special
      </Text>

      {/* Maximum Capacity */}
      <View style={{ marginBottom: 24 }}>
        <Text style={styles.label}>Maximum Capacity</Text>
        <Text style={styles.typeOptionDescription}>
          How many people can attend your event?
        </Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 50, 100, 500"
          value={eventData.ticket.capacity || ""}
          onChangeText={handleMaxCapacityChange}
          keyboardType="numeric"
        />
      </View>

      {/* Entertainment Perks */}
      <Text style={[styles.label, { marginTop: 12, marginBottom: 8 }]}>
        Entertainment & Activities
      </Text>
      <View style={{ marginBottom: 8 }}>
        {toRows(entertainmentPerks).map((row, idx) => (
          <View
            key={idx}
            style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}
          >
            {row.map((perk) => {
              const selected = selectedPerks.includes(perk.name);
              const IconComponent = perk.icon;
              return (
                <TouchableOpacity
                  key={perk.name}
                  style={[
                    styles.typeOption,
                    selected && styles.selectedTypeOption,
                    { flex: 1, alignItems: "center", justifyContent: "center" },
                  ]}
                  activeOpacity={0.85}
                  onPress={() => handleSelect(perk.name)}
                >
                  <View style={{ marginBottom: 8 }}>
                    <IconComponent size={20} color="#274046" />
                  </View>
                  <Text style={styles.labelText}>{perk.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {/* Food & Drink Perks */}
      <Text style={[styles.label, { marginTop: 12, marginBottom: 8 }]}>
        Food & Beverages
      </Text>
      <View style={{ marginBottom: 8 }}>
        {toRows(foodAndDrinkPerks).map((row, idx) => (
          <View
            key={idx}
            style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}
          >
            {row.map((perk) => {
              const selected = selectedPerks.includes(perk.name);
              const IconComponent = perk.icon;
              return (
                <TouchableOpacity
                  key={perk.name}
                  style={[
                    styles.typeOption,
                    selected && styles.selectedTypeOption,
                    { flex: 1, alignItems: "center", justifyContent: "center" },
                  ]}
                  activeOpacity={0.85}
                  onPress={() => handleSelect(perk.name)}
                >
                  <View style={{ marginBottom: 8 }}>
                    <IconComponent size={20} color="#274046" />
                  </View>
                  <Text style={styles.labelText}>{perk.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {/* Experience Perks */}
      <Text style={[styles.label, { marginTop: 12, marginBottom: 8 }]}>
        Experience & Networking
      </Text>
      <View style={{ marginBottom: 8 }}>
        {toRows(experiencePerks).map((row, idx) => (
          <View
            key={idx}
            style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}
          >
            {row.map((perk) => {
              const selected = selectedPerks.includes(perk.name);
              const IconComponent = perk.icon;
              return (
                <TouchableOpacity
                  key={perk.name}
                  style={[
                    styles.typeOption,
                    selected && styles.selectedTypeOption,
                    { flex: 1, alignItems: "center", justifyContent: "center" },
                  ]}
                  activeOpacity={0.85}
                  onPress={() => handleSelect(perk.name)}
                >
                  <View style={{ marginBottom: 8 }}>
                    <IconComponent size={20} color="#274046" />
                  </View>
                  <Text style={styles.labelText}>{perk.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {/* Facilities Perks */}
      <Text style={[styles.label, { marginTop: 12, marginBottom: 8 }]}>
        Facilities & Services
      </Text>
      <View style={{ marginBottom: 8 }}>
        {toRows(facilitiesPerks).map((row, idx) => (
          <View
            key={idx}
            style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}
          >
            {row.map((perk) => {
              const selected = selectedPerks.includes(perk.name);
              const IconComponent = perk.icon;
              return (
                <TouchableOpacity
                  key={perk.name}
                  style={[
                    styles.typeOption,
                    selected && styles.selectedTypeOption,
                    { flex: 1, alignItems: "center", justifyContent: "center" },
                  ]}
                  activeOpacity={0.85}
                  onPress={() => handleSelect(perk.name)}
                >
                  <View style={{ marginBottom: 8 }}>
                    <IconComponent size={20} color="#274046" />
                  </View>
                  <Text style={styles.labelText}>{perk.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}
