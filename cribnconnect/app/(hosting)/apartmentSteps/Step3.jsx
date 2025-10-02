import { View, Text, TextInput } from "react-native";
import { ChevronsUpDown } from "lucide-react-native";

export default function Step3({ value = {}, onChange, styles }) {
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
            value={value.beds || ""}
            onChangeText={(text) => onChange({ ...value, beds: text })}
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
            value={value.rooms || ""}
            onChangeText={(text) => onChange({ ...value, rooms: text })}
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
            value={value.privateBathIn || ""}
            onChangeText={(text) => onChange({ ...value, privateBathIn: text })}
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
            value={value.privateBathOut || ""}
            onChangeText={(text) =>
              onChange({ ...value, privateBathOut: text })
            }
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
            value={value.sharedBath || ""}
            onChangeText={(text) => onChange({ ...value, sharedBath: text })}
          />
        </View>
      </View>
    </View>
  );
}
