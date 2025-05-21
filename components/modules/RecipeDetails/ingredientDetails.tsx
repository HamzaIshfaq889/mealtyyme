import React from "react";

import { Pressable, Text, useColorScheme, View } from "react-native";

import { addIngredients } from "@/redux/slices/cart";
import { useDispatch, useSelector } from "react-redux";

import { Ingredient } from "@/lib/types/recipe";
import {
  capitalizeFirstLetter,
  convertToFraction,
  truncateChars,
} from "@/utils";
import Toast from "react-native-toast-message";
import {
  loadIngredientCart,
  saveIngredientCart,
} from "@/utils/storage/cartStorage";

type IngredientDetailsProps = {
  ingredients: Ingredient[];
  serving: number;
  defaultServings: number;
};

const IngredientDetails = ({
  ingredients,
  serving,
  defaultServings,
}: IngredientDetailsProps) => {
  const dispatch = useDispatch();
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";
  const customerId = useSelector(
    (state: any) => state.auth.loginResponseType.customer_details?.id
  );

  const handleAddCart = async () => {
    const adjustedIngredients = ingredients.map((ing) => {
      const amountPerServing = ing.amount / defaultServings;
      const totalAmount = amountPerServing * serving;

      return {
        ...ing,
        amount: totalAmount,
      };
    });

    dispatch(addIngredients(adjustedIngredients));

    // Load existing cart from storage
    const existingCart = await loadIngredientCart(customerId);

    // Merge new ingredients with existing ones
    const updatedCart = [...existingCart];

    for (const newItem of adjustedIngredients) {
      const existing = updatedCart.find(
        (item) =>
          item.ingredient.id === newItem.ingredient.id &&
          item.unit === newItem.unit
      );

      if (existing) {
        existing.amount += newItem.amount;
      } else {
        updatedCart.push(newItem);
      }
    }

    // Save updated cart to AsyncStorage
    await saveIngredientCart(customerId, updatedCart);

    Toast.show({
      type: "success",
      text1: "Items added to the gorcery list successfully!",
    });
  };

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
        <Pressable onPress={handleAddCart}>
          <Text className="text-secondary pr-5 font-bold">
            Add to grocery list
          </Text>
        </Pressable>
      </View>

      <View className="mt-5">
        {ingredients?.map((ing) => {
          // if (ing?.amount == null) return null;

          const amountPerServing = ing?.amount / defaultServings;
          const totalAmount = amountPerServing * serving;

          return (
            <View
              className="p-6 py-5 flex flex-row justify-between items-center rounded-2xl mb-4 bg-foreground"
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
                {convertToFraction(totalAmount)} {ing?.unit}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default IngredientDetails;
