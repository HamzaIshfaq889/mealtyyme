import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FeaturedRecipeSketon } from "../Skeletons";
import { convertMinutesToTimeLabel, truncateChars } from "@/utils";
import { Clock, Flame } from "lucide-react-native";
import { router } from "expo-router";
import { getMainDishes } from "@/services/recipesAPI";
import { Recipe } from "@/lib/types/recipe";

const MainDishes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const data = await getMainDishes(4);
      setRecipes(data);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <>
      <View className="flex flex-row justify-between  mx-7">
        <Text className="text-foreground font-bold text-xl leading-5 mb-4">
          Main Dishes
        </Text>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: `/(protected)/(nested)/all-recipes/${3}` as any,
              params: { name: "categories" },
            })
          }
        >
          <Text className="font-medium text-secondary mb-1">View all</Text>
        </TouchableOpacity>
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
                  marginLeft: index === 0 ? 28 : 0,
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
                className={`${
                  index === 0 ? "ml-7 " : "ml-1"
                } mr-3 p-4 bg-card rounded-2xl !w-[220px]`}
                onPress={() => router.push(`/recipe/${item?.id}` as const)}
              >
                <View className="flex flex-col">
                  <View className="relative mb-4">
                    <Image
                      source={{ uri: item.image_url }}
                      className="h-40 w-full rounded-2xl bg-gray-300"
                      resizeMode="cover"
                    />
                  </View>

                  <Text className="text-foreground font-bold text-base leading-5 mb-3">
                    {truncateChars(item?.title, 20)}
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
                        {convertMinutesToTimeLabel(item.ready_in_minutes)}
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

export default MainDishes;
