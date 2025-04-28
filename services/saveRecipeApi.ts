import apiClient from "@/lib/apiClient";
import { Recipe } from "@/lib/types/recipe";

export const saveRecipe = async (recipeId: number) => {
  const response = await apiClient.post(`customer/save-recipe/`, {
    recipe_id: recipeId,
  });

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

export const deleteRecipe = async (recipeId: number) => {
  const response = await apiClient.post(`customer/remove-recipe/`, {
    recipe_id: recipeId,
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 404) {
      throw new Error("Recipe not found or unauthorized access.");
    }
    throw new Error(
      response?.originalError?.message ||
        "Something went wrong while deleting the recipe."
    );
  }

  return response.data;
};

export const getSavedRecipes = async () => {
  const response = await apiClient.get("customer/saved-recipes/");

  if (!response.ok) {
    if (response.status === 401 || response.status === 404) {
      throw new Error("No saved recipes found or unauthorized access.");
    }
    throw new Error(
      response?.originalError?.message ||
        "Something went wrong while fetching saved recipes."
    );
  }

  const data: any = response.data;

  return data.saved_recipes as Recipe[];
};
