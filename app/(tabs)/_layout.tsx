import { Tabs } from "expo-router";

import { House, CalendarDays, ShoppingCart, User } from "lucide-react-native";
import { useColorScheme } from "react-native";
export default function TabsLayout() {
  const scheme = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: scheme === "dark" ? "#00C3FF" : "#00C3FF",
        tabBarInactiveTintColor: scheme === "dark" ? "#6B7280" : "#97A2B0",
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          backgroundColor: scheme === "dark" ? "#17181A" : "#FFFFFF",
          position: "absolute", // ensures it’s not floating
          bottom: 0, // stick to bottom
          height: 75, // control height
          paddingBottom: 10, // tweak as needed
          paddingTop: 5,
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <House color={color} size={27} />,
        }}
      />
      <Tabs.Screen
        name="meal-plan"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <CalendarDays color={color} size={27} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <ShoppingCart color={color} size={27} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <User color={color} size={27} />,
        }}
      />
    </Tabs>
  );
}
