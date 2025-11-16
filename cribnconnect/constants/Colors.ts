/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { green } from "react-native-reanimated/lib/typescript/Colors";

export const Colors = {
  primary: "#274046",
  white: "#fff",
  green: "#38EF7D",
  black: "#000",
  lightgray: "#C9C9C9",
  gray: "#D9D9D9",
  darkgray: "#6b7280",
  
  // Additional colors used throughout the app
  emerald: "#10b981", // Used for liked hearts and price text
  success: "#10b981", // Used for active status indicators
  error: "#ef4444", // Used for error states and failed indicators
  amber: "#f59e0b", // Used for day time indicator
  indigo: "#6366f1", // Used for night time indicator
  
  // Gray scale variations
  gray50: "#f9fafb",
  gray100: "#f3f4f6", 
  gray200: "#e5e7eb",
  gray300: "#d1d5db",
  gray400: "#9ca3af",
  gray500: "#6b7280",
  gray600: "#4b5563",
  gray700: "#374151",
  gray800: "#1f2937",
  gray900: "#111827",
  
  // Blue variations for selected states
  blue600: "#2563eb",
  blue50: "#eff6ff",
  warning: "#f59e0b",

  // Background colors
  lightBackground: "#f3f4f6",
  cardBackground: "#f9fafb",
  borderColor: "#e5e7eb",
  shadowColor: "#000",
};
