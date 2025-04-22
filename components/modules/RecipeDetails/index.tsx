import React, { useRef, useState } from "react";

import { Image, Pressable, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";

import { useDispatch } from "react-redux";

import { useQuery } from "@tanstack/react-query";

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

import { Button, ButtonText } from "@/components/ui/button";

import Protien from "@/assets/svgs/Proteins.svg";

import { getSingleRecipe } from "@/services/recipesAPI";

import InstructionDetails from "./instructionDetails";
import RecipeMenuOptions from "./recipeMenuOptions";
import IngredientDetails from "./ingredientDetails";

import Review from "./review";

const RecipeDetails = ({ recipeId }: { recipeId: string | null }) => {
  const scheme = useColorScheme();
  const dispatch = useDispatch();

  const isDarkMode = scheme === "dark";
  const bottomSheetMenuRef = useRef<BottomSheet>(null);
  const [activeTab, setActiveTab] = useState<"Ingredients" | "Instructions">(
    "Ingredients"
  );

  const {
    data: recipe,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: () => getSingleRecipe(recipeId),
    enabled: !!recipeId,
  });

  const gradientsInfo = [
    { id: 1, icon: Leaf, text: `${recipe?.nutrition?.carbohydrates}g carbs` },
    { id: 2, icon: Protien, text: `${recipe?.nutrition?.protein}g protiens` },
    { id: 3, icon: Flame, text: `${recipe?.nutrition?.calories}g cal` },
    { id: 4, icon: Pizza, text: `${recipe?.nutrition?.fat}g fat` },
  ];

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView className="relative">
          <Image
            source={{ uri: recipe?.image_url }}
            resizeMode="cover"
            className="w-full h-96 object-cover object-center"
          />

          <View
            className="flex flex-row justify-between w-full absolute top-0 py-12 px-6"
            pointerEvents="box-none"
          >
            <View className="bg-background w-10 h-10 p-1.5 flex justify-center items-center rounded-md">
              <X
                color={scheme === "dark" ? "#fff" : "#000"}
                size={22}
                onPress={() => router.push("/(tabs)/Home")}
              />
            </View>
            <View className="flex flex-row gap-2 items-center">
              <View className="bg-background w-20 h-10 p-1.5 flex flex-row justify-center gap-1.5 items-center rounded-md">
                <Star color={scheme === "dark" ? "#fff" : "#000"} size={22} />
                <Text className="text-primary">4.5</Text>
              </View>

              <View className="bg-background w-10 h-10 p-1.5 flex justify-center items-center rounded-md">
                <Heart color={scheme === "dark" ? "#fff" : "#000"} size={22} />
              </View>
            </View>
          </View>
          <View className="px-6 pt-6 pb-20  rounded-tl-[30px] rounded-tr-[30] -mt-10 bg-background">
            <Pressable
              className="flex flex-row justify-end py-1"
              onPress={() => bottomSheetMenuRef.current?.snapToIndex(1)}
            >
              <Ellipsis size={25} color={scheme === "dark" ? "#fff" : "#000"} />
            </Pressable>
            <View className="w-full fex flex-row items-center justify-between">
              <Text className="text-primary font-bold text-2xl leading-8 mt-2 max-w-80">
                {recipe?.title}
              </Text>
              <View className="flex flex-row items-center justify-between gap-1.5">
                <Clock color="#96a1b0" size={18} />
                <Text className="text-muted">
                  {/* {recipe?.ready_in_minutes
                    ? convertMinutesToTimeLabel(recipe?.ready_in_minutes)
                    : "15min"} */}
                </Text>
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
                    <Text className="font-semibold text-lg leading-5 text-primary">
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
                  <Text className="text-primary">-</Text>
                </View>
                <Text className="font-bold text-lg leading-8 text-primary">
                  1
                </Text>
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
              {/* {activeTab === "Ingredients" ? (
                <IngredientDetails
                  ingredients={recipe?.ingredients ? recipe.ingredients : []}
                />
              ) : (
                <InstructionDetails
                  instructions={recipe?.instructions ? recipe.instructions : []}
                />
              )} */}
            </View>

            <Button
              action="secondary"
              className="h-16 mt-6"
              onPress={() => router.push(`/cooking/${recipe?.id}` as any)}
            >
              <ButtonText>Start Cooking</ButtonText>
            </Button>

            <View className="mb-8">
              <Review />
            </View>

            <View className="w-full h-[2px] bg-accent mb-7"></View>

            <View className="flex flex-row gap-3.5 mb-10">
              <View className="bg-accent p-7 border-2 border-secondary rounded-full"></View>
              <View>
                <Text className="text-foreground font-semibold leading-5 text-lg mb-1.5">
                  Natalia Luca
                </Text>
                <Text className="font-medium text-gray-500">
                  I'm the author and recipe developer.
                </Text>
              </View>
            </View>

            <View className="mt-8">{/* <RelatedRecipes /> */}</View>
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
        handleStyle={{
          backgroundColor: isDarkMode ? "#1f242a" : "#fff",
          borderWidth: 0,
        }}
        handleIndicatorStyle={{
          backgroundColor: isDarkMode ? "#888" : "#ccc",
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
