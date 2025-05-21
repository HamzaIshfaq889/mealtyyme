"use client";

import { useEffect, useRef } from "react";
import {
  View,
  Animated,
  Easing,
  Dimensions,
  useColorScheme,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export const RecipeSkeletonItem = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.ease,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  const shimmerColors = [
    "rgba(0, 0, 0, 0.06)",
    "rgba(0, 0, 0, 0.06)",
    "rgba(0, 0, 0, 0.06)",
  ];

  return (
    <View
      className="flex flex-row justify-between items-center py-5 px-3 rounded-2xl mb-5 bg-foreground"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View className="flex flex-row gap-4">
        {/* Image placeholder */}
        <View
          className={`w-24 h-[80px] rounded-2xl ${
            isDarkMode ? "bg-gray-700" : "bg-gray-300"
          } overflow-hidden`}
        >
          <Animated.View
            style={{
              width: "100%",
              height: "100%",
              transform: [{ translateX }],
            }}
          >
            <LinearGradient
              colors={shimmerColors as any}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ width: "200%", height: "100%" }}
            />
          </Animated.View>
        </View>

        <View className="flex flex-col justify-between max-w-40">
          {/* Title placeholder */}
          <View
            className={`h-6 w-36 rounded-md mb-2 overflow-hidden  ${
              isDarkMode ? "bg-gray-700" : "bg-gray-300"
            }`}
          >
            <Animated.View
              style={{
                width: "100%",
                height: "100%",
                transform: [{ translateX }],
              }}
            >
              <LinearGradient
                colors={shimmerColors as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ width: "200%", height: "100%" }}
              />
            </Animated.View>
          </View>

          {/* Author info placeholder */}
          <View className="flex flex-row gap-2 items-center">
            {/* Avatar placeholder */}
            <View
              className={`w-6 h-6 rounded-full overflow-hidden  ${
                isDarkMode ? "bg-gray-700" : "bg-gray-300"
              }`}
            >
              <Animated.View
                style={{
                  width: "100%",
                  height: "100%",
                  transform: [{ translateX }],
                }}
              >
                <LinearGradient
                  colors={shimmerColors as any}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ width: "200%", height: "100%" }}
                />
              </Animated.View>
            </View>

            {/* Author name placeholder */}
            <View
              className={`h-4 w-24 rounded-md overflow-hidden  ${
                isDarkMode ? "bg-gray-700" : "bg-gray-300"
              }`}
            >
              <Animated.View
                style={{
                  width: "100%",
                  height: "100%",
                  transform: [{ translateX }],
                }}
              >
                <LinearGradient
                  colors={shimmerColors as any}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ width: "200%", height: "100%" }}
                />
              </Animated.View>
            </View>
          </View>
        </View>
      </View>

      {/* Arrow button placeholder */}
      <View
        className={`mr-2 p-0.5 w-8 h-8 rounded-md overflow-hidden  ${
          isDarkMode ? "bg-gray-700" : "bg-gray-300"
        }`}
      >
        <Animated.View
          style={{
            width: "100%",
            height: "100%",
            transform: [{ translateX }],
          }}
        >
          <LinearGradient
            colors={shimmerColors as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: "200%", height: "100%" }}
          />
        </Animated.View>
      </View>
    </View>
  );
};

export const RecipeSkeletonList = ({ count = 5 }: { count?: number }) => {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <RecipeSkeletonItem key={`skeleton-${index}`} />
        ))}
    </>
  );
};
