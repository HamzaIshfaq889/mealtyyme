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
      {/* <SafeAreaView style={{ flex: 1 }}> */}
      <View
        className={`px-7 pb-4  flex-row justify-between items-center bg-foreground pt-16 ${
          Platform.OS === "android" && "pt-16"
        }`}
      >
        <View className="flex flex-row items-center gap-2">
          <NotebookPen
            size={24}
            color={scheme === "dark" ? "#FAF1E5" : "#003D29"}
          />

          <Text className="font-bold text-2xl text-primary ml-2">
            Meal Planning
          </Text>
        </View>
      </View>
      <View className="">
        <Calendar onSelectDate={setSelectedDate} selected={selectedDate} />
      </View>
      <ScrollView className="w-full mb-8 bg-background">
        <View className="mt-8 px-7">
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
      {/* </SafeAreaView> */}
    </>
  );
};

export default MealPlan;
