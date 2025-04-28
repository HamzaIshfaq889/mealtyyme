import React, { useEffect, useRef, useState } from "react";

import {
  Image,
  Pressable,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";

import RenderHtml from "react-native-render-html";

import { useDispatch } from "react-redux";

import { useQuery } from "@tanstack/react-query";

import { router } from "expo-router";

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import { Clock, Leaf, Flame, Pizza, X, Ellipsis } from "lucide-react-native";

import { convertMinutesToTimeLabel } from "@/utils";

import { Button, ButtonText } from "@/components/ui/button";

import Protien from "@/assets/svgs/Proteins.svg";

import { getSingleRecipe } from "@/services/recipesAPI";

import { setCurrentRecipe, startCooking } from "@/redux/slices/recipies";

import RecipeDetailsSkeleton from "../Skeletons/recipeDetailsSkeleton";
import InstructionDetails from "./instructionDetails";
import RecipeMenuOptions from "./recipeMenuOptions";
import IngredientDetails from "./ingredientDetails";
import RelatedRecipes from "./relatedRecipes";
import Review from "./review";
import Error from "../Error";

const RecipeDetails = ({ recipeId }: { recipeId: string | null }) => {
  const bottomSheetMenuRef = useRef<BottomSheet>(null);

  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  const [expanded, setExpanded] = useState(false);
  const [serving, setServings] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"Ingredients" | "Instructions">(
    "Ingredients"
  );

  const {
    data: recipe,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: () => getSingleRecipe(recipeId),
    enabled: !!recipeId,
  });

  useEffect(() => {
    if (recipe?.servings) {
      setServings(recipe.servings);
    }
  }, [recipe]);

  if (isLoading) {
    return <RecipeDetailsSkeleton />;
  }

  if (isError) {
    return (
      <Error
        errorButtonLink="/(tabs)/Home"
        errorButtonText="Go to home"
        errorMessage="Recipe Not Found"
      />
    );
  }

  if (recipe) {
    dispatch(setCurrentRecipe(recipe));
  }

  const gradientsInfo = [
    {
      id: 1,
      icon: Leaf,
      amount: recipe?.nutrition?.carbohydrates,
      text: `g carbs`,
    },
    {
      id: 2,
      icon: Protien,
      amount: recipe?.nutrition?.protein,
      text: `g protien`,
    },
    {
      id: 3,
      icon: Flame,
      amount: recipe?.nutrition?.calories,
      text: `g cal`,
    },
    {
      id: 4,
      icon: Pizza,
      amount: recipe?.nutrition?.fat,
      text: `g fat`,
    },
  ];

  const handleStartCooking = () => {
    if (recipe) dispatch(startCooking(recipe));
    router.push(`/cooking/${recipe?.id}` as any);
  };
  function getTruncatedSummary(text: string): string {
    const words = text.split(" ");
    const wordLimit = words.slice(0, 10).join(" ");
    const charLimit = text.slice(0, 45);
    return wordLimit.length < charLimit.length
      ? wordLimit + "..."
      : charLimit + "...";
  }

  console.log(recipe);

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
                onPress={() => router.back()}
              />
            </View>
            <View className="flex flex-row gap-2 items-center">
              {/* <View className="bg-background w-20 h-10 p-1.5 flex flex-row justify-center gap-1.5 items-center rounded-md">
                <Star color={scheme === "dark" ? "#fff" : "#000"} size={22} />
                <Text className="text-primary">4.5</Text>
              </View> */}

              {/* <View className="bg-background w-10 h-10 p-1.5 flex justify-center items-center rounded-md">
                <Heart color={scheme === "dark" ? "#fff" : "#000"} size={22} />
              </View> */}
            </View>
          </View>
          <View className="pt-6 pb-20 rounded-tl-[30px] rounded-tr-[30px] -mt-10 bg-gray-50 dark:bg-black">
            <Pressable
              className="flex flex-row justify-end py-1 pr-6"
              onPress={() => bottomSheetMenuRef.current?.snapToIndex(1)}
            >
              <Ellipsis size={30} color={scheme === "dark" ? "#fff" : "#000"} />
            </Pressable>
            <View className="px-6 w-full fex flex-row items-center justify-between">
              <Text className="text-primary font-bold text-2xl leading-8 mt-2 max-w-80">
                {recipe?.title}
              </Text>
              <View className="flex flex-row items-center justify-between gap-1.5">
                <Clock color="#96a1b0" size={18} />
                <Text className="text-muted">
                  {recipe?.ready_in_minutes
                    ? convertMinutesToTimeLabel(recipe?.ready_in_minutes)
                    : "15min"}
                </Text>
              </View>
            </View>

            <View className="px-6 mt-3">
              <RenderHtml
                contentWidth={width}
                source={{
                  html:
                    expanded && recipe
                      ? recipe?.summary
                      : getTruncatedSummary(recipe?.summary || ""),
                }}
                baseStyle={{
                  color: "#9ca3af",
                  fontSize: 14,
                  lineHeight: 20,
                  maxHeight: !expanded ? 20 : undefined,
                  overflow: "hidden",
                }}
              />
              <Pressable onPress={() => setExpanded(!expanded)}>
                <Text className="text-primary font-semibold mt-1">
                  {expanded ? "View Less" : "View More"}
                </Text>
              </Pressable>
            </View>

            <View className="px-6 flex flex-row flex-wrap mt-3 mb-3">
              {gradientsInfo?.map((item) => {
                if (item.amount == null || recipe?.servings == null) {
                  // If amount or servings are missing
                  return (
                    <View
                      key={item.id}
                      className="basis-1/2 flex flex-row items-center gap-3 py-2"
                    >
                      <View className="bg-accent p-2 rounded-md">
                        <item.icon color="#00C3FF" />
                      </View>
                      <Text className="font-semibold text-lg leading-5 text-primary">
                        N/A {item.text}
                      </Text>
                    </View>
                  );
                }

                // Safe: both item.amount and recipe.servings exist
                const amountPerServing = item.amount / recipe.servings;
                const totalAmount = amountPerServing * serving;

                return (
                  <View
                    key={item.id}
                    className="basis-1/2 flex flex-row items-center gap-3 py-2"
                  >
                    <View className="bg-accent p-2 rounded-md">
                      <item.icon color="#00C3FF" />
                    </View>
                    <Text className="font-semibold text-lg leading-5 text-primary">
                      {Math.ceil(totalAmount)} {item.text}
                    </Text>
                  </View>
                );
              })}
            </View>

            <View
              className="px-6 p-4 flex flex-row items-center justify-between rounded-2xl mb-5"
              style={{
                boxShadow: "0px 2px 16px 0px #0633361A",
              }}
            >
              <Text className="font-bold text-xl text-primary">
                Number of Servings
              </Text>
              <View className="flex flex-row gap-3 items-center">
                <Pressable
                  className="border border-accent py-1 px-3 rounded-lg"
                  onPress={() => {
                    if (serving > 1) {
                      setServings(serving - 1);
                    } else {
                      setServings(serving);
                    }
                  }}
                >
                  <Text className="text-primary">-</Text>
                </Pressable>
                <Text className="font-bold text-lg leading-8 text-primary">
                  {serving}
                </Text>
                <Pressable
                  className="border border-secondary py-1 px-3 rounded-lg"
                  onPress={() => setServings(serving + 1)}
                >
                  <Text className="text-secondary">+</Text>
                </Pressable>
              </View>
            </View>

            <View className="mx-6 px-1.5 flex flex-row gap-1.5 bg-gray4  py-2 rounded-2xl mb-5">
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

            <View className="px-6">
              {activeTab === "Ingredients" ? (
                <IngredientDetails
                  ingredients={recipe?.ingredients ? recipe.ingredients : []}
                  serving={serving}
                  defaultServings={recipe?.servings ?? 1}
                />
              ) : (
                <InstructionDetails
                  instructions={recipe?.instructions ? recipe.instructions : []}
                />
              )}
            </View>

            <Button
              action="secondary"
              className="mx-6 h-16 mt-6"
              onPress={handleStartCooking}
            >
              <ButtonText>Start Cooking</ButtonText>
            </Button>

            <View className="mx-6 mb-8">
              <Review />
            </View>

            <View className="w-full h-[2px] bg-accent mb-7"></View>

            <View className="px-7 flex flex-row gap-3.5 mb-10">
              <Image
                source={{ uri: recipe?.created_by?.image_url }}
                resizeMode="cover"
                className="w- w-16 h-16 object-cover object-center rounded-full"
              />
              <View>
                <Text className="text-foreground font-semibold leading-5 text-lg mb-1.5">
                  {recipe?.created_by.first_name}
                </Text>
                <Text className="font-medium text-gray-500">
                  I'm the author and recipe developer.
                </Text>
              </View>
            </View>

            <View>
              <RelatedRecipes recipe={recipe} />
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
