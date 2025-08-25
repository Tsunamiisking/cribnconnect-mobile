import { View, Text, TextInput } from "react-native";

export default function Step7({ value, onChange, styles }) {
  // value: { perNight: string, perWeek: string }
  const handleNightChange = (text) => {
    onChange({ ...value, perNight: text });
  };
  const handleWeekChange = (text) => {
    onChange({ ...value, perWeek: text });
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
          value={value?.perNight || ""}
          onChangeText={handleNightChange}
        />
        <Text style={[styles.labelText, { marginTop: 8, marginLeft: 12 } ]}>{value?.perNight || ""}</Text>
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
          value={value?.perWeek || ""}
          onChangeText={handleWeekChange}
        />
        <Text style={[styles.labelText, { marginTop: 8, marginLeft: 12 } ]}>{value?.perWeek || ""}</Text>
      </View>
    </View>
  );
}
