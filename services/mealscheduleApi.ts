import apiClient from "@/lib/apiClient";
import { AddMealSchedulePayload, MealData } from "@/lib/types/mealschedule";

export const AddMealSchedule = async (mealSchedule: AddMealSchedulePayload) => {
  const response = await apiClient.post(
    `customer-meal-schedules/`,
    mealSchedule
  );

  if (!response.ok) {
    if (response.status === 401 || response.status === 404) {
      throw new Error(
        "Failed to add recipe. Please check the cookbook or recipe."
      );
    }
    throw new Error(response?.originalError?.message || "Something went wrong");
  }

  return response.data;
};

export const GetMealsByDate = async (date: string): Promise<MealData> => {
  try {
    const response = await apiClient.get(
      `customer-meal-schedules/meals-by-date/?date=${date}`
    );

    if (!response.ok) {
      if (response.status === 401 || response.status === 404) {
        throw new Error(
          "Failed to fetch meals. Please check the date or your session."
        );
      }
      throw new Error(
        response?.originalError?.message || "Something went wrong"
      );
    }

    // Assuming the response data is in the structure of MealData
    return response.data as MealData;
  } catch (error) {
    console.error("Error fetching meals:", error);
    throw error;
  }
};
