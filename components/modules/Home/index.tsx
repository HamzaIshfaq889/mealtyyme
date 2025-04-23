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
import LogoAPP from "@/assets/svgs/logoapp.svg";

const HomeUser = () => {
  const scheme = useColorScheme();
  const currentHour = new Date().getHours();
  const isCooking = useSelector((state: any) => state.recipe.isCooking);
  const name = useSelector(
    (state: any) => state.auth.loginResponseType.first_name
  );
  const getGreeting = () => {
    if (currentHour < 12) {
      return `Good Morning ${name ? name : ""}`;
    } else if (currentHour < 18) {
      return `Good Afternoon ${name ? name : ""}`;
    } else {
      return `Good Evening ${name ? name : ""}`;
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
    <View className="flex-1 relative">
      {/* Sticky Header */}
      <View
        className="absolute top-0 left-0 right-0 z-10 bg-background pt-12 pb-4"
        style={{
          paddingTop: Platform.OS === "ios" ? 50 : 36, // Adjust for status bar
        }}
      >
        <View className="flex flex-row justify-between items-center px-5  bg-background">
          {/* Left: Logo */}
          <View className=" rounded-2xl bg-secondary p-1 ">
            <LogoAPP width={29} height={29} />
          </View>

          {/* Center: Greeting & Title */}
          <View className="items-center">
            <View className="flex-row items-center ">
              <Ionicons name={getIconName()} size={20} color="orange" />
              <Text className="text-sm text-foreground ml-2 pt-1">
                {getGreeting()}
              </Text>
            </View>
          </View>

          {/* Right: Search Icon */}
          <Pressable onPress={() => router.push("/(nested)/search")}>
            <Search color={scheme === "dark" ? "#fff" : "#000"} />
          </Pressable>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        className="flex-1 "
        contentContainerStyle={{
          paddingTop: Platform.OS === "ios" ? 110 : 110,
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
