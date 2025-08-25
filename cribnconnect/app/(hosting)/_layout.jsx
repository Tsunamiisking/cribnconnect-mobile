import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function HostingLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
      </Stack>
    </GestureHandlerRootView>
  );
}
