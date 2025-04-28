import React from "react";
import { router } from "expo-router";

import { useCookbookRecipes } from "@/services/cookbooksApi";
import { Pressable, FlatList, Text } from "react-native";

import { FeaturedRecipeSketon } from "../../Skeletons";
import { RecipeCard } from "../../Common";

type RecipeFlatListProps = {
  recipeIds: [];
};

const RecipesFlatList = ({ recipeIds }: RecipeFlatListProps) => {
  const {
    data: recipes,
    isLoading: recipesLoading,
    isError: recipesError,
  } = useCookbookRecipes(recipeIds);

  if (recipesLoading) {
    return (
      <FlatList
        horizontal
        data={Array.from({ length: 3 })}
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        className="mt-4"
        renderItem={({ index }) => (
          <FeaturedRecipeSketon
            style={{
              width: 200,
              height: 170,
              marginRight: 16,
              marginLeft: index === 0 ? 28 : 0,
              borderRadius: 32,
            }}
          />
        )}
      />
    );
  }

  if (recipesError) {
    return (
      <Text className="text-foreground text-base text-center my-6 px-7">
        Something went wrong while fetching cookbook recipes
      </Text>
    );
  }

  return (
    <FlatList
      data={recipes}
      horizontal
      keyExtractor={(item) => item.id.toString()}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item, index }) => (
        <Pressable
          className={`mr-4 ${index === 0 ? "ml-6" : ""}`}
          onPress={() => router.push(`/recipe/${item.id}` as const)}
        >
          <RecipeCard recipeItem={item} />
        </Pressable>
      )}
    />
  );
};

export default RecipesFlatList;
