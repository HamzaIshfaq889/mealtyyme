import { router } from "expo-router";

import React from "react";
import { ScrollView, Text, View } from "react-native";
import { TouchableOpacity, useColorScheme } from "react-native";
import { ArrowLeft } from "lucide-react-native";

import RewardCard from "./rewardCard";

const rewardsData = [
  {
    id: "1",
    title: "10 % off Yearly Pro Subscription",
    points: 750,
    bgColor: "bg-[#d9b6f1]",
    textColor: "text-[#ffa85c]",
    borderColor: "border-[#ffa85c]",
  },
  {
    id: "2",
    title: "10 % off Yearly Pro Subscription",
    points: 850,
    bgColor: "bg-[#b8e5c0]",
    textColor: "text-[#ffa85c]",
    borderColor: "border-[#ffa85c]",
  },
  {
    id: "3",
    title: "10 % off Yearly Pro Subscription",
    points: 1000,
    bgColor: "bg-[#c3c6f4]",
    textColor: "text-[#ffa85c]",
    borderColor: "border-[#ffa85c]",
  },
  {
    id: "4",
    title: "10 % off Yearly Pro Subscription",
    points: 1200,
    bgColor: "bg-[#a3e4e9]",
    textColor: "text-[#ffa85c]",
    borderColor: "border-[#ffa85c]",
  },
];

const RedeemPoints = () => {
  const scheme = useColorScheme();
  return (
    <ScrollView className="w-full h-full py-16 flex-col relative bg-background">
      <View className="flex-row items-center justify-between mb-8 mx-6">
        <TouchableOpacity
          onPress={() => router.push("/(protected)/(nested)/settings")}
        >
          <ArrowLeft
            width={30}
            height={30}
            color={scheme === "dark" ? "#fff" : "#000"}
          />
        </TouchableOpacity>

        <View className="flex-1 items-center">
          <Text className="font-bold text-2xl text-primary">
            Redeem Your Points
          </Text>
        </View>
      </View>

      <View className="flex flex-row justify-between flex-wrap gap-4 mx-6">
        {rewardsData.map((reward) => (
          <View className="w-[47.5%]" key={reward.id}>
            <RewardCard
              title={reward.title}
              points={reward.points}
              bgColor={reward.bgColor}
              textColor={reward.textColor}
              borderColor={reward.borderColor}
            />
          </View>
        ))}
      </View>

      <Text className="text-primary font-bold text-lg leading-5 mx-6 my-8">
        Reward for Pro members
      </Text>

      <View className="flex flex-row justify-between flex-wrap gap-4 mx-6 mb-32">
        {rewardsData.map((reward) => (
          <View className="w-[47.5%]" key={reward.id}>
            <RewardCard
              title={reward.title}
              points={reward.points}
              bgColor={reward.bgColor}
              textColor={reward.textColor}
              borderColor={reward.borderColor}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default RedeemPoints;
