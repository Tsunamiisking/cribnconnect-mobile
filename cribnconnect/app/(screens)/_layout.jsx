import { Stack } from 'expo-router';

export default function ScreensLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen 
        name="apartment-details/[id]" 
        options={{ 
          title: 'Apartment Details',
          headerBackTitle: 'Back',
        }} 
      />
      <Stack.Screen 
        name="event-details/[id]" 
        options={{ 
          title: 'Event Details',
          headerBackTitle: 'Back',
        }} 
      />
      <Stack.Screen 
        name="linkup-details/[id]" 
        options={{ 
          title: 'Linkup Details',
          headerBackTitle: 'Back',
        }} 
      />
      <Stack.Screen 
        name="profile/[id]" 
        options={{ 
          title: 'Profile',
          headerBackTitle: 'Back',
        }} 
      />
      <Stack.Screen 
        name="chat/[id]" 
        options={{ 
          title: 'Chat',
          headerBackTitle: 'Back',
        }} 
      />

      <Stack.Screen 
        name="settings/index" 
        options={{ 
          title: 'Settings',
          headerBackTitle: 'Back',
        }} 
      />

      <Stack.Screen 
        name="search/index" 
        options={{ 
          title: 'Search',
          headerBackTitle: 'Back',
          headerShown: false
        }} 
      />

      <Stack.Screen 
        name="create-linkup/index" 
        options={{ 
          title: 'Create Linkup',
          headerBackTitle: 'Back',
          headerShown: false
        }} 
      />

    </Stack>
  );
}
