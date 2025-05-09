import React, { useState } from "react";

import {
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import { useDietsQuery } from "@/redux/queries/recipes/useStaticFilter";
import { useUpdateCustomer } from "@/redux/queries/recipes/useCustomerQuery";

import { router } from "expo-router";

import { Button, ButtonText } from "@/components/ui/button";
import { useSelector } from "react-redux";

const PickDiet = () => {
  const { data: diets = [], isLoading: dietsLoading } = useDietsQuery();
  const { mutate: updateDietPrefrences } = useUpdateCustomer();
  const customerId = useSelector(
    (state: any) => state.auth.loginResponseType.customer_details?.id
  );

  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const scheme = useColorScheme();

  const handleSelection = (index: number) => {
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes(selectedIndexes.filter((i) => i !== index));
    } else {
      setSelectedIndexes([...selectedIndexes, index]);
    }
  };

  const handleContinue = () => {
    const data = {
      diet_preferences: selectedIndexes,
    };

    updateDietPrefrences(
      { customerId, data },
      {
        onSuccess: () => {
          router.push("/(protected)/(onboarding)/allergies");
        },
        onError: (error) => {
          console.error("Error adding recipe:", error);
        },
      }
    );
  };

  return (
    <>
      <View className="w-full h-full px-9 py-16 flex-col relative">
        <View className="flex-row items-center justify-between mb-8">
          <View className="flex-1 items-center">
            <Text className="font-bold text-2xl text-primary">
              Pick your diet
            </Text>
          </View>
        </View>

        {/* Buttons List */}
        <ScrollView>
          {diets?.map((diet, index) => {
            const isSelected = selectedIndexes.includes(diet.id);
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelection(diet.id)}
              >
                <View className="mb-4">
                  <Text
                    className={`border-2 font-bold leading-6 border-border p-4 rounded-xl bg-background ${
                      isSelected
                        ? "text-background bg-secondary"
                        : "text-foreground bg-background"
                    }`}
                  >
                    {diet.name}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <Button className="mt-2" action="primary" onPress={handleContinue}>
          <ButtonText>Next</ButtonText>
        </Button>

        {/* Next Button */}
      </View>
    </>
  );
};

export default PickDiet;
