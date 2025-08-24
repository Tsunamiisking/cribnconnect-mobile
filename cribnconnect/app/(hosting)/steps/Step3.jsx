import { View, Text, TextInput } from "react-native";

export default function Step3({ styles }) {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>How many rooms are available?</Text>
      <Text style={styles.sectionSubtitle}>
        Select the number of rooms and bathrooms available
      </Text>
      <View>
        <View className="flex-row items-center justify-between">
          <Text style={styles.label}>Beds:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) => updateField("step3Beds", text)}
          />
        </View>
        <View className="flex-row items-center justify-between">
          <Text style={styles.label}>Rooms:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) => updateField("step3Rooms", text)}
          />
        </View>
        <View className="flex-row items-center justify-between">
          <Text style={styles.label}>Private bathroom inside room:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) => updateField("step3Bathrooms", text)}
          />
        </View>
        <View className="flex-row items-center justify-between">
          <Text style={styles.label}>Private bathroom outside room:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) => updateField("step3Bathrooms", text)}
          />
        </View>
        <View className="flex-row items-center justify-between">
          <Text style={styles.label}>Shared bathrooms:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) => updateField("step3Bathrooms", text)}
          />
        </View>
      </View>
    </View>
  );
}
