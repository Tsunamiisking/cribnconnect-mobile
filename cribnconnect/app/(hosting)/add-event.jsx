import BackHeader from "@/components/BackHeader";
import HostingButtonNav from "@/components/HostingButtonNav";
import { Colors } from "@/constants/Colors";
import useHostingStore from "@/stores/hostingStore";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EventAddress from "./eventSteps/EventAddress";
import EventDate from "./eventSteps/EventDate";
import EventImages from "./eventSteps/EventImages";
import EventSafetyTips from "./eventSteps/EventSafetyTips";
import EventSpecialPerks from "./eventSteps/EventSpecialPerks";
import EventTicket from "./eventSteps/EventTicket";
import EventTitle from "./eventSteps/EventTitle";
import EventType from "./eventSteps/EventType";

export default function AddEventScreen() {
  const {
    getCurrentStep,
    eventData,
    hostingType,
    setHostingType,
    setCurrentStep,
    nextStep,
    previousStep,
    submitListing,
    submitListingOptimistic,
    saveAsDraft,
    isSubmitting,
    isStepValid,
  } = useHostingStore();

  const currentStep = getCurrentStep();

  // Set hosting type to event when component mounts
  useEffect(() => {
    if (hostingType !== 'event') {
      setHostingType('event');
      setCurrentStep(1);
    }
  }, []);

  const handleNext = () => {
    console.log('=== HANDLE NEXT CALLED ===');
    console.log('Current Step:', currentStep);
    console.log('Is Step Valid:', isStepValid(currentStep));
    
    if (currentStep < 8) {
      nextStep();
    } else {
      console.log('Calling handleSubmit...');
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      previousStep();
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    console.log('=== SUBMIT CLICKED ===');
    console.log('Event Data:', eventData);
    
    // Validate required fields
    if (!eventData.title?.trim()) {
      Alert.alert("Missing Information", "Please provide an event title");
      return;
    }

    if (!eventData.description?.trim()) {
      Alert.alert("Missing Information", "Please provide an event description");
      return;
    }

    if (!eventData.location?.street?.trim()) {
      Alert.alert("Missing Information", "Please provide an event location");
      return;
    }

    if (!eventData.date) {
      Alert.alert("Missing Information", "Please select an event date");
      return;
    }

    if (!eventData.time?.trim()) {
      Alert.alert("Missing Information", "Please provide an event time");
      return;
    }

    if (!eventData.capacity || eventData.capacity <= 0) {
      Alert.alert("Missing Information", "Please provide event capacity");
      return;
    }

    if (!eventData.isFree && (!eventData.ticketTypes || eventData.ticketTypes.length === 0)) {
      Alert.alert("Missing Information", "Please add at least one ticket type or mark event as free");
      return;
    }

    console.log('=== ALL VALIDATIONS PASSED ===');
    
    // Optional: Check for media files
    if (!eventData.media || eventData.media.length === 0) {
      Alert.alert(
        "No Event Photos",
        "Are you sure you want to submit without any photos?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Continue",
            onPress: submitEvent
          }
        ]
      );
      return;
    }

    // If all validations pass, submit
    await submitEvent();
  };

  const submitEvent = async () => {
    // Use optimistic submission - adds to queue and uploads in background
    const result = await submitListingOptimistic();
    
    if (result.success) {
      Alert.alert(
        "Uploading! 📤",
        result.message || "Your event is being uploaded in the background. A group chat will be created for attendees once complete. Check the Host Dashboard to see the progress.",
        [
          {
            text: "View Dashboard",
            onPress: () => router.push("/(hosting)/my-hosted-items")
          }
        ]
      );
    } else {
      Alert.alert(
        "Error",
        result.error || "Failed to create event. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const handleSaveDraft = () => {
    const draftId = saveAsDraft();
    console.log('Event draft saved with ID:', draftId);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <EventType styles={styles} />;
      case 2:
        return <EventTitle styles={styles} />;
      case 3:
        return <EventAddress styles={styles} />;
      case 4:
        return <EventImages styles={styles} />;
      case 5:
        return <EventTicket styles={styles} />;
      case 6:
        return <EventDate styles={styles} />;
      case 7:
        return <EventSpecialPerks styles={styles} />;
      case 8:
        return <EventSafetyTips styles={styles} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <BackHeader title="Add Event" showUser={true} />
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(currentStep / 8) * 100}%` },
            ]}
          />
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={styles.content}>
          {renderStepContent()}
          <HostingButtonNav
            onNext={handleNext}
            onBack={handleBack}
            onSubmit={handleSubmit}
            onSaveDraft={handleSaveDraft}
            currentStep={currentStep}
            totalSteps={8}
            isValid={isStepValid(currentStep)}
            isSubmitting={isSubmitting}
            isLastStep={currentStep === 8}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Loading Overlay */}
      {isSubmitting && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
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
    fontFamily: "Sora-Regular",
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});
