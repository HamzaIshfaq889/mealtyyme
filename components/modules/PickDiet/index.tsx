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
      <View className="flex-col w-full h-full px-9 py-16">
        <View className="flex flex-row justify-between items-center mb-20">
          <TouchableOpacity
            onPress={() => router.push("/(onboarding)/onboarding1")}
          >
            <ArrowLeft
              width={30}
              height={30}
              color={scheme === "dark" ? "#fff" : "#000"}
            />
          </TouchableOpacity>
          <Text className="block font-bold text-2xl text-primary">
            Pick your diet
          </Text>
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
                <View className="mb-4 ">
                  <Text
                    className={`border-2 font-bold leading-6 border-border p-4 rounded-xl bg-background  ${
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
        <Button
          className="mt-2"
          action="primary"
          onPress={() => router.push("/allergies")}
        >
          <ButtonText>Next</ButtonText>
        </Button>
      </View>
    </>
  );
};

export default PickDiet;
