import { Ingredient } from "@/lib/types/recipe";

import apiClient from "@/lib/apiClient";

export const sendIngredients = async (ingredients: Ingredient[]) => {
  const response = await apiClient.post("shopping-list/", ingredients);
   console.log(response?.originalError);
  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("Invalid ingredient data sent to server.");
    }
    if (response.status === 401) {
      throw new Error("Unauthorized.");
    }
    throw new Error(
      response?.originalError?.message ||
        "Something went wrong while sending ingredients."
    );
  }

  return response.data;
};
