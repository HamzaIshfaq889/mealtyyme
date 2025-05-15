import React from "react";

import { router } from "expo-router";

import { ScrollView, Text } from "react-native";
import { TouchableOpacity, useColorScheme, View } from "react-native";

import { ArrowLeft } from "lucide-react-native";
import EarnCard from "./earnCard";

const ways = [
  {
    id: "1",
    points: "+20 Points",
    description: "Leave feedback or review on a ...",
    button_text: "Get Info",
  },
  {
    id: "2",
    points: "+300 Points",
    description: "Leave feedback or review on a ...",
    button_text: "Get Info",
  },
  {
    id: "3",
    points: "+50 Points",
    description: "Leave feedback or review on a ...",
    button_text: "Get Info",
  },
  {
    id: "4",
    points: "+500 Points",
    description: "Leave feedback or review on a ...",
    button_text: "Get Info",
  },
  {
    id: "5",
    points: "+10 Points",
    description: "Leave feedback or review on a ...",
    button_text: "Get Info",
  },
  {
    id: "6",
    points: "+5 Points",
    description: "Leave feedback or review on a ...",
    button_text: "Get Info",
  },
  {
    id: "7",
    points: "+10 Points",
    description: "Leave feedback or review on a ...",
    button_text: "Get Info",
  },
  {
    id: "8",
    points: "+10 Points",
    description: "Leave feedback or review on a ...",
    button_text: "Get Info",
  },
];

const OtherEarnWays = () => {
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
          <Text className="font-bold text-2xl text-primary">
            Other Ways to Earn
          </Text>
        </View>
      </View>

      <View className="flex flex-row justify-between flex-wrap gap-4 mx-6 mb-28">
        {ways.map((way) => (
          <View className="w-[47.5%]" key={way.id}>
            <EarnCard
              button_text={way.button_text}
              description={way.description}
              points={way.points}
              id={way.id}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default OtherEarnWays;
