import React, { useRef, useEffect } from "react";
import { Recipe } from "@/lib/types/recipe";
import { FlatList, Image, Pressable, Text, View, Animated } from "react-native";
import { ArrowRight, Clock, Flame, Star } from "lucide-react-native";
import { RecipeSkeletonItem } from "../Skeletons";
import { router } from "expo-router";
import HorizontalRecipeCard from "../RecipeCards/horizontalRecipeCard";

interface AnimatedRecipeItemProps {
  recipe: Recipe;
  index: number;
  animationDelay?: number;
}
// Animated Recipe Item component
const AnimatedRecipeItem: React.FC<AnimatedRecipeItemProps> = ({
  recipe,
  index,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100, // Stagger the animations
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, translateY, index]);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: translateY }],
      }}
    >
      <HorizontalRecipeCard recipe={recipe} />
    </Animated.View>
  );
};

type RecipesBySearchProps = {
  searchValue: string;
  flattenedRecipes: Recipe[];
  isLoading: boolean;
  handleLoadMore: () => void;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
};

const RecipesBySearch = ({
  flattenedRecipes,
  searchValue,
  isLoading,
  handleLoadMore,
  isFetchingNextPage,
  hasNextPage,
}: RecipesBySearchProps) => {
  const prevRecipesCountRef = useRef(0);
  const isNewBatchRef = useRef(false);

  useEffect(() => {
    if (
      flattenedRecipes.length > prevRecipesCountRef.current &&
      prevRecipesCountRef.current > 0
    ) {
      isNewBatchRef.current = true;
    } else {
      isNewBatchRef.current = false;
    }
    prevRecipesCountRef.current = flattenedRecipes.length;
  }, [flattenedRecipes]);

  if (isLoading) {
    return (
      <View className="mt-3 space-y-6">
        {[1, 2, 3, 4].map((item) => {
          return <RecipeSkeletonItem key={item} />;
        })}
      </View>
    );
  }

  if (flattenedRecipes.length === 0) {
    return (
      <Text className="text-xl text-foreground text-center mt-10 px-6">
        No recipes Found with these filters. Please Update filters
      </Text>
    );
  }

  return (
    <View className="px-4">
      <AnimatedRecipeItem recipe={flattenedRecipes[0]} index={0} />
    </View>
  );
};

export default RecipesBySearch;
