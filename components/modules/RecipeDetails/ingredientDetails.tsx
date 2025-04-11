import React from "react";

import { Pressable, Text, View } from "react-native";

import { router } from "expo-router";
import { Button, ButtonText } from "@/components/ui/button";
import { ScrollView } from "react-native-gesture-handler";
import Review from "./review";

const IngredientDetails = () => {
  const ingredentDetail = [
    {
      ingredientName: "Honey",
      ingredientAmount: "1 Cup",
    },
    {
      ingredientName: "Avocado",
      ingredientAmount: "1",
    },
    {
      ingredientName: "Red Cabbage",
      ingredientAmount: "9 ml",
    },
    {
      ingredientName: "Peanuts",
      ingredientAmount: "1",
    },
    {
      ingredientName: "Red Onions",
      ingredientAmount: "1",
    },
  ];

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

  const truncateName = (name: string): string => {
    return name.length > 8 ? name.slice(0, 8) + "..." : name;
  };

  return (
    <View className="">
      <View className="flex flex-row justify-between">
        <View>
          <Text className="text-primary font-bold text-xl leading-5 mb-1">
            Ingredients
          </Text>
          <Text className="text-muted">6 Item</Text>
        </View>
        <Pressable onPress={() => router.push("/")}>
          <Text className="text-secondary pr-5 font-bold">Add All to Cart</Text>
        </Pressable>
      </View>

      <View className="mt-5 mb-5">
        {ingredentDetail?.map((ing, item) => {
          return (
            <View
              className="p-2.5 flex flex-row justify-between items-center rounded-2xl mb-4"
              style={{
                boxShadow: "0px 2px 12px 0px rgba(0,0,0,0.1)",
              }}
            >
              <View className="flex flex-row gap-6 items-center">
                <View className="bg-accent p-7 rounded-lg"></View>
                <Text className="font-bold text-xl text-foreground">
                  {ing?.ingredientName}
                </Text>
              </View>
              <Text className="font-semibold leading-5 text-lg">
                {ing?.ingredientAmount}
              </Text>
            </View>
          );
        })}
      </View>

      {/* </View> */}

      <Button action="secondary" className="mb-8 h-16">
        <ButtonText>Start Cooking</ButtonText>
      </Button>

      <View className="mb-8">
        <Review />
      </View>

      <View className="w-full h-[2px] bg-accent mb-7"></View>

      <View className="flex flex-row gap-3.5 mb-10">
        <View className="bg-accent p-7 border-2 border-secondary rounded-full"></View>
        <View>
          <Text className="text-foreground font-semibold leading-5 text-lg mb-1.5">
            Natalia Luca
          </Text>
          <Text className="font-medium text-gray-500">
            I'm the author and recipe developer.
          </Text>
        </View>
      </View>

      <View className="flex flex-row justify-between items-center">
        <Text className="text-primary font-bold text-xl leading-7 mb-1">
          Related Recipes
        </Text>
        <Pressable onPress={() => router.push("/")}>
          <Text className="text-secondary pr-5 font-bold">See All</Text>
        </Pressable>
      </View>

      <View className="flex flex-row flex-wrap">
        {favouritesData.map((item) => {
          return (
            <View key={item.id} className="basis-1/3 p-1">
              <View className="bg-background rounded-2xl p-2 shadow-custom">
                <View className="relative mb-4">
                  <View className="h-24 w-full rounded-xl bg-gray-300" />
                </View>
                <Text className="text-foreground font-bold text-base leading-5 mb-3">
                  {truncateName(item.name)}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default IngredientDetails;
