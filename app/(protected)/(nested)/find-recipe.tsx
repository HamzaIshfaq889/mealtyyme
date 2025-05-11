import React, { useMemo } from "react";

import { useLocalSearchParams } from "expo-router";
import { IngredientBasedrecipes } from "@/components/modules";
import { Ingredient } from "@/lib/types/recipe";

const IngredientBasedRecipesScreen = () => {
  const { ingredients } = useLocalSearchParams();

  const parsedIngredients: Ingredient[] = useMemo(() => {
    try {
      return ingredients
        ? JSON.parse(decodeURIComponent(ingredients as string))
        : [];
    } catch (error) {
      console.warn("Invalid ingredients param:", error);
      return [];
    }
  }, [ingredients]);

  const ingredientIds = useMemo(() => {
    const ids = parsedIngredients.map((i) => i.ingredient.id);
    return [...new Set(ids)];
  }, [parsedIngredients]);

  console.log("Parsed Ingredients", ingredientIds);

  return <IngredientBasedrecipes ingredients={ingredientIds} />;
};

export default IngredientBasedRecipesScreen;
