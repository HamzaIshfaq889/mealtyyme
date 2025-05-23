import React from "react";

import { useLocalSearchParams } from "expo-router";

import { CookbookRecipes } from "@/components/modules";

const CookbookRecipesScreen = () => {
  const { recipes } = useLocalSearchParams();

  const recipesArray = recipes ? JSON.parse(recipes as string) : [];

  // return <CookbookRecipes recipes={recipesArray} cookbookId={1}/>;
};

export default CookbookRecipesScreen;
