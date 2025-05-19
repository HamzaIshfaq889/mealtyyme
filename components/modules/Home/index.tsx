import React, { useEffect, useRef, useState } from "react";
import {
  Bell,
  CircleUserRound,
  Coins,
  Lock,
  Search,
} from "lucide-react-native";
import {
  Text,
  View,
  Pressable,
  ScrollView,
  useColorScheme,
  Platform,
  Image,
} from "react-native";
import { router } from "expo-router";
import BottomSheet from "@gorhom/bottom-sheet";
import { useSelector } from "react-redux";

import FeaturedRecipes from "./featuredRecipes";
import PopularRecipes from "./popularRecipes";

import Svg1 from "@/assets/svgs/cookingfood.svg";
import LogoAPP from "@/assets/svgs/logoapp.svg";
import { getGreeting, getIconName } from "@/utils";
import SubcriptionCTA from "../SubscriptionsCTA";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";
import { UserPointsData } from "@/lib/types/gamification";
import { getGamificationStats } from "@/services/gamification";
import { useUserGamification } from "@/hooks/useUserGamification";
import { Modal, TouchableOpacity } from "react-native";
import ProSubscribeModal from "@/components/ui/modals/proModal";
import ProFeaturesCard from "../Search/proFeaturesCard";
import { useModal } from "@/hooks/useModal";
import DailyCheckInCard from "@/components/ui/modals/checkin";
import { registerForPushNotificationsAsync } from "@/services/notifications/service";
import { saveNotificationToken } from "@/services/notifications/api";
import { LoginResponseTypes } from "@/lib/types";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
  useAnimatedScrollHandler,
  runOnJS,
} from "react-native-reanimated";
import MealPlanCard from "./mealplancard";

