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

    const luxuryAmenities = [
    {name: "Workspace", icon: Work},
    {name: "Beach/Lake Access", icon: Waves},
    {name: "Pool Ball", icon: Pool},
    {name: "Outdoor Dining", icon: Dining},
    {name: "Fireplace", icon: Fireplace},
    {name: "Hot Tub", icon: HotTub},
    {name: "Gym Access", icon: Gym},
    {name: "Private Parking", icon: Parking},
    {name: "BBQ Grill", icon: Grill},
    {name: "Home Voice Control", icon: HomeVoiceControl},
    {name: "Indoor Piano", icon: IndoorPiano},
  ];

  const sharedFeatures = [
    {name: "Shared Pool", icon: Pool},
    {name: "Shared Gym", icon: Gym},
    {name: "Shared Workspace", icon: Work},
    {name: "Security", icon: Security},
    {name: "Shared Parking", icon: Parking},
    {name: "Generator", icon: Generator}   
  ]
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Select essentials available in your space.</Text>
      <Text style={styles.sectionSubtitle}>Content coming soon...</Text>
    </View>
  );
}
