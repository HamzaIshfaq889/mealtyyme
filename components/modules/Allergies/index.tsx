import React, { useState } from "react";

import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

import { router } from "expo-router";

import { useDispatch } from "react-redux";

import { Button, ButtonText } from "@/components/ui/button";

import Svg1 from "@/assets/svgs/arrow-left.svg";

import { setOnboardingComplete } from "@/redux/slices/Auth";
import { ArrowLeft } from "lucide-react-native";

const Allergies = () => {
  const dispatch = useDispatch();
  const scheme = useColorScheme();

  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

  const allergies = [
    "Shellfish",
    "Fish",
    "Gluten",
    "Peanuts",
    "Tree Nut",
    "Soy",
    "Egg",
    "Sesame",
    "Mustard",
    "Sulfite",
    "Nightshade",
  ];

  const handleSelection = (index: number) => {
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes(selectedIndexes.filter((i) => i !== index));
    } else {
      setSelectedIndexes([...selectedIndexes, index]);
    }
  };

  const handleNext = () => {
    dispatch(setOnboardingComplete(true));
    router.push("/(auth)/account-options");
  };

  return (
    <View className="px-9 py-16 flex w-full h-full flex-col">
      <View className="flex flex-row justify-between items-center mb-14">
        <TouchableOpacity onPress={() => router.push("/pick-diet")}>
          <ArrowLeft
            width={30}
            height={30}
            color={scheme === "dark" ? "#fff" : "#000"}
          />
        </TouchableOpacity>
        <Text className="block font-bold text-2xl text-primary">
          Any allergies?
        </Text>
        <Text></Text>
      </View>
      <View className="flex-row flex-wrap">
        {allergies?.map((allergy, index) => {
          const isSelected = selectedIndexes.includes(index);
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelection(index)}
            >
              <Text
                className={`border-2 inline border-border p-4 rounded-xl font-bold leading-6 mx-1.5 my-1.5 
                ${
                  isSelected
                    ? "text-background bg-secondary"
                    : "text-foreground bg-background"
                }`}
              >
                {allergy}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View className="mt-auto mb-10">
        <Text className="text-xs text-center text-muted leading-5">
          Don’t see your allergy listed? No worries! Use our advanced filter to
          easily remove any ingredient from your recipe searches. Enjoy
          personalized meal suggestions that cater to your needs!
        </Text>
      </View>
      <Button
        className="mt-2 bg-secondary"
        action="primary"
        onPress={handleNext}
      >
        <ButtonText>Next</ButtonText>
      </Button>
    </View>
  );
};

export default Allergies;
