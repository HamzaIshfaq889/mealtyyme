import React from "react";

import { useLocalSearchParams } from "expo-router";

import { RecipeDetails } from "@/components/modules";

const DetailRecipeScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <RecipeDetails recipeId={id} />;
};

export default DetailRecipeScreen;
