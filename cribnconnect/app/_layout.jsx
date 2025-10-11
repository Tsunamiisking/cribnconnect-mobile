import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { ToastProvider } from "react-native-toast-notifications";
import { Colors } from "../constants/Colors";
import { AuthProvider } from "../contexts/AuthContext";
import "../global.css";
import useHostingStore from "../stores/hostingStore";

export default function RootLayout() {
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
    }
  }, [loaded, initialize]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ToastProvider
          placement="top"
          duration={3000}
          animationType="slide-in | zoom-in"
          animationDuration={250}
          successColor={Colors.green}
          dangerColor={Colors.danger}
          warningColor={Colors.warning}
          normalColor={Colors.primary}
          successIcon={"🍾"}
          dangerIcon={"🚫"}
          warningIcon={"⚠️"}
          textStyle={{ fontSize: 16 }}
          swipeEnabled={true}
        >
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
        </ToastProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
