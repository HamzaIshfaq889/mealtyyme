import React, { useState } from "react";

import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

import { router } from "expo-router";

import Svg1 from "../../../assets/svgs/arrow-left.svg";
import { Button, ButtonText } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react-native";

const PickDiet = () => {
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const scheme = useColorScheme();

  const buttons = [
    "Low Carbs",
    "Keto",
    "Flexitarian",
    "Paleo",
    "Vegetarian",
    "Pescatarian",
    "Vegan",
  ];

  const handleSelection = (index: number) => {
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes(selectedIndexes.filter((i) => i !== index));
    } else {
      setSelectedIndexes([...selectedIndexes, index]);
    }
  };

  return (
    <>
      <View className="w-full h-full px-9 py-16 flex-col relative">
        {/* Header row */}
        <View className="flex-row items-center justify-between mb-8">
          <TouchableOpacity
            onPress={() => router.push("/(protected)/(onboarding)/onboarding1")}
          >
            <ArrowLeft
              width={30}
              height={30}
              color={scheme === "dark" ? "#fff" : "#000"}
            />
          </TouchableOpacity>

          <View className="flex-1 items-center">
            <Text className="font-bold text-2xl text-primary">
              Pick your diet
            </Text>
          </View>

          {/* Invisible View to balance layout */}
          <View style={{ width: 30 }} />
        </View>

        {/* Buttons List */}
        <View>
          {buttons?.map((btn, index) => {
            const isSelected = selectedIndexes.includes(index);
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelection(index)}
              >
                <View className="mb-4">
                  <Text
                    className={`border-2 font-bold leading-6 border-border p-4 rounded-xl bg-background ${
                      isSelected
                        ? "text-background bg-secondary"
                        : "text-foreground bg-background"
                    }`}
                  >
                    {btn}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Next Button */}
        <Button
          className="mt-2"
          action="primary"
          onPress={() => router.push("/(protected)/(onboarding)/allergies")}
        >
          <ButtonText>Next</ButtonText>
        </Button>
      </View>
    </>
  );
};

export default PickDiet;
