import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { ArrowLeft } from "lucide-react-native";
import React from "react";

import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

import Coin from "@/assets/svgs/coin.svg";

const Rewards = () => {
  const scheme = useColorScheme();
  return (
    <View className="w-full h-full px-6 py-16 flex-col relative">
      <View className="flex-row items-center justify-between mb-8">
        <TouchableOpacity onPress={() => router.push("/(protected)/(tabs)")}>
          <ArrowLeft
            width={30}
            height={30}
            color={scheme === "dark" ? "#fff" : "#000"}
          />
        </TouchableOpacity>

        <View className="flex-1 items-center">
          <Text className="font-bold text-2xl text-primary">Your Rewards</Text>
        </View>

        {/* <View style={{ width: 30 }} /> */}
        <View className="flex-row items-center bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full">
          <LottieView
            source={require("../../../assets/lottie/coin.json")}
            autoPlay
            loop={true}
            style={{ width: 26, height: 26 }}
          />
          <Text className="ml-1 font-bold text-yellow-600 dark:text-yellow-400 text">
            50
          </Text>
        </View>
      </View>

      <View
        className="p-6 rounded-2xl bg-background"
        style={{
          boxShadow: "0px 2px 12px 0px rgba(0,0,0,0.1)",
        }}
      >
        <Text className="font-bold text-xl leading-5 text-foreground mb-1.5">
          Daily check-in Progress
        </Text>
        <Text className="text-muted leading-6 text-sm mb-3">
          You will get extra points in the seventh time you check in each week
        </Text>
        <View className="flex flex-row gap-2">
          <View
            className="flex flex-col justify-center items-center bg-background py-4 px-3 rounded-lg"
            style={{
              boxShadow: "0px 2px 12px 0px rgba(0,0,0,0.07)",
            }}
          >
            <Coin />
            <Text className="text-foreground text-base leading-6 mt-1.5">
              Today
            </Text>
          </View>
          <View
            className="flex flex-col justify-center items-center bg-background py-4 px-3 rounded-lg"
            style={{
              boxShadow: "0px 2px 12px 0px rgba(0,0,0,0.07)",
            }}
          >
            <Coin />
            <Text className="text-foreground text-base leading-6 mt-1.5">
              Day 1
            </Text>
          </View>
          <View
            className="flex flex-col justify-center items-center bg-background py-4 px-3 rounded-lg"
            style={{
              boxShadow: "0px 2px 12px 0px rgba(0,0,0,0.07)",
            }}
          >
            <Coin />
            <Text className="text-foreground text-base leading-6 mt-1.5">
              Day 2
            </Text>
          </View>
          <View
            className="flex flex-col justify-center items-center bg-background py-4 px-3 rounded-lg"
            style={{
              boxShadow: "0px 2px 12px 0px rgba(0,0,0,0.07)",
            }}
          >
            <Coin />
            <Text className="text-foreground text-base leading-6 mt-1.5">
              Day 3
            </Text>
          </View>
          <View
            className="flex flex-col justify-center items-center bg-background py-4 px-3 rounded-lg"
            style={{
              boxShadow: "0px 2px 12px 0px rgba(0,0,0,0.07)",
            }}
          >
            <Coin />
            <Text className="text-foreground text-base leading-6 mt-1.5">
              Day 4
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Rewards;
