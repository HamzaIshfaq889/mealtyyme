import apiClient from "@/lib/apiClient";

export const saveNotificationToken = async (expotoken: string) => {
  const response = await apiClient.post(`register-notification/`, {
    expo_push_token: expotoken,
  });
  console.log("response", response);
  if (!response.ok) {
    if (response.status === 401 || response.status === 404) {
      throw new Error("Recipe not found or unauthorized access.");
    }
    throw new Error(
      response?.originalError?.message ||
        "Something went wrong while saving the recipe."
    );
  }

  return response.data;
};
