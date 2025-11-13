import AirVent from "@/components/svgs/airVent";
import BathTub from "@/components/svgs/bathTub";
import BBQGrill from "@/components/svgs/bbqGrill";
import Beach from "@/components/svgs/beach";
import Electricity from "@/components/svgs/electricity";
import Fireplace from "@/components/svgs/fireplace";
import Generator from "@/components/svgs/generator";
import Gym from "@/components/svgs/gym";
import HomeAssistant from "@/components/svgs/homeAssistant";
import IndoorDining from "@/components/svgs/indoorDining";
import Kitchen from "@/components/svgs/kichen";
import OutdoorDining from "@/components/svgs/outdoorDining";
import Parking from "@/components/svgs/parking";
import Piano from "@/components/svgs/piano";
import Pool from "@/components/svgs/pool";
import PoolBall from "@/components/svgs/poolBall";
import Refrigerator from "@/components/svgs/refrigerator";
import Security from "@/components/svgs/security";
import SmartLock from "@/components/svgs/smartLock";
import Tv from "@/components/svgs/tv";
import Washer from "@/components/svgs/washer";
import Water from "@/components/svgs/water";
import Wifi from "@/components/svgs/wifi";
import Workspace from "@/components/svgs/workspace";
import useHostingStore from "@/stores/hostingStore";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Step6({ styles }) {
  const { apartmentData, updateApartmentData } = useHostingStore();
  
  const [selectedBasicAmenities, setSelectedBasicAmenities] = useState(apartmentData.basicAmenities || []);
  const [selectedLuxuryAmenities, setSelectedLuxuryAmenities] = useState(apartmentData.luxuryAmenities || []);
  const [selectedSharedAmenities, setSelectedSharedAmenities] = useState(apartmentData.sharedAmenities || []);
  const [otherAmenitiesText, setOtherAmenitiesText] = useState(
    apartmentData.otherAmenities?.join(", ") || ""
  );

  // Update store when amenities change
  useEffect(() => {
    updateApartmentData('basicAmenities', selectedBasicAmenities);
  }, [selectedBasicAmenities]);

  useEffect(() => {
    updateApartmentData('luxuryAmenities', selectedLuxuryAmenities);
  }, [selectedLuxuryAmenities]);

  useEffect(() => {
    updateApartmentData('sharedAmenities', selectedSharedAmenities);
  }, [selectedSharedAmenities]);

  const handleOtherAmenitiesChange = (text) => {
    setOtherAmenitiesText(text);
    // Convert comma-separated string to array
    const amenitiesArray = text
      .split(",")
      .map(item => item.trim())
      .filter(item => item.length > 0);
    updateApartmentData('otherAmenities', amenitiesArray);
  };

  const basicAmenities = [
    { name: "WIFI", icon: Wifi },
    { name: "TV", icon: Tv },
    { name: "Smart Lock", icon: SmartLock },
    { name: "Air Conditioning", icon: AirVent },
    { name: "Refrigerator", icon: Refrigerator },
    { name: "Kitchen", icon: Kitchen },
    { name: "Washer", icon: Washer },
    { name: "Indoor Dining", icon: IndoorDining },
    { name: "Electricity", icon: Electricity },
    { name: "Clean Water", icon: Water },
  ];

  const luxuryAmenities = [
    { name: "Workspace", icon: Workspace },
    { name: "Beach/Lake Access", icon: Beach },
    { name: "Pool Ball", icon: PoolBall },
    { name: "Outdoor Dining", icon: OutdoorDining },
    { name: "Fireplace", icon: Fireplace },
    { name: "Private Gym", icon: Gym },
    { name: "Private Pool", icon: Pool },
    { name: "Private Parking", icon: Parking },
    { name: "BBQ Grill", icon: BBQGrill },
    { name: "Voice Assistant", icon: HomeAssistant },
    { name: "Indoor Piano", icon: Piano },
    { name: "Bathtub", icon: BathTub },
  ];

  const sharedAmenities = [
    { name: "Shared Pool", icon: Pool },
    { name: "Shared Gym", icon: Gym },
    { name: "Shared Workspace", icon: Workspace },
    { name: "Security", icon: Security },
    { name: "Shared Parking", icon: Parking },
    { name: "Generator", icon: Generator },
  ];

  // Helper to split array into rows of 2
  function toRows(arr) {
    const rows = [];
    for (let i = 0; i < arr.length; i += 2) {
      rows.push(arr.slice(i, i + 2));
    }
    return rows;
  }

  const handleBasicAmenitySelect = (name) => {
    setSelectedBasicAmenities((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleLuxuryAmenitySelect = (name) => {
    setSelectedLuxuryAmenities((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleSharedAmenitySelect = (name) => {
    setSelectedSharedAmenities((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>
        Select essentials available in your space.
      </Text>
      <Text style={styles.sectionSubtitle}>
        Choose all amenities that apply
      </Text>

      {/* Basic Amenities */}
      <Text style={[styles.label, { marginTop: 24, marginBottom: 8 }]}>
        Basic Amenities
      </Text>
      <View style={{ marginBottom: 8 }}>
        {toRows(basicAmenities).map((row, idx) => (
          <View
            key={idx}
            style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}
          >
            {row.map((amenity) => {
              const selected = selectedBasicAmenities.includes(amenity.name);
              return (
                <TouchableOpacity
                  key={amenity.name}
                  style={[
                    styles.typeOption,
                    selected && styles.selectedTypeOption,
                    { flex: 1, alignItems: "center", justifyContent: "center" },
                  ]}
                  activeOpacity={0.85}
                  onPress={() => handleBasicAmenitySelect(amenity.name)}
                >
                  <View style={{ marginBottom: 8 }}>
                    <amenity.icon width={32} height={32} />
                  </View>
                  <Text style={styles.labelText}>{amenity.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {/* Luxury Amenities */}
      <Text style={[styles.label, { marginTop: 12, marginBottom: 8 }]}>
        Luxury Amenities
      </Text>
      <View style={{ marginBottom: 8 }}>
        {toRows(luxuryAmenities).map((row, idx) => (
          <View
            key={idx}
            style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}
          >
            {row.map((amenity) => {
              const selected = selectedLuxuryAmenities.includes(amenity.name);
              return (
                <TouchableOpacity
                  key={amenity.name}
                  style={[
                    styles.typeOption,
                    selected && styles.selectedTypeOption,
                    { flex: 1, alignItems: "center", justifyContent: "center" },
                  ]}
                  activeOpacity={0.85}
                  onPress={() => handleLuxuryAmenitySelect(amenity.name)}
                >
                  <View style={{ marginBottom: 8 }}>
                    <amenity.icon width={32} height={32} />
                  </View>
                  <Text style={styles.labelText}>{amenity.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {/* Shared Amenities */}
      <Text style={[styles.label, { marginTop: 12, marginBottom: 8 }]}>
        Shared Amenities
      </Text>
      <View style={{ marginBottom: 8 }}>
        {toRows(sharedAmenities).map((row, idx) => (
          <View
            key={idx}
            style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}
          >
            {row.map((amenity) => {
              const selected = selectedSharedAmenities.includes(amenity.name);
              return (
                <TouchableOpacity
                  key={amenity.name}
                  style={[
                    styles.typeOption,
                    selected && styles.selectedTypeOption,
                    { flex: 1, alignItems: "center", justifyContent: "center" },
                  ]}
                  activeOpacity={0.85}
                  onPress={() => handleSharedAmenitySelect(amenity.name)}
                >
                  <View style={{ marginBottom: 8 }}>
                    <amenity.icon width={32} height={32} />
                  </View>
                  <Text style={styles.labelText}>{amenity.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      <View>
        <Text style={styles.label}>Enter Other Amenities (Optional)</Text>
        <Text style={styles.typeOptionDescription}>
          Add any special features your space offers that are not listed above.
        </Text>
        <TextInput 
          style={styles.input} 
          placeholder="Other Amenities" 
          value={otherAmenitiesText}
          onChangeText={handleOtherAmenitiesChange}
        />
        <Text style={styles.typeOptionDescription}>
          Have something unique in your space? Add it here (e.g., solar panels,
          inverter, pet-friendly area). Make sure to separate each item with a comma.
        </Text>
      </View>
    </View>
  );
}
