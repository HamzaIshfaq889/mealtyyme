import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Animated, Platform } from "react-native";

import { router } from "expo-router";
import { Soup } from "lucide-react-native";

export default function ImportRecipeCard({}) {
  // Animation values
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const featuresAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Card entrance animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      // Features fade in sequentially
      Animated.timing(featuresAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Button appears with a bounce
      Animated.spring(buttonAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View className="bg-secondary py-8 px-6 rounded-3xl overflow-hidden mx-6">
      <View>
        <View className="flex justify-center items-center mb-4">
          <Soup size={40} color="#fff" />
        </View>
        <Text className="text-white font-semibold text-xl mb-2 text-center">
          Discover New Recipes
        </Text>
        <Text className="text-white font-semibold text-sm mb-6 text-center">
          Tap to import recipes from popular sites
        </Text>

        <Animated.View
          style={{
            transform: [
              {
                translateY: buttonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
            opacity: buttonAnim,
          }}
        >
          <TouchableOpacity
            className="bg-white py-4 rounded-3xl active:opacity-90 flex-row justify-center items-center"
            activeOpacity={0.8}
            onPress={() =>
              router.replace("/(protected)/(nested)/scrape-recipe")
            }
          >
            <Text className="text-secondary font-bold text-center text-lg">
              Import Now
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.View>
  );
}
