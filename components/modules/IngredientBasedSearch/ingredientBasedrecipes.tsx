import { capitalizeFirstLetter } from "@/utils";
import React, { useCallback, useMemo } from "react";

import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { RecipeSkeletonItem } from "../Skeletons";
import { router } from "expo-router";
import { ArrowRight, Clock, Flame, Star } from "lucide-react-native";
import { useRecipesQuery } from "@/redux/queries/recipes/useRecipeQuery";

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
      <View className="pt-20 px-6 pb-4 space-y-6">
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
    <View>
      <View className="pt-20 px-5 pb-4">
        <View className="flex flex-row justify-between items-center mb-6">
          <Text className="text-foreground text-4xl font-semibold">
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
              <TouchableOpacity
                onPress={() => router.push(`/recipe/${recipe.id}` as const)}
              >
                <View
                  className="flex flex-row justify-between items-center p-4 rounded-2xl mb-5 bg-background"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.05,
                    shadowRadius: 6,
                    elevation: 3,
                  }}
                >
                  <View className="flex flex-row gap-4 flex-1">
                    <View className="relative">
                      <Image
                        source={{ uri: recipe?.image_url }}
                        className="w-24 h-24 rounded-xl"
                        resizeMode="cover"
                      />
                      {recipe?.is_featured && (
                        <View className="absolute top-1 right-1 bg-yellow-400 p-1 rounded-full">
                          <Star color="#fff" size={14} />
                        </View>
                      )}
                    </View>

                    <View className="flex flex-col justify-between flex-1">
                      <View>
                        <Text
                          className="font-bold text-lg mb-1 text-primary"
                          numberOfLines={1}
                        >
                          {recipe?.title}
                        </Text>

                        <View className="flex flex-row items-center gap-2 mb-2">
                          <Image
                            source={{ uri: recipe?.created_by.image_url }}
                            className="w-5 h-5 rounded-full"
                          />
                          <Text className="text-muted text-sm">
                            {recipe?.created_by.first_name}{" "}
                            {recipe?.created_by.last_name}
                          </Text>
                        </View>
                      </View>

                      <View className="flex flex-row gap-3">
                        <View className="flex flex-row items-center gap-1">
                          <Clock color="#6b7280" size={16} />
                          <Text className="text-muted text-sm">
                            {recipe?.ready_in_minutes} min
                          </Text>
                        </View>

                        <View className="flex flex-row items-center gap-1">
                          <Flame color="#6b7280" size={16} />
                          <Text className="text-muted text-sm">
                            {Math.ceil(recipe?.calories)} Kcal
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View className="ml-2 p-2 bg-secondary rounded-full">
                    <ArrowRight color="#fff" size={18} />
                  </View>
                </View>
              </TouchableOpacity>
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
    </View>
  );
};

export default IngredientBasedrecipes;
