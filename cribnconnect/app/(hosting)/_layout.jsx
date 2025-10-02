import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function HostingLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Host Type",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="add-apartment"
          options={{
            title: "Add Apartment",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="add-event"
          options={{
            title: "Create Event",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="drafts"
          options={{
            title: "Drafts",
            headerShown: false,
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
