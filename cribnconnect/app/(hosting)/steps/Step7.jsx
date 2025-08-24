import { View, Text, TextInput } from "react-native";

export default function Step7({ styles }) {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>How much does your space cost</Text>
      <Text style={styles.sectionSubtitle}>Specify your price range</Text>

      <View>
        <Text>Amount Per Night </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your price range"
          placeholderTextColor="#B0B0B0"
        />
      </View>
    </View>
  );
}
