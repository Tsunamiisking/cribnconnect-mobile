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
  Hotel,
  Caravan,
  Container,
  Trees,
  Barn,
  Tent,
  Sparkle,
  Ship,
  Building2,
} from "lucide-react-native";
import HostingButtonNav from "@/components/HostingButtonNav";
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
    { type: "Apartment", icon: Building2 },
    { type: "Boat", icon: Ship },
    { type: "Hotel", icon: Hotel },
    { type: "Camper", icon: Caravan },
    { type: "Container", icon: Container },
    { type: "Cabin", icon: Trees },
    // { type: "Farmhouse", icon: Barn },
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
                    style={[styles.typeOption, selected && styles.selectedTypeOption]}
                    activeOpacity={0.85}
                    onPress={() => updateField("apartmentType", type)}
                  >
                    <View style={styles.typeOptionRow}>
                      <View style={styles.typeIcon}>
                        <Icon size={28} color={Colors.black} />
                      </View>
                      <Text style={[styles.typeOptionText, selected && styles.selectedTypeOptionText]}>
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
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(currentStep / 10) * 100}%` },
            ]}
          />
        </View>
      </View>

      <ScrollView style={styles.content}>
        {renderStepContent()}
        <HostingButtonNav
          onNext={nextStep}
          onBack={previousStep}
          currentStep={currentStep}
          totalSteps={10}
        />
      </ScrollView>
      {/* Navigation buttons removed. User is redirected to next step on option select. */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    paddingHorizontal: 24,
    backgroundColor: Colors.white,
  },
  stepCounter: {
    textAlign: "center",
    color: Colors.white,
    marginBottom: 8,
  },
  progressBar: {
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
    fontSize: 28,
    fontFamily: "Urbanist-Bold",
    color: Colors.primary,
    marginVertical: 12,
  },
  sectionSubtitle: {
    color: "#6b7280",
    fontFamily: "Sora-regular",
    marginBottom: 12,
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
    fontFamily: "Sora-Regular",
  },
  selectedTypeOptionText: {
    color: Colors.primary,
  },
});
