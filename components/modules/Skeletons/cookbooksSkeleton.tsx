"use client";

import { useEffect } from "react";
import { View, FlatList, useColorScheme, Animated, Easing } from "react-native";
import { useTheme } from "@react-navigation/native";

const RecipeCardSkeleton = () => {
  const colorScheme = useColorScheme();
  const { colors } = useTheme();

  // Animation for the skeleton loading effect
  const opacityValue = new Animated.Value(0.3);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 0.3,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, []);

  const skeletonColor = colorScheme === "dark" ? "#3a3a3c" : "#e1e1e1";

  return (
    <Animated.View
      style={{
        opacity: opacityValue,
        width: 200,
        height: 150,
        borderRadius: 12,
        backgroundColor: skeletonColor,
        marginRight: 2,
      }}
    />
  );
};

export const CookBookSkeleton = () => {
  const colorScheme = useColorScheme();
  const { colors } = useTheme();

  // Animation for the skeleton loading effect
  const opacityValue = new Animated.Value(0.3);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 0.3,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, []);

  const skeletonColor = colorScheme === "dark" ? "#3a3a3c" : "#e1e1e1";
  const textColor = colorScheme === "dark" ? "#fff" : "#0a2533";

  // Generate dummy data for the skeleton
  const skeletonData = Array(5)
    .fill(0)
    .map((_, index) => ({ id: index.toString() }));

  return (
    <View>
      <View>
        <View className="flex-row justify-between items-center mb-4 mt-4">
          <View className="flex flex-row items-center gap-5">
            {/* Title skeleton */}
            <Animated.View
              style={{
                opacity: opacityValue,
                width: 120,
                height: 24,
                borderRadius: 4,
                backgroundColor: skeletonColor,
                marginLeft: 13,
              }}
            />

            <View className="flex flex-row gap-6">
              {/* Icon skeletons */}
              <Animated.View
                style={{
                  opacity: opacityValue,
                  width: 22,
                  height: 22,
                  borderRadius: 4,
                  backgroundColor: skeletonColor,
                }}
              />
              <Animated.View
                style={{
                  opacity: opacityValue,
                  width: 22,
                  height: 22,
                  borderRadius: 4,
                  backgroundColor: skeletonColor,
                }}
              />
            </View>
          </View>
        </View>

        <FlatList
          data={skeletonData}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={() => (
            <View className="ml-3 mr-5 py-4">
              <RecipeCardSkeleton />
            </View>
          )}
        />
      </View>
      <View className="mt-2">
        <View className="flex-row justify-between items-center mb-4 mt-4">
          <View className="flex flex-row items-center gap-5">
            {/* Title skeleton */}
            <Animated.View
              style={{
                opacity: opacityValue,
                width: 120,
                height: 24,
                borderRadius: 4,
                backgroundColor: skeletonColor,
                marginLeft: 13,
              }}
            />

            <View className="flex flex-row gap-6">
              {/* Icon skeletons */}
              <Animated.View
                style={{
                  opacity: opacityValue,
                  width: 22,
                  height: 22,
                  borderRadius: 4,
                  backgroundColor: skeletonColor,
                }}
              />
              <Animated.View
                style={{
                  opacity: opacityValue,
                  width: 22,
                  height: 22,
                  borderRadius: 4,
                  backgroundColor: skeletonColor,
                }}
              />
            </View>
          </View>
        </View>

        <FlatList
          data={skeletonData}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={() => (
            <View className="ml-3 mr-5 py-4">
              <RecipeCardSkeleton />
            </View>
          )}
        />
      </View>
    </View>
  );
};
