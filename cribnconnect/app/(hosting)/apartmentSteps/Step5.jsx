import useHostingStore from "@/stores/hostingStore";
import { Text, TextInput, View } from "react-native";

export default function Step5({ styles }) {
  const { apartmentData, updateApartmentData } = useHostingStore();

  const handleDetailsChange = (field, value) => {
    updateApartmentData('details', {
      ...apartmentData.details,
      [field]: value
    });
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
          value={apartmentData.details.title || ""}
          onChangeText={(text) => handleDetailsChange('title', text)}
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
          value={apartmentData.details.description || ""}
          onChangeText={(text) => handleDetailsChange('description', text)}
        />
      </View>
    </View>
  );
}
