import React, { useState } from "react";

import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

import { router } from "expo-router";

import { useDispatch } from "react-redux";

import { Button, ButtonText } from "@/components/ui/button";

import { setOnboardingComplete } from "@/redux/slices/Auth";
import { ArrowLeft } from "lucide-react-native";
import { setOnboardComplete } from "@/redux/store/expoStore";

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

  const handleNext = async () => {
    dispatch(setOnboardingComplete(true));
    await setOnboardComplete();
    router.push("/(auth)/account-options");
  };

  return (
    <View className="w-full h-full px-9 py-16 flex-col relative">
      {/* Header row */}
      <View className="flex-row items-center justify-between mb-8">
        <TouchableOpacity
          onPress={() => router.push("/(onboarding)/pick-diet")}
        >
          <ArrowLeft
            width={30}
            height={30}
            color={scheme === "dark" ? "#fff" : "#000"}
          />
        </TouchableOpacity>

        <View className="flex-1 items-center">
          <Text className="font-bold text-2xl text-primary">
            Any Allergies?
          </Text>
        </View>

        {/* Invisible View to balance layout */}
        <View style={{ width: 30 }} />
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
