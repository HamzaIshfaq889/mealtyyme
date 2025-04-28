import React from "react";

import { Pressable, Text, useColorScheme, View } from "react-native";

import { Ingredient } from "@/lib/types/recipe";
import { capitalizeFirstLetter, truncateChars } from "@/utils";

type IngredientDetailsProps = {
  ingredients: Ingredient[];
  serving: number;
  defaultServings: number; // 👈 added this
};

const IngredientDetails = ({
  ingredients,
  serving,
  defaultServings,
}: IngredientDetailsProps) => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

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
          <Text className="text-muted">{`${ingredients?.length} Item(s)`}</Text>
        </View>
        <Pressable>
          {/* <Text className="text-secondary pr-5 font-bold">Add All to Cart</Text> */}
        </Pressable>
      </View>

      <View className="mt-5">
        {ingredients?.map((ing) => {
          if (ing?.amount == null) return null;

          const amountPerServing = ing.amount / defaultServings;
          const totalAmount = amountPerServing * serving;

          return (
            <View
              className="p-6 py-5 flex flex-row justify-between items-center rounded-2xl mb-4 bg-background"
              key={ing?.ingredient?.id}
            >
              <View className="flex flex-row gap-6 items-center">
                <Text className="font-bold text-sm text-primary">
                  {truncateChars(
                    capitalizeFirstLetter(ing?.ingredient?.name),
                    28
                  )}
                </Text>
              </View>
              <Text className="font-semibold leading-5 text-base text-primary">
                {Math.ceil(totalAmount)} {ing?.unit}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default IngredientDetails;
