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
};

const RecipesBySearch = ({
  flattenedRecipes,
  searchValue,
  isLoading,
  handleLoadMore,
  isFetchingNextPage,
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

  return (
    <View className="px-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold text-primary">Recipes</Text>
      </View>
      {searchValue && flattenedRecipes.length === 0 && !isLoading ? (
        <View className="flex flex-col justify-center items-center p-4 mt-10">
          <Text className="text-2xl font-semibold text-center text-primary">
            No recipes found for "{searchValue}"
          </Text>
          <Text className="text-center mt-2 text-primary">
            Try adjusting your search or filters
          </Text>
        </View>
      ) : isLoading ? (
        <View className="mt-3 space-y-6">
          {[1, 2, 3, 4].map((item) => {
            return <RecipeSkeletonItem key={item} />;
          })}
        </View>
      ) : flattenedRecipes.length === 0 ? (
        <Text className="text-xl text-foreground text-center mt-10 px-6">
          No recipes Found with these filters. Please Update filters
        </Text>
      ) : (
        <FlatList
          data={flattenedRecipes}
          keyExtractor={(item) => item?.id.toString()}
          contentContainerStyle={{
            paddingHorizontal: 2,
            paddingBottom: 400,
          }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: recipe, index }) => (
            <AnimatedRecipeItem
              recipe={recipe}
              index={
                isNewBatchRef.current &&
                index >=
                  prevRecipesCountRef.current -
                    (flattenedRecipes.length - prevRecipesCountRef.current)
                  ? index -
                    (prevRecipesCountRef.current -
                      (flattenedRecipes.length - prevRecipesCountRef.current))
                  : isNewBatchRef.current
                  ? 0
                  : index
              }
            />
          )}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="mt-3 space-y-6">
                {[1, 2].map((item) => (
                  <RecipeSkeletonItem key={`footer-skeleton-${item}`} />
                ))}
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

export default RecipesBySearch;
