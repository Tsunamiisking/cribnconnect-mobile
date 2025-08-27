import { View, Text, TextInput } from "react-native";

export default function EventAddress({ styles }) {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Where is your Event located?</Text>
      <Text style={styles.sectionSubtitle}>Fill in the location details</Text>
      <View className="mt-6">
        <Text style={styles.label}>Provide house address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter address"
          placeholderTextColor="#B0B0B0"
        />
        <View className="flex-row">
          <TextInput
            style={styles.input}
            placeholder="State"
            placeholderTextColor="#B0B0B0"
          />
          <TextInput
            style={styles.input}
            placeholder="City"
            placeholderTextColor="#B0B0B0"
          />
        </View>
        <View className="flex-row">
          <TextInput
            style={styles.input}
            placeholder="Zip Code"
            placeholderTextColor="#B0B0B0"
          />
          <TextInput
            style={styles.input}
            placeholder="Country"
            placeholderTextColor="#B0B0B0"
          />
        </View>
      </View>
    </View>
  );
}
