import { View, Text, TextInput } from "react-native";

export default function EventTitle({ styles }) {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>
        Give your event a proper title and description
      </Text>
      <Text style={styles.sectionSubtitle}>
        Write a suitable title and description for your space
      </Text>

      <View className="mt-6">
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter title"
          placeholderTextColor="#B0B0B0"
        />
      </View>

      <View className="mt-6">
        <Text style={styles.label}>Description ( Optional )</Text>
        <TextInput
          style={styles.inputArea}
          placeholder="Enter description"
          placeholderTextColor="#B0B0B0"
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
      </View>
    </View>
  );
}
