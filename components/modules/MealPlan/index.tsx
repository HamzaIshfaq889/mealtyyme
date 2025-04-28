import moment from "moment";
import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
  Pressable,
  Image,
  SafeAreaView,
} from "react-native";
import Calendar from "./Calander";
import { ArrowRight, Clock, Flame, Star } from "lucide-react-native";
import { GetMealsByDate } from "@/services/mealscheduleApi";
import { Meal, MealData, MealType } from "@/lib/types/mealschedule";
import { RecipeSkeletonItem } from "../Skeletons";
import { router } from "expo-router";

const MealPlan = () => {
  const scheme = useColorScheme();
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [meals, setMeals] = useState<MealData | null>(null); // Use MealData type
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMeals = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    console.log("Fetching meals for date:", selectedDate); // Log the selected date

    try {
      const data = await GetMealsByDate(selectedDate);
      setMeals(data); // data is typed as MealData
      console.log("Fetched meals:", data); // Log the fetched data directly
    } catch (err) {
      console.error("Error fetching meals:", err); // Log the error for debugging
      setError("Failed to load meals. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Selected Date:", selectedDate); // Log selected date changes
    fetchMeals();
  }, [selectedDate]);

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
        <Pressable
          key={recipeIndex}
          onPress={() => router.push(`/recipe/${recipe.id}` as const)} // Ensure actual routing logic
        >
          <View
            className="flex flex-row justify-between items-center p-4 rounded-2xl mb-5 bg-background mt-3"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 6,
              elevation: 3,
            }}
          >
            <View className="flex flex-row gap-4 flex-1">
              <View className="relative">
                <Image
                  source={{ uri: recipe.image_url }}
                  className="w-24 h-24 rounded-xl"
                  resizeMode="cover"
                />
                {recipe.is_featured && (
                  <View className="absolute top-1 right-1 bg-yellow-400 p-1 rounded-full">
                    <Star color="#fff" size={14} />
                  </View>
                )}
              </View>

              <View className="flex flex-col justify-between flex-1">
                <View>
                  <Text
                    className="font-bold text-lg mb-1 text-primary"
                    numberOfLines={1}
                  >
                    {recipe.title}
                  </Text>

                  <View className="flex flex-row items-center gap-2 mb-2">
                    <Image
                      source={{ uri: recipe.created_by.image_url }}
                      className="w-5 h-5 rounded-full"
                    />
                    <Text className="text-muted text-sm">
                      {recipe.created_by.first_name}{" "}
                      {recipe.created_by.last_name}
                    </Text>
                  </View>
                </View>

                <View className="flex flex-row gap-3">
                  <View className="flex flex-row items-center gap-1">
                    <Clock color="#6b7280" size={16} />
                    <Text className="text-muted text-sm">
                      {recipe.ready_in_minutes} min
                    </Text>
                  </View>

                  <View className="flex flex-row items-center gap-1">
                    <Flame color="#6b7280" size={16} />
                    <Text className="text-muted text-sm">
                      {Math.ceil(recipe.calories)} Kcal
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="ml-2 p-2 bg-secondary rounded-full">
              <ArrowRight color="#fff" size={18} />
            </View>
          </View>
        </Pressable>
      ))
    );
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex flex-row justify-center px-9 pb-4">
          <Text className="block font-bold text-2xl text-foreground">
            Meal Planning
          </Text>
        </View>
        <View>
          <Calendar onSelectDate={setSelectedDate} selected={selectedDate} />
        </View>
        <ScrollView className="w-full   mb-8">
          <View className="mt-8 px-8">
            <Text className="text-xl leading-6 text-secondary">Breakfast</Text>
            {renderMeal("BREAKFAST")}

            <Text className="text-xl leading-6 text-secondary">Lunch</Text>
            {renderMeal("LUNCH")}

            <Text className="text-xl leading-6 text-secondary">Dinner</Text>
            {renderMeal("DINNER")}
            <Text className="text-xl leading-6 text-secondary">Snacks</Text>
            {renderMeal("SNACK")}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default MealPlan;
