import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { ArrowLeft } from "lucide-react-native";
import React from "react";

import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import Coin from "@/assets/svgs/coin.svg";
import { Button, ButtonText } from "@/components/ui/button";

const rewards = [
  {
    id: 1,
    title: "10% off Yearly Pro Subscription",
    subtitle: "For all member",
    points: 750,
    color: "#D2A8F8",
  },
  {
    id: 2,
    title: "10% off Yearly Pro Subscription",
    subtitle: "For all member",
    points: 850,
    color: "#B4E8C2",
  },
  {
    id: 3,
    title: "10% off Yearly Pro Subscription",
    subtitle: "For all member",
    points: 1000,
    color: "#C5C9F8",
  },
];

const Rewards = () => {
  const scheme = useColorScheme();
  return (
    <ScrollView className="w-full h-full py-16 flex-col relative">
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

      <View className="p-6 rounded-2xl bg-card mx-6">
        <Text className="font-bold text-xl leading-5 text-foreground mb-1.5">
          Daily check-in Progress
        </Text>
        <Text className="text-muted leading-6 text-sm mb-3">
          You will get extra points in the seventh time you check in each week
        </Text>
        <View className="flex flex-row gap-1.5">
          {[1, 2, 3, 4, 5].map((_, index) => {
            return (
              <View
                key={index}
                className="w-16 flex flex-col justify-center items-center py-4 rounded-lg bg-white"
              >
                <Coin />
                <Text className="text-black text-sm leading-6 mt-1.5">
                  Today
                </Text>
              </View>
            );
          })}
        </View>

        <Button action="secondary" className="mt-6">
          <ButtonText className="!text-white">Check-in Now</ButtonText>
        </Button>
      </View>

      <View className="p-6 rounded-2xl bg-card mt-6 mb-8 mx-6">
        <Text className="font-bold text-2xl leading-7 text-foreground mb-2">
          Win Big Every Month
        </Text>
        <Text className="text-muted leading-6 text-sm mb-5">
          A choice between $300 in cash or travel credit to book flights,
          accommodations or experience.
        </Text>

        <Text className="font-bold text-xl leading-5 text-foreground mb-2">
          Win Big Every Month
        </Text>
        <Text className="text-muted leading-6 text-sm mb-5">
          Every month, one lucky winner scores a major prize — $300 in cash or
          travel credit for flights, hotels, or epic experiences. As Mealtime
          grows, expect even bigger rewards: thousands in cash, luxury gifts,
          vacations & more! Enter for just 500 points!
        </Text>

        <Button action="secondary" className="mt-6">
          <ButtonText className="!text-white">
            Insufficient points to Participate
          </ButtonText>
        </Button>
      </View>

      <View className="flex flex-row justify-between items-center mb-6 mx-6">
        <View>
          <Text className="text-primary font-bold text-lg leading-5 mb-1">
            Another way to get points
          </Text>
        </View>
        <Pressable>
          <Text className="text-secondary pr-5 font-bold text-lg">See all</Text>
        </Pressable>
      </View>

      <View className="flex flex-row flex-wrap justify-between gap-x-4 gap-y-6 mb-8 mx-6">
        {[1, 2, 3, 4].map((_, index) => {
          return (
            <View
              className="w-[47.5%] bg-card rounded-3xl px-4 py-5 "
              key={index}
            >
              <View className="bg-secondary/20 self-start rounded-full px-3 py-1 mb-3">
                <Text className="text-secondary font-medium">
                  Get +20 Points
                </Text>
              </View>

              <Text className="text-foreground text-lg font-semibold mb-4">
                Leave feedback or review on a ...
              </Text>

              <TouchableOpacity
                className="border border-secondary/80 rounded-full py-2.5 items-center"
                activeOpacity={0.7}
              >
                <Text className="text-secondary font-medium text-base">
                  Get Info
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      <View className="flex flex-row justify-between items-center mb-6 mx-6">
        <View>
          <Text className="text-primary font-bold text-lg leading-5 mb-1">
            Buy to shop items
          </Text>
        </View>
        <Pressable>
          <Text className="text-secondary pr-5 font-bold text-lg">See all</Text>
        </Pressable>
      </View>

      <View className="mb-32">
        <FlatList
          data={rewards}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View
              className={`overflow-hidden rounded-3xl  border-0  ${
                index === 0 ? "ml-4" : "ml-1"
              } mr-3 py-4}`}
              key={item?.id}
            >
              <View className="w-64">
                <View className="bg-[#c99fe6] p-5 pb-6">
                  <Text className="text-white text-xl font-medium mb-3">
                    {item?.title}
                  </Text>

                  <View className="bg-[#b77fd6] px-4 py-1.5 self-start rounded-full">
                    <Text className="text-white font-medium text-sm">
                      {item?.subtitle}
                    </Text>
                  </View>
                </View>

                <View className="bg-card p-5">
                  {/* <Text className="text-foreground/80 text-lg font-semibold mb-2">
                  {item?.title}
                </Text> */}
                  <Text className="text-[#ffa85c] font-medium text-xl">
                    {item?.points}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
};

export default Rewards;
