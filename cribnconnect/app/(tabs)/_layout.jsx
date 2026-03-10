import { HapticTab } from "@/components/HapticTab";
import { Colors } from "@/constants/Colors";
import { Tabs } from "expo-router";
import {
  Heart,
  HeartHandshake,
  Home,
  MessageCircle,
  Tickets,
} from "lucide-react-native";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          paddingBottom:
            Platform.OS === "ios" ? insets.bottom : insets.bottom + 4,
          height: Platform.OS === "ios" ? 85 : 45 + insets.bottom,
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
        },
        // Set background color for the screen container to prevent white flash
        sceneStyle: { backgroundColor: Colors.white },
        // Use fade animation for smoother transitions
        // animation: "fade",
        // Lazy load screens for better performance
        lazy: true,
      }}
      // Ensure initial route is set
      initialRouteName="index"
      // Set background color for entire tabs container
      sceneContainerStyle={{ backgroundColor: Colors.white }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Events",
          tabBarIcon: ({ color }) => <Tickets size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="apartments"
        options={{
          title: "Apartments",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="linkups"
        options={{
          title: "Linkups",
          tabBarIcon: ({ color }) => <HeartHandshake size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color }) => <MessageCircle size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favourites"
        options={{
          title: "Favourites",
          tabBarIcon: ({ color }) => <Heart size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
