import React, { useState } from "react";

import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

import { router } from "expo-router";

import { Button, ButtonText } from "@/components/ui/button";

import { ArrowLeft } from "lucide-react-native";
import { useUpdateCustomer } from "@/redux/queries/recipes/useCustomerQuery";
import { useSelector } from "react-redux";

const Allergies = () => {
  const scheme = useColorScheme();
  const { mutate: updateAllergies } = useUpdateCustomer();
  const customerId = useSelector(
    (state: any) => state.auth.loginResponseType.customer_details?.id
  );

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
    router.push("/(protected)/(tabs)");

    const data = {
      allergies: selectedIndexes,
    };

    updateAllergies(
      { customerId, data },
      {
        onSuccess: () => {
          router.push("/(protected)/(tabs)");
        },
        onError: (error) => {
          console.error("Error adding recipe:", error);
        },
      }
    );
  };

  return (
    <View className="w-full h-full px-9 py-16 flex-col relative">
      <View className="flex-row items-center justify-between mb-8">
        <TouchableOpacity
          onPress={() => router.push("/(protected)/(onboarding)/pick-diet")}
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
