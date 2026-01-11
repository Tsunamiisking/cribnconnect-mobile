import { Colors } from "@/constants/Colors";
import { router, useNavigation, usePathname } from "expo-router";
import { MoveLeft } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import ProfilePopup from "./ProfilePopup";

export default function BackHeader({
  title = "Title",
  onBack,
  showUser,
  fallbackPath = "/(tabs)", // Default fallback path
}) {
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const navigation = useNavigation();
  const currentPath = usePathname();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation.canGoBack()) {
      router.back();
    } else {
      // If we can't go back, navigate to the fallback path
      router.replace(fallbackPath);
    }
  };

  const handleProfilePress = () => {
    setShowProfilePopup(true);
  };

  const truncateLongHeader = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;

    const truncated = text.slice(0, maxLength);
    return truncated.slice(0, truncated.lastIndexOf(" ")) + "…";
  };

  return (
    <>
      <View
        style={styles.container}
        className="flex-row items-center justify-between px-4 py-3"
      >
        <Pressable onPress={handleBack} style={styles.backButton}>
          <MoveLeft size={26} color={Colors.primary} />
        </Pressable>

        <Text style={styles.text}>{truncateLongHeader(title, 25)}</Text>

        {showUser && (
          <Pressable onPress={handleProfilePress}>
            <View
              style={styles.profileButton}
              className="h-14 w-14 rounded-full items-center justify-center"
            >
              <Text style={styles.profileText}>GU</Text>
            </View>
          </Pressable>
        )}
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
    // borderBottomWidth: 1,
    // borderBottomColor: "#f3f4f6",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    // alignItems: "center",
  },
  text: {
    fontSize: 28,
    fontFamily: "Urbanist-Bold",
    color: Colors.primary,
    flex: 1,
  },
  profileButton: {
    backgroundColor: Colors.primary,
  },
  profileText: {
    color: "white",
    fontFamily: "Sora-SemiBold",
    fontSize: 18,
  },
});
