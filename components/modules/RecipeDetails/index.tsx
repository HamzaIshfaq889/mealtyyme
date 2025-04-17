import React, { useEffect, useRef, useState } from "react";

import { Pressable, Text, View } from "react-native";

import { router } from "expo-router";

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import {
  Clock,
  Leaf,
  Flame,
  Pizza,
  Ellipsis,
  X,
  Heart,
  Star,
} from "lucide-react-native";

import { Recipe } from "@/lib/types/recipe";

import Protien from "@/assets/svgs/Proteins.svg";

import InstructionDetails from "./instructionDetails";
import RecipeMenuOptions from "./recipeMenuOptions";
import IngredientDetails from "./ingredientDetails";

import { Button, ButtonText } from "@/components/ui/button";
import { getSingleRecipe } from "@/services/recipesAPI";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RecipeDetails = ({ recipeId }: { recipeId: string | null }) => {
  const bottomSheetMenuRef = useRef<BottomSheet>(null);
  const [activeTab, setActiveTab] = useState<"Ingredients" | "Instructions">(
    "Ingredients"
  );

  const [recipes, setRecipes] = useState<Recipe>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        console.log("recipe id", recipeId);
        const data = await getSingleRecipe(recipeId);
        setRecipes(data);
        console.log("recipe data", recipes);
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const gradientsInfo = [
    { id: 1, icon: Leaf, text: "65 Carbs" },
    { id: 2, icon: Protien, text: "27g Protiens" },
    { id: 3, icon: Flame, text: "27g Protiens" },
    { id: 4, icon: Pizza, text: "91g Protiens" },
  ];

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView className="relative">
          <View className="bg-green-500 w-full h-80"></View>
          {/* <Image
          source={require("@/assets/images/review-person1.png")}
          className="w-full h-80"
        /> */}

          <View
            className="flex flex-row justify-between w-full absolute top-0 py-10 px-12"
            pointerEvents="box-none"
          >
            <View className="bg-background w-10 h-10 p-1.5 flex justify-center items-center rounded-md">
              <X
                color="#000"
                size={22}
                onPress={() => router.push("/(tabs)/Home")}
              />
            </View>
            <View className="flex flex-row gap-2 items-center">
              <View className="bg-background w-20 h-10 p-1.5 flex flex-row justify-center gap-1.5 items-center rounded-md">
                <Star color="#000" size={22} />
                <Text>4.5</Text>
              </View>

              <View className="bg-background w-10 h-10 p-1.5 flex justify-center items-center rounded-md">
                <Heart color="#000" size={22} />
              </View>
            </View>
          </View>
          <View className="px-6 pt-6 pb-20  rounded-tl-[30px] rounded-tr-[30] -mt-10 bg-background">
            <Pressable
              className="flex flex-row justify-end py-1"
              onPress={() => bottomSheetMenuRef.current?.snapToIndex(1)}
            >
              <Ellipsis size={25} color="#000" />
            </Pressable>
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
                className={`basis-1/2 rounded-2xl ${
                  activeTab === "Ingredients" ? "bg-foreground" : "bg-gray4"
                }`}
                onPress={() => setActiveTab("Ingredients")}
              >
                <ButtonText
                  className={`${
                    activeTab === "Ingredients"
                      ? "text-background"
                      : "!text-primary"
                  }`}
                >
                  Ingredients
                </ButtonText>
              </Button>

              <Button
                className={`basis-1/2 rounded-2xl ${
                  activeTab === "Instructions" ? "bg-foreground" : "bg-gray4"
                }`}
                onPress={() => setActiveTab("Instructions")}
              >
                <ButtonText
                  className={`${
                    activeTab === "Instructions"
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
        </ScrollView>
      </SafeAreaView>

      <BottomSheet
        ref={bottomSheetMenuRef}
        index={-1}
        snapPoints={["50%"]}
        backdropComponent={BottomSheetBackdrop}
        onChange={(index) => {
          console.log(index);
          if (index === 0) {
            bottomSheetMenuRef.current?.close();
          }
        }}
      >
        <BottomSheetView>
          <RecipeMenuOptions />
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

export default RecipeDetails;
