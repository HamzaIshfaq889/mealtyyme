import moment from "moment";
import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  ScrollView,
  useColorScheme,
  Pressable,
  Image,
  SafeAreaView,
  Platform,
} from "react-native";
import Calendar from "./Calander";
import {
  ArrowRight,
  Clock,
  Flame,
  NotebookPen,
  ShoppingBagIcon,
  Star,
} from "lucide-react-native";
import { GetMealsByDate } from "@/services/mealscheduleApi";
import { Meal, MealData, MealType } from "@/lib/types/mealschedule";
import { RecipeSkeletonItem } from "../Skeletons";
import { router } from "expo-router";
import HorizontalRecipeCard from "../RecipeCards/horizontalRecipeCard";

const MealPlan = () => {
  const scheme = useColorScheme();
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [meals, setMeals] = useState<MealData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMeals = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    console.log("Fetching meals for date:", selectedDate);

    try {
      const data = await GetMealsByDate(selectedDate);
      setMeals(data);
      console.log("Fetched meals:", data);
    } catch (err) {
      console.error("Error fetching meals:", err);
      setError("Failed to load meals. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Selected Date:", selectedDate);
    fetchMeals();
  }, [selectedDate]);

  const allMealsEmpty = () => {
    if (!meals) return true;
    return (
      (!meals.BREAKFAST || meals.BREAKFAST.length === 0) &&
      (!meals.LUNCH || meals.LUNCH.length === 0) &&
      (!meals.DINNER || meals.DINNER.length === 0) &&
      (!meals.SNACK || meals.SNACK.length === 0)
    );
  };

  const renderMeal = (mealType: MealType) => {
    if (loading) {
      return (
        <View className="mt-3 space-y-6">
          {[1].map((item) => {
            return <RecipeSkeletonItem key={item} />;
          })}
        </View>
      );
    }

    // Check if the mealType data exists in the meals object
    const mealData = meals?.[mealType];

    if (!mealData || mealData.length === 0) {
      return (
        <View className="flex-1 justify-center items-center p-7">
          <Text className="text-gray-500 text-sm">No recipes available.</Text>
        </View>
      );
    }

    return mealData.map((meal: Meal, index: number) =>
      meal.recipes.map((recipe, recipeIndex) => (
        <HorizontalRecipeCard recipe={recipe} />
      ))
    );
  };

  return (
    <>
      {/* <SafeAreaView style={{ flex: 1 }}> */}
      <View className="flex-1 bg-background">
        <View
          className={`px-7 pb-4  flex-row justify-between items-center  pt-16 ${
            Platform.OS === "android" && "pt-16"
          }`}
        >
          <View className="flex flex-row items-center gap-2 ">
            <NotebookPen
              size={24}
              color={scheme === "dark" ? "#FAF1E5" : "#003D29"}
            />

            <View>
              <Text className="font-bold text-2xl text-primary ml-2">
                Meal Planning
              </Text>
            </View>
          </View>
        </View>
        <View className="pt-6">
          <Calendar onSelectDate={setSelectedDate} selected={selectedDate} />
          <Text className="text-muted text-sm px-7">
            {moment(selectedDate).format("MMMM D, YYYY")}
          </Text>
        </View>
        <ScrollView className="w-full mb-8 bg-background ">
          <View className="mt-8 px-7">
            {allMealsEmpty() ? (
              <View className="flex-1 justify-center items-center p-7">
                <Text className="text-gray-500 text-base text-center">
                  Your plan looks empty for{" "}
                  {moment(selectedDate).format("MMMM D, YYYY")}. Head to any
                  recipe to add to your meal planning
                </Text>
              </View>
            ) : (
              <>
                <Text className="text-xl leading-6 text-secondary mb-3">
                  Breakfast
                </Text>
                {renderMeal("BREAKFAST")}

                <Text className="text-xl leading-6 text-secondary">Lunch</Text>
                {renderMeal("LUNCH")}

                <Text className="text-xl leading-6 text-secondary">Dinner</Text>
                {renderMeal("DINNER")}

                <Text className="text-xl leading-6 text-secondary">Snacks</Text>
                {renderMeal("SNACK")}
              </>
            )}
          </View>
        </ScrollView>
      </View>
      {/* </SafeAreaView> */}
    </>
  );
};

export default MealPlan;
