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
import { useDispatch, useSelector } from "react-redux";
import Svg1 from "../../../assets/svgs/cookingfood.svg";
import { Button, ButtonText } from "@/components/ui/button";
import { useClerk } from "@clerk/clerk-expo";
import { logout } from "@/redux/slices/Auth";
import { deleteToken, resetOnboardStatus } from "@/redux/store/expoStore";

const HomeUser = () => {
  const scheme = useColorScheme();
  const currentHour = new Date().getHours();
  const isCooking = useSelector((state: any) => state.recipe.isCooking);
  const getGreeting = () => {
    if (currentHour < 12) {
      return "Good Morning";
    } else if (currentHour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  console.log("iscooking", isCooking);

  const getIconName = () => {
    if (currentHour < 12) {
      return "sunny-outline"; // Morning
    } else if (currentHour < 18) {
      return "partly-sunny-outline"; // Afternoon
    } else {
      return "moon-outline"; // Evening
    }
  };
  const dispatch = useDispatch();
  const { signOut } = useClerk();
  const handleSignOut = () => {
    signOut();
    dispatch(logout());
    deleteToken();
    resetOnboardStatus();
    console.log("working");
    deleteToken();
    router.push("/(auth)/login");
  };

  return (
    <View className="flex-1 relative">
      {/* Sticky Header */}
      <View
        className="absolute top-0 left-0 right-0 z-10 bg-background pt-12 pb-4"
        style={{
          paddingTop: Platform.OS === "ios" ? 50 : 36, // Adjust for status bar
        }}
      >
        <View className="flex flex-row justify-between items-center px-5">
          <View className="space-y-1.5">
            <View className="flex flex-row items-center gap-1">
              <Ionicons name={getIconName()} size={24} color="orange" />
              <Text className="text-sm text-foreground">{getGreeting()}</Text>
            </View>
            <Text className="text-2xl font-bold text-foreground">MealTyme</Text>
          </View>
          <Button onPress={handleSignOut}>
            <ButtonText>SIgn out</ButtonText>
          </Button>
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

      {isCooking && (
        <Pressable
          className="absolute bottom-5 right-5 z-20 mb-24"
          onPress={() => router.push(`/cooking/1` as any)}
        >
          <View className="bg-secondary p-1 rounded-full shadow-lg">
            <Svg1 width={50} height={50} color="#fff" />
          </View>
        </Pressable>
      )}
    </View>
  );
};

export default HomeUser;
