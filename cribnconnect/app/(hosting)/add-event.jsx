import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import BackHeader from "@/components/BackHeader";

export default function AddEventScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    title: "",
    description: "",
    category: "",

    // Date & Time
    date: "",
    startTime: "",
    endTime: "",

    // Location
    venue: "",
    address: "",
    city: "",
    state: "",

    // Details
    ticketPrice: "",
    capacity: "",
    ageRestriction: "",
    dressCode: "",

    // Requirements
    requirements: [],

    // Contact
    organizer: "",
    contactEmail: "",
    contactPhone: "",
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitEvent = () => {
    // TODO: Add API integration to submit event
    // Example API call:
    // try {
    //   const response = await api.createEvent(formData);
    //   if (response.success) {
    //     router.push('/(tabs)/events');
    //   }
    // } catch (error) {
    //   // Handle error
    // }

    console.log("Submitting event:", formData);
    router.push("/(tabs)/events");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View>
            <Text>Event Information</Text>
          </View>
        );

      case 2:
        return (
          <View>
            <Text>Event Information</Text>
          </View>
        );

      case 3:
        return (
          <View>
            <Text>Event Information</Text>
          </View>
        );

      case 4:
        return (
          <View>
            <Text>Event Information</Text>
          </View>
        );

      case 5:
        return (
          <View>
            <Text>Event Information</Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <BackHeader title="Add Event" />
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
    flexWrap: "wrap",
    width: "100%",
  },
  sectionSubtitle: {
    color: "#6b7280",
    fontFamily: "Sora-regular",
    marginBottom: 12,
    flexWrap: "wrap",
    width: "100%",
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
    flexWrap: "wrap",
    width: "100%",
  },
  typeOptionDescription: {
    fontSize: 14,
    marginTop: 6,
    color: Colors.gray600,
    fontFamily: "Sora-Regular",
    flexWrap: "wrap",
    width: "100%",
  },
  selectedTypeOptionText: {
    color: Colors.primary,
    flexWrap: "wrap",
    width: "100%",
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
    color: "#111827",
    fontSize: 18,
    color: Colors.primary,
    fontFamily: "Sora-Regular",
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
  warning: {
    color: Colors.warning,
    fontFamily: "Sora-Regular",
    fontSize: 14,
    marginTop: 6,
    flexWrap: "wrap",
    width: "100%",
  },
});
