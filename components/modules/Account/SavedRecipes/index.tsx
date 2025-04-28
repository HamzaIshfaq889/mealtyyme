import React from "react";

import { Image, Pressable, Text, useColorScheme, View } from "react-native";

import { SquareArrowRight } from "lucide-react-native";
import { useSavedRecipes } from "@/redux/queries/recipes/useSaveRecipesQuery";
import { truncateChars } from "@/utils";
import { RecipeSkeletonItem } from "@/components/modules/Skeletons";
import Error from "@/components/modules/Error";
import { router } from "expo-router";

const Savedrecipes = () => {
  const scheme = useColorScheme();
  const { data: savedRecipes, isLoading, isError } = useSavedRecipes();

  if (isLoading) {
    return (
      <View className="mt-3 space-y-6 px-6">
        {[1, 2, 3, 4].map((item) => {
          return <RecipeSkeletonItem key={item} />;
        })}
      </View>
    );
  }

  if (isError) {
    return <Error errorMessage="No Saved Recipes found, Add One now!" />;
  }

  return (
    <View className="mt-6 space-y-7">
      {savedRecipes &&
        savedRecipes.map((recipe) => {
          return (
            <Pressable
              className="flex flex-row justify-between items-center py-5 px-7 rounded-2xl"
              style={{
                boxShadow: "0px 2px 12px 0px rgba(0,0,0,0.1)",
              }}
              key={recipe?.id}
              onPress={() => router.push(`/recipe/${recipe.id}` as const)}
            >
              <View className="flex flex-row gap-4">
                <Image
                  source={{ uri: recipe?.image_url }}
                  className="w-24 h-[80px] rounded-xl bg-gray-300"
                  resizeMode="cover"
                />
                <View className="flex flex-col justify-between max-w-60">
                  <Text className="font-bold text-lg mb-1 leading-6 text-primary">
                    {truncateChars(recipe?.title, 36)}
                  </Text>
                  <View className="flex flex-row gap-4">
                    {/* <View className="bg-gray3 w-1 h-1 p-3.5 rounded-full"></View> */}
                    <Image
                      source={{ uri: recipe?.created_by.image_url }}
                      className="w-7 h-7 rounded-full"
                      resizeMode="cover"
                    />
                    <Text className="text-muted text-base self-end">
                      {recipe?.created_by?.first_name}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="mr-2">
                <SquareArrowRight
                  color={scheme === "dark" ? "#fff" : "#000"}
                  size={30}
                />
              </View>
            </Pressable>
          );
        })}
    </View>
  );
};

export default Savedrecipes;
