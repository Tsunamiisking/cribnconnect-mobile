import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import { PaystackProvider } from "react-native-paystack-webview";
import { Colors } from "../constants/Colors";
import { AuthProvider } from "../contexts/AuthContext";
import "../global.css";
import useHostingStore from "../stores/hostingStore";
import { useHeartbeat } from "../hooks/useHeartbeat";

export default function RootLayout() {
  // Start heartbeat service for active status tracking
  useHeartbeat();

  const [loaded] = useFonts({
    // Sora font family for body text
    "Sora-Light": require("../assets/fonts/Sora-Light.ttf"),
    "Sora-Regular": require("../assets/fonts/Sora-Regular.ttf"),
    "Sora-Medium": require("../assets/fonts/Sora-Medium.ttf"),
    "Sora-SemiBold": require("../assets/fonts/Sora-SemiBold.ttf"),
    "Sora-Bold": require("../assets/fonts/Sora-Bold.ttf"),

    // Urbanist font family for headers
    "Urbanist-Light": require("../assets/fonts/Urbanist-Light.ttf"),
    "Urbanist-Regular": require("../assets/fonts/Urbanist-Regular.ttf"),
    "Urbanist-Medium": require("../assets/fonts/Urbanist-Medium.ttf"),
    "Urbanist-SemiBold": require("../assets/fonts/Urbanist-SemiBold.ttf"),
    "Urbanist-Bold": require("../assets/fonts/Urbanist-Bold.ttf"),
    "Urbanist-ExtraBold": require("../assets/fonts/Urbanist-ExtraBold.ttf"),

    // Fallback
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Initialize hosting store and run cleanup
  const { initialize } = useHostingStore();

  useEffect(() => {
    if (loaded) {
      // Initialize hosting store cleanup on app start
      initialize();
      // Check location permission when app starts
      const checkPermissions = async () => {
        try {
          const { checkLocationPermission } = await import(
            "@/utils/userLocation"
          );
          await checkLocationPermission();
        } catch (error) {
          console.error("Error checking location permissions:", error);
        }
      };
      checkPermissions();
    }
  }, [loaded, initialize]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaystackProvider paystackKey={process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY}>
        <AuthProvider>
          <Stack>
            {/* Auth Flow - Welcome, Login, Register */}
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />

            {/* Main App - Tab Navigator */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

            {/* Detail Screens */}
            <Stack.Screen name="(screens)" options={{ headerShown: false }} />

            {/* Hosting Flows */}
            <Stack.Screen name="(hosting)" options={{ headerShown: false }} />

            {/* 404 Screen */}
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar barStyle="dark-content" backgroundColor="white" />
          <Toast />
        </AuthProvider>
      </PaystackProvider>
    </GestureHandlerRootView>
  );
}
