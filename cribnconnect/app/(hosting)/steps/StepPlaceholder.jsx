import React from "react";
import { View, Text } from "react-native";

export default function StepPlaceholder({ step, styles }) {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Step {step}</Text>
      <Text style={styles.sectionSubtitle}>Content coming soon...</Text>

      <View>{}</View>
    </View>
  );
}
