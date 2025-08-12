import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useState } from "react";
import { MoveLeft } from "lucide-react-native";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import ProfilePopup from "./ProfilePopup";

export default function BackHeader({ title = "Title", onBack }) {
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleProfilePress = () => {
    setShowProfilePopup(true);
  };

  return (
    <>
      <View style={styles.container} className="flex-row items-center justify-between px-4 py-3">
        <Pressable onPress={handleBack} style={styles.backButton}>
          <MoveLeft size={24} color={Colors.primary} />
        </Pressable>

        <Text style={styles.text}>
          {title}
        </Text>

        <Pressable onPress={handleProfilePress}>
          <View
            style={styles.profileButton}
            className="h-12 w-12 rounded-full items-center justify-center"
          >
            <Text style={styles.profileText}>GU</Text>
          </View>
        </Pressable>
      </View>

      <ProfilePopup 
        visible={showProfilePopup}
        onClose={() => setShowProfilePopup(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    // borderRadius: 20,
  },
  text: {
    fontSize: 28,
    fontFamily: "Urbanist-SemiBold",
    color: Colors.primary,
    // textAlign: 'center',
    flex: 1,
  },
    profileButton: {
    backgroundColor: Colors.primary,
  },
  profileText: {
    color: 'white',
    fontFamily: 'Sora-SemiBold',
    fontSize: 14,
  }
});
