import useHostingStore from "@/stores/hostingStore";
import { Text, TextInput, View } from "react-native";

export default function Step3({ styles }) {
  const { apartmentData, updateApartmentData } = useHostingStore();
  
  // Get the apartment category from Step 2
  const category = apartmentData.apartmentCategory;

  const handleChange = (field, value) => {
    updateApartmentData(field, value);
  };
  
  // Determine what to show based on category
  const isWholeSpace = category === "Whole Space ";
  const isOneRoom = category === "One Room";
  const isSharedRoom = category === "Shared Room";

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>
        {isSharedRoom ? "Room Configuration" : "How many rooms are available?"}
      </Text>
      <Text style={styles.sectionSubtitle}>
        {isWholeSpace && "Specify the number of bedrooms and bathrooms in the entire space"}
        {isOneRoom && "Specify the room and bathroom configuration"}
        {isSharedRoom && "Specify the shared room configuration"}
      </Text>
      
      <View>
        {/* WHOLE SPACE: Bedrooms + Total Bathrooms */}
        {isWholeSpace && (
          <>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <Text style={styles.label}>Bedrooms:</Text>
              <TextInput
                style={[styles.inputView, { width: 70 }]}
                keyboardType="numeric"
                value={apartmentData.bedrooms || ""}
                onChangeText={(text) => handleChange('bedrooms', text)}
              />
            </View>
            
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <Text style={styles.label}>Total Bathrooms:</Text>
              <TextInput
                style={[styles.inputView, { width: 70 }]}
                keyboardType="numeric"
                value={apartmentData.bathrooms || ""}
                onChangeText={(text) => handleChange('bathrooms', text)}
              />
            </View>
          </>
        )}

        {/* ONE ROOM: Bedrooms (usually 1) + Private + Shared Bathrooms */}
        {isOneRoom && (
          <>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <View className="flex-1">
                <Text style={styles.label}>Bedrooms you're renting:</Text>
                <Text style={styles.typeOptionDescription}>
                  Usually 1 for a single room rental
                </Text>
              </View>
              <TextInput
                style={[styles.inputView, { width: 70 }]}
                keyboardType="numeric"
                value={apartmentData.bedrooms || ""}
                onChangeText={(text) => handleChange('bedrooms', text)}
              />
            </View>
            
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <View className="flex-1">
                <Text style={styles.label}>Private bathrooms:</Text>
                <Text style={styles.typeOptionDescription}>
                  Attached bathroom for exclusive use
                </Text>
              </View>
              <TextInput
                style={[styles.inputView, { width: 70 }]}
                keyboardType="numeric"
                value={apartmentData.privateBathrooms || ""}
                onChangeText={(text) => handleChange('privateBathrooms', text)}
              />
            </View>
            
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <View className="flex-1">
                <Text style={styles.label}>Shared bathrooms:</Text>
                <Text style={styles.typeOptionDescription}>
                  Bathrooms shared with other tenants
                </Text>
              </View>
              <TextInput
                style={[styles.inputView, { width: 70 }]}
                keyboardType="numeric"
                value={apartmentData.sharedBathrooms || ""}
                onChangeText={(text) => handleChange('sharedBathrooms', text)}
              />
            </View>
          </>
        )}

        {/* SHARED ROOM: Beds in room + Shared Bathrooms */}
        {isSharedRoom && (
          <>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <View className="flex-1">
                <Text style={styles.label}>Total beds in room:</Text>
                <Text style={styles.typeOptionDescription}>
                  How many beds are in this shared room
                </Text>
              </View>
              <TextInput
                style={[styles.inputView, { width: 70 }]}
                keyboardType="numeric"
                value={apartmentData.bedrooms || ""}
                onChangeText={(text) => handleChange('bedrooms', text)}
              />
            </View>
            
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <View className="flex-1">
                <Text style={styles.label}>Shared bathrooms:</Text>
                <Text style={styles.typeOptionDescription}>
                  Bathrooms shared with roommates
                </Text>
              </View>
              <TextInput
                style={[styles.inputView, { width: 70 }]}
                keyboardType="numeric"
                value={apartmentData.sharedBathrooms || ""}
                onChangeText={(text) => handleChange('sharedBathrooms', text)}
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
}
