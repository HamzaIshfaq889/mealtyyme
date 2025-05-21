import React, { useCallback, useState } from "react";

import { router, useFocusEffect } from "expo-router";

import {
  Clock,
  Dumbbell,
  Flame,
  HeartPulse,
  Leaf,
  Star,
  Users,
} from "lucide-react-native";

import {
  Text,
  View,
  FlatList,
  Image,
  Pressable,
  useColorScheme,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {
  Utensils,
  Coffee,
  Cake,
  Drumstick,
  Salad,
  Soup,
  Sandwich,
  GlassWater,
  Apple,
  Pizza,
  Candy,
  IceCream,
} from "lucide-react-native";

import { capitalizeWords, truncateChars } from "@/utils";

import { Button, ButtonText } from "@/components/ui/button";
import { FeaturedRecipeSketon } from "@/components/modules/Skeletons";
import { useCategories } from "@/redux/queries/recipes/useCategoryQuery";
import { usePopularRecipes } from "@/redux/queries/recipes/useRecipeQuery";
import { getPopularRecipes } from "@/services/recipesAPI";
import { Recipe } from "@/lib/types/recipe";

const PopularRecipes = () => {
  const scheme = useColorScheme();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | number>(
    "all"
  );

  const iconList = [
    Utensils,
    Coffee,
    Cake,
    Drumstick,
    Salad,
    Soup,
    Sandwich,
    GlassWater,
    Apple,
    Pizza,
    Candy,
    IceCream,
  ];

  const chunkArray = (arr: any[], size: number) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  // const { data: categories = [], isLoading: loadingCategories } =
  //   useCategories();
  // const { data: recipes = [], isLoading: loadingRecipes, refetch } = usePopularRecipes();

  const [loading, setLoading] = useState<boolean>(false);

  const screenWidth = Dimensions.get("window").width;
  const numColumns = 4;
  const gap = 12; // gap between tiles
  const horizontalPadding = 14; // container padding left and right
  // Calculate tile width to fill full width minus gaps and padding
  const tileWidth =
    (screenWidth - horizontalPadding * 2 - gap * (numColumns - 1)) / numColumns;

  const categories = [
    { id: "hot", name: "Hot", Icon: Flame },
    { id: "our_picks", name: "Our Picks", Icon: Star },
    { id: "under_30", name: "Under 30 Min", Icon: Clock },
    { id: "vegan", name: "Vegan", Icon: Leaf },
    { id: "high_protein", name: "High Protein", Icon: Dumbbell },
    { id: "low_carb", name: "Low Carb", Icon: HeartPulse },
    { id: "quick_snacks", name: "Quick Snacks", Icon: Sandwich },
    { id: "family_meals", name: "Family Meals", Icon: Users },
  ];

  const rows = [categories.slice(0, 4), categories.slice(4)];
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        setLoading(true);
        try {
          const data = await getPopularRecipes();
          console.log("data", data);
          if (isActive) {
            setRecipes(data);
          }
        } catch (error) {
          console.error("Failed to fetch recipes:", error);
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      };

      fetchData();

      return () => {
        isActive = false;
      };
    }, [])
  );
  const handlePress = (id: string | number) => {
    setSelectedCategoryId(id);
  };
  const formattedData = chunkArray(
    [{ id: "all", name: "All" }, ...categories],
    2
  );
  return (
    <>
      <View className="flex flex-row justify-between">
        <Text className="text-primary  text-xl leading-5 mb-1 pl-4">
          Popular Recipies
        </Text>
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
              <FeaturedRecipeSketon
                style={{
                  width: 220,
                  height: 220,
                  marginRight: 16,
                  marginLeft: index === 0 ? 14 : 0,
                  borderRadius: 32,
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
                className={`${index === 0 ? "ml-4" : "ml-1"} mr-3 py-4`}
                onPress={() => router.push(`/recipe/${item?.id}` as const)}
              >
                <View
                  className="flex flex-col bg-foreground rounded-2xl w-64 p-4 shadow-md"
                  style={{
                    shadowColor: scheme === "dark" ? "#000" : "#999",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 10,
                    elevation: 5,
                  }}
                >
                  <View className="relative mb-4 rounded-xl overflow-hidden h-40">
                    <Image
                      source={{ uri: item.image_url }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>

                  <Text className="text-gray-900 dark:text-gray-100 font-semibold text-lg mb-3 leading-tight">
                    {truncateChars(item?.title, 20)}
                  </Text>

                  <View className="flex flex-row items-center gap-4 mt-auto">
                    {/* Set fixed height */}
                    <View className="flex flex-row items-center gap-1 h-6">
                      <Flame color="#6B7280" size={20} />
                      <Text className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                        {Math.ceil(item.calories)} Kcal
                      </Text>
                    </View>

                    {/* Divider with same height */}
                    <View
                      className="w-px bg-gray-300 dark:bg-gray-700"
                      style={{ height: 24 }}
                    />

                    <View className="flex flex-row items-center gap-1 h-6">
                      <Clock color="#6B7280" size={18} />
                      <Text className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                        {item.ready_in_minutes} min
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
