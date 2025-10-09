import { Colors } from "@/constants/Colors";
import useHostingStore from "@/stores/hostingStore";
import { AlertTriangle, Plus, X } from "lucide-react-native";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function EventSafetyTips({ styles }) {
  const { eventData, updateEventData } = useHostingStore();
  const [newTip, setNewTip] = useState("");
  const [showAddTip, setShowAddTip] = useState(false);

  const safetyTips = eventData.eventSafetyTips || [];

  // Predefined common safety tips
  const commonSafetyTips = [
    "Please arrive 30 minutes early for security check",
    "Valid ID required for entry",
    "No outside food or beverages allowed", 
    "Follow all venue safety guidelines",
    "Emergency exits are clearly marked",
    "Report any suspicious activity to security",
    "Keep personal belongings secure at all times",
    "No smoking inside the venue",
    "Follow social distancing guidelines if applicable",
    "Wear comfortable shoes for standing events",
  ];

  const addSafetyTip = (tip) => {
    if (!tip.trim()) {
      Alert.alert('Error', 'Please enter a safety tip');
      return;
    }

    if (tip.length > 200) {
      Alert.alert('Error', 'Safety tip must be less than 200 characters');
      return;
    }

    if (safetyTips.includes(tip.trim())) {
      Alert.alert('Error', 'This safety tip has already been added');
      return;
    }

    const updatedTips = [...safetyTips, tip.trim()];
    updateEventData('eventSafetyTips', updatedTips);
    setNewTip("");
    setShowAddTip(false);
  };

  const removeSafetyTip = (index) => {
    const updatedTips = safetyTips.filter((_, i) => i !== index);
    updateEventData('eventSafetyTips', updatedTips);
  };

  const addCommonTip = (tip) => {
    addSafetyTip(tip);
  };

  const getAvailableCommonTips = () => {
    return commonSafetyTips.filter(tip => !safetyTips.includes(tip));
  };

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Safety Guidelines & Information</Text>
      <Text style={styles.sectionSubtitle}>
        Add important safety information and guidelines for your attendees (Optional)
      </Text>

      <View style={{ marginTop: 24 }}>
        {/* Current Safety Tips */}
        {safetyTips.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <Text style={styles.label}>Your Safety Guidelines</Text>
            {safetyTips.map((tip, index) => (
              <View key={index} style={[styles.typeOption, { marginBottom: 8 }]}>
                <View style={styles.typeOptionRow}>
                  <AlertTriangle size={16} color={Colors.warning} />
                  <Text style={[styles.labelText, { flex: 1, marginLeft: 8 }]}>
                    {tip}
                  </Text>
                  <TouchableOpacity
                    onPress={() => removeSafetyTip(index)}
                    style={{
                      padding: 4,
                      backgroundColor: Colors.gray200,
                      borderRadius: 4,
                    }}
                  >
                    <X size={14} color={Colors.gray600} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Add Custom Safety Tip */}
        <View style={{ marginBottom: 24 }}>
          <Text style={styles.label}>Add Custom Safety Tip</Text>
          {!showAddTip ? (
            <TouchableOpacity
              onPress={() => setShowAddTip(true)}
              style={[styles.typeOption, { backgroundColor: Colors.blue50 }]}
            >
              <View style={styles.typeOptionRow}>
                <Plus size={20} color={Colors.primary} />
                <Text style={[styles.labelText, { color: Colors.primary }]}>
                  Add Custom Safety Guideline
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={[styles.typeOption, styles.selectedTypeOption]}>
              <Text style={[styles.labelText, { marginBottom: 8 }]}>
                Enter Safety Guideline
              </Text>
              <TextInput
                style={[styles.input, { marginBottom: 12, height: 80 }]}
                placeholder="e.g., Please bring a valid ID for entry verification"
                value={newTip}
                onChangeText={setNewTip}
                multiline
                maxLength={200}
                textAlignVertical="top"
              />
              <Text style={[styles.typeOptionDescription, { marginBottom: 12 }]}>
                {newTip.length}/200 characters
              </Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                  onPress={() => addSafetyTip(newTip)}
                  style={{
                    flex: 1,
                    backgroundColor: Colors.primary,
                    padding: 12,
                    borderRadius: 8,
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ color: 'white', fontFamily: 'Sora-SemiBold' }}>
                    Add Tip
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setShowAddTip(false);
                    setNewTip("");
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: Colors.gray600,
                    padding: 12,
                    borderRadius: 8,
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ color: 'white', fontFamily: 'Sora-SemiBold' }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Common Safety Tips */}
        {getAvailableCommonTips().length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <Text style={styles.label}>Quick Add Common Guidelines</Text>
            <Text style={styles.typeOptionDescription}>
              Tap to add commonly used safety guidelines
            </Text>
            <View style={{ marginTop: 12 }}>
              {getAvailableCommonTips().slice(0, 5).map((tip, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => addCommonTip(tip)}
                  style={[styles.typeOption, { marginBottom: 8 }]}
                >
                  <View style={styles.typeOptionRow}>
                    <Plus size={16} color={Colors.primary} />
                    <Text style={[styles.labelText, { flex: 1, marginLeft: 8 }]}>
                      {tip}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Info Note */}
        <View style={[styles.typeOption, { backgroundColor: Colors.yellow50, borderColor: Colors.warning }]}>
          <View style={styles.typeOptionRow}>
            <AlertTriangle size={20} color={Colors.warning} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.labelText, { color: Colors.warning, marginBottom: 4 }]}>
                Safety First
              </Text>
              <Text style={styles.typeOptionDescription}>
                Clear safety guidelines help ensure a safe and enjoyable experience for all attendees. 
                These will be displayed prominently on your event page.
              </Text>
            </View>
          </View>
        </View>

        {/* Summary */}
        {safetyTips.length > 0 && (
          <View style={{ marginTop: 16 }}>
            <Text style={styles.typeOptionDescription}>
              ✅ {safetyTips.length} safety guideline(s) added
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
