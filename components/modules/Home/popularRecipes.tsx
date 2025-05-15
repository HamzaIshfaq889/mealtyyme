import React, { useState } from "react";

import { router } from "expo-router";

import { Clock, Flame } from "lucide-react-native";

import {
  Text,
  View,
  FlatList,
  Image,
  Pressable,
  useColorScheme,
  TouchableOpacity,
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

  const { data: categories = [], isLoading: loadingCategories } =
    useCategories();
  const { data: recipes = [], isLoading: loadingRecipes } =
    usePopularRecipes(selectedCategoryId);

  const handlePress = (id: string | number) => {
    setSelectedCategoryId(id);
  };
  const formattedData = chunkArray(
    [{ id: "all", name: "All" }, ...categories],
    2
  );
  return (
    <>
      <View className="mb-6">
        {/* <View className="flex-row justify-between items-center mb-4 pl-7">
          <Text className="text-lg font-bold text-primary">Category</Text>
        </View> */}

        {!loadingCategories ? (
          <FlatList
            horizontal
            data={formattedData}
            keyExtractor={(_, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingLeft: 14 }}
            renderItem={({ item: column, index: columnIndex }) => (
              <View style={{ flexDirection: "column", gap: 12 }}>
                {column.map((item, localIndex) => {
                  const globalIndex = columnIndex * column.length + localIndex;
                  const isSelected = selectedCategoryId === item.id;
                  const IconComponent = iconList[globalIndex % iconList.length];

                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => handlePress(item.id)}
                      className={`w-24 h-24 items-center justify-center rounded-xl  ${
                        isSelected ? "bg-secondary" : "bg-gray3/60"
                      }`}
                    >
                      {IconComponent && (
                        <IconComponent
                          size={24}
                          color={isSelected ? "white" : "#918e8e"}
                        />
                      )}
                      <Text
                        className={`text-center text-xs mt-2 ${
                          isSelected
                            ? "text-background"
                            : "text-primary font-semibold"
                        }`}
                      >
                        {capitalizeWords(item.name)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          />
        ) : (
          <FlatList
            horizontal
            data={Array.from({ length: 4 })}
            keyExtractor={(_, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingLeft: 14 }}
            renderItem={({ index }) => (
              <View key={index} style={{ flexDirection: "column", gap: 12 }}>
                {[0, 1].map((i) => (
                  <View
                    key={i}
                    className="rounded-full bg-gray3/50 h-10 w-24 animate-pulse"
                  />
                ))}
              </View>
            )}
          />
        )}
      </View>
      <View className="flex flex-row justify-between">
        <Text className="text-foreground  text-xl leading-5 mb-1 pl-4">
          Popular Recipies
        </Text>
      </View>

      <View>
        {loadingRecipes ? (
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
                  className="flex flex-col bg-background rounded-2xl w-64 p-4 shadow-md"
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