const HomeUser = () => {
  const scheme = useColorScheme();
  const [isScrolledToFeatured, setIsScrolledToFeatured] = useState(false);
  const subscriptionBottomSheetRef = useRef<BottomSheet>(null);
  const isCooking = useSelector((state: any) => state.recipe.isCooking);
  const name = useSelector(
    (state: any) => state.auth.loginResponseType.first_name
  );
  const [showSubscriptionCTA, setShowSubscriptionCTA] = useState(false);
  const auth: LoginResponseTypes = useSelector(
    (state: any) => state.auth.loginResponseType
  );
  useEffect(() => {
    const initNotifications = async () => {
      try {
        const expoPushToken = await registerForPushNotificationsAsync();
        if (expoPushToken) {
          await saveNotificationToken(expoPushToken);
        }
      } catch (error) {
        console.error("Failed to save notification token:");
      }
    };
    initNotifications();
  }, []);
  const isDark = scheme === "dark";
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSubscriptionCTA(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const {
    isVisible: checkInModal,
    showModal,
    hideModal,
    backdropAnim,
    modalAnim,
  } = useModal();

  const { hasCheckedIn, stats, checkIn } = useUserGamification();

  useEffect(() => {
    if (!hasCheckedIn) {
      showModal();
    }
  }, [hasCheckedIn, showModal]);

  // Reanimated shared values for animations
  const scrollY = useSharedValue(0);
  const searchBarOpacity = useSharedValue(1);
  const searchIconOpacity = useSharedValue(0);

  // Update animations when scroll state changes
  useEffect(() => {
    searchBarOpacity.value = withTiming(isScrolledToFeatured ? 0 : 1, {
      duration: 300,
    });
    searchIconOpacity.value = withTiming(isScrolledToFeatured ? 1 : 0, {
      duration: 300,
    });
  }, [isScrolledToFeatured]);

  // Animated styles
  const searchBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: searchBarOpacity.value,
      transform: [
        {
          translateY: interpolate(
            searchBarOpacity.value,
            [0, 1],
            [-10, 0],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const searchIconAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: searchIconOpacity.value,
      transform: [
        {
          scale: interpolate(
            searchIconOpacity.value,
            [0, 1],
            [0.8, 1],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  console.log('checkin',hasCheckedIn);

  return (
    <View className="flex-1">
      {/* Gradient background for visual interest */}
      <LinearGradient
        colors={isDark ? ["#111115", "#16161a"] : ["#f9f9ff", "#ffffff"]}
        className="absolute top-0 left-0 right-0 h-48 z-0"
      />

      {/* Header with glass effect */}
      <BlurView
        intensity={isDark ? 20 : 60}
        tint={isDark ? "dark" : "light"}
        className="absolute top-0 left-0 right-0 z-10 pt-12 pb-3"
        style={{
          paddingTop: Platform.OS === "ios" ? 50 : 36,
        }}
      >
        {/* User info and greeting */}
        <View className="flex-row items-center justify-between px-4 mb-3">
          <Pressable className="flex-row items-center">
            {auth?.image_url ? (
              <Image
                source={{ uri: auth?.image_url }}
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
          <View className="flex-row items-center space-x-4">
            {/* Search Icon - Animated */}
            <Animated.View style={searchIconAnimatedStyle}>
              <Pressable
                onPress={() => router.push("/(protected)/(nested)/search")}
                className="relative h-10 w-10 bg-background/80 dark:bg-muted/20 rounded-full flex items-center justify-center shadow-sm"
              >
                <Search size={20} color={isDark ? "#e0e0e0" : "#333"} />
              </Pressable>
            </Animated.View>

            {/* Coins with animation */}
            <Pressable className="bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-full mx-2">
              <View className="flex-row items-center">
                <LottieView
                  source={require("../../../assets/lottie/coin.json")}
                  autoPlay
                  loop={true}
                  style={{ width: 22, height: 22 }}
                />
                <Text className="font-bold text-amber-600 dark:text-amber-400 text-sm ml-1">
                  -
                </Text>
              </View>
            </Pressable>

            {/* Bell Icon in floating pill */}
            <Pressable className="relative h-10 w-10 bg-background/80 dark:bg-muted/20 rounded-full flex items-center justify-center shadow-sm">
              <Bell size={20} color={isDark ? "#e0e0e0" : "#333"} />
            </Pressable>
          </View>
        </View>

        {/* Search bar with animated appearance */}
        {!isScrolledToFeatured && (
          <Animated.View style={searchBarAnimatedStyle}>
            <Pressable
              onPress={() => router.push("/(protected)/(nested)/search")}
              className=" flex-row items-center bg-background dark:bg-background px-6 py-4 rounded-full border border-muted mt-2 mx-3"
            >
              <Search size={18} color={isDark ? "#aaa" : "#888"} />
              <Text className="ml-2 text-muted">
                Search recipes, ingredients...
              </Text>
            </Pressable>
          </Animated.View>
        )}
      </BlurView>

      {/* Main content */}
      <Animated.ScrollView
        className="flex-1 mt-2"
        contentContainerStyle={{
          paddingTop: Platform.OS === "ios" ? 140 : 120,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
        onScroll={useAnimatedScrollHandler({
          onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
            runOnJS(setIsScrolledToFeatured)(event.contentOffset.y > 1);
          },
        })}
        scrollEventThrottle={16} // For smoother tracking
      >
        <FeaturedRecipes />
        <PopularRecipes />
        <MealPlanCard />

        {showSubscriptionCTA && <SubcriptionCTA />}
      </Animated.ScrollView>

      {/* Floating cooking button with subtle animation */}
      {isCooking && (
        <Pressable
          className="absolute bottom-5 right-5 z-20 mb-24"
          onPress={() => router.push(`/cooking/1`)}
        >
          <View className="bg-primary rounded-full p-3 shadow-lg shadow-primary/20">
            <Svg1 width={40} height={40} color="#fff" />
          </View>
        </Pressable>
      )}

      {/* {!hasCheckedIn && (
        <ProSubscribeModal
          visible={!hasCheckedIn}
          hideModal={hideModal}
          backdropAnim={backdropAnim}
          modalAnim={modalAnim}
        >
          <DailyCheckInCard
            handleCheckIn={async () => {
              await checkIn();
              hideModal();
            }}
            handleSkip={hideModal}
            userPointsData={stats}
          />
        </ProSubscribeModal>
      )} */}
    </View>
  );
};

export default HomeUser;
// {/* <View className="flex-1 relative">
// <View
//   className="absolute top-0 left-0 right-0 z-10 bg-background pt-12 pb-4 shadow-md"
//   style={{
//     paddingTop: Platform.OS === "ios" ? 50 : 36,
//   }}
// >
//   {/* Main Header Row */}
//   <View className="flex-row justify-between items-center px-4">
//     {/* Left: Profile/Avatar */}
//     <Pressable>
//       {auth?.image_url ? (
//         <Image
//           source={{ uri: auth?.image_url }}
//           className="w-10 h-10 rounded-full"
//           resizeMode="cover"
//         />
//       ) : (
//         <CircleUserRound
//           size={32}
//           strokeWidth={1}
//           color={scheme === "dark" ? "#fff" : "#000"}
//         />
//       )}
//     </Pressable>

//     {/* Center: Greeting with Icon */}
//     <View className="flex-row items-center">
//       <Ionicons name={getIconName()} size={18} color="#FFB830" />
//       <Text
//         className="text-sm ml-2 font-medium text-foreground max-w-[120px]"
//         numberOfLines={1}
//         ellipsizeMode="tail"
//       >
//         {getGreeting(name)}
//       </Text>
//     </View>

//     {/* Right: Action Icons */}
//     <View className="flex-row items-center space-x-4">
//       {/* Coins */}
//       <Pressable>
//         <View className="flex-row items-center">
//           <LottieView
//             source={require("../../../assets/lottie/coin.json")}
//             autoPlay
//             loop={true}
//             style={{ width: 22, height: 22 }}
//           />
//           <Text className="font-bold text-yellow-600 dark:text-yellow-400 text-sm">
//             -
//           </Text>
//         </View>
//       </Pressable>

//       {/* Bell Icon */}
//       <Pressable>
//         <View className="relative">
//           <Bell size={22} color={scheme === "dark" ? "#fff" : "#000"} />
//           {/* {hasNotifications && (
//             <View className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
//           )} */}
//         </View>
//       </Pressable>

//       {/* Search Icon */}
//       <Pressable
//         onPress={() => router.push("/(protected)/(nested)/search")}
//       >
//         <Search size={22} color={scheme === "dark" ? "#fff" : "#000"} />
//       </Pressable>
//     </View>
//   </View>
// </View>

// <ScrollView
//   className="flex-1"
//   contentContainerStyle={{
//     paddingTop: Platform.OS === "ios" ? 130 : 110,
//   }}
//   showsVerticalScrollIndicator={false}
// >
//   <View>
//     <FeaturedRecipes />
//     <PopularRecipes />
//   </View>
// </ScrollView>

// {isCooking && (
//   <Pressable
//     className="absolute bottom-5 right-5 z-20 mb-24"
//     onPress={() => router.push(`/cooking/1` as any)}
//   >
//     <View className="bg-secondary p-1 rounded-full shadow-lg">
//       <Svg1 width={50} height={50} color="#fff" />
//     </View>
//   </Pressable>
// )}

// {showSubscriptionCTA && <SubcriptionCTA />}

// {/* Show modal for returning users */}
// {/* {!hasCheckedIn && (
//   <ProSubscribeModal
//     visible={!hasCheckedIn}
//     hideModal={hideModal}
//     backdropAnim={backdropAnim}
//     modalAnim={modalAnim}
//   >
//     <DailyCheckInCard
//       handleCheckIn={async () => {
//         await checkIn();
//         hideModal();
//       }}
//       handleSkip={hideModal}
//       userPointsData={stats}
//     />
//   </ProSubscribeModal>
// )} */}
// </View> */}
