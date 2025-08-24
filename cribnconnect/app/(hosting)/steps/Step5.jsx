import { View, Text, TextInput } from "react-native";

export default function Step5({ styles }) {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>
        Give a title and description of your space
      </Text>
      <Text style={styles.sectionSubtitle}>
        Write a suitable title and description for your space
      </Text>

      <View className="mt-7">
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter title"
          placeholderTextColor="#B0B0B0"
        />
      </View>

      <View className="mt-4">
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.inputArea}
          placeholder="Enter description"
          placeholderTextColor="#B0B0B0"
          multiline
          numberOfLines={10}
          textAlignVertical="top"
        />
      </View>
    </View>
  );
}
