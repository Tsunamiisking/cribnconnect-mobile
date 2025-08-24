import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import {
  House,
  Building2,
  Ship,
  Hotel,
  Caravan,
  Container,
  Trees,
  Tent,
  Sparkle,
} from "lucide-react-native";

const apartmentTypeOptions = [
  { type: "House", icon: House },
  { type: "Apartment", icon: Building2 },
  { type: "Boat", icon: Ship },
  { type: "Hotel", icon: Hotel },
  { type: "Camper", icon: Caravan },
  { type: "Container", icon: Container },
  { type: "Cabin", icon: Trees },
  { type: "Tent", icon: Tent },
  { type: "Other", icon: Sparkle },
];

export default function StepApartmentType({ value, onSelect, styles }) {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>How would you describe your space?</Text>
      <Text style={styles.sectionSubtitle}>Select the type of place you want to list</Text>
      <View style={styles.verticalOptions}>
        {apartmentTypeOptions.map(({ type, icon: Icon }) => {
          const selected = value === type;
          return (
            <TouchableOpacity
              key={type}
              style={[styles.typeOption, selected && styles.selectedTypeOption]}
              activeOpacity={0.85}
              onPress={() => onSelect(type)}
            >
              <View style={styles.typeOptionRow}>
                <View style={styles.typeIcon}>
                  <Icon size={28} color={Colors.black} />
                </View>
                <Text style={[styles.typeOptionText, selected && styles.selectedTypeOptionText]}>
                  {type}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
