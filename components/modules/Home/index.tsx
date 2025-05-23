import React, { useEffect, useRef, useState, useCallback } from "react";
import { Bell, CircleUserRound, Search } from "lucide-react-native";
import {
  Text,
  View,
  Pressable,
  useColorScheme,
  Platform,
  Image,
  NativeModules,
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
  cancelAnimation,
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
// import { TabBarContext } from "@/app/(protected)/(tabs)/_layout";

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

// Add memory monitoring function
const logMemoryUsage = () => {
  if (__DEV__) {
    try {
      if (Platform.OS === "android") {
        const { getMemoryInfo } = NativeModules;
        if (getMemoryInfo) {
          getMemoryInfo().then((info: any) => {
            console.log("Android Memory Usage:", {
              totalMemory: `${Math.round(info.totalMemory / 1024 / 1024)}MB`,
              usedMemory: `${Math.round(info.usedMemory / 1024 / 1024)}MB`,
              freeMemory: `${Math.round(info.freeMemory / 1024 / 1024)}MB`,
            });
          });
        } else {
          console.log("Memory monitoring not available on this device");
        }
      } else if (Platform.OS === "ios") {
        console.log("Memory monitoring not available on iOS");
      }
    } catch (error) {
      console.log("Memory monitoring error:", error);
    }
  }
};

// Add type for Redux state
interface RootState {
  recipe: {
    isCooking: boolean;
  };
  auth: {
    loginResponseType: {
      first_name: string;
      image_url?: string;
      id: string;
    };
  };
}

const HomeUser = () => {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const lottieRef = useRef<LottieView>(null);
  const [isScrolledToFeatured, setIsScrolledToFeatured] = useState(false);
  const subscriptionBottomSheetRef = useRef<BottomSheet>(null);

  // Optimize Redux selectors to only get what's needed
  const isCooking = useSelector((state: RootState) => state.recipe.isCooking);
  const {
    first_name: name,
    image_url,
    id: customerId,
  } = useSelector(
    (state: RootState) => state.auth.loginResponseType,
    // Add shallow equality check to prevent unnecessary re-renders
    (prev, next) => {
      console.log("[HomeUser] Redux selector comparison:", { prev, next });
      return (
        prev?.first_name === next?.first_name &&
        prev?.image_url === next?.image_url &&
        prev?.id === next?.id
      );
    }
  );

  const [showSubscriptionCTA, setShowSubscriptionCTA] = useState(false);
  const auth: LoginResponseTypes = useSelector(
    (state: any) => state.auth.loginResponseType
  );

  const [checking, setChecking] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);

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
  // const { tabBarTranslateY } = React.useContext(TabBarContext);

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

    return () => {
      // Cancel animations when effect cleanup
      cancelAnimation(searchBarOpacity);
      cancelAnimation(searchIconOpacity);
    };
  }, [isScrolledToFeatured]);

  // // Add memory monitoring
  // useEffect(() => {
  //   if (__DEV__) {
  //     // Log initial memory usage
  //     logMemoryUsage();

  //     // Set up interval to log memory usage
  //     const memoryInterval = setInterval(() => {
  //       logMemoryUsage();
  //     }, 5000); // Log every 5 seconds

  //     return () => {
  //       clearInterval(memoryInterval);
  //     };
  //   }
  // }, []);

  // Add memory check to scroll handler
  // const handleScroll = useCallback(
  //   (event: any) => {
  //     try {
  //       const offsetY = event.contentOffset.y;
  //       console.log("[HomeUser] Scroll position:", offsetY);
  //       scrollY.value = offsetY;
  //       setIsScrolledToFeatured(offsetY > 1);

  //       // Clear any existing animation frame
  //       if (scrollTimeoutRef.current) {
  //         console.log("[HomeUser] Clearing existing animation frame");
  //         cancelAnimationFrame(scrollTimeoutRef.current);
  //       }

  //       // Use requestAnimationFrame instead of setTimeout for better performance
  //       scrollTimeoutRef.current = requestAnimationFrame(() => {
  //         console.log("[HomeUser] Processing scroll animation frame");
  //         if (offsetY > 0) {
  //           headerTranslateY.value = withTiming(-100, { duration: 200 });
  //           if (tabBarTranslateY?.value !== undefined) {
  //             tabBarTranslateY.value = withTiming(100, { duration: 200 });
  //           }
  //         } else {
  //           headerTranslateY.value = withTiming(0, { duration: 200 });
  //           if (tabBarTranslateY?.value !== undefined) {
  //             tabBarTranslateY.value = withTiming(0, { duration: 200 });
  //           }
  //         }
  //       });

  //       // Log memory usage during scroll (throttled)
  //       if (__DEV__ && offsetY % 100 === 0) {
  //         console.log("[HomeUser] Scroll memory check at offset:", offsetY);
  //         logMemoryUsage();
  //       }
  //     } catch (error) {
  //       console.error("[HomeUser] Scroll handling error:", error);
  //     }
  //   },
  //   [tabBarTranslateY]
  // );

  // const handleScrollEnd = useCallback(() => {
  //   try {
  //     // Always show header and tab bar when scrolling stops
  //     headerTranslateY.value = withTiming(0, { duration: 200 });
  //     if (tabBarTranslateY?.value !== undefined) {
  //       tabBarTranslateY.value = withTiming(0, { duration: 200 });
  //     }
  //   } catch (error) {
  //     console.error("Scroll end handling error:", error);
  //   }
  // }, [tabBarTranslateY]);

  // Cleanup all listeners and animations on unmount
  // useEffect(() => {
  //   console.log("[HomeUser] Setting up notifications and subscriptions");
  //   let notificationListener: Notifications.Subscription;
  //   let responseListener: Notifications.Subscription;
  //   let subscriptionTimer: ReturnType<typeof setTimeout>;

  //   const setupNotifications = async () => {
  //     try {
  //       console.log("[HomeUser] Registering for push notifications");
  //       const token = await registerForPushNotificationsAsync();
  //       if (token) {
  //         console.log("[HomeUser] Push notification token received");
  //         setExpoPushToken(token);
  //         await saveTokenToBackend(token);
  //       }
  //     } catch (error: any) {
  //       console.error("[HomeUser] Push notification setup error:", error);
  //       setExpoPushToken(`${error}`);
  //     }

  //     notificationListener = Notifications.addNotificationReceivedListener(
  //       (notification) => {
  //         console.log("[HomeUser] Notification received:", notification);
  //         setNotification(notification);
  //       }
  //     );

  //     responseListener = Notifications.addNotificationResponseReceivedListener(
  //       (response) => {
  //         console.log("[HomeUser] Notification response received:", response);
  //       }
  //     );
  //   };

  //   setupNotifications();

  //   subscriptionTimer = setTimeout(() => {
  //     console.log("[HomeUser] Showing subscription CTA");
  //     setShowSubscriptionCTA(true);
  //   }, 3000);

  //   return () => {
  //     console.log("[HomeUser] Cleaning up notifications and subscriptions");
  //     // Cleanup notification listeners
  //     if (notificationListener) notificationListener.remove();
  //     if (responseListener) responseListener.remove();
  //     if (subscriptionTimer) clearTimeout(subscriptionTimer);
  //     if (scrollTimeoutRef.current) {
  //       console.log("[HomeUser] Cleaning up scroll animation frame");
  //       cancelAnimationFrame(scrollTimeoutRef.current);
  //     }

  //     // Reset all animation values
  //     scrollY.value = 0;
  //     headerTranslateY.value = 0;
  //     searchBarOpacity.value = 1;
  //     searchIconOpacity.value = 0;
  //     if (tabBarTranslateY?.value !== undefined) {
  //       tabBarTranslateY.value = 0;
  //     }

  //     // Cancel any ongoing animations
  //     cancelAnimation(scrollY);
  //     cancelAnimation(headerTranslateY);
  //     cancelAnimation(searchBarOpacity);
  //     cancelAnimation(searchIconOpacity);
  //   };
  // }, []);

  // Cleanup scroll handler
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        cancelAnimationFrame(scrollTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    console.log("[HomeUser] Checking daily check-in status:", {
      statsLoading,
      checking,
      customerId,
    });
    if (statsLoading || checking || !customerId) return;

    (async () => {
      setChecking(true);
      try {
        const stored = await getLastCheckInDate(customerId);
        const today = formatDate(new Date());
        console.log("[HomeUser] Daily check-in dates:", { stored, today });

        if (stored !== today) {
          console.log("[HomeUser] Performing daily check-in");
          await checkInMutation.mutateAsync();
          await setLastCheckInDate(customerId, today);
          showModal();
        }
      } catch (e) {
        console.error("[HomeUser] Daily check‑in failed:", e);
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

  // Cleanup Lottie animation
  useEffect(() => {
    return () => {
      if (lottieRef.current) {
        lottieRef.current.reset();
      }
    };
  }, []);

  const [isLottiePlaying, setIsLottiePlaying] = useState(false);

  const handleLottieAnimationFinish = useCallback(() => {
    setIsLottiePlaying(false);
  }, []);

  // Start Lottie animation when component mounts
  useEffect(() => {
    if (lottieRef.current && !isLottiePlaying) {
      lottieRef.current.play();
    }
  }, [isLottiePlaying]);

  // Add memory check to component mount/unmount
  useEffect(() => {
    if (__DEV__) {
      console.log("[HomeUser] Component mounted - checking memory");
      logMemoryUsage();

      return () => {
        console.log("[HomeUser] Component unmounting - checking memory");
        logMemoryUsage();
      };
    }
  }, []);

  console.log('okkkkkkkkkkkkkkkkkkkkkkkk')

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
            <Pressable
              className="bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-full mx-2"
              onPress={() => {
                if (lottieRef.current && !isLottiePlaying) {
                  lottieRef.current.play();
                }
              }}
            >
              <View className="flex-row items-center">
                <LottieView
                  ref={lottieRef}
                  source={require("../../../assets/lottie/coin.json")}
                  autoPlay={false}
                  loop={false}
                  style={{ width: 22, height: 22 }}
                  onAnimationFinish={handleLottieAnimationFinish}
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
        // onScroll={useAnimatedScrollHandler({
        //   onScroll: (event) => {
        //     "worklet";
        //     runOnJS(handleScroll)(event);
        //   },
        // })}
        scrollEventThrottle={16}
        // onScrollEndDrag={handleScrollEnd}
        // onMomentumScrollEnd={handleScrollEnd}
        bounces={true}
        overScrollMode="always"
        removeClippedSubviews={true}
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
          <View
            className={`${
              scheme === "dark" ? "bg-primary" : "bg-card"
            } rounded-full p-3 shadow-lg shadow-primary/20`}
          >
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
