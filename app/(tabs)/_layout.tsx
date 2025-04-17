import { Tabs } from "expo-router";

import { House, CalendarDays, ShoppingCart, User } from "lucide-react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#00C3FF",
        tabBarInactiveTintColor: "#97A2B0",

        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          backgroundColor: "#fff",
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
