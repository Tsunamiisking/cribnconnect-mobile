import useHostingStore from "@/stores/hostingStore";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function EventType({ styles }) {
  const { eventData, updateEventData } = useHostingStore();
  const [selectedCategory, setSelectedCategory] = useState(eventData.category || "");
  const [selectedEventType, setSelectedEventType] = useState(eventData.eventType || "");

  // Update store when selections change
  useEffect(() => {
    if (selectedCategory) {
      updateEventData('category', selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedEventType) {
      updateEventData('eventType', selectedEventType);
    }
  }, [selectedEventType]);

  // Initialize from store data
  useEffect(() => {
    if (eventData.category && selectedCategory !== eventData.category) {
      setSelectedCategory(eventData.category);
    }
    if (eventData.eventType && selectedEventType !== eventData.eventType) {
      setSelectedEventType(eventData.eventType);
    }
  }, []);

const eventCategories = { 
  "Entertainment & Nightlife": [
    "Concerts & Live Music (Afrobeats, Amapiano, Hip-Hop)",
    "Rave / Club Night",
    "Beach Party",
    "House Party",
    "Silent Disco",
    "Karaoke Night",
    "Comedy Show",
    "Open Mic & Talent Showcase"
  ],

  "Education & Professional": [
    "Tech Conference / Hackathon",
    "Networking Mixer",
    "Workshops & Skill Training",
    "Startup Pitch Event",
    "Career Fair / Internship Recruitment",
    "Personal Development Seminar"
  ],

  "Arts & Culture": [
    "Art Exhibition / Gallery Showing",
    "Poetry Slam & Spoken Word",
    "Theatre & Stage Performances",
    "Cultural Festival / Heritage Day",
    "Photography & Creative Showcase",
    "Sip & Paint / Creative Hangout"
  ],

  "Sports & Fitness": [
    "Football Match / Viewing Party",
    "Fitness Bootcamp / Aerobics Session",
    "Dance Fitness (Afrobeats, Amapiano, Zumba)",
    "Yoga / Meditation Retreat",
    "Cycling & Marathon Events",
    "Esports & Gaming Tournament"
  ],

  "Food & Drink": [
    "Brunch & Chill",
    "Food Festival / Street Food Fair",
    "Wine / Cocktail Tasting",
    "Backyard Grill / Cookout",
    "Pop-up Restaurant Experience"
  ],

  "Lifestyle & Celebrations": [
    "Owambe / Traditional Party",
    "Wedding / Engagement Party",
    "Birthday / Private Celebration",
    "Anniversary Dinner / Surprise Event",
    "Fashion Runway / Style Showcase",
    "Charity Gala / Fundraiser"
  ],

  "Faith & Community": [
    "Faith Conference / Camp Meeting",
    "Worship Night / Gospel Concert",
    "Youth Fellowship Hangout",
    "Community Outreach & Volunteering"
  ],

  "Special Interests": [
    "Book Club Meetup",
    "Anime & Movie Hangout",
    "Chess / Board Game Meetup",
    "Dance Classes & Workshops",
    "Photography Walks",
    "Road Trips & Travel Group Adventures"
  ]
};

  // Handle category selection
  const selectCategory = (category) => {
    setSelectedCategory(category);
    setSelectedEventType(""); // Reset event type when category changes
  };

  // Handle event type selection
  const selectEventType = (eventType, category) => {
    setSelectedCategory(category);
    setSelectedEventType(eventType);
  };

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>What type of event are you hosting?</Text>
      <Text style={styles.sectionSubtitle}>
        {!selectedCategory 
          ? "First, select a category" 
          : selectedCategory 
            ? `Selected: ${selectedCategory}${selectedEventType ? ` > ${selectedEventType}` : ""}`
            : "Select the type of event"
        }
      </Text>

      <View className="mt-6">
        {Object.entries(eventCategories).map(([category, subtypes]) => (
          <View key={category} style={{ marginBottom: 10 }}>
            <TouchableOpacity
              onPress={() => selectCategory(category)}
              style={[
                styles.typeOption,
                selectedCategory === category && styles.selectedTypeOption,
                { marginBottom: 12 }
              ]}
            >
              <Text style={[
                styles.typeOptionText,
                selectedCategory === category && styles.selectedTypeOptionText
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
            
            {selectedCategory === category && (
              <View style={{ paddingLeft: 16 }}>
                {subtypes.map((subtype) => {
                  const isSelected = selectedEventType === subtype;
                  return (
                    <TouchableOpacity
                      key={subtype}
                      onPress={() => selectEventType(subtype, category)}
                      style={[
                        styles.typeOption,
                        isSelected && styles.selectedTypeOption,
                        { marginBottom: 8, backgroundColor: isSelected ? "#274046" : "#f9fafb" }
                      ]}
                    >
                      <Text style={[
                        styles.labelText,
                        isSelected && { color: "#ffffff" }
                      ]}>
                        {subtype}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}
