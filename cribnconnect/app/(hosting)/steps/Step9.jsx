import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";

export default function Step9({ styles }) {
  const [selected, setSelected] = useState(false); // 'yes' | 'no' | null

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Safety Tips or House rules</Text>
      <Text style={styles.sectionSubtitle}>
        Finish your Listing Upload with this final step 🎉
      </Text>
      <View className="mt-4">
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
        <Text style={[styles.typeOptionText, { marginTop: 14 }]}>
          Are parties allowed in your space?
        </Text>
      </View>
    </View>
  );
}
