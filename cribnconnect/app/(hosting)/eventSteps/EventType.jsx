import { View, Text } from "react-native";

export default function EventType({ styles }) {
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

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>What type of event are you hosting?</Text>
      <Text style={styles.sectionSubtitle}>Select the type of event</Text>
    </View>
  );
}
