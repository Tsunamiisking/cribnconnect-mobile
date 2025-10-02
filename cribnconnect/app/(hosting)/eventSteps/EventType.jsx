import { View, Text, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import useHostingStore from "@/stores/hostingStore";

export default function EventType({ styles }) {
  const { eventData, updateEventData } = useHostingStore();
  const [selected, setSelected] = useState(eventData.eventType ? [eventData.eventType] : []); // store selected subtypes in an array

  // Update store when selection changes
  useEffect(() => {
    if (selected.length > 0) {
      updateEventData('eventType', selected[0]); // Take the first selected type
    }
  }, [selected]);

  // Initialize from store data
  useEffect(() => {
    if (eventData.eventType && !selected.includes(eventData.eventType)) {
      setSelected([eventData.eventType]);
    }
  }, []);

  const eventCategories = {
    "Entertainment & Nightlife": [
      "Concerts & Live Music",
      "Club Night / Rave",
      "House Party",
      "Karaoke Night",
      "Comedy Show",
      "Open Mic",
    ],
    "Education & Professional": [
      "Tech Conference",
      "Networking Event",
      "Workshops & Training",
      "Startup Pitch Event",
      "Career Fair",
    ],
    "Arts & Culture": [
      "Art Exhibition",
      "Poetry Slams",
      "Cultural Festival",
      "Photography Show",
    ],
    "Sports & Fitness": [
      "Football Match / Viewing Party",
      "Marathons & Runs",
      "Fitness Bootcamp",
      "Yoga / Wellness Sessions",
      "Esports Tournament",
    ],
    "Food & Drink": [
      "Food & Drink",
      "Wine / Cocktail Tasting",
      "Cooking Classes",
      "Pop-up Restaurants",
    ],
    "Lifestyle & Celebrations": [
      "Wedding",
      "Birthday",
      "Anniversary",
      "Fashion show",
      "Charity Gala",
    ],
    "Special Interests": [
      "Book Club",
      "Gaming Meetup",
      "Dance Classes",
      "Language Exchange",
      "Travel and Adventure trips",
    ],
  };

  // toggle selection (single selection for event type)
  const toggleSelect = (subtype) => {
    setSelected((prev) => {
      // Only allow single selection for event type
      if (prev.includes(subtype)) {
        return []; // Deselect if already selected
      } else {
        return [subtype]; // Select new type, replacing any existing selection
      }
    });
  };

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>What type of event are you hosting?</Text>
      <Text style={styles.sectionSubtitle}>Select the type of event</Text>

      <View className="mt-6">
        {Object.entries(eventCategories).map(([category, subtypes]) => (
          <View key={category} style={{ marginBottom: 24 }}>
            <Text style={[styles.label, { marginBottom: 12 }]}>{category}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {subtypes.map((subtype) => {
                const isSelected = selected.includes(subtype);
                return (
                  <View className="flex-row items-center w-full" key={subtype}>
                    <TouchableOpacity
                      onPress={() => toggleSelect(subtype)}
                      className={`w-10 h-10 border-[#e5e7eb] border-2 rounded-lg items-center justify-center mt-4 mr-4 ${isSelected ? "bg-[#274046]" : "bg-white"}`}
                    />
                    <Text style={[styles.labelText, { marginTop: 14 }]}>
                      {subtype}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
