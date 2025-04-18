import React from "react";

import { Search } from "lucide-react-native";
import { Text, View, FlatList, Pressable, ScrollView } from "react-native";

import { router } from "expo-router";

import Svg1 from "@/assets/svgs/Sun.svg";
import { Button, ButtonText } from "@/components/ui/button";

import FeaturedRecipes from "./featuredRecipes";
import PopularRecipes from "./popularRecipes";

const HomeUser = () => {
  return (
    <ScrollView className="flex flex-col w-full h-full pl-7 py-16 ">
      <View className="flex flex-row justify-between items-center mb-10">
        <View className="space-y-1.5">
          <View className="flex flex-row items-center gap-1">
            <Svg1 />
            <Text className=" text-sm leading-6 text-foreground">
              Good Morning
            </Text>
          </View>
          <Text className="font-bold text-2xl text-foreground leading-8">
            MealTyme
          </Text>
        </View>

        <Pressable
          className="mr-5"
          onPress={() => router.push("/(nested)/search")}
        >
          <Search color="#000" />
        </Pressable>
      </View>

      <FeaturedRecipes />

      <PopularRecipes />
    </ScrollView>
  );
};

export default HomeUser;
