import apiClient from "@/lib/apiClient";
import { ChatbotResponse } from "@/lib/types/recipe";

export const sendChatBotMessage = async (
  chatHistory: string[]
): Promise<ChatbotResponse> => {
  const response = await apiClient.post<ChatbotResponse>(`chatbot/recipes/`, {
    chat_history: chatHistory,
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

export const getTokenUsage = async () => {
  const response = await apiClient.get<ChatbotResponse>(`message-usage/`);

  if (!response.ok) {
    if (response.status === 401 || response.status === 404) {
      throw new Error("Failed to get token usage.");
    }
    throw new Error(response?.originalError?.message || "Something went wrong");
  }

  if (!response.data) {
    throw new Error("Invalid response from server.");
  }

  return response.data;
};
