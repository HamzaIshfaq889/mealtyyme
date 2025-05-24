import { capitalizeFirstLetter } from "@/utils";
import React, { useCallback, useMemo } from "react";

import {
  FlatList,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { RecipeSkeletonItem } from "../Skeletons";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useRecipesQuery } from "@/redux/queries/recipes/useRecipeQuery";
import HorizontalRecipeCard from "../RecipeCards/horizontalRecipeCard";

type QueryOptions = {
  dietIds?: number[];
  categoryIds?: number[];
  cuisineIds?: number[];
};

type IngredientBasedrecipesProps = {
  ingredients: number[];
};

const IngredientBasedrecipes = ({
  ingredients,
}: IngredientBasedrecipesProps) => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useRecipesQuery({
    includeIngredientIDs: ingredients,
  });
  const flattenedRecipes = useMemo(
    () => data?.pages.flatMap((page) => page.results) ?? [],
    [data]
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return (
      <View className="pt-20 px-6 pb-4 space-y-6 bg-background">
        <View>
          <Text className="text-foreground text-4xl font-semibold mb-6">
            {capitalizeFirstLetter("Recipes")}
          </Text>
          {[1, 2, 3, 4, 5].map((item) => {
            return <RecipeSkeletonItem key={item} />;
          })}
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500 text-lg font-medium">
          Failed to load recipes.
        </Text>
      </View>
    );
  }

  return (
    <View className="pt-16 px-5 pb-4 bg-background w-full h-full">
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft
            width={30}
            height={30}
            color={isDarkMode ? "#fff" : "#000"}
          />
        </TouchableOpacity>
        <Text className="text-foreground text-2xl font-semibold ml-4">
          {capitalizeFirstLetter("Recipes")}
        </Text>
      </View>
      {flattenedRecipes.length === 0 ? (
        <View className="w-full h-full">
          <Text className="text-xl text-foreground text-center mt-10 px-6">
            No recipes Found.
          </Text>
        </View>
      ) : (
        <FlatList
          data={flattenedRecipes}
          keyExtractor={(item) => item?.id.toString()}
          contentContainerStyle={{
            paddingHorizontal: 2,
            paddingBottom: 200,
          }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: recipe }) => (
            <HorizontalRecipeCard recipe={recipe} />
          )}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="mt-3 space-y-6">
                {[1, 2].map((item) => (
                  <RecipeSkeletonItem key={`footer-skeleton-${item}`} />
                ))}
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

export default IngredientBasedrecipes;
