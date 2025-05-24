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

import { ArrowRight, Import } from "lucide-react-native";
import { truncateChars } from "@/utils";
import { RecipeSkeletonItem } from "@/components/modules/Skeletons";
import Error from "@/components/modules/Error";
import { router, useFocusEffect } from "expo-router";
import { Recipe } from "@/lib/types/recipe";
import { getPrivateRecipes } from "@/services/privateRecipe";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const NUM_COLUMNS = 2;
const ITEM_WIDTH = (SCREEN_WIDTH - 48) / NUM_COLUMNS; // 48 = padding (16) * 2 + gap (16)
const ITEM_HEIGHT = 200;

const MyRecipes = () => {
  const scheme = useColorScheme();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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
    <View className="flex-1">
      <FlatList
        data={recipes}
        numColumns={NUM_COLUMNS}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 16,
        }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/recipe/[id]",
                params: {
                  id: item?.id,
                  isPrivateRecipe: "true",
                },
              })
            }
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

      {/* Button to Import Recipe */}
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
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
});
