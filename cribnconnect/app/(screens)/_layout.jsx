import { Stack } from "expo-router";

export default function ScreensLayout() {
  return (
    <Stack>
      {/* <StatusBar style="dark" /> */}
      <Stack.Screen
        name="apartment-details/[id]"
        options={{
          title: "Apartment Details",
          // headerBackTitle: "Back",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="event-details/[id]"
        options={{
          title: "Event Details",
          // headerBackTitle: "Back",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="linkup-details/[id]"
        options={{
          title: "Linkup Details",
          // headerBackTitle: "Back",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profile/[id]"
        options={{
          title: "Profile",
          // headerBackTitle: "Back",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="chat/[id]"
        options={{
          title: "Chat",
          // headerBackTitle: "Back",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="settings/index"
        options={{
          title: "Settings",
          // headerBackTitle: "Back",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="search/index"
        options={{
          title: "Search",
          // headerBackTitle: "Back",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="create-linkup/index"
        options={{
          title: "Create Linkup",
          // headerBackTitle: "Back",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="nearby-people/index"
        options={{
          title: "Nearby People",
          // headerBackTitle: "Back",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="edit-profile/index"
        options={{
          title: "Edit Profile",
          // headerBackTitle: "Back",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="notification/index"
        options={{
          title: "Notifications",
          // headerBackTitle: "Back",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="notification/[id]"
        options={{
          title: "Notification Details",
          // headerBackTitle: "Back",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="create-profile/index"
        options={{ title: "Create Profile", headerShown: false }}
      />
    </Stack>
  );
}
