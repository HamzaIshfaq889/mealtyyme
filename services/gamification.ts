import { AppConfig } from "@/constants";
import apiClient from "@/lib/apiClient";
import { UserPointsData } from "@/lib/types/gamification";

export const getGamificationStats = async (): Promise<UserPointsData> => {
  const response = await apiClient.get("gamification/stats/");
  console.log("response", response);
  if (!response.ok) {
    throw new Error(
      response?.originalError?.message || "Failed to fetch gamification stats."
    );
  }

  return response.data as UserPointsData;
};

export const checkInUser = async (): Promise<void> => {
  const response = await apiClient.post(
    `gamification/daily-checkin/`
  );
  console.log("check-in response...............", response);

  if (!response.ok) {
    throw new Error(
      response?.originalError?.message || "Failed to check in user."
    );
  }

  // No return needed if API returns no useful data
};
