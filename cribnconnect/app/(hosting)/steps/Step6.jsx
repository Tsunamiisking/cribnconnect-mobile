import { AirVent, DoorClosedLocked, Refrigerator, Tv, Waves, Wifi } from "lucide-react-native";
import { View, Text } from "react-native";

export default function Step6({ styles }) {
  const basicAmenities = [
    { name: "WIFI", icon: Wifi },
    {name: "TV", icon: Tv},
    {name: "Smart Lock", icon: DoorClosedLocked},
    {name: "Air Conditioning", icon: AirVent},
    {name: "Refrigerator", icon: Refrigerator},
    {name: "Kitchen", icon: Kitchen},
    {name: "Washer", icon: Washer},
    {name: "Indoor Dining", icon: IndoorDining}
  ];

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Select essentials available in your space.</Text>
      <Text style={styles.sectionSubtitle}>Content coming soon...</Text>
    </View>
  );
}
