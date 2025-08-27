import { View, Text } from "react-native";

export default function EventAddress({ styles }) {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Where is your Event located?</Text>
      <Text style={styles.sectionSubtitle}>Fill in the location details</Text>
    </View>
  );
}
