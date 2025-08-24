import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import React from "react";

const HostingButtonNav = () => {
  return (
    <View style={styles.container}>
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
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginVertical: 12,
    backgroundColor: Colors.white,
  },
  nextButton: {
    backgroundColor: Colors.primary,
  },
});

export default HostingButtonNav;
