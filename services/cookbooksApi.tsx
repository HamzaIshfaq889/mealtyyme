import apiClient from "@/lib/apiClient";
import { AddRecipePayload, cookbooks } from "@/lib/types";

export const getCookBooks = async () => {
  const response = await apiClient.get("customer-cookbooks/");

  if (!response.ok) {
    if (response.status === 401 || response.status === 404) {
      throw new Error("Cookbooks not found.Please add one.");
    }
    throw new Error(response?.originalError?.message || "Something went wrong");
  }
  console.log(response);

  return response.data as cookbooks[];
};

export const addRecipeToCookbook = async ({
  cookbookId,
  recipeId,
}: AddRecipePayload) => {
  const response = await apiClient.post(
    `customer-cookbooks/${cookbookId}/add_recipe/`,
    {
      recipe_id: recipeId,
    }
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
