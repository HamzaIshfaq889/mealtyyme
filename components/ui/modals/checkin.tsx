import React, { useEffect } from "react";
import { View, Text } from "react-native";

import { UserPointsData } from "@/lib/types/gamification";

import CoinCheckin from "@/assets/svgs/coin-checkin.svg";

type DailyCheckInCardProps = {
  handleCheckIn: () => void;
  handleSkip: () => void;
  userPointsData: UserPointsData | null;
};

export default function DailyCheckInCard({
  handleCheckIn,
  handleSkip,
}: DailyCheckInCardProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      handleCheckIn();
    }, 3000);

    return () => clearTimeout(timer); 
  }, []);
  return (
    <View className="bg-background rounded-3xl">
      <View className="items-center mb-8">
        {/* <LottieView
          source={require("../../../assets/lottie/coin.json")}
          autoPlay
          loop={true}
          style={{ width: 150, height: 150 }}
        /> */}
        <View className="py-8">
          <CoinCheckin />
        </View>
        <Text className="text-foreground text-2xl font-bold mb-6 text-center">
          Congratulations!
        </Text>
        <Text className="text-foreground text-base font-medium text-center">
          You’ve earned 5 points for checking in.
        </Text>
      </View>
    </View>
  );
}
