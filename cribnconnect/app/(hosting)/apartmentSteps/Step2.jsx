import useHostingStore from "@/stores/hostingStore";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function StepSpace({ styles }) {
  const { apartmentData, updateApartmentData } = useHostingStore();

  const handleSelect = (space) => {
    updateApartmentData('space', space);
  };
  const apartmentOption = [
    {
      label: "Whole Space ",
      text: "Allocate the whole available space in the apartment",
    },
    {
      label: "One Room",
      text: "Allocate a room or part of available space in the apartment",
    },
    {
      label: "Shared Room",
      text: "Allocate a bed or space in a room of the available space",
    },
  ];
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>What space are you allocating?</Text>
      <Text style={styles.sectionSubtitle}>
        Select how much space is available for your listing
      </Text>

      <View style={styles.verticalOptions}>
        {apartmentOption.map((option) => {
          const selected = apartmentData.space === option.label;
          return (
            <TouchableOpacity
              key={option.label}
              style={[styles.typeOption, selected && styles.selectedTypeOption]}
              activeOpacity={0.85}
              onPress={() => handleSelect(option.label)}
            >
              <Text style={styles.typeOptionText}>{option.label}</Text>
              <Text style={styles.typeOptionDescription}>{option.text}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
