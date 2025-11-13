import useHostingStore from "@/stores/hostingStore";
import { Text, TextInput, View } from "react-native";

export default function Step7({ styles }) {
  const { apartmentData, updateApartmentData } = useHostingStore();

  const handlePricePerNightChange = (value) => {
    updateApartmentData('pricePerNight', value);
  };

  const handlePricePerWeekChange = (value) => {
    updateApartmentData('pricePerWeek', value);
  };

  // Helper to format price with naira sign, commas, and .00
  const formatNaira = (amount) => {
    if (!amount || isNaN(amount)) return "";
    const num = parseFloat(amount.replace(/,/g, ""));
    return `₦${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>How much does your space cost</Text>
      <Text style={styles.sectionSubtitle}>Specify your price range</Text>

      <View>
        <Text style={styles.label}>Amount Per Night </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Price Per Night"
          placeholderTextColor="#B0B0B0"
          keyboardType="numeric"
          value={apartmentData.pricePerNight || ""}
          onChangeText={handlePricePerNightChange}
        />
        <Text style={[styles.labelText, { marginTop: 8, marginLeft: 12 } ]}>{formatNaira(apartmentData.pricePerNight)}</Text>
      </View>
      <View style={{ marginVertical: 24, position: 'relative', justifyContent: 'center', alignItems: 'center', height: 24 }}>
        <View style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, backgroundColor: '#B0B0B0' }} />
        <View style={{ backgroundColor: '#fff', paddingHorizontal: 8 }}>
          <Text style={[styles.labelText]}>Optional</Text>
        </View>
      </View>

     <View>
        <Text style={[styles.label, { marginTop: 12 }]}>Amount Per Week </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Price Per Week"
          placeholderTextColor="#B0B0B0"
          keyboardType="numeric"
          value={apartmentData.pricePerWeek || ""}
          onChangeText={handlePricePerWeekChange}
        />
        <Text style={[styles.labelText, { marginTop: 8, marginLeft: 12 } ]}>{formatNaira(apartmentData.pricePerWeek)}</Text>
      </View>
    </View>
  );
}
