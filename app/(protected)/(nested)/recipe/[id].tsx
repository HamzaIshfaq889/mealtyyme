import React from "react";

import { useLocalSearchParams } from "expo-router";

import { RecipeDetails } from "@/components/modules";

const DetailRecipeScreen = () => {
  const { id, isPrivateRecipe } = useLocalSearchParams<{
    id: string;
    isPrivateRecipe: string;
  }>();

  const isPrivate = isPrivateRecipe === "true";

  console.log("isPrivate",isPrivate)

  return <RecipeDetails recipeId={id} isPrivate={isPrivate} />;
  // return null;
};

export default DetailRecipeScreen;
