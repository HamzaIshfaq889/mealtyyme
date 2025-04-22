import React from "react";

import { Search } from "lucide-react-native";
import {
  Text,
  View,
  Pressable,
  ScrollView,
  useColorScheme,
  Platform,
} from "react-native";

import { router } from "expo-router";

import FeaturedRecipes from "./featuredRecipes";
import { Ionicons } from "@expo/vector-icons";
import PopularRecipes from "./popularRecipes";

const HomeUser = () => {
  const scheme = useColorScheme();
  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) {
      return "Good Morning";
    } else if (currentHour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  const getIconName = () => {
    if (currentHour < 12) {
      return "sunny-outline"; // Morning
    } else if (currentHour < 18) {
      return "partly-sunny-outline"; // Afternoon
    } else {
      return "moon-outline"; // Evening
    }
  };

  return (
    <View className="flex-1  relative">
      {/* Sticky Header */}
      <View
        className="absolute top-0 left-0 right-0 z-10 bg-background pt-12 pb-4 "
        style={{
          paddingTop: Platform.OS === "ios" ? 50 : 36, // Adjust for status bar
        }}
      >
        <View className="flex flex-row justify-between items-center px-5 ">
          <View className="space-y-1.5">
            <View className="flex flex-row items-center gap-1">
              <Ionicons name={getIconName()} size={24} color="orange" />
              <Text className="text-sm text-foreground">{getGreeting()}</Text>
            </View>
            <Text className="text-2xl font-bold text-foreground">MealTyme</Text>
          </View>

          <Pressable onPress={() => router.push("/(nested)/search")}>
            <Search color={scheme === "dark" ? "#fff" : "#000"} />
          </Pressable>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        className="flex-1 mt-2"
        contentContainerStyle={{
          paddingTop: Platform.OS === "ios" ? 130 : 110,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <FeaturedRecipes />
          <PopularRecipes />
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeUser;
