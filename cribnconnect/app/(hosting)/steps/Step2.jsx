import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export default function StepSpace({ value, onSelect, styles }) {
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
          const selected = value === option.label;
          return (
            <TouchableOpacity
              key={option.label}
              style={[styles.typeOption, selected && styles.selectedTypeOption]}
              activeOpacity={0.85}
              onPress={() => onSelect(option.label)}
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
