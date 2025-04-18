import React from "react";

import { Text, useColorScheme, View } from "react-native";

import { SquareArrowRight } from "lucide-react-native";

const Savedrecipes = () => {
  const scheme = useColorScheme();

  const savedRecipies = [
    {
      id: 1,
      recipiesImage: "",
      name: " Easy homemade beef burger",
      chef: "James spader",
    },
    {
      id: 2,
      recipiesImage: "",
      name: " Easy homemade beef burger",
      chef: "James spader",
    },
    {
      id: 3,
      recipiesImage: "",
      name: " Easy homemade beef burger",
      chef: "James spader",
    },
  ];

  return (
    <View className="mt-6 space-y-10">
      {savedRecipies.map((recipe) => {
        return (
          <View
            className="flex flex-row justify-between items-center py-5 px-3 rounded-2xl mb-5"
            style={{
              boxShadow: "0px 2px 12px 0px rgba(0,0,0,0.1)",
            }}
            key={recipe?.id}
          >
            <View className="flex flex-row gap-4">
              {/* Will be replavce by image if the recipie */}
              <View className="w-24 h-[80px] rounded-2xl bg-gray3"></View>
              <View className="flex flex-col justify-between max-w-40">
                <Text className="font-bold text-lg mb-1 leading-6 text-primary">
                  {recipe?.name}
                </Text>
                <View className="flex flex-row gap-2">
                  <View className="bg-gray3 w-1 h-1 p-3.5 rounded-full"></View>
                  <Text className="text-muted text-base ">{recipe?.chef}</Text>
                </View>
              </View>
            </View>
            <View className="mr-2">
              <SquareArrowRight
                color={scheme === "dark" ? "#fff" : "#000"}
                size={30}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default Savedrecipes;
