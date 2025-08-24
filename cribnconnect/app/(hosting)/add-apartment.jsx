import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  House,
  Building,
  Boat,
  Hotel,
  Caravan,
  Container,
  Trees,
  Barn,
  Tent,
  Sparkle,
} from "lucide-react-native";
import BackHeader from "@/components/BackHeader";
import { useState } from "react";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddApartmentScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    apartmentType: "", // Step 1
    // ...existing fields for future steps
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 10) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitListing = () => {
    // TODO: Add API integration to submit apartment listing
    console.log("Submitting apartment listing:", formData);
    router.push("/(tabs)");
  };

  const apartmentTypeOptions = [
    { type: "House", icon: House },
    { type: "Apartment", icon: Building },
    { type: "Boat", icon: Boat },
    { type: "Hotel", icon: Hotel },
    { type: "Camper", icon: Caravan },
    { type: "Container", icon: Container },
    { type: "Cabin", icon: Trees },
    { type: "Farmhouse", icon: Barn },
    { type: "Tent", icon: Tent },
    { type: "Other", icon: Sparkle },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>
              How would you describe your space?
            </Text>
            <Text style={styles.sectionSubtitle}>
              Select the type of place you want to list
            </Text>
            <View style={styles.verticalOptions}>
              {apartmentTypeOptions.map(({ type, icon: Icon }) => {
                const selected = formData.apartmentType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeOption,
                      selected && styles.selectedTypeOption,
                    ]}
                    activeOpacity={0.85}
                    onPress={() => updateField("apartmentType", type)}
                  >
                    <View style={styles.typeOptionRow}>
                      <View style={styles.typeIcon}>
                        <Icon size={28} color={Colors.black} />
                      </View>
                      <Text
                        style={[
                          styles.typeOptionText,
                          selected && styles.selectedTypeOptionText,
                        ]}
                      >
                        {type}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Step 2</Text>
            <Text style={styles.sectionSubtitle}>Content coming soon...</Text>
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Step 3</Text>
            <Text style={styles.sectionSubtitle}>Content coming soon...</Text>
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Step 4</Text>
            <Text style={styles.sectionSubtitle}>Content coming soon...</Text>
          </View>
        );
      case 5:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Step 5</Text>
            <Text style={styles.sectionSubtitle}>Content coming soon...</Text>
          </View>
        );
      case 6:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Step 6</Text>
            <Text style={styles.sectionSubtitle}>Content coming soon...</Text>
          </View>
        );
      case 7:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Step 7</Text>
            <Text style={styles.sectionSubtitle}>Content coming soon...</Text>
          </View>
        );
      case 8:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Step 8</Text>
            <Text style={styles.sectionSubtitle}>Content coming soon...</Text>
          </View>
        );
      case 9:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Step 9</Text>
            <Text style={styles.sectionSubtitle}>Content coming soon...</Text>
          </View>
        );
      case 10:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Step 10</Text>
            <Text style={styles.sectionSubtitle}>Content coming soon...</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <BackHeader title="Add Apartment" />
      <View style={styles.progressContainer}>
        <Text style={styles.stepCounter}>Step {currentStep} of 10</Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(currentStep / 10) * 100}%` },
            ]}
          />
        </View>
      </View>

      <ScrollView style={styles.content}>{renderStepContent()}</ScrollView>

      <View style={styles.navigationContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.navButton, styles.backButton]}
            onPress={previousStep}
            disabled={currentStep === 1}
          >
            <Text style={styles.backButtonText}>
              {currentStep === 1 ? "Cancel" : "Back"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, styles.nextButton]}
            onPress={currentStep === 10 ? submitListing : nextStep}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === 10 ? "Submit Listing" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  // },
  progressContainer: {
    paddingHorizontal: 24,
    // paddingVertical: ,
    backgroundColor: "#f9fafb",
  },
  stepCounter: {
    textAlign: "center",
    color: Colors.white,
    marginBottom: 8,
  },
  progressBar: {
    // backgroundColor: '#e5e7eb',
    height: 8,
    borderRadius: 4,
  },
  progressFill: {
    backgroundColor: Colors.primary,
    height: "100%",
    borderRadius: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontFamily: "Sora-Bold",
    color: "#111827",
    marginBottom: 14,
  },
  sectionSubtitle: {
    color: "#6b7280",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  verticalOptions: {
    marginTop: 16,
    gap: 12,
  },
  typeOption: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  typeOptionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  typeIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  selectedTypeOption: {
    backgroundColor: Colors.blue50,
    borderColor: Colors.primary,
  },
  typeOptionText: {
    fontSize: 18,
    color: "#111827",
    fontFamily: "Sora-SemiBold",
  },
  selectedTypeOptionText: {
    color: Colors.primary,
  },
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  amenityButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedAmenityButton: {
    backgroundColor: "#2563eb",
  },
  amenityButtonText: {
    color: "#374151",
  },
  selectedAmenityButtonText: {
    color: "white",
  },
  disclaimer: {
    backgroundColor: "#eff6ff",
    padding: 16,
    borderRadius: 8,
  },
  disclaimerText: {
    color: "#1d4ed8",
    fontSize: 14,
  },
  navigationContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButton: {
    backgroundColor: "#f3f4f6",
    marginRight: 12,
  },
  nextButton: {
    backgroundColor: "#2563eb",
    marginLeft: 12,
  },
  backButtonText: {
    textAlign: "center",
    color: "#374151",
    fontWeight: "500",
  },
  nextButtonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "500",
  },
});
