import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";

export default function Step4({ styles }) {
    const [selectedOption, setSelectedOption] = useState(false)
  const renderComplexAddress = () => {
    return (
      <View className="mt-7">
        <Text style={styles.label}>Enter the name of the complex</Text>
        <TextInput style={styles.input} />
        <Text style={styles.typeOptionDescription}>
          (e.g. Pearl Towers Kuje, Genesis Apartments Festac, The View Estate
          Surulere, Golden tulip Festac)
        </Text>

        <View>
          <Text style={styles.label}>
            Provide house address
          </Text>
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
            <TouchableOpacity className="w-10 h-10 border-[#274046] border-2 rounded-lg items-center justify-center mt-4 mr-4"/>

            <Text style={styles.typeOptionText}>
                Yes
            </Text>
        </View>

          <View className="flex-row items-center">
            <TouchableOpacity className="w-10 h-10 border-[#274046] border-2 rounded-lg items-center justify-center mt-4 mr-4"/>
            <Text style={styles.typeOptionText}>
                No
            </Text>
        </View>
        
      </View>
      <View>{renderComplexAddress()}</View>
    </View>
  );
}
