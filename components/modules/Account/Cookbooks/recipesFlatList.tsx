import React from "react";

import Toast from "react-native-toast-message";
import { Pressable, FlatList, Text } from "react-native";

import { router } from "expo-router";

import { useCookbookRecipes } from "@/services/cookbooksApi";

import { FeaturedRecipeSketon } from "@/components/modules/Skeletons";
import { RecipeCard } from "@/components/modules/Common";

import { useDeleteRecipeFromCookbook } from "@/redux/queries/recipes/useCookbooksQuery";

type RecipeFlatListProps = {
  recipeIds: [];
  cookbookId: number;
  refetch: () => void;
};

const RecipesFlatList = ({
  recipeIds,
  cookbookId,
  refetch,
}: RecipeFlatListProps) => {
  const {
    data: recipes,
    isLoading: recipesLoading,
    isError: recipesError,
  } = useCookbookRecipes(recipeIds);
  const { mutate: deleteRecipe } = useDeleteRecipeFromCookbook();

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

  const handleRecipeDelete = (recipeId: number) => {
    if (!cookbookId || !recipeId) {
      console.log("No cookbookId or recipeId provided");
      return;
    }

    deleteRecipe(
      { cookbookId: cookbookId, recipeId: recipeId },
      {
        onSuccess: () => {
          refetch();
        },
        onError: (error: any) => {
          Toast.show({
            type: "error",
            text1:
              error?.message || "Error while deleting recipe.Please try again!",
          });
        },
      }
    );
  };

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
          <RecipeCard
            recipeItem={item}
            showDelete={true}
            handleRecipeDelete={handleRecipeDelete}
          />
        </Pressable>
      )}
    />
  );
};

export default RecipesFlatList;
