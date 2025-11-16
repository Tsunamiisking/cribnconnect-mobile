import BackHeader from "@/components/BackHeader";
import HostingButtonNav from "@/components/HostingButtonNav";
import { Colors } from "@/constants/Colors";
import useHostingStore from "@/stores/hostingStore";
import { router } from "expo-router";
import { useEffect, useState } from "react";
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
import StepSpace from "./apartmentSteps/Step2";
import Step3 from "./apartmentSteps/Step3";
import Step4 from "./apartmentSteps/Step4";
import Step5 from "./apartmentSteps/Step5";
import Step6 from "./apartmentSteps/Step6";
import Step7 from "./apartmentSteps/Step7";
import Step8 from "./apartmentSteps/Step8";
import Step9 from "./apartmentSteps/Step9";
import StepApartmentType from "./apartmentSteps/StepApartmentType";

export default function AddApartmentScreen() {
  const [isSubmittingData, setIsSubmittingData] = useState(false);
  
  // Get store state and actions
  const {
    getCurrentStep,
    apartmentData,
    setHostingType,
    setCurrentStep,
    nextStep,
    previousStep,
    updateApartmentData,
    updateApartmentNestedData,
    submitListing,
    submitListingOptimistic,
    saveAsDraft,
    isSubmitting,
    isStepValid,
  } = useHostingStore();

  const currentStep = getCurrentStep();

  // Set hosting type when component mounts
  useEffect(() => {
    setHostingType('apartment');
  }, [setHostingType]);

  const handleNext = () => {
    if (currentStep < 9) {
      nextStep();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      previousStep();
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!apartmentData.title || !apartmentData.description) {
      Alert.alert('Missing Information', 'Please provide a title and description for your apartment.');
      return;
    }
    
    if (!apartmentData.address?.city || !apartmentData.address?.state) {
      Alert.alert('Missing Location', 'Please provide the location details.');
      return;
    }
    
    if (!apartmentData.pricePerNight || parseFloat(apartmentData.pricePerNight) <= 0) {
      Alert.alert('Missing Price', 'Please set a valid price per night.');
      return;
    }
    
    if (!apartmentData.media || apartmentData.media.length === 0) {
      Alert.alert('No Photos', 'Please add at least one photo of your apartment.');
      return;
    }
    
    setIsSubmittingData(true);
    
    try {
      // Use optimistic submission - adds to queue and uploads in background
      const result = await submitListingOptimistic();
      
      if (result.success) {
        Alert.alert(
          'Uploading! 📤',
          result.message || 'Your apartment is being uploaded in the background. Check the Host Dashboard to see the progress.',
          [
            {
              text: 'View Dashboard',
              onPress: () => router.push("/(hosting)/my-hosted-items"),
            },
          ]
        );
      } else {
        Alert.alert(
          'Submission Failed',
          result.error || 'Failed to submit your listing. Please try again.',
          [
            { text: 'OK' }
          ]
        );
      }
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert(
        'Error',
        'An unexpected error occurred. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmittingData(false);
    }
  };

  const handleSaveDraft = () => {
    try {
      const draftId = saveAsDraft();
      Alert.alert(
        'Draft Saved',
        'Your progress has been saved. You can continue editing later.',
        [{ text: 'OK' }]
      );
      console.log('Draft saved with ID:', draftId);
    } catch (error) {
      Alert.alert('Error', 'Failed to save draft. Please try again.');
      console.error('Save draft error:', error);
    }
  };

  // Apartment type options moved to StepApartmentType.jsx

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepApartmentType
            styles={styles}
          />
        );
      case 2:
        return (
          <StepSpace
            styles={styles}
          />
        );
      case 3:
        return (
          <Step3
            styles={styles}
          />
        );
      case 4:
        return (
          <Step4
            styles={styles}
          />
        );
      case 5:
        return (
          <Step5
            styles={styles}
          />
        );
      case 6:
        return (
          <Step6
            styles={styles}
          />
        );
      case 7:
        return (
          <Step7
            styles={styles}
          />
        );
      case 8:
        return <Step8 styles={styles} />;
      case 9:
        return <Step9 styles={styles} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <BackHeader title="Add Apartment" showUser={true} />
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(currentStep / 9) * 100}%` },
            ]}
          />
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        // keyboardVerticalOffset={80}
      >
        <ScrollView style={styles.content}>
          {isSubmittingData && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          )}
          {renderStepContent()}
          <HostingButtonNav
            onNext={handleNext}
            onBack={handlePrevious}
            onSubmit={handleSubmit}
            onSaveDraft={handleSaveDraft}
            currentStep={currentStep}
            totalSteps={9}
            isSubmitting={isSubmitting || isSubmittingData}
            isStepValid={isStepValid(currentStep)}
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});
