import apiClient from "@/lib/apiClient";
import { AddMealSchedulePayload, MealData } from "@/lib/types/mealschedule";
import { ChatbotResponse } from "@/lib/types/recipe";

export const sendChatBotMessage = async (
  message: string
): Promise<ChatbotResponse> => {
  const response = await apiClient.post<ChatbotResponse>(`chatbot/recipes/`, {
    message,
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 404) {
      throw new Error("Failed to get recipes.");
    }
    throw new Error(response?.originalError?.message || "Something went wrong");
  }

  if (!response.data) {
    throw new Error("Invalid response from server.");
  }

  return response.data;
};
