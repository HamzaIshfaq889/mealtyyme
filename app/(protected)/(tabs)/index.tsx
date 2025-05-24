// app/(tabs)/index.tsx
import React, { useContext } from "react";
import {
  StyleSheet,
  Platform,
  View,
  Pressable,
  Image,
  Text,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabBarContext } from "./_layout";
import { HomeUser } from "@/components/modules";
import { Bell, CircleUserRound, Search } from "lucide-react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "react-native";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { useSelector } from "react-redux";
import LottieView from "lottie-react-native";
import { useUserGamification } from "@/hooks/useUserGamification";

export default function HomeScreen() {
  const tabBarTranslation = useContext(TabBarContext);
  const lastOffset = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const tabBarHeight = 70 + insets.bottom;
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const { stats, fetchStats } = useUserGamification();

  // Get user data from Redux
  const { first_name: name, image_url } = useSelector(
    (state: any) => state.auth.loginResponseType
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const offsetY = event.contentOffset.y;
      const diff = offsetY - lastOffset.value;
      scrollY.value = offsetY;

      if (offsetY <= 0) {
        // At the top of the screen
        //@ts-ignore
        tabBarTranslation.value = withTiming(0, { duration: 250 });
      } else if (diff > 0) {
        // scrolling down
        //@ts-ignore
        tabBarTranslation.value = withTiming(tabBarHeight, { duration: 250 });
      } else if (diff < 0) {
        // scrolling up
        //@ts-ignore
        tabBarTranslation.value = withTiming(0, { duration: 250 });
      }

      lastOffset.value = offsetY;
    },
    onMomentumEnd: () => {
      // Show both header and tab bar when scrolling stops
      //@ts-ignore
      tabBarTranslation.value = withTiming(0, { duration: 250 });
    },
    onEndDrag: () => {
      // Show both header and tab bar when scrolling stops
      //@ts-ignore
      tabBarTranslation.value = withTiming(0, { duration: 250 });
    },
  });

  // Header animation styles
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 100],
      [0, 0],
      Extrapolate.CLAMP
    );
    const opacity = interpolate(
      scrollY.value,
      [0, 100],
      [1, 1],
      Extrapolate.CLAMP
    );
    const height = interpolate(
      scrollY.value,
      [0, 50],
      [180, 100], // Adjust these values based on your header's actual height
      Extrapolate.CLAMP
    );

    return {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      transform: [{ translateY }],
      opacity,
      height,
    };
  });

  const searchBarAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 50],
      [1, 0],
      Extrapolate.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [0, 50],
      [0, -20],
      Extrapolate.CLAMP
    );
    const height = interpolate(
      scrollY.value,
      [0, 50],
      [60, 0], // Adjust based on your search bar's actual height
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
      height,
      overflow: "hidden",
    };
  });

  const searchIconAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 50],
      [0, 1],
      Extrapolate.CLAMP
    );
    const scale = interpolate(
      scrollY.value,
      [0, 50],
      [0.8, 1],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <View className="flex-1 bg-background">
      {/* Gradient background */}
      <LinearGradient
        colors={isDark ? ["#111115", "#16161a"] : ["#f9f9ff", "#ffffff"]}
        className="absolute top-0 left-0 right-0 h-48 z-0"
      />

      {/* Header */}
      <Animated.View
        style={[
          headerAnimatedStyle,
          {
            paddingTop: Platform.OS === "ios" ? 40 : 36,
          },
        ]}
        className="bg-background backdrop-blur-md "
      >
        {/* User info and greeting */}
        <View className="flex-row items-center justify-between px-4 mb-4 mt-3">
          <Pressable className="flex-row items-center">
            {image_url ? (
              <Image
                source={{ uri: image_url }}
                className="w-10 h-10 rounded-full border-2 border-primary"
                resizeMode="cover"
              />
            ) : (
              <View className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <CircleUserRound
                  size={24}
                  strokeWidth={1.5}
                  color={isDark ? "#fff" : "#000"}
                />
              </View>
            )}
            <View className="ml-3">
              <Text className="text-base font-semibold text-foreground">
                {name || "Chef"}
              </Text>
            </View>
          </Pressable>

          {/* Right side actions */}
          <View className="flex-row items-center gap-4">
            {/* Search Icon - Animated */}
            <Animated.View style={searchIconAnimatedStyle}>
              <Pressable
                onPress={() => router.push("/(protected)/(nested)/search")}
                className="relative h-10 w-10 bg-card rounded-full flex items-center justify-center shadow-sm"
              >
                <Search
                  size={24}
                  color={isDark ? "#e0e0e0" : "#333"}
                  strokeWidth={1.5}
                />
              </Pressable>
            </Animated.View>
            <View className="flex flex-row  justify-center items-center bg-card w-16 h-10 rounded-full shadow-sm">
              <View>
                <LottieView
                  source={require("../../../assets/lottie/coin.json")}
                  autoPlay
                  loop
                  style={{ width: 24, height: 24 }}
                />
              </View>
              <Text className="text-foreground text-xs">
                {stats?.total_points}
              </Text>
            </View>

            <Pressable className="relative h-10 w-10 bg-card rounded-full flex items-center justify-center shadow-sm">
              <Bell
                size={24}
                color={isDark ? "#e0e0e0" : "#333"}
                strokeWidth={1.5}
              />
            </Pressable>
          </View>
        </View>

        {/* Search bar with animated appearance */}
        <Animated.View style={searchBarAnimatedStyle}>
          <Pressable
            onPress={() => router.push("/(protected)/(nested)/search")}
            className="mx-6 mb-5"
          >
            <View className="flex-row items-center bg-card border border-input rounded-3xl px-3 py-2 h-16">
              <View className="ml-1">
                <Search size={24} color={isDark ? "#e0e0e0" : "#333"} />
              </View>
              <Text className="ml-2 text-foreground">Search Recipes</Text>
            </View>
          </Pressable>
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Platform.OS === "ios" ? 180 : 176,
          },
        ]}
        className="bg-background"
        bounces={true}
        overScrollMode="always"
        removeClippedSubviews={true}
      >
        <HomeUser onCheckInComplete={fetchStats} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 100,
  },
});
