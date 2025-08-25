import { View, Text, TouchableOpacity,TextInput } from "react-native";
import { useState } from "react";
import Wifi from "@/components/svgs/wifi";
import Tv from "@/components/svgs/tv";
import SmartLock from "@/components/svgs/smartLock";
import Water from "@/components/svgs/water";
import Washer from "@/components/svgs/washer";
import AirVent from "@/components/svgs/airVent";
import Electricity from "@/components/svgs/electricity";
import Refrigerator from "@/components/svgs/refrigerator";
import Kitchen from "@/components/svgs/kichen";
import BathTub from "@/components/svgs/bathTub";
import IndoorDining from "@/components/svgs/indoorDining";
import Workspace from "@/components/svgs/workspace";
import Beach from "@/components/svgs/beach";
import PoolBall from "@/components/svgs/poolBall";
import OutdoorDining from "@/components/svgs/outdoorDining";
import Fireplace from "@/components/svgs/fireplace";
import Gym from "@/components/svgs/gym";
import Pool from "@/components/svgs/pool";
import Parking from "@/components/svgs/parking";
import BBQGrill from "@/components/svgs/bbqGrill";
import HomeAssistant from "@/components/svgs/homeAssistant";
import Piano from "@/components/svgs/piano";
import Security from "@/components/svgs/security";
import Generator from "@/components/svgs/generator";

export default function Step6({ styles }) {
  const [selectedAmenities, setSelectedAmenities] = useState([]);

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

  const handleSelect = (name) => {
    setSelectedAmenities((prev) =>
      prev.includes(name)
        ? prev.filter((n) => n !== name)
        : [...prev, name]
    );
  };

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Select essentials available in your space.</Text>
      <Text style={styles.sectionSubtitle}>Choose all amenities that apply</Text>

      {/* Basic Amenities */}
      <Text style={[styles.label, { marginTop: 24, marginBottom: 8 }]}>Basic Amenities</Text>
      <View style={{ marginBottom: 8 }}>
        {toRows(basicAmenities).map((row, idx) => (
          <View key={idx} style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
            {row.map((amenity) => {
              const selected = selectedAmenities.includes(amenity.name);
              return (
                <TouchableOpacity
                  key={amenity.name}
                  style={[styles.typeOption, selected && styles.selectedTypeOption, { flex: 1, alignItems: 'center', justifyContent: 'center' }]}
                  activeOpacity={0.85}
                  onPress={() => handleSelect(amenity.name)}
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
      <Text style={[styles.label, { marginTop: 12, marginBottom: 8 }]}>Luxury Amenities</Text>
      <View style={{ marginBottom: 8 }}>
        {toRows(luxuryAmenities).map((row, idx) => (
          <View key={idx} style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
            {row.map((amenity) => {
              const selected = selectedAmenities.includes(amenity.name);
              return (
                <TouchableOpacity
                  key={amenity.name}
                  style={[styles.typeOption, selected && styles.selectedTypeOption, { flex: 1, alignItems: 'center', justifyContent: 'center' }]}
                  activeOpacity={0.85}
                  onPress={() => handleSelect(amenity.name)}
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
      <Text style={[styles.label, { marginTop: 12, marginBottom: 8 }]}>Shared Amenities</Text>
      <View style={{ marginBottom: 8 }}>
        {toRows(sharedAmenities).map((row, idx) => (
          <View key={idx} style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
            {row.map((amenity) => {
              const selected = selectedAmenities.includes(amenity.name);
              return (
                <TouchableOpacity
                  key={amenity.name}
                  style={[styles.typeOption, selected && styles.selectedTypeOption, { flex: 1, alignItems: 'center', justifyContent: 'center' }]}
                  activeOpacity={0.85}
                  onPress={() => handleSelect(amenity.name)}
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
          <Text style={styles.label}>Enter Other Amenities</Text>
          <TextInput style={styles.input} placeholder="Other Amenities" />
          <Text style={styles.typeOptionDescription}>Additional amenities can help your listing stand out! separate them with commas.(Example: Pool, Gym, Parking)</Text>
        </View>
    </View>
  );
}
