import React, { useState } from "react";


import { Text, View } from "react-native";

import { Clock, Leaf, Flame, Pizza } from "lucide-react-native";

import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';

import Protien from "@/assets/svgs/Proteins.svg";

import { Button, ButtonText } from "@/components/ui/button";
import IngredientDetails from "./ingredientDetails";
import InstructionDetails from "./instructionDetails";

const RecipeDetails = ({ bottomSheetRef }: { bottomSheetRef: React.RefObject<BottomSheet> }) => {

  const [activeTab, setActiveTab] = useState<"Ingredients" | "Instructions">(
    "Ingredients"
  );


  const gradientsInfo = [
    { id: 1, icon: Leaf, text: "65 Carbs" },
    { id: 2, icon: Protien, text: "27g Protiens" },
    { id: 3, icon: Flame, text: "27g Protiens" },
    { id: 4, icon: Pizza, text: "91g Protiens" },
  ];


  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={["20%", "50%", "80%"]}
      backdropComponent={BottomSheetBackdrop}
      onChange={(index) => {
        if (index === 0) {
          bottomSheetRef.current?.close();
        }
      }}
    >
      <BottomSheetScrollView>
        <View className="p-5">
          <View className="w-full fex flex-row items-center justify-between">
            <Text className="text-primary font-bold text-2xl leading-8 mt-2">
              Healthy Taco Salad
            </Text>
            <View className="flex flex-row items-center justify-between">
              <Clock color="#96a1b0" size={18} />
              <Text className="text-muted">15 Min</Text>
            </View>
          </View>
          <Text className="text-muted mt-3">
            This Healthy Taco Salad is the universal delight of taco night
            <Text className="text-primary font-semibold leading-5">
              {" "}
              View More
            </Text>
          </Text>

          <View className="flex flex-row flex-wrap mt-3 mb-3">
            {gradientsInfo?.map((item) => {
              return (
                <View
                  key={item.id}
                  className="basis-1/2 flex flex-row items-center gap-3 py-2"
                >
                  <View className="bg-accent p-2 rounded-md">
                    <item.icon color="#00C3FF" />
                  </View>
                  <Text className="font-semibold text-lg leading-5">
                    {item.text}
                  </Text>
                </View>
              );
            })}
          </View>

          <View
            className="p-4 flex flex-row items-center justify-between rounded-2xl mb-5"
            style={{
              boxShadow: "0px 2px 16px 0px #0633361A",
            }}
          >
            <Text className="font-bold text-xl text-primary">
              Number of Servings
            </Text>
            <View className="flex flex-row gap-3 items-center">
              <View className="border border-accent py-0.5 px-2 rounded-lg">
                <Text>-</Text>
              </View>
              <Text className="font-bold text-lg leading-8">1</Text>
              <View className="border border-secondary py-0.5 px-2 rounded-lg">
                <Text className="text-secondary">+</Text>
              </View>
            </View>
          </View>

          <View className="flex flex-row gap-1.5 bg-gray4 px-2 py-2 rounded-2xl mb-5">
            <Button
              className={`basis-1/2 rounded-2xl ${activeTab === "Ingredients"
                ? "bg-foreground"
                : "bg-gray4"
                }`}
              onPress={() => setActiveTab("Ingredients")}
            >
              <ButtonText
                className={`${activeTab === "Ingredients"
                  ? "text-background"
                  : "!text-primary"
                  }`}
              >
                Ingredients
              </ButtonText>
            </Button>

            <Button
              className={`basis-1/2 rounded-2xl ${activeTab === "Instructions"
                ? "bg-foreground"
                : "bg-gray4"
                }`}
              onPress={() => setActiveTab("Instructions")}
            >
              <ButtonText
                className={`${activeTab === "Instructions"
                  ? "text-background"
                  : "!text-primary"
                  }`}
              >
                Instructions
              </ButtonText>
            </Button>
          </View>

          <View>
            {activeTab === "Ingredients" ? (
              <IngredientDetails />
            ) : (
              <InstructionDetails />
            )}
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default RecipeDetails;
