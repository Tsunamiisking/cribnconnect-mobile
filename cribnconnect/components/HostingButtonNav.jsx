import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import React from "react";

const HostingButtonNav = ({ onNext, onBack, currentStep, totalSteps }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onBack}
        disabled={currentStep === 1}
        style={[styles.navButton, currentStep === 1 && { opacity: 0.5 }]}
      >
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.nextButton, styles.navButton]}
        onPress={onNext}
        // disabled={currentStep === totalSteps}
      >
        <Text style={styles.nextText}>{currentStep === totalSteps ? "Finish" : "Next"}</Text>
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
  navButton: {
    width: 100,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: Colors.primary,
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
});

export default HostingButtonNav;
