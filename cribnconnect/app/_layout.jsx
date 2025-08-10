import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import "../global.css";

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
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
        
        {/* Modal Screens */}
        <Stack.Screen 
          name="(modal)" 
          options={{ 
            headerShown: false,
            presentation: 'modal' 
          }} 
        />
        
        {/* 404 Screen */}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
