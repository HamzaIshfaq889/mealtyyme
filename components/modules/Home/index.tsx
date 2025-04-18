import React from "react";

import { Search } from "lucide-react-native";
import {
  Text,
  View,
  FlatList,
  Pressable,
  ScrollView,
  useColorScheme,
} from "react-native";

import { router } from "expo-router";

import Svg1 from "@/assets/svgs/Sun.svg";
import { Button, ButtonText } from "@/components/ui/button";

import FeaturedRecipes from "./featuredRecipes";
import PopularRecipes from "./popularRecipes";

const categories = [
  { id: "1", name: "Relax Dinner" },
  { id: "2", name: "Kids Favourite" },
  { id: "3", name: "Family Meals" },
  { id: "4", name: "Quick Bites" },
  { id: "5", name: "Relax Dinner" },
  { id: "6", name: "Kids Favourite" },
  { id: "7", name: "Family Meals" },
  { id: "8", name: "Quick Bites" },
];

const HomeUser = () => {
  const scheme = useColorScheme();
  return (
    <ScrollView className="flex flex-col w-full h-full pl-7 py-16 bg-background">
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
          <Search color={scheme === "dark" ? "#fff" : "#000"} />
        </Pressable>
      </View>

      <FeaturedRecipes />

      <View className="mb-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-primary">Category</Text>
        </View>

        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
          renderItem={({ item, index }) => (
            <Button
              action="secondary"
              className={`rounded-full px-10 py-2 ${
                index === 0 ? "bg-secondary" : "bg-accent"
              }`}
            >
              <ButtonText
                className={`text-base leading-6 ${
                  index === 0
                    ? "text-background"
                    : "!text-primary font-semibold"
                }`}
              >
                {item.name}
              </ButtonText>
            </Button>
          )}
        />
      </View>
      <PopularRecipes />
    </ScrollView>
  );
};

export default HomeUser;
