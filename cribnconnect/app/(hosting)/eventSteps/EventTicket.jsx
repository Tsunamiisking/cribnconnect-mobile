import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";

export default function EventTicket({ styles }) {
  const [selected, setSelected] = useState(null);

  const toggleSelected = () => {
    setSelected((prev) => (prev === "free" ? null : "free"));
  };
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>How can people access your event?</Text>
      <Text style={styles.sectionSubtitle}>Select Tickect Access Type</Text>
      <View className="mt-6">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={toggleSelected}
            className={`w-10 h-10 border-[#e5e7eb] border-2 rounded-lg items-center justify-center mt-4 mr-4 ${selected === "free" ? "bg-[#274046]" : "bg-white"}`}
          />
          <Text style={[styles.typeOptionText, { marginTop: 14 }]}>
            Free ( Mark event access as FREE )
          </Text>
        </View>
      </View>
    </View>
  );
}
