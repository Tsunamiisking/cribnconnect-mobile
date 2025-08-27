import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";

export default function EventTicket({ styles }) {
  const [selected, setSelected] = useState(null);
  const [price, setPrice] = useState("");

  const formatNaira = (amount) => {
    if (!amount || isNaN(amount)) return "";
    const num = parseFloat(amount.replace(/,/g, ""));
    return `₦${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

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
          <Text style={[styles.labelText, { marginTop: 14 }]}>
            Free ( Mark event access as FREE )
          </Text>
        </View>

        <View className="mt-6">
          <Text style={styles.label}>Regular</Text>
          <Text style={styles.typeOptionDescription}>
            Set regular ticket price
          </Text>
          <TextInput
            onChangeText={setPrice}
            value={price}
            placeholder="Enter price"
            keyboardType="numeric"
            style={styles.input}
          />
          <Text style={styles.typeOptionDescription}>
            {price && `Regular ticket price is ${formatNaira(price)} / per person`}
          </Text>
        </View>
      </View>
    </View>
  );
}
