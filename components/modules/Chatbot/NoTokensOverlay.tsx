import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import { checkisProUser } from "@/utils";

const NoTokensOverlay = () => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const status = useSelector(
    (state: any) =>
      state.auth.loginResponseType.customer_details?.subscription?.status
  );
  const isProUser = checkisProUser(status);

  // Calculate first day of next month
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  nextMonth.setDate(1); // Set to first day of the month
  const nextMonthDate = nextMonth.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Animated.View
      className="absolute inset-0 bg-black/60 flex items-center justify-center z-50"
      style={{ opacity: fadeAnim }}
    >
      <Animated.View
        className="bg-card rounded-2xl p-6 mx-6 w-full max-w-sm"
        style={{ transform: [{ scale: scaleAnim }] }}
      >
        <Text className="text-2xl font-bold text-center text-secondary mb-4">
          No Tokens Left
        </Text>
        {isProUser ? (
          <>
            <Text className="text-base text-center text-gray-600 dark:text-gray-300 mb-6">
              You've used all your tokens for this month. Your tokens will
              refresh on {nextMonthDate}. In the meantime, you can still access
              all your saved recipes and meal plans!
            </Text>
            <TouchableOpacity
              className="py-4"
              onPress={() => router.push("/(protected)/(tabs)")}
            >
              <Text className="text-secondary text-center font-semibold text-base">
                Go Back
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text className="text-base text-center text-gray-600 dark:text-gray-300 mb-6">
              You've used all your free tokens for this month. Your tokens will
              refresh on {nextMonthDate}. Upgrade to continue chatting with
              ChefMate!
            </Text>
            <TouchableOpacity
              className="bg-secondary py-4 rounded-xl mb-3"
              onPress={() =>
                router.push("/(protected)/(nested)/buy-subscription")
              }
            >
              <Text className="text-white text-center font-semibold text-lg">
                Upgrade Now
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="py-4"
              onPress={() => router.push("/(protected)/(tabs)")}
            >
              <Text className="text-secondary text-center font-semibold text-base">
                Maybe Later
              </Text>
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
    </Animated.View>
  );
};

export default NoTokensOverlay;
