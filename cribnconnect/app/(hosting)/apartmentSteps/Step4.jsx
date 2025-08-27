import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
// import { KeyboardAvoidingView } from "react-native";

export default function Step4({ styles }) {
  const [selected, setSelected] = useState(null); // 'yes' | 'no' | null

  const renderComplexAddress = () => {
    return (
      <View className="mt-7">
        <Text style={styles.label}>Enter the name of the complex</Text>
        <TextInput style={styles.input} />
        <Text style={styles.typeOptionDescription}>
          (e.g. Pearl Towers Kuje, Genesis Apartments Festac, The View Estate
          Surulere, Golden tulip Festac)
        </Text>

        <View className="mt-7">
          <Text style={styles.label}>Provide house address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter address"
            placeholderTextColor="#B0B0B0"
          />
          <View className="flex-row">
            <TextInput
              style={styles.input}
              placeholder="State"
              placeholderTextColor="#B0B0B0"
            />
            <TextInput
              style={styles.input}
              placeholder="City"
              placeholderTextColor="#B0B0B0"
            />
          </View>
          <View className="flex-row">
            <TextInput
              style={styles.input}
              placeholder="Zip Code"
              placeholderTextColor="#B0B0B0"
            />
            <TextInput
              style={styles.input}
              placeholder="Country"
              placeholderTextColor="#B0B0B0"
            />
          </View>
        </View>
      </View>
    );
  };

  const renderAddress = () => {
    return (
      <View className="mt-7">
        <Text style={styles.label}>Provide house address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter address"
          placeholderTextColor="#B0B0B0"
        />
        <View className="flex-row">
          <TextInput
            style={styles.input}
            placeholder="State"
            placeholderTextColor="#B0B0B0"
          />
          <TextInput
            style={styles.input}
            placeholder="City"
            placeholderTextColor="#B0B0B0"
          />
        </View>
        <View className="flex-row">
          <TextInput
            style={styles.input}
            placeholder="Zip Code"
            placeholderTextColor="#B0B0B0"
          />
          <TextInput
            style={styles.input}
            placeholder="Country"
            placeholderTextColor="#B0B0B0"
          />
        </View>
      </View>
    );
  };
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Where is your space located?</Text>
      <Text style={styles.sectionSubtitle}>Fill your location details</Text>
      <View className="mt-6">
        <Text style={styles.label}>
          Is this apartment part of a larger serviced apartment building or
          complex?
        </Text>
      </View>
      <View>
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => setSelected("yes")}
            className={`w-10 h-10 border-[#e5e7eb] border-2 rounded-lg items-center justify-center mt-4 mr-4 ${selected === "yes" ? "bg-[#274046]" : "bg-white"}`}
          />
          <Text style={[styles.typeOptionText, { marginTop: 14}]}>Yes</Text>
        </View>
        <View className="flex-row items-center ">
          <TouchableOpacity
            onPress={() => setSelected("no")}
            className={`w-10 h-10 border-[#e5e7eb] border-2 rounded-lg items-center justify-center mt-4 mr-4 ${selected === "no" ? "bg-[#274046]" : "bg-white"}`}
          />
          <Text style={[styles.typeOptionText, { marginTop: 14}]}>No</Text>
        </View>
      </View>
      <View>
        {selected === "yes" && renderComplexAddress()}
        {selected === "no" && renderAddress()}
      </View>
    </View>
  );
}
