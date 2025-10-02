import useHostingStore from "@/stores/hostingStore";
import { Text, TextInput, View } from "react-native";

export default function Step3({ styles }) {
  const { apartmentData, updateApartmentData } = useHostingStore();

  const handleChange = (field, value) => {
    updateApartmentData('rooms', {
      ...apartmentData.rooms,
      [field]: value
    });
  };
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>How many rooms are available?</Text>
      <Text style={styles.sectionSubtitle}>
        Select the number of rooms and bathrooms available
      </Text>
      <View>
        {/* Beds input with ChevronsUpDown aligned horizontally */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <Text style={styles.label}>Beds:</Text>
          <TextInput
            style={[styles.inputView, { width: 70 }]}
            keyboardType="numeric"
            value={apartmentData.rooms.beds || ""}
            onChangeText={(text) => handleChange('beds', text)}
          />
        </View>
        {/* Rooms input */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <Text style={styles.label}>Rooms:</Text>
          <TextInput
            style={[styles.inputView, { width: 70 }]}
            keyboardType="numeric"
            value={apartmentData.rooms.rooms || ""}
            onChangeText={(text) => handleChange('rooms', text)}
          />
        </View>
        {/* Private bathroom inside room */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <View className="flex-1">
            <Text style={styles.label}>Private bathroom inside room:</Text>
          </View>
          <TextInput
            style={[styles.inputView, { width: 70 }]}
            keyboardType="numeric"
            value={apartmentData.rooms.privateBathIn || ""}
            onChangeText={(text) => handleChange('privateBathIn', text)}
          />
        </View>
        {/* Private bathroom outside room */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <View className="flex-1">
            <Text style={styles.label}>Private bathroom outside room:</Text>
          </View>
          <TextInput
            style={[styles.inputView, { width: 70 }]}
            keyboardType="numeric"
            value={apartmentData.rooms.privateBathOut || ""}
            onChangeText={(text) => handleChange('privateBathOut', text)}
          />
        </View>
        {/* Shared bathrooms */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <Text style={styles.label}>Shared bathroom (s):</Text>
          <TextInput
            style={[styles.inputView, { width: 70 }]}
            keyboardType="numeric"
            value={apartmentData.rooms.sharedBath || ""}
            onChangeText={(text) => handleChange('sharedBath', text)}
          />
        </View>
      </View>
    </View>
  );
}
