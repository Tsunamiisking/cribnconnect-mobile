import { View, Text, TextInput, TouchableOpacity, } from "react-native";
import { useState } from "react";
// import { KeyboardAvoidingView } from "react-native";

export default function Step4({ styles }) {
  const [selectedYes, setSelectedYes] = useState(false);
  const [selectedNo, setSelectedNo] = useState(false);

  const renderComplexAddress = () => {
    return (
      <View className="mt-7">
        <Text style={styles.label}>Enter the name of the complex</Text>
        <TextInput style={styles.input} />
        <Text style={styles.typeOptionDescription}>
          (e.g. Pearl Towers Kuje, Genesis Apartments Festac, The View Estate
          Surulere, Golden tulip Festac)
        </Text>

        <View className="mt-6">
          <Text style={styles.label}>Provide house address</Text>
          <TextInput style={styles.input} placeholder="Enter address" placeholderTextColor="#B0B0B0"/>
          <View className="flex-row"> 
            <TextInput style={styles.inputShare} placeholder="State" placeholderTextColor="#B0B0B0"/>
            <TextInput style={styles.inputShare} placeholder="City" placeholderTextColor="#B0B0B0"/>
          </View>
          <View className="flex-row">
            <TextInput style={styles.inputShare} placeholder="Zip Code" placeholderTextColor="#B0B0B0"/>
            <TextInput style={styles.inputShare} placeholder="Country" placeholderTextColor="#B0B0B0"/>
          </View>
        </View>
      </View>
    );
  };

  const renderAddress = () => {
    return (
      <View>
        <Text style={styles.label}>
          Please provide the address of the apartment:
        </Text>
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
            onPress={() => setSelectedYes(!selectedYes)}
            className={`w-10 h-10 border-[#274046] border-2 rounded-lg items-center justify-center mt-4 mr-4 ${selectedYes ? "bg-[#274046]" : "bg-white"}`}
          />

          <Text style={styles.typeOptionText}>Yes</Text>
        </View>

        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => setSelectedNo(!selectedNo)}
            className={`w-10 h-10 border-[#274046] border-2 rounded-lg items-center justify-center mt-4 mr-4 ${selectedNo ? "bg-[#274046]" : "bg-white"}`}
          />
          <Text style={styles.typeOptionText}>No</Text>
        </View>
      </View>
      <View>{selectedYes ? renderComplexAddress() : renderAddress()}</View>
    </View>
  );
}
