import React, { useEffect, useRef, useState } from "react";
import { Coins, Lock, Search } from "lucide-react-native";
import {
  Text,
  View,
  Pressable,
  ScrollView,
  useColorScheme,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
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

const HomeUser = () => {
  const scheme = useColorScheme();

  const subscriptionBottomSheetRef = useRef<BottomSheet>(null);
  const isCooking = useSelector((state: any) => state.recipe.isCooking);
  const name = useSelector(
    (state: any) => state.auth.loginResponseType.first_name
  );
  const [showSubscriptionCTA, setShowSubscriptionCTA] = useState(false);

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

  const { hasCheckedIn, stats, error, loading, checkIn } =
    useUserGamification();

  // Check if the user is a returning user and display the modal accordingly
  useEffect(() => {
    if (!hasCheckedIn) {
      showModal(); // Open modal if user has checked in before (i.e., returning user)
    }
  }, [hasCheckedIn, showModal]);

  console.log("haschecked", hasCheckedIn);

  return (
    <View className="flex-1 relative">
      <View
        className="absolute top-0 left-0 right-0 z-10 bg-background pt-12 pb-4 shadow-md"
        style={{
          paddingTop: Platform.OS === "ios" ? 50 : 36,
        }}
      >
        <View className="flex-row justify-between items-center px-4">
          {/* Logo */}
          <View className="bg-secondary p-2 rounded-2xl shadow-sm">
            <LogoAPP width={30} height={30} />
          </View>

          {/* Greeting Centered */}
          <View className="flex-1 items-center ml-8">
            <View className="flex-row items-center">
              <Ionicons name={getIconName()} size={18} color="#FFB830" />
              <Text
                className="text-sm ml-2 font-medium text-foreground max-w-[150px]"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {getGreeting(name)}
              </Text>
            </View>
          </View>

          {/* Coins and Search */}
          <View className="flex flex-row items-center space-x-2">
            {/* <View className="flex-row items-center bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full">
              <LottieView
                source={require("../../../assets/lottie/coin.json")}
                autoPlay
                loop={true}
                style={{ width: 24, height: 24 }}
              />
              <Text className="ml-1 font-bold text-yellow-600 dark:text-yellow-400 text-sm">
                {stats?.total_points}
              </Text>
            </View> */}

            <Pressable
              className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full"
              onPress={() => router.push("/(protected)/(nested)/search")}
            >
              <Search size={24} color={scheme === "dark" ? "#fff" : "#000"} />
            </Pressable>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: Platform.OS === "ios" ? 130 : 110,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <FeaturedRecipes />
          <PopularRecipes />
        </View>
      </ScrollView>

      {isCooking && (
        <Pressable
          className="absolute bottom-5 right-5 z-20 mb-24"
          onPress={() => router.push(`/cooking/1` as any)}
        >
          <View className="bg-secondary p-1 rounded-full shadow-lg">
            <Svg1 width={50} height={50} color="#fff" />
          </View>
        </Pressable>
      )}

      {/* {showSubscriptionCTA && <SubcriptionCTA />} */}

      {/* Show modal for returning users */}
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
