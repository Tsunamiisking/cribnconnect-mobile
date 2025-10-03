import useHostingStore from "@/stores/hostingStore";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function EventSpecialPerks({ styles }) {
  const { eventData, updateEventData, updateEventNestedData } = useHostingStore();
  const [selectedPerks, setSelectedPerks] = useState(eventData.specialPerks || []);

  // Update store when selectedPerks changes
  useEffect(() => {
    updateEventData('specialPerks', selectedPerks);
  }, [selectedPerks]);

  const handleMaxCapacityChange = (text) => {
    // Only allow numbers
    const numericValue = text.replace(/[^0-9]/g, '');
    updateEventNestedData('ticket', 'capacity', numericValue);
  };

  const entertainmentPerks = [
    { name: "Live Music", icon: "🎵" },
    { name: "DJ Performance", icon: "🎧" },
    { name: "Live Band", icon: "🎸" },
    { name: "Photography", icon: "📸" },
    { name: "Video Recording", icon: "🎥" },
    { name: "Photo Booth", icon: "📷" },
    { name: "Dancing", icon: "💃" },
    { name: "Karaoke", icon: "🎤" },
  ];

  const foodAndDrinkPerks = [
    { name: "Free Food", icon: "🍽️" },
    { name: "Free Drinks", icon: "🥤" },
    { name: "Alcohol Available", icon: "🍷" },
    { name: "Catering Service", icon: "🍴" },
    { name: "Welcome Drinks", icon: "🥂" },
    { name: "Snacks Included", icon: "🍿" },
    { name: "BBQ/Grill", icon: "🔥" },
    { name: "Buffet Style", icon: "🍱" },
  ];

  const experiencePerks = [
    { name: "Networking", icon: "🤝" },
    { name: "Workshop/Training", icon: "📚" },
    { name: "Guest Speaker", icon: "🎙️" },
    { name: "Prize/Giveaways", icon: "🎁" },
    { name: "Certificates", icon: "🏆" },
    { name: "Goodie Bag", icon: "🛍️" },
    { name: "VIP Access", icon: "⭐" },
    { name: "Early Bird Benefits", icon: "🐦" },
  ];

  const facilitiesPerks = [
    { name: "Free Parking", icon: "🅿️" },
    { name: "Air Conditioning", icon: "❄️" },
    { name: "WiFi Access", icon: "📶" },
    { name: "Seating Provided", icon: "🪑" },
    { name: "Restroom Access", icon: "🚻" },
    { name: "Coat Check", icon: "🧥" },
    { name: "Security", icon: "🛡️" },
    { name: "Accessibility", icon: "♿" },
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
                    <Text style={{ fontSize: 32 }}>{perk.icon}</Text>
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
                    <Text style={{ fontSize: 32 }}>{perk.icon}</Text>
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
                    <Text style={{ fontSize: 32 }}>{perk.icon}</Text>
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
                    <Text style={{ fontSize: 32 }}>{perk.icon}</Text>
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