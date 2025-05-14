import React, { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  StyleSheet,
  Dimensions,
} from "react-native";

import {
  ArrowRight,
  BookmarkIcon,
  ChefHat,
  Clock,
  Flame,
  Import,
  SquareArrowRight,
  Star,
} from "lucide-react-native";
import {
  usePrivateRecipes,
  useSavedRecipes,
} from "@/redux/queries/recipes/useSaveRecipesQuery";
import { truncateChars } from "@/utils";
import { RecipeSkeletonItem } from "@/components/modules/Skeletons";
import Error from "@/components/modules/Error";
import { router, useFocusEffect } from "expo-router";
import { Button, ButtonText } from "@/components/ui/button";
import { Recipe } from "@/lib/types/recipe";
import { getPrivateRecipes } from "@/services/privateRecipe";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const MyRecipes = () => {
  const scheme = useColorScheme();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Calculate item width based on screen size (2 columns with padding)
  const ITEM_WIDTH = SCREEN_WIDTH / 2 - 24; // Accounting for padding
  const ITEM_HEIGHT = 200;

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchRecipes = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getPrivateRecipes();
          if (isActive) {
            setRecipes(data);
          }
        } catch (err: any) {
          if (isActive) {
            setError(err.message || "Failed to fetch recipes.");
          }
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      };

      fetchRecipes();

      return () => {
        isActive = false;
      };
    }, [])
  );

  if (loading) {
    return (
      <View className="mt-3 space-y-6 px-6">
        {[1, 2, 3, 4].map((item) => {
          return <RecipeSkeletonItem key={item} />;
        })}
      </View>
    );
  }

  if (error) {
    return <Error errorMessage="No Saved Recipes found, Add One now!" />;
  }

  return (
    <View className="mt-6 space-y-7 pb-8">
      {/* Button to Import Recipe */}
      <TouchableOpacity
        className="mx-6 p-3  flex flex-row items-center justify-between border border-foreground rounded-lg mb-4"
        onPress={() => router.push("/(protected)/(nested)/scrape-recipe")}
      >
        <View className="flex flex-row items-center gap-3">
          <Import color={scheme === "dark" ? "#fff" : "#000"} size={30} />
          <Text className="font-medium text-base font-sofia text-foreground w-64">
            Found a recipe on the web, save it to Mealtyme.
          </Text>
        </View>
        <ArrowRight color={"#00C3FF"} size={30} />
      </TouchableOpacity>

      <FlatList
        data={recipes}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 22,
        }}
        renderItem={({ item }) => (
          <Pressable
            // onPress={() => router.push(`/recipe/${item.id}`)}
            style={{ width: ITEM_WIDTH }}
          >
            <View
              style={{
                width: ITEM_WIDTH,
                height: ITEM_HEIGHT,
                borderRadius: 16,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Image
                source={{ uri: item.image_url }}
                resizeMode="cover"
                style={StyleSheet.absoluteFillObject}
              />
              <LinearGradient
                colors={["rgba(0,0,0,0.7)", "transparent"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={styles.background}
              />
              <View className="absolute bottom-0 w-full p-4">
                <Text
                  className="font-semibold text-base text-white mb-1"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {truncateChars(item.title, 20)}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

export default MyRecipes;

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
  },
});
