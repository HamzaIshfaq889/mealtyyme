import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { Text, View, FlatList, Image, Pressable } from "react-native";
import { Clock, Flame } from "lucide-react-native";
import { getCategories } from "@/services/recipesAPI";
import { Categories } from "@/lib/types/recipe";
import {
  capitalizeWords,
  convertMinutesToTimeLabel,
  truncateChars,
} from "@/utils";
import { Button, ButtonText } from "@/components/ui/button";
import { FeaturedRecipeSketon } from "../Skeletons";
import { usePopularRecipes } from "@/redux/queries/recipes/useRecipeQuery";

const PopularRecipes: React.FC = () => {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const {
    data: recipes = [],
    isLoading: recipesLoading,
    isError: recipesError,
    error: recipesFetchError,
  } = usePopularRecipes();

  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const data = await getCategories();
        if (isMounted) {
          setCategories(data);
        }
      } catch (err: any) {
        if (isMounted) {
          setCategoriesError(err.message ?? "Error fetching categories");
        }
      } finally {
        if (isMounted) {
          setCategoriesLoading(false);
        }
      }
    };
    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCategoryPress = (id: string | number, name: string) => {
    router.push({
      pathname: `/(protected)/(nested)/all-recipes/${id}` as any,
      params: { name: "categories" },
    });
  };

  return (
    <>
      {/* Categories Section (unchanged) */}
      <View>
        <View className="mb-5">
          <Text className="text-foreground font-bold text-xl leading-5 pl-7">
            Categories
          </Text>
        </View>
        {categoriesLoading ? (
          <FlatList
            horizontal
            data={Array.from({ length: 4 })}
            keyExtractor={(_, idx) => idx.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
            renderItem={({ index }) => (
              <FeaturedRecipeSketon
                style={{
                  width: 100,
                  height: 40,
                  marginLeft: index === 0 ? 28 : 0,
                  borderRadius: 20,
                }}
              />
            )}
          />
        ) : categoriesError ? (
          <Text className="text-red-500 pl-7">{categoriesError}</Text>
        ) : (
          <FlatList
            horizontal
            data={[...categories]}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
            renderItem={({ item, index }) => (
              <Button
                action="secondary"
                className={`rounded-full px-10 py-2 ${
                  index === 0 ? "ml-7" : ""
                }`}
                onPress={() => handleCategoryPress(item?.id, item?.name)}
              >
                <ButtonText className="text-base leading-6 !text-white font-semibold">
                  {capitalizeWords(item?.name)}
                </ButtonText>
              </Button>
            )}
          />
        )}
      </View>

      {/* Popular Recipes Section */}
      <View className="flex flex-row justify-between mt-5">
        <Text className="text-foreground font-bold text-xl leading-5 mb-4 pl-7">
          Popular Recipes
        </Text>
      </View>
      <View>
        {recipesLoading ? (
          <FlatList
            horizontal
            data={Array.from({ length: 3 })}
            keyExtractor={(_, idx) => idx.toString()}
            showsHorizontalScrollIndicator={false}
            className="mt-4"
            renderItem={({ index }) => (
              <FeaturedRecipeSketon
                style={{
                  width: 220,
                  height: 220,
                  marginRight: 16,
                  marginLeft: index === 0 ? 28 : 0,
                  borderRadius: 32,
                }}
              />
            )}
          />
        ) : recipesError ? (
          <Text className="text-red-500 pl-7">
            {(recipesFetchError as Error)?.message || "Failed to load recipes."}
          </Text>
        ) : (
          <FlatList
            horizontal
            data={recipes}
            keyExtractor={(item) => item?.id?.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <Pressable
                className={`${
                  index === 0 ? "ml-7" : "ml-1"
                } mr-3 p-4 bg-card rounded-2xl w-[220px]`}
                onPress={() => router.push(`/recipe/${item?.id}` as const)}
              >
                <View className="flex flex-col">
                  <View className="relative mb-4">
                    <Image
                      source={{ uri: item?.image_url }}
                      className="h-40 w-full rounded-2xl bg-gray-300"
                      resizeMode="cover"
                    />
                  </View>
                  <Text className="text-foreground font-bold text-base leading-5 mb-3">
                    {truncateChars(item?.title, 20)}
                  </Text>
                  <View className="flex flex-row items-center gap-2">
                    <View className="flex flex-row items-center gap-0.5">
                      <Flame color="#96a1b0" size={20} />
                      <Text className="text-muted">{item?.calories} Kcal</Text>
                    </View>
                    <View className="bg-muted p-0.5" />
                    <View className="flex flex-row items-center gap-1">
                      <Clock color="#96a1b0" size={16} />
                      <Text className="text-muted text-sm">
                        {convertMinutesToTimeLabel(item?.ready_in_minutes)}
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            )}
          />
        )}
      </View>
    </>
  );
};

export default PopularRecipes;
