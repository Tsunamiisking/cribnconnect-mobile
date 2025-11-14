import useHostingStore from "@/stores/hostingStore";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Step4({ styles }) {
  const { apartmentData, updateApartmentData } = useHostingStore();
  const [hasComplex, setHasComplex] = useState(
    apartmentData.complex?.name ? "yes" : null
  );

  const handleAddressChange = (field, value) => {
    updateApartmentData('address', {
      ...apartmentData.address,
      [field]: value
    });
  };

  const handleComplexChange = (value) => {
    updateApartmentData('complex', {
      name: value
    });
  };

  const handleComplexTypeChange = (type) => {
    setHasComplex(type);
    if (type === "no") {
      handleComplexChange("");
    }
  };

  const renderComplexAddress = () => {
    return (
      <View className="mt-7">
        <Text style={styles.label}>Enter the name of the complex</Text>
        <TextInput 
          style={styles.input} 
          value={apartmentData.complex?.name || ""}
          onChangeText={handleComplexChange}
          placeholder="Enter complex name"
          placeholderTextColor="#B0B0B0"
        />
        <Text style={styles.typeOptionDescription}>
          (e.g. Pearl Towers Kuje, Genesis Apartments Festac, The View Estate
          Surulere, Golden tulip Festac)
        </Text>

        <View className="mt-7">
          <Text style={styles.label}>Provide house address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter street address"
            placeholderTextColor="#B0B0B0"
            value={apartmentData.address?.street || ""}
            onChangeText={(text) => handleAddressChange('street', text)}
          />
          <View className="flex-row">
            <TextInput
              style={styles.input}
              placeholder="State"
              placeholderTextColor="#B0B0B0"
              value={apartmentData.address?.state || ""}
              onChangeText={(text) => handleAddressChange('state', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="City"
              placeholderTextColor="#B0B0B0"
              value={apartmentData.address?.city || ""}
              onChangeText={(text) => handleAddressChange('city', text)}
            />
          </View>
          <View className="flex-row">
            <TextInput
              style={styles.input}
              placeholder="LGA (Local Government Area)"
              placeholderTextColor="#B0B0B0"
              value={apartmentData.address?.lga || ""}
              onChangeText={(text) => handleAddressChange('lga', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Country"
              placeholderTextColor="#B0B0B0"
              value={apartmentData.address?.country || ""}
              onChangeText={(text) => handleAddressChange('country', text)}
            />
          </View>
        </View>
      </View>
    );
  };

  const renderAddress = () => {
    return (
      <View className="mt-6">
        <Text style={styles.label}>Provide house address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter street address"
          placeholderTextColor="#B0B0B0"
          value={apartmentData.address?.street || ""}
          onChangeText={(text) => handleAddressChange('street', text)}
        />
        <View className="flex-row">
          <TextInput
            style={styles.input}
            placeholder="State"
            placeholderTextColor="#B0B0B0"
            value={apartmentData.address?.state || ""}
            onChangeText={(text) => handleAddressChange('state', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="City"
            placeholderTextColor="#B0B0B0"
            value={apartmentData.address?.city || ""}
            onChangeText={(text) => handleAddressChange('city', text)}
          />
        </View>
        <View className="flex-row">
          <TextInput
            style={styles.input}
            placeholder="LGA (Local Government Area)"
            placeholderTextColor="#B0B0B0"
            value={apartmentData.address?.lga || ""}
            onChangeText={(text) => handleAddressChange('lga', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Country"
            placeholderTextColor="#B0B0B0"
            value={apartmentData.address?.country || ""}
            onChangeText={(text) => handleAddressChange('country', text)}
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
            onPress={() => handleComplexTypeChange("yes")}
            className={`w-10 h-10 border-[#e5e7eb] border-2 rounded-lg items-center justify-center mt-4 mr-4 ${hasComplex === "yes" ? "bg-[#274046]" : "bg-white"}`}
          />
          <Text style={[styles.typeOptionText, { marginTop: 14}]}>Yes</Text>
        </View>
        <View className="flex-row items-center ">
          <TouchableOpacity
            onPress={() => handleComplexTypeChange("no")}
            className={`w-10 h-10 border-[#e5e7eb] border-2 rounded-lg items-center justify-center mt-4 mr-4 ${hasComplex === "no" ? "bg-[#274046]" : "bg-white"}`}
          />
          <Text style={[styles.typeOptionText, { marginTop: 14}]}>No</Text>
        </View>
      </View>
      <View>
        {hasComplex === "yes" && renderComplexAddress()}
        {hasComplex === "no" && renderAddress()}
      </View>
    </View>
  );
}
