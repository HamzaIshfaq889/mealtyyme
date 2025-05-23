import React from "react";

import { useLocalSearchParams } from "expo-router";

import { CookbookRecipes } from "@/components/modules";

const CookbookRecipesScreen = () => {
  const { recipes, cookBookImage, cookbookName, cookbookId } =
    useLocalSearchParams();

  const recipesArray = recipes ? JSON.parse(recipes as string) : [];


  return (
    <CookbookRecipes
      recipeIds={recipesArray}
      cookbookId={cookbookId as string}
      cookbookImage={cookBookImage as string}
      cookbookName={cookbookName}
    />
  );
};

export default CookbookRecipesScreen;
