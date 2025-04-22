import React from "react";

import { Pressable, Text, View } from "react-native";

import { truncateChars } from "@/utils";

const favouritesData = [
  {
    id: 1,
    name: "Sunny Egg & Toast Avocado",
    image: require("@/assets/svgs/Sun.svg"),
  },
  {
    id: 2,
    name: "Sunny Egg & Toast Avocado",
    image: require("@/assets/svgs/Sun.svg"),
  },
  {
    id: 3,
    name: "Sunny Egg & Toast Avocado",
    image: require("@/assets/svgs/Sun.svg"),
  },
  {
    id: 4,
    name: "Sunny Egg & Toast Avocado",
    image: require("@/assets/svgs/Sun.svg"),
  },
  {
    id: 5,
    name: "Sunny Egg & Toast Avocado",
    image: require("@/assets/svgs/Sun.svg"),
  },
  {
    id: 6,
    name: "Sunny Egg & Toast Avocado",
    image: require("@/assets/svgs/Sun.svg"),
  },
];
const RelatedRecipes = () => {
  return (
    <>
      <View className="flex flex-row justify-between items-center">
        <Text className="text-primary font-bold text-xl leading-7 mb-1">
          Related Recipes
        </Text>
      </View>
      <View className="flex flex-row flex-wrap">
        {favouritesData.map((item) => {
          return (
            <View key={item.id} className="basis-1/3 p-1">
              <View className="bg-background rounded-2xl p-2 shadow-custom">
                <View className="relative mb-4">
                  <View className="h-24 w-full rounded-xl bg-gray4" />
                </View>
                <Text className="text-foreground font-bold text-base leading-5 mb-2">
                  {truncateChars(item.name, 10)}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </>
  );
};

export default RelatedRecipes;
