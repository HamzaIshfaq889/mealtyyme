import React, { useEffect, useState } from "react";

import {
  Text,
  View,
  FlatList,
  Image,
  Pressable,
  useColorScheme,
} from "react-native";

import { router } from "expo-router";
import { Clock, Flame, Heart } from "lucide-react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { getCategories, getPopularRecipes } from "@/services/recipesAPI";
import { Categories, Recipe } from "@/lib/types/recipe";
import { capitalizeWords } from "@/utils";
import { PulsePlaceholder } from "@/components/ui/PulsePlaceHolder";

const PopularRecipes = () => {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scheme = useColorScheme();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loadingRecipe, setLoadingRecipe] = useState(true);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | number>(
    "all"
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err: any) {
        setError(err.message || "Error fetching categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    fetchRecipes(null);
  }, []);

  const handlePress = (id: string | number) => {
    setSelectedCategoryId(id);

    // Pass null if 'all' is selected, or if the id is an empty string, otherwise pass the selected id
    const categoryIdToPass = id === "all" || id === "" ? null : id;

    // Call fetchRecipes when category ID changes
    fetchRecipes(categoryIdToPass);
  };

  const fetchRecipes = async (categoryIdToPass: string | number | null) => {
    setLoadingRecipe(true); // Ensure loading starts before fetching
    try {
      const data = await getPopularRecipes(categoryIdToPass);
      setRecipes(data);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    } finally {
      setLoadingRecipe(false); // Stop loading when done
    }
  };

  return (
    <>
      <View className="mb-6">
        <View className="flex-row justify-between items-center mb-4 pl-7">
          <Text className="text-lg font-bold text-primary">Category</Text>
        </View>

        <FlatList
          horizontal
          data={[{ id: "all", name: "All" }, ...categories]}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
          renderItem={({ item, index }) => (
            <Button
              action="secondary"
              className={`rounded-full px-10 py-2 ${
                index === 0 ? "ml-7" : ""
              } ${
                selectedCategoryId === item.id ? "bg-secondary" : "bg-accent"
              }`}
              onPress={() => handlePress(item.id)}
            >
              <ButtonText
                className={`text-base leading-6 ${
                  selectedCategoryId === item.id
                    ? "text-background"
                    : "!text-primary font-semibold"
                }`}
              >
                {capitalizeWords(item.name)}
              </ButtonText>
            </Button>
          )}
        />
      </View>
      <View className="flex flex-row justify-between">
        <Text className="text-foreground font-bold text-xl leading-5 mb-1 pl-7">
          Popular Recipies
        </Text>
        <Pressable>
          <Text className="text-secondary pr-5 font-bold">See All</Text>
        </Pressable>
      </View>

      <View>
        {loading ? (
          <FlatList
            horizontal
            data={Array.from({ length: 3 })}
            keyExtractor={(_, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            className="mt-4"
            renderItem={({ index }) => (
              <PulsePlaceholder
                style={{
                  width: 220,
                  height: 220,
                  marginRight: 16,
                  marginLeft: index === 0 ? 28 : 0,
                  borderRadius: 32, // Match the rounded corners of the card
                }}
              />
            )}
          />
        ) : (
          <FlatList
            data={recipes}
            horizontal
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <Pressable
                className={`${index === 0 ? "ml-7" : "ml-1"} mr-3 py-4`}
                onPress={() => router.push(`/recipe/${1}` as const)}
              >
                <View
                  className="flex flex-col bg-background rounded-2xl w-64 p-3 !h-64"
                  style={{
                    boxShadow:
                      scheme === "dark"
                        ? "0px 2px 12px 0px rgba(0,0,0,0.4)"
                        : "0px 2px 12px 0px rgba(0,0,0,0.2)",
                  }}
                >
                  <View className="relative mb-4">
                    <Image
                      source={{ uri: item.image_url }}
                      className="h-36 w-full rounded-xl bg-gray-300"
                      resizeMode="cover"
                    />
                    <View className="absolute top-2 right-2 bg-background rounded-md p-1.5">
                      <Heart
                        color={scheme === "dark" ? "#fff" : "#000"}
                        size={16}
                      />
                    </View>
                  </View>

                  <Text className="text-foreground font-bold text-base leading-5 mb-3">
                    {item.title}
                  </Text>

                  <View className="flex flex-row items-center gap-2 mt-auto">
                    <View className="flex flex-row items-center gap-0.5">
                      <Flame color="#96a1b0" size={20} />
                      <Text className="text-muted"> {item.calories} Kcal</Text>
                    </View>
                    <View className="bg-muted p-0.5" />
                    <View className="flex flex-row items-center gap-1">
                      <Clock color="#96a1b0" size={16} />
                      <Text className="text-muted text-sm">
                        {item.ready_in_minutes}
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
