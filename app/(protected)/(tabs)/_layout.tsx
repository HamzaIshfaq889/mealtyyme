// app/(tabs)/_layout.tsx
import React, { createContext } from "react";
import { Tabs } from "expo-router";
import { BottomTabBar } from "@react-navigation/bottom-tabs";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { StyleSheet } from "react-native";
import { CalendarDays, House, ShoppingCart, User } from "lucide-react-native";

export const TabBarContext = createContext(null);

export default function TabsLayout() {
  const tabBarTranslation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: tabBarTranslation.value }],
  }));

  return (
    //@ts-ignore
    <TabBarContext.Provider value={tabBarTranslation}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#00C3FF",
          tabBarInactiveTintColor: "#97A2B0",
        }}
        tabBar={(props) => (
          <Animated.View style={[styles.tabBarContainer, animatedStyle]}>
            <BottomTabBar {...props} />
          </Animated.View>
        )}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <House color={color} size={27} strokeWidth={1} />
            ),
          }}
        />
        <Tabs.Screen
          name="meal-plan"
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <CalendarDays color={color} size={27} strokeWidth={1} />
            ),
          }}
        />
        <Tabs.Screen name="chat-bot" />
        <Tabs.Screen
          name="cart"
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <ShoppingCart color={color} size={27} strokeWidth={1} />
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <User color={color} size={27} strokeWidth={1} />
            ),
          }}
        />
      </Tabs>
    </TabBarContext.Provider>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    zIndex: 100,
  },
});
