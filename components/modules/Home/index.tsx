import React, { useEffect, useRef, useState } from "react";
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

  const { data: stats, isLoading: statsLoading } = useGamificationStats();
  const checkInMutation = useCheckInUser();

  const { isVisible, showModal, hideModal, backdropAnim, modalAnim } =
    useModal();

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

  useEffect(() => {
    console.log(statsLoading, checking, customerId);
    if (statsLoading || checking || !customerId) return;

    (async () => {
      setChecking(true);
      try {
        const stored = await getLastCheckInDate(customerId);
        const today = formatDate(new Date());

        console.log(stored);
        console.log(today);
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

  const scrollY = useSharedValue(0);
  const searchBarOpacity = useSharedValue(1);
  const searchIconOpacity = useSharedValue(0);

  useEffect(() => {
    searchBarOpacity.value = withTiming(isScrolledToFeatured ? 0 : 1, {
      duration: 300,
    });
    searchIconOpacity.value = withTiming(isScrolledToFeatured ? 1 : 0, {
      duration: 300,
    });
  }, [isScrolledToFeatured]);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      hideModal();
    }, 3000);

    return () => clearTimeout(timer);
  }, [isVisible, hideModal]);

  return (
    <View className="flex-1 bg-background pt-12">
      <View className="flex flex-row items-center justify-between mx-6 mb-6">
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
            <Text className="text-base font-semibold text-primary">
              {name || "Chef"}
            </Text>
          </View>
        </Pressable>

        <View className="flex flex-row items-center">
          <View className="w-12 h-12 bg-card flex justify-center items-center rounded-full mr-6">
            <Bell size={26} color="#ee8427" />
          </View>
          <View className="flex flex-row gap-2.5 justify-center items-center bg-card w-20 h-12 rounded-3xl">
            <View>
              <Coin />
            </View>
            <Text className="text-foreground">10</Text>
          </View>
        </View>
      </View>

      <Pressable
        onPress={() => router.push("/(protected)/(nested)/search")}
        className="mx-6 mb-6"
      >
        <Input isReadOnly className="px-4">
          <InputSlot className="ml-1">
            <InputIcon className="!w-6 !h-6 " as={SearchIcon} />
          </InputSlot>
          <InputField type="text" placeholder="Search recipe" readOnly />
        </Input>
      </Pressable>

      <Animated.ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: 60,
        }}
        showsVerticalScrollIndicator={false}
        onScroll={useAnimatedScrollHandler({
          onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
            runOnJS(setIsScrolledToFeatured)(event.contentOffset.y > 1);
          },
        })}
        scrollEventThrottle={16}
      >
        <FeaturedRecipes />
        <PopularRecipes />
        {/* <MealPlanCard /> */}

        {showSubscriptionCTA && <SubcriptionCTA />}
      </Animated.ScrollView>

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
