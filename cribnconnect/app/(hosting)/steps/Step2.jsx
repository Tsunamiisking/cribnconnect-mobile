import { View, Text } from "react-native";

export default function Step2({ styles }) {
    const apartmentOption = [
        { label: "Whole Space ", text: "Allocate the whole available space in the apartment" },
        { label: "One Room", text: "Allocate a room or part of available space in the apartment" },
        { label: "Shared Room", text: "Allocate a bed or space in a room of the available space" },
    ];
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>What space are you allocating?</Text>
      <Text style={styles.sectionSubtitle}>Select how much space is available for your listing</Text>
    </View>
  );
}

