import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Colors } from "@/constants/Colors";
import React from "react";

const HostingButtonNav = ({ 
  onNext, 
  onBack, 
  onSubmit,
  onSaveDraft,
  currentStep, 
  totalSteps,
  isSubmitting = false,
  isStepValid = true
}) => {
  const isLastStep = currentStep === totalSteps;
  
  const handlePrimaryAction = () => {
    if (isLastStep) {
      onSubmit?.();
    } else {
      onNext?.();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onBack}
        disabled={currentStep === 1}
        style={[styles.navButton, currentStep === 1 && { opacity: 0.5 }]}
      >
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      
      {onSaveDraft && (
        <TouchableOpacity
          onPress={onSaveDraft}
          style={[styles.navButton, styles.draftButton]}
          disabled={isSubmitting}
        >
          <Text style={styles.draftText}>Save Draft</Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity
        style={[
          styles.nextButton, 
          styles.navButton,
          (!isStepValid || isSubmitting) && { opacity: 0.5 }
        ]}
        onPress={handlePrimaryAction}
        disabled={!isStepValid || isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color={Colors.white} size="small" />
        ) : (
          <Text style={styles.nextText}>
            {isLastStep ? "Submit" : "Next"}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 20,
    marginVertical: 12,
    backgroundColor: Colors.white,
  },
  leftButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  navButton: {
    minWidth: 80,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    minWidth: 100,
  },
  draftButton: {
    backgroundColor: 'transparent',
    // borderWidth: 1,
    // borderColor: Colors.primary,
  },
  backText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  nextText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  draftText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
});

export default HostingButtonNav;
