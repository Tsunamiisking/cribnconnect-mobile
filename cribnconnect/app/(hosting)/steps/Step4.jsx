import { View, Text } from "react-native";

export default function Step4({ styles }) {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Where is your space located?</Text>
      <Text style={styles.sectionSubtitle}>Fill your location details</Text>
    </View>
  );
}
