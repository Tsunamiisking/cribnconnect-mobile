import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import HostingButtonNav from "@/components/HostingButtonNav";
import BackHeader from "@/components/BackHeader";
import StepApartmentType from "./steps/StepApartmentType";
import StepSpace from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import Step5 from "./steps/Step5";
import Step6 from "./steps/Step6";
import Step7 from "./steps/Step7";
import Step8 from "./steps/Step8";
import Step9 from "./steps/Step9";
import Step10 from "./steps/Step10";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddApartmentScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    apartmentType: "", // Step 1
    step2Space: "", // Step 2
    step3Value: {
      beds: "",
      rooms: "",
      privateBathIn: "",
      privateBathOut: "",
      sharedBath: "",
    }, // Step 3
    step4Value: {
      complexType: "", // 'yes' or 'no'
      complexName: "",
      address: "",
      state: "",
      city: "",
      zip: "",
      country: "",
    }, // Step 4
    step5Value: {
      title: "",
      description: "",
    }, // Step 5
    step6Value: {
      amenities: [],
      otherAmenities: "",
    }, // Step 6
    step7Value: {
      perNight: "",
      perWeek: "",
    }, // Step 7
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

  // Apartment type options moved to StepApartmentType.jsx

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepApartmentType
            value={formData.apartmentType}
            onSelect={type => updateField('apartmentType', type)}
            styles={styles}
          />
        );
      case 2:
        return (
          <StepSpace
            value={formData.step2Space}
            onSelect={space => updateField('step2Space', space)}
            styles={styles}
          />
        );
      case 3:
        return (
          <Step3
            value={formData.step3Value}
            onChange={val => updateField('step3Value', val)}
            styles={styles}
          />
        );
      case 4:
        return (
          <Step4
            value={formData.step4Value}
            onChange={val => updateField('step4Value', val)}
            styles={styles}
          />
        );
      case 5:
        return (
          <Step5
            value={formData.step5Value}
            onChange={val => updateField('step5Value', val)}
            styles={styles}
          />
        );
      case 6:
        return (
          <Step6
            value={formData.step6Value}
            onChange={val => updateField('step6Value', val)}
            styles={styles}
          />
        );
      case 7:
        return (
          <Step7
            value={formData.step7Value}
            onChange={val => updateField('step7Value', val)}
            styles={styles}
          />
        );
      case 8:
        return <Step8 styles={styles} />;
      case 9:
        return <Step9 styles={styles} />;
      case 10:
        return <Step10 styles={styles} />;
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
            style={[styles.progressFill, { width: `${(currentStep / 10) * 100}%` }]}
          />
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        // keyboardVerticalOffset={80}
      >
        <ScrollView style={styles.content}>
          {renderStepContent()}
          <HostingButtonNav
            onNext={nextStep}
            onBack={previousStep}
            currentStep={currentStep}
            totalSteps={10}
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
    flexWrap: 'wrap',
    width: '100%',
  },
  sectionSubtitle: {
    color: "#6b7280",
    fontFamily: "Sora-regular",
    marginBottom: 12,
    flexWrap: 'wrap',
    width: '100%',
  },
  verticalOptions: {
    marginTop: 16,
    gap: 10,
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
    flexWrap: 'wrap',
    width: '100%',
  },
  typeOptionDescription: {
    fontSize: 14,
    marginTop: 6,
    color: Colors.gray600,
    fontFamily: "Sora-Regular",
    flexWrap: 'wrap',
    width: '100%',
  },
  selectedTypeOptionText: {
    color: Colors.primary,
    flexWrap: 'wrap',
    width: '100%',
  },
  inputView: {
    display: "flex",
    flexDirection: "row",
    fontSize: 16,
    fontFamily: "Sora-SemiBold",
    alignItems: "center",
    paddingVertical: 12,
    paddingLeft: 12,
    paddingRight: 8,
    borderWidth: 1,
    width: 80,
    height: 50,
    borderColor: Colors.borderColor,
    borderRadius: 12,
    marginBottom: 12,
  },
  label: {
    fontSize: 18,
    color: Colors.primary,
    fontFamily: "Sora-SemiBold",
  },
  input: {
    width: "100%",
    flex: 1,
    height: 60,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 12,
    // marginBottom: 12,
    fontSize: 16,
    color: Colors.primary,
    fontFamily: "Sora-Regular",
    marginTop: 12,
    paddingHorizontal: 16,
  },
  inputArea: {
    flex: 1,
    minHeight: 140,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 12,
    fontSize: 16,
    color: Colors.primary,
    fontFamily: "Sora-Regular",
    marginTop: 12,
    paddingLeft: 16,
    paddingTop: 16,
  },
  labelText: {
    fontSize: 16,
    color: Colors.primary,
    fontFamily: "Sora-Regular",
  },
  uploadContainer: {
    borderWidth: 1,
    height: 200,
    borderColor: Colors.borderColor,
    borderRadius: 12,
    padding: 12,
    marginTop: 24,
    backgroundColor: "#f9fafb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadButton: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    width: 160,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 12,
  },
});
