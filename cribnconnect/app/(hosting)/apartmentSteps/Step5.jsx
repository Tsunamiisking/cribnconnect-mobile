import useHostingStore from "@/stores/hostingStore";
import { Text, TextInput, View } from "react-native";

export default function Step5({ styles }) {
  const { apartmentData, updateApartmentData } = useHostingStore();

  const handleTitleChange = (value) => {
    updateApartmentData('title', value);
  };

  const handleDescriptionChange = (value) => {
    updateApartmentData('description', value);
  };

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>
        Give a title and description of your space
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
          value={apartmentData.title || ""}
          onChangeText={handleTitleChange}
        />
      </View>

      <View className="mt-6">
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.inputArea}
          placeholder="Enter description"
          placeholderTextColor="#B0B0B0"
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          value={apartmentData.description || ""}
          onChangeText={handleDescriptionChange}
        />
      </View>
    </View>
  );
}
