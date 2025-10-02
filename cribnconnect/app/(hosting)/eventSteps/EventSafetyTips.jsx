import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import useHostingStore from "@/stores/hostingStore";

export default function EventSafetyTips({ styles }) {
  const { eventData, updateEventData } = useHostingStore();
  const [refundable, setRefundable] = useState(false);
  const [transferable, setTransferable] = useState(false);
  const [upgradable, setUpgradable] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Initialize from store data
  useEffect(() => {
    if (eventData.safetyTips?.length > 0) {
      // You could parse existing safety tips data here if needed
    }
  }, []);

  const handleSafetyTipsChange = (value) => {
    updateEventData('safetyTips', [value]); // Store as array to match schema
  };

  // Update store when ticket policies change
  useEffect(() => {
    const policies = {
      refundable,
      transferable, 
      upgradable,
      termsAccepted
    };
    updateEventData('ticketPolicies', policies);
  }, [refundable, transferable, upgradable, termsAccepted]);

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Safety Tips or House rules</Text>
      <Text style={styles.sectionSubtitle}>
        Finish your Listing Upload with this final step 🎉
      </Text>

      <View className="mt-6">
        <Text style={styles.label}>Set House rules</Text>
        <TextInput
          style={styles.inputArea}
          placeholder="Enter your safety tips or house rules"
          placeholderTextColor="#B0B0B0"
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          value={eventData.safetyTips?.[0] || ''}
          onChangeText={handleSafetyTipsChange}
        />
      </View>
      <View className="flex-row items-center ">
        <TouchableOpacity
          onPress={() => setRefundable(!refundable)}
          className={`w-10 h-10 border-[#e5e7eb] border-2 rounded-lg items-center justify-center mt-4 mr-4 ${refundable === true ? "bg-[#274046]" : "bg-white"}`}
        />
        <Text style={[styles.labelText, { marginTop: 14 }]}>
          Are Tickets Refundable?
        </Text>
      </View>
      <View className="flex-row items-center ">
        <TouchableOpacity
          onPress={() => setUpgradable(!upgradable)}
          className={`w-10 h-10 border-[#e5e7eb] border-2 rounded-lg items-center justify-center mt-4 mr-4 ${upgradable === true ? "bg-[#274046]" : "bg-white"}`}
        />
        <Text style={[styles.labelText, { marginTop: 14 }]}>
          Are Tickets Upgradable?
        </Text>
      </View>

      <View style={{ marginVertical: 12 }}>
        <Text style={styles.label}>Safety Tips</Text>
        <Text style={styles.warning}>
          * Ensure the venue has clearly marked emergency exits.
        </Text>
        <Text style={styles.warning}>
          * Do not exceed the maximum capacity of the venue.
        </Text>
        <Text style={styles.warning}>
          * Keep fire extinguishers and a first aid kit easily accessible.
        </Text>
        <Text style={styles.warning}>
          * Have trained security or safety personnel on site.
        </Text>
        <Text style={styles.warning}>
          * Ensure electrical connections and equipment are properly set up.
        </Text>
        <Text style={styles.warning}>
          * Provide sufficient lighting in key areas, especially exits and
          parking lots.
        </Text>
        <Text style={styles.warning}>
          * Have an emergency evacuation plan and communicate it to staff.
        </Text>
        <Text style={styles.warning}>
          * Monitor crowd behavior and address conflicts quickly.
        </Text>
        <Text style={styles.warning}>
          * Make sure drinking water is available to prevent dehydration.
        </Text>
        <Text style={styles.warning}>
          * If alcohol is served, encourage responsible drinking and provide
          alternatives.
        </Text>
      </View>

      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={() => setTermsAccepted(!termsAccepted)}
          className={`w-10 h-10 border-[#e5e7eb] border-2 rounded-lg items-center justify-center mt-4 mr-4 ${termsAccepted === true ? "bg-[#274046]" : "bg-white"}`}
        />
        <View className="flex-1">
          <Text style={[styles.typeOptionDescription, { marginTop: 14 }]}>
            I agree to the Cribnconnect safety terms and conditions
          </Text>
        </View>
      </View>
    </View>
  );
}
