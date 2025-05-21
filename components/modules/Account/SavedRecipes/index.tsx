import React from "react";

import {
  FlatList,
  Image,
  Pressable,
  Text,
  useColorScheme,
  View,
} from "react-native";

import {
  ArrowRight,
  Clock,
  Flame,
  SquareArrowRight,
  Star,
} from "lucide-react-native";
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

  if (!savedRecipes || savedRecipes.length === 0) {
    return (
      <View className="flex-1 justify-center items-center p-7 mt-3">
        <Text className="text-gray-500 text-sm">
          No saved recipes found. Add one by going to a recipe
        </Text>
      </View>
    );
  }

  return (
    <View className="mt-6 space-y-7 px-6">
      <FlatList
        data={savedRecipes}
        keyExtractor={(item) => item?.id.toString()}
        contentContainerStyle={{
          paddingHorizontal: 2,
          paddingBottom: 40,
        }}
        onEndReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: recipe }) => (
          <Pressable
            onPress={() => router.push(`/recipe/${recipe.id}` as const)}
          >
            <View
              className="flex flex-row justify-between items-center p-4 rounded-2xl mb-5 bg-card"
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
          </Pressable>
        )}
      />
    </View>
  );
};

export default Savedrecipes;
