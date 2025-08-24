import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import React from "react";

const HostingButtonNav = () => {
  return (
    <View className="flex-row justify-between items-center p-4 my-10 bg-white">
      <TouchableOpacity>
        <Text>Back</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.nextButton}
        className="w-24 h-16 rounded-md flex justify-center"
      >
        <Text className="text-center text-white">Next</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  nextButton: {
    backgroundColor: Colors.primary,
  },
});

export default HostingButtonNav;
