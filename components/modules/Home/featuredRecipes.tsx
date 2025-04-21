import React, { useEffect, useState } from "react";

import { Clock } from "lucide-react-native";

import { HStack } from "@/components/ui/hstack";

import {
  Text,
  View,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";
import { getFeaturedRecipes } from "@/services/recipesAPI";
import { Recipe } from "@/lib/types/recipe";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { PulsePlaceholder } from "@/components/ui/PulsePlaceHolder";

const FeaturedRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getFeaturedRecipes();
        setRecipes(data);
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "orange",
    },
    background: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      height: 300,
    },
    button: {
      padding: 15,
      alignItems: "center",
      borderRadius: 5,
    },
    text: {
      backgroundColor: "transparent",
      fontSize: 15,
      color: "#fff",
    },
  });

  return (
    <>
      <Text className="text-foreground font-bold text-xl leading-5 pl-7">
        Featured
      </Text>
      <View className="max-h-max mt-1 mb-8">
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
                  width: 260,
                  height: 200,
                  marginRight: 16,
                  marginLeft: index === 0 ? 28 : 0,
                  borderRadius: 8,
                }}
              />
            )}
          />
        ) : (
          <FlatList
            horizontal
            data={recipes}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            className="mt-4"
            renderItem={({ item, index }) => (
              <Pressable
                className={`mr-4 ${index === 0 ? "ml-7" : ""}`}
                onPress={() => router.push(`/recipe/${item.id}` as const)}
              >
                <View className="rounded-2xl w-[260px] h-[200px] overflow-hidden relative">
                  <Image
                    source={{ uri: item.image_url }}
                    resizeMode="cover"
                    className="absolute top-0 left-0 right-0 bottom-0 w-full h-full"
                  />
                  <LinearGradient
                    colors={["rgba(0,0,0,1.6)", "transparent"]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={styles.background}
                    className="absolute bottom-0 left-0 right-0 h-1/3"
                  />
                  <View className="absolute bottom-0 w-full p-4">
                    <Text
                      className="font-semibold text-lg text-white mb-2"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.title}
                    </Text>
                    <View className="flex-row justify-between items-center">
                      <View className="flex-row items-center gap-2">
                        <Image
                          source={{ uri: item.created_by.image_url }}
                          className="w-6 h-6 rounded-full"
                        />
                        <Text className="text-white text-sm">
                          {item.created_by.first_name}{" "}
                          {item.created_by.last_name}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-1">
                        <Clock color="white" size={14} />
                        <Text className="text-white text-sm">
                          {item.ready_in_minutes}m
                        </Text>
                      </View>
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

export default FeaturedRecipes;
