import React, { useEffect, useRef, useState } from "react";

import {
  Text,
  View,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";

import { Clock } from "lucide-react-native";

import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { truncateChars } from "@/utils/index";

import { FeaturedRecipeSketon } from "../Skeletons";
import { useFeaturedRecipes } from "@/redux/queries/recipes/useRecipeQuery";

const FeaturedRecipes = () => {
  const {
    data: recipes = [],
    isLoading: loading,
    error,
  } = useFeaturedRecipes();

  const flatListRef = useRef<FlatList<any>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= recipes.length) nextIndex = 0;

      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 3000); // Change slide every 3s

    return () => clearInterval(interval);
  }, [currentIndex, recipes.length]);

  if (loading) {
    return (
      <FlatList
        horizontal
        data={Array.from({ length: 3 })}
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        className="mt-4"
        renderItem={({ index }) => (
          <FeaturedRecipeSketon
            style={{
              width: 260,
              height: 220,
              marginRight: 16,
              marginLeft: index === 0 ? 28 : 0,
              borderRadius: 32,
            }}
          />
        )}
      />
    );
  }

  if (error) {
    <View className="flex justify-center items-center">
      <Text className="text-xl text-foreground">
        Error while fetching featured recipes
      </Text>
    </View>;
  }

  return (
    <>
      {/* <Text className="text-foreground font-bold text-xl leading-5 pl-7">
        Featured
      </Text> */}
      <View className="max-h-max mt-1 mb-8">
        <FlatList
          horizontal
          data={recipes}
          ref={flatListRef}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          className="mt-4"
          renderItem={({ item, index }) => (
            <Pressable
              className={`mr-4 ${index === 0 ? "ml-4" : ""}`}
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
                    {truncateChars(item.title, 20)}
                  </Text>
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center gap-2">
                      <Image
                        source={{ uri: item.created_by.image_url }}
                        className="w-6 h-6 rounded-full"
                      />
                      <Text className="text-white text-sm">
                        {item.created_by.first_name} {item.created_by.last_name}
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
      </View>
    </>
  );
};

export default FeaturedRecipes;

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
