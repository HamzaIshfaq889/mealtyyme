import React, { useCallback, useRef, useState } from "react";

import {
  Image,
  Pressable,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import { ScrollView } from "react-native";

import RenderHtml from "react-native-render-html";

import { useDispatch, useSelector } from "react-redux";

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
  X,
  Ellipsis,
  Heart,
  Nut,
} from "lucide-react-native";

import { convertMinutesToTimeLabel, getCleanDescription } from "@/utils";

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
import {
  useRemoveRecipe,
  useSaveRecipe,
} from "@/redux/queries/recipes/useSaveRecipesQuery";
import Toast from "react-native-toast-message";
import { saveSavedRecipesInStorage } from "@/utils/storage/authStorage";
import { setSavedRecipes, updateSavedRecipes } from "@/redux/slices/Auth";
import {
  clearStepTimers,
  saveCookingPrivacy,
  saveCookingRecipe,
} from "@/utils/storage/cookingStorage";

type RecipeDetailsProps = {
  recipeId: string | null;
  isPrivate: boolean;
};

const RecipeDetails = ({ recipeId, isPrivate }: RecipeDetailsProps) => {
  const bottomSheetMenuRef = useRef<BottomSheet>(null);

  const savedRecipes = useSelector(
    (state: any) => state.auth.savedRecipes || []
  );

  const isRecipeSaved = savedRecipes.some(
    (id: number) => id === Number(recipeId)
  );
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );
  const { mutate: saveRecipe } = useSaveRecipe();
  const { mutate: removeRecipe } = useRemoveRecipe();
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  const customerId = useSelector(
    (state: any) => state?.auth?.loginResponseType?.customer_details?.id
  );
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
    queryFn: () => getSingleRecipe(recipeId, isPrivate),
    enabled: !!recipeId,
  });

  // useEffect(() => {
  //   if (recipe?.servings) {
  //     setServings(recipe.servings);
  //   }
  // }, [recipe]);

  const gradientsInfo = [
    {
      id: 1,
      icon: Leaf,
      amount: recipe?.nutrition?.carbohydrates,
      text: `g carbs`,
    },
    {
      id: 2,
      icon: Nut,
      amount: recipe?.nutrition?.protein,
      text: `g protien`,
    },
    {
      id: 3,
      icon: Flame,
      amount: recipe?.nutrition?.calories,
      text: `K cal`,
    },
    {
      id: 4,
      icon: Pizza,
      amount: recipe?.nutrition?.fat,
      text: `g fat`,
    },
  ];

  const handleStartCooking = async () => {
    if (recipe) {
      dispatch(startCooking({ recipe, isPrivate }));
      await saveCookingRecipe(customerId, recipe);
      await saveCookingPrivacy(customerId, isPrivate);
      await clearStepTimers(customerId);

      router.push(`/cooking/${recipe?.id}` as any);
    }
  };

  const handleFavourite = (id: number | undefined) => {
    if (!id) return;

    saveRecipe(id, {
      onSuccess: (data) => {
        storeinStorage(id);
        dispatch(updateSavedRecipes(id));
      },
      onError: (error) => {
        console.error("Failed to save recipe:", error);
        Toast.show({
          type: "error",
          text1: "Something went wrong while saving recipe",
        });
      },
    });
  };

  const handleUnfavourite = (id: number | undefined) => {
    if (!id) return;

    removeRecipe(id, {
      onSuccess: () => {
        const updatedRecipes = savedRecipes.filter(
          (recipeId: number) => recipeId !== id
        );
        removeFromStorage(updatedRecipes);
        dispatch(setSavedRecipes(updatedRecipes));
      },
      onError: (error) => {
        console.error("Failed to delete recipe:", error);
        Toast.show({
          type: "error",
          text1: "Something went wrong while deleting recipe",
        });
      },
    });
  };

  const storeinStorage = async (id: number) => {
    if (!savedRecipes.includes(id)) {
      saveSavedRecipesInStorage([...savedRecipes, id])
        .then(() => {})
        .catch((error) => {
          console.error("Error saving recipe to storage:", error);
          Toast.show({
            type: "error",
            text1: "Something went wrong while saving the recipe",
          });
        });
    }
  };

  const removeFromStorage = async (updatedRecipes: number[]) => {
    saveSavedRecipesInStorage([...updatedRecipes])
      .then(() => {})
      .catch((error) => {
        console.error("Error saving recipe to storage:", error);
        Toast.show({
          type: "error",
          text1: "Something went wrong while saving the recipe",
        });
      });
  };

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

  return (
    <>
      {/* <SafeAreaView style={{ flex: 1 }} className="bg-background"> */}
      <ScrollView className="relative bg-background">
        <Image
          source={{ uri: recipe?.image_url }}
          resizeMode="cover"
          className="w-full h-96 object-cover object-center"
        />

        <View
          className="flex flex-row justify-between w-full absolute top-0 py-12 px-6"
          pointerEvents="box-none"
        >
          <View className=" w-10 h-10 p-1.5 flex justify-center items-center rounded-md bg-background">
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

            <Pressable
              className="bg-background w-10 h-10 p-1.5 flex justify-center items-center rounded-md"
              onPress={() => handleFavourite(recipe?.id)}
            >
              {isRecipeSaved ? (
                <Heart
                  color={scheme === "dark" ? "#fff" : "#000"}
                  size={22}
                  onPress={() => handleUnfavourite(recipe?.id)}
                  fill={scheme === "dark" ? "#fff" : "#000"}
                />
              ) : (
                <Heart
                  color={scheme === "dark" ? "#fff" : "#000"}
                  size={22}
                  onPress={() => handleFavourite(recipe?.id)}
                />
              )}
            </Pressable>
          </View>
        </View>
        <View className="pt-6 pb-20 rounded-tl-[30px] rounded-tr-[30px] -mt-10 bg-background">
          {!isPrivate && (
            <Pressable
              className="flex flex-row justify-end py-1 pr-6"
              onPress={() => bottomSheetMenuRef.current?.snapToIndex(1)}
            >
              <Ellipsis size={30} color={scheme === "dark" ? "#fff" : "#000"} />
            </Pressable>
          )}
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
                html: getCleanDescription(recipe?.summary || ""),
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
                return (
                  <View
                    key={item.id}
                    className="basis-1/2 flex flex-row items-center gap-3 py-2"
                  >
                    <View className="bg-white p-2 rounded-md">
                      <item.icon color="#EE8427" />
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
                  <View className="bg-white p-2 rounded-md">
                    <item.icon color="#7ca982" />
                  </View>
                  <Text className="font-semibold text-lg leading-5 text-primary">
                    {Math.ceil(totalAmount)} {item.text}
                  </Text>
                </View>
              );
            })}
          </View>

          <View className="mx-6 px-3 py-4 flex flex-row items-center justify-between rounded-2xl mb-5 bg-card">
            <Text className="font-semibold text-md text-primary">
              Number of Servings
            </Text>
            <View className="flex flex-row gap-3 items-center">
              <Pressable
                className="border border-secondary py-1 px-3 rounded-lg"
                onPress={() => {
                  if (serving > 1) {
                    setServings(serving - 1);
                  } else {
                    setServings(serving);
                  }
                }}
              >
                <Text className="text-secondary">-</Text>
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

          <View className="flex flex-row bg-card p-1 rounded-full mb-5 mx-6">
            {/* Ingredients Tab */}
            <Button
              className={`flex-1 rounded-full transition-all duration-300 ${
                activeTab === "Ingredients" ? "bg-secondary" : "bg-card"
              }`}
              onPress={() => setActiveTab("Ingredients")}
            >
              <ButtonText
                className={`text-center font-semibold text-sm ${
                  activeTab === "Ingredients" ? "!text-white" : "!text-primary"
                }`}
              >
                Ingredients
              </ButtonText>
            </Button>

            {/* Instructions Tab */}
            <Button
              className={`flex-1 rounded-full transition-all duration-300 ${
                activeTab === "Instructions" ? "bg-secondary" : "bg-transparent"
              }`}
              onPress={() => setActiveTab("Instructions")}
            >
              <ButtonText
                className={`text-center font-semibold text-sm ${
                  activeTab === "Instructions" ? "!text-white" : "!text-primary"
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
            <ButtonText className="!text-white">Start Cooking</ButtonText>
          </Button>

          {!isPrivate && (
            <View className="mx-6 mb-8">
              {recipe?.reviews && recipe?.reviews.length > 0 ? (
                <Review review={recipe.reviews} />
              ) : (
                ""
              )}
            </View>
          )}

          <View className={`h-[1.5px] mb-7 mt-6 mx-6 bg-secondary`}></View>

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

          {!isPrivate && <RelatedRecipes recipe={recipe} />}
        </View>
      </ScrollView>
      {/* </SafeAreaView> */}

      <BottomSheet
        ref={bottomSheetMenuRef}
        index={-1}
        snapPoints={["30%"]}
        backdropComponent={renderBackdrop}
        onChange={(index) => {
          console.log(index);
          if (index === 0) {
            bottomSheetMenuRef.current?.close();
          }
        }}
        handleStyle={{
          backgroundColor: isDarkMode ? "#1c1c1c" : "#fdf8f4",
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
