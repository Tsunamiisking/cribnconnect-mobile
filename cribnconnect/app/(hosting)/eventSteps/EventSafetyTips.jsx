import { useState } from "react";
import { View, Text, TextInput } from "react-native";

export default function EventSafetyTips({ styles }) {
  const [selected, setSelected] = useState(false); // 'yes' | 'no' | null

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Safety Tips or House rules</Text>
      <Text style={styles.sectionSubtitle}>
        Finish your Listing Upload with this final step 🎉
      </Text>

      <View className="mt-6">
        <Text style={styles.label}>Set House rules</Text>
        <TextInput
          style={styles.inputArea}
          placeholder="Enter your safety tips or house rules"
          placeholderTextColor="#B0B0B0"
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
      </View>
      <View className="flex-row items-center ">
        <TouchableOpacity
          onPress={() => setSelected(!selected)}
          className={`w-10 h-10 border-[#e5e7eb] border-2 rounded-lg items-center justify-center mt-4 mr-4 ${selected === true ? "bg-[#274046]" : "bg-white"}`}
        />
        <Text style={[styles.labelText, { marginTop: 14 }]}>
          Are parties allowed in your space?
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <Text style={styles.labelText}>Max Guests Allowed:</Text>
        <TextInput
          style={[styles.inputView, { width: 70 }]}
          keyboardType="numeric"
          // value={value.beds || ""}
          // onChangeText={(text) => onChange({ ...value, beds: text })}
        />
      </View>
      <View style={{ marginVertical: 12 }}>
        <Text style={styles.label}>Safety Tips</Text>
        <Text style={styles.warning}>
          * Provide a fire extinguisher and first aid kit in a visible location.
        </Text>
        <Text style={styles.warning}>
          * Install a working smoke detector and door locks.
        </Text>
        <Text style={styles.warning}>
          * If possible, have external cameras (not inside the apartment) for
          entrance monitoring.
        </Text>
      </View>
    </View>
  );
}
