import React, { useEffect } from "react";
import { View, Text, Animated, Easing, TouchableOpacity } from "react-native";
import { useColorScheme } from "nativewind";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

export const PreviousSubscriptionSkeleton = ({ count = 3 }) => {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  // Animation for shimmer effect
  const shimmerValue = new Animated.Value(0);

  useEffect(() => {
    const startShimmerAnimation = () => {
      shimmerValue.setValue(0);
      Animated.timing(shimmerValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: false,
        isInteraction: false,
      }).start(() => startShimmerAnimation());
    };

    startShimmerAnimation();

    return () => shimmerValue.stopAnimation();
  }, []);

  const shimmerTranslate = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  const renderSkeletonCard = (key: any) => (
    <View
      key={key}
      className={`${
        isDarkMode ? "bg-gray4/50" : "bg-background"
      } rounded-3xl p-4 w-full max-w-sm mb-8`}
      style={{
        boxShadow: isDarkMode ? "" : "0px 2px 12px 0px rgba(0,0,0,0.1)",
      }}
    >
      {/* Status Badge Skeleton */}
      <View className="mb-4">
        <View className="flex-row justify-between items-start">
          <View className="relative overflow-hidden">
            <View
              className={`px-2 py-1 rounded-md mb-2 w-16 h-6 ${
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
              }`}
            />
            <Animated.View
              className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              style={{ transform: [{ translateX: shimmerTranslate }] }}
            />
          </View>
        </View>

        {/* Plan and Amount Skeleton */}
        <View className="flex-row justify-between items-center">
          <View className="relative overflow-hidden">
            <View
              className={`w-24 h-7 rounded ${
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
              }`}
            />
            <Animated.View
              className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              style={{ transform: [{ translateX: shimmerTranslate }] }}
            />
          </View>
          <View className="relative overflow-hidden">
            <View
              className={`w-20 h-7 rounded ${
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
              }`}
            />
            <Animated.View
              className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              style={{ transform: [{ translateX: shimmerTranslate }] }}
            />
          </View>
        </View>
      </View>

      {/* Details Skeleton */}
      <View className="space-y-2 mb-6">
        {/* Started Row */}
        <View className="flex-row justify-between mb-2">
          <Text className="text-foreground/60 text-sm">Started:</Text>
          <View className="relative overflow-hidden">
            <View
              className={`w-24 h-5 rounded ${
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
              }`}
            />
            <Animated.View
              className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              style={{ transform: [{ translateX: shimmerTranslate }] }}
            />
          </View>
        </View>

        {/* Next Billing Date Row */}
        <View className="flex-row justify-between mb-2">
          <Text className="text-foreground/60 text-sm">Next Billing Date:</Text>
          <View className="relative overflow-hidden">
            <View
              className={`w-24 h-5 rounded ${
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
              }`}
            />
            <Animated.View
              className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              style={{ transform: [{ translateX: shimmerTranslate }] }}
            />
          </View>
        </View>

        {/* Subscription ID Row */}
        <View className="flex-row justify-between">
          <Text className="text-foreground/60 text-sm">Subscription ID:</Text>
          <View className="relative overflow-hidden">
            <View
              className={`w-24 h-5 rounded ${
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
              }`}
            />
            <Animated.View
              className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              style={{ transform: [{ translateX: shimmerTranslate }] }}
            />
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View className="px-6 pt-16 pb-12">
      <View className="flex-row items-center justify-between mb-12">
        <TouchableOpacity
          onPress={() =>
            router.push("/(protected)/(nested)/active-subscription")
          }
        >
          <ArrowLeft
            width={30}
            height={30}
            color={isDarkMode ? "#fff" : "#000"}
          />
        </TouchableOpacity>

        <View className="flex-1 items-center ml-5">
          <Text className="font-bold text-2xl text-foreground">
            Previous Subscriptions
          </Text>
        </View>

        <View style={{ width: 30 }} />
      </View>
      {Array.from({ length: count }).map((_, index) =>
        renderSkeletonCard(`skeleton-${index}`)
      )}
    </View>
  );
};
