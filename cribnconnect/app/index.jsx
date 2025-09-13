import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" style={styles.screen}>
      {/* Centered hero copy */}
      <View className="flex-1 justify-center px-8">
        <Text style={styles.title} className="text-center">
          {"Welcome\nto your city\nin one app."}
        </Text>
        <Text style={styles.subtitle} className="text-center mt-6">
          Explore, Have fun, Be you.
        </Text>
      </View>

      {/* CTA button -> go to (tabs) */}
      <View className="px-8 pb-28">
        <Link href="/(tabs)" asChild>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.cta}
            className="rounded-2xl"
          >
            <Text style={styles.ctaText}>LETS GO!</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    // Rounded-screen look is usually device/chrome; keeping clean white background
    // Add padding if you need extra spacing on devices without SafeArea
  },
  title: {
    color: Colors.primary, // dark teal-like tone
    fontSize: 60,
    lineHeight: 70,
    fontWeight: "700",
    fontFamily: "Urbanist-Bold", // Applied Urbanist font for headers
    textAlign: "right",
  },
  subtitle: {
    color: Colors.primary, // muted teal-gray
    fontSize: 14,
    fontFamily: "Sora-SemiBold", // Applied Sora font for body text
    fontWeight: "500",
    textAlign: "right",
  },
  cta: {
    backgroundColor: Colors.primary, // dark teal button
    paddingVertical: 22,
    borderRadius: 14,
  },
  ctaText: {
    color: Colors.white,
    textAlign: "center",
    fontFamily: "Sora-Bold", // Applied Sora font for body text
    fontWeight: "700",
    letterSpacing: 0.75,
  },
});
