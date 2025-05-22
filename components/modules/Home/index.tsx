import React, { useEffect, useRef, useState, useCallback } from "react";
import { Bell, CircleUserRound, Search, SearchIcon } from "lucide-react-native";
import {
  Text,
  View,
  Pressable,
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
import SubcriptionCTA from "../SubscriptionsCTA";

import ProSubscribeModal from "@/components/ui/modals/proModal";
import { useModal } from "@/hooks/useModal";
import DailyCheckInCard from "@/components/ui/modals/checkin";
import { LoginResponseTypes } from "@/lib/types";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
  useAnimatedScrollHandler,
  runOnJS,
  Layout,
} from "react-native-reanimated";
import MealPlanCard from "./mealplancard";
import {
  useCheckInUser,
  useGamificationStats,
} from "@/redux/queries/recipes/useGamification";
import {
  getLastCheckInDate,
  setLastCheckInDate,
} from "@/utils/storage/gamificationStorage";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";

import Coin from "@/assets/svgs/coin.svg";
import MainDishes from "./mainDishes";
import ImportRecipeCard from "./importRecipeCard";
import Under30Minutes from "./under30Minutes";
import AskChefMate from "./askChefMate";
import GlutenFreeDiets from "./glutenFreeDiets";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { saveNotificationToken } from "../../../services/notifications/api";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { TabBarContext } from "@/app/(protected)/(tabs)/_layout";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Permission not granted to get push token for push notification!"
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}

async function saveTokenToBackend(token: string) {
  try {
    await saveNotificationToken(token);
    console.log("Token saved to backend successfully");
  } catch (error) {
    console.error("Error saving token to backend:", error);
  }
}

const formatDate = (d: Date) => d.toISOString().split("T")[0];

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
  const customerId = useSelector(
    (state: any) => state?.auth?.loginResponseType
  );

  const [checking, setChecking] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const { data: stats, isLoading: statsLoading } = useGamificationStats();
  const checkInMutation = useCheckInUser();

  const { isVisible, showModal, hideModal, backdropAnim, modalAnim } =
    useModal();

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);

  // Reanimated shared values for animations
  const scrollY = useSharedValue(0);
  const searchBarOpacity = useSharedValue(1);
  const searchIconOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(0);
  const { tabBarTranslateY } = React.useContext(TabBarContext);

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

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: headerTranslateY.value,
        },
      ],
      opacity: interpolate(
        headerTranslateY.value,
        [-100, 0],
        [0, 1],
        Extrapolate.CLAMP
      ),
    };
  });

  // Update animations when scroll state changes
  useEffect(() => {
    searchBarOpacity.value = withTiming(isScrolledToFeatured ? 0 : 1, {
      duration: 300,
    });
    searchIconOpacity.value = withTiming(isScrolledToFeatured ? 1 : 0, {
      duration: 300,
    });
  }, [isScrolledToFeatured]);

  const handleScroll = useCallback(
    (event: any) => {
      const offsetY = event.contentOffset.y;
      scrollY.value = offsetY;
      setIsScrolledToFeatured(offsetY > 1);

      if (offsetY > 0) {
        headerTranslateY.value = withTiming(-100, { duration: 300 });
        if (tabBarTranslateY?.value !== undefined) {
          tabBarTranslateY.value = withTiming(100, { duration: 300 });
        }
      } else {
        headerTranslateY.value = withTiming(0, { duration: 300 });
        if (tabBarTranslateY?.value !== undefined) {
          tabBarTranslateY.value = withTiming(0, { duration: 300 });
        }
      }
    },
    [tabBarTranslateY]
  );

  const handleScrollEnd = useCallback(() => {
    headerTranslateY.value = withTiming(0, { duration: 300 });
    if (tabBarTranslateY?.value !== undefined) {
      tabBarTranslateY.value = withTiming(0, { duration: 300 });
    }
  }, [tabBarTranslateY]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        if (token) {
          setExpoPushToken(token);
          saveTokenToBackend(token);
        }
      })
      .catch((error: any) => setExpoPushToken(`${error}`));

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  const isDark = scheme === "dark";
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSubscriptionCTA(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log(statsLoading, checking, customerId);
    if (statsLoading || checking || !customerId) return;

    (async () => {
      setChecking(true);
      try {
        const stored = await getLastCheckInDate(customerId);
        const today = formatDate(new Date());

        if (stored !== today) {
          await checkInMutation.mutateAsync();
          await setLastCheckInDate(customerId, today);
          showModal();
        }
      } catch (e) {
        console.error("Daily check‑in failed:", e);
      } finally {
        setChecking(false);
      }
    })();
  }, [statsLoading, customerId]);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      hideModal();
    }, 3000);

    return () => clearTimeout(timer);
  }, [isVisible, hideModal]);

  return (
    <View className="flex-1 bg-background">
      {/* Gradient background for visual interest */}
      <LinearGradient
        colors={isDark ? ["#111115", "#16161a"] : ["#f9f9ff", "#ffffff"]}
        className="absolute top-0 left-0 right-0 h-48 z-0"
      />

      {/* Header with glass effect */}
      <Animated.View
        style={[
          headerAnimatedStyle,
          {
            paddingTop: Platform.OS === "ios" ? 50 : 36,
          },
        ]}
        className="absolute top-0 left-0 right-0 z-10 pt-12 pb-3 bg-background"
      >
        {/* User info and greeting */}
        <View className="flex-row items-center justify-between px-4 mb-3 mt-3">
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
                  {stats?.total_points}
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
              className="mx-6 mt-5"
            >
              <Input isReadOnly>
                <InputSlot className="ml-1">
                  <InputIcon className="!w-6 !h-6" as={Search} />
                </InputSlot>
                <InputField type="text" placeholder="Search Recipes" readOnly />
              </Input>
            </Pressable>
          </Animated.View>
        )}
      </Animated.View>

      <Animated.ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: 80,
          paddingTop: 190,
        }}
        showsVerticalScrollIndicator={false}
        onScroll={useAnimatedScrollHandler({
          onScroll: (event) => {
            runOnJS(handleScroll)(event);
          },
        })}
        scrollEventThrottle={16}
        onScrollEndDrag={handleScrollEnd}
        onMomentumScrollEnd={handleScrollEnd}
      >
        <Animated.View layout={Layout.springify()}>
          <View className="mb-8">
            <FeaturedRecipes />
          </View>

          <View className="mb-4">
            <PopularRecipes />
          </View>

          <View className="mb-6">
            <MealPlanCard />
          </View>

          <View className="mb-6">
            <MainDishes />
          </View>

          <View className="mb-6">
            <ImportRecipeCard />
          </View>

          <View className="mb-6">
            <Under30Minutes />
          </View>

          <View className="mb-6">
            <AskChefMate />
          </View>

          <View className="mb-6">
            <GlutenFreeDiets />
          </View>

          {showSubscriptionCTA && <SubcriptionCTA />}
        </Animated.View>
      </Animated.ScrollView>

      {isCooking && (
        <Pressable
          className="absolute bottom-5 right-5 z-20 mb-24"
          onPress={() => router.push(`/cooking/1`)}
        >
          <View className={`${scheme === "dark" ? "bg-primary" : "bg-card"} rounded-full p-3 shadow-lg shadow-primary/20`}>
            <Svg1 width={40} height={40} color="#fff" />
          </View>
        </Pressable>
      )}

      <ProSubscribeModal
        visible={isVisible}
        hideModal={hideModal}
        backdropAnim={backdropAnim}
        modalAnim={modalAnim}
      >
        <DailyCheckInCard />
      </ProSubscribeModal>
    </View>
  );
};

export default HomeUser;
