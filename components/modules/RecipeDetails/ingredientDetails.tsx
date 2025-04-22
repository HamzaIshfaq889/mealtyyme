import React from "react";

import { Pressable, Text, View } from "react-native";

import { Ingredient } from "@/lib/types/recipe";

type IngredientDetailsProps = {
  ingredients: Ingredient[];
};

const IngredientDetails = ({ ingredients }: IngredientDetailsProps) => {
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

  if (ingredients.length === 0) {
    return (
      <View className="flex items-center justify-center">
        <Text className="text-primary text-xl font-semibold">
          No Ingredients
        </Text>
      </View>
    );
  }

  return (
    <View>
      <View className="flex flex-row justify-between">
        <View>
          <Text className="text-primary font-bold text-xl leading-5 mb-1">
            Ingredients
          </Text>
          <Text className="text-muted">{`${ingredients?.length} Item`}</Text>
        </View>
        <Pressable>
          <Text className="text-secondary pr-5 font-bold">Add All to Cart</Text>
        </Pressable>
      </View>

      <View className="mt-5">
        {ingredients?.map((ing) => {
          return (
            <View
              className="p-6 py-5 flex flex-row justify-between items-center rounded-2xl mb-4"
              style={{
                boxShadow: "0px 2px 12px 0px rgba(0,0,0,0.1)",
              }}
              key={ing?.ingredient?.id}
            >
              <View className="flex flex-row gap-6 items-center">
                <Text className="font-bold text-xl text-primary">
                  {ing?.ingredient?.name}
                </Text>
              </View>
              <Text className="font-semibold leading-5 text-lg text-primary">
                {ing?.amount}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default IngredientDetails;
