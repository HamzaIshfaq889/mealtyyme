import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Pressable,
  useColorScheme,
  Platform,
  SafeAreaView,
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
import Animated, { Layout } from "react-native-reanimated";
import MealPlanCard from "./mealplancard";
import {
  useCheckInUser,
  useGamificationStats,
} from "@/redux/queries/recipes/useGamification";
import {
  getLastCheckInDate,
  setLastCheckInDate,
} from "@/utils/storage/gamificationStorage";

import MainDishes from "./mainDishes";
import ImportRecipeCard from "./importRecipeCard";
import Under30Minutes from "./under30Minutes";
import AskChefMate from "./askChefMate";
import GlutenFreeDiets from "./glutenFreeDiets";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { saveNotificationToken } from "../../../services/notifications/api";
import LottieView from "lottie-react-native";

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

interface HomeUserProps {
  onCheckInComplete?: () => void;
}

const HomeUser = ({ onCheckInComplete }: HomeUserProps) => {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const lottieRef = useRef<LottieView>(null);
  const subscriptionBottomSheetRef = useRef<BottomSheet>(null);

  // Optimize Redux selectors to only get what's needed
  const isCooking = useSelector((state: RootState) => state.recipe.isCooking);
  const customerId = useSelector(
    (state: any) => state.auth.loginResponseType.customer_details?.id
  );

  console.log(customerId);

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);

  const [showSubscriptionCTA, setShowSubscriptionCTA] = useState(false);
  const [checking, setChecking] = useState(false);

  const { data: stats, isLoading: statsLoading } = useGamificationStats();
  const checkInMutation = useCheckInUser();

  const { isVisible, showModal, hideModal, backdropAnim, modalAnim } =
    useModal();

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
          onCheckInComplete?.();
        }
      } catch (e) {
        console.error("[HomeUser] Daily check‑in failed:", e);
      } finally {
        setChecking(false);
      }
    })();
  }, [statsLoading, customerId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSubscriptionCTA(true);
    }, 3000);

    return () => clearTimeout(timer);
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

  return (
    <View>
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
