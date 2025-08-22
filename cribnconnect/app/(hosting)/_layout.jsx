import { Stack } from 'expo-router';

export default function HostingLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index"
        options={{ 
          title: 'Host Type',
          headerShown: true,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="add-apartment" 
        options={{ 
          title: 'Add Apartment',
          headerShown: true,
          headerBackTitleVisible: false,
        }} 
      />
      <Stack.Screen 
        name="add-event" 
        options={{ 
          title: 'Create Event',
          headerShown: true,
          headerBackTitleVisible: false,
        }} 
      />
    </Stack>
  );
}
