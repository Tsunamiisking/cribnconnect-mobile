import useHostingStore from "@/stores/hostingStore";
import { Text, TextInput, View } from "react-native";

export default function EventAddress({ styles }) {
  const { eventData, updateEventNestedData } = useHostingStore();

  const handleLocationChange = (field, value) => {
    updateEventNestedData('location', field, value);
  };

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Where is your Event located?</Text>
      <Text style={styles.sectionSubtitle}>Fill in the location details</Text>
      <View className="mt-6">
        <Text style={styles.label}>Provide event address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter street address"
          placeholderTextColor="#B0B0B0"
          value={eventData.location.street}
          onChangeText={(value) => handleLocationChange('street', value)}
        />
        <View className="flex-row">
          <TextInput
            style={styles.input}
            placeholder="State"
            placeholderTextColor="#B0B0B0"
            value={eventData.location.state}
            onChangeText={(value) => handleLocationChange('state', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="City"
            placeholderTextColor="#B0B0B0"
            value={eventData.location.city}
            onChangeText={(value) => handleLocationChange('city', value)}
          />
        </View>

        <View className="mt-6">
          <Text style={styles.label}>Venue Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter venue name"
            placeholderTextColor="#B0B0B0"
            value={eventData.location.venue}
            onChangeText={(value) => handleLocationChange('venue', value)}
          />
          <Text style={styles.typeOptionDescription}>Specific Venue Detail or Name (e.g., Lekki Event Center, Oriental Hotel)</Text>
        </View>
      </View>
    </View>
  );
}
