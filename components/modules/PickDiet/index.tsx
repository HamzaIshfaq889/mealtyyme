import React, { useState } from "react";

import { Text, TouchableOpacity, View } from "react-native";

import Svg1 from "../../../assets/svgs/arrow-left.svg";
import { router } from "expo-router";
import { Button, ButtonText } from "@/components/ui/button";

const PickDiet = () => {
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

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
      <View className="flex-col w-full h-full px-9 py-16">
        <View className="flex flex-row justify-between items-center mb-20">
          <TouchableOpacity onPress={() => router.push("onboarding3")}>
            <Svg1 width={23} height={23} />
          </TouchableOpacity>
          <Text className="block font-bold text-2xl">Pick your diet</Text>
          <Text></Text>
        </View>
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
                    className={`border-2 font-bold leading-6 border-border p-4 rounded-xl ${
                      isSelected
                        ? "text-primary-foreground bg-secondary"
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
        <Button className="mt-2" action="primary" onPress={() => router.push("allergies")}>
          <ButtonText>Next</ButtonText>
        </Button>
      </View>
    </>
  );
};

export default PickDiet;
