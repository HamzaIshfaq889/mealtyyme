// app/(tabs)/_layout.tsx
import React, { createContext } from "react";
import { Tabs } from "expo-router";
import { BottomTabBar } from "@react-navigation/bottom-tabs";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { StyleSheet, Platform, View, useColorScheme } from "react-native";
import {
  Bot,
  CalendarDays,
  House,
  ShoppingCart,
  User,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const TabBarContext = createContext(null);

export default function TabsLayout() {
  const tabBarTranslation = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: tabBarTranslation.value }],
  }));

  return (
    //@ts-ignore
    <TabBarContext.Provider value={tabBarTranslation}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#EE8427",
          tabBarInactiveTintColor: scheme === "dark" ? "#FFF" : "#000",
          tabBarStyle: {
            height: 65 + insets.bottom,
            paddingBottom: insets.bottom,
            paddingTop: 10,
            backgroundColor: scheme === "dark" ? "#2B2B2B" : "#fff",
          },
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
              <House color={color} size={32} strokeWidth={1.5} />
            ),
          }}
        />
        <Tabs.Screen
          name="meal-plan"
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <CalendarDays color={color} size={32} strokeWidth={1.5} />
            ),
          }}
        />
        <Tabs.Screen
          name="chat-bot"
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <Bot color={color} size={36} strokeWidth={1.5} />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <ShoppingCart color={color} size={32} strokeWidth={1.5} />
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <User color={color} size={32} strokeWidth={1.5} />
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
    backgroundColor: "#1E293B",
    zIndex: 100,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: -4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 12,
      },
    }),
    borderTopWidth: 0.5,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
});
