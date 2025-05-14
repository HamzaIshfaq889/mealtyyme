import apiClient from "@/lib/apiClient";
import { PrivateRecipe } from "@/lib/types/privateRecipe";
import { Recipe } from "@/lib/types/recipe";

// Define the types

// Updated function with return type
export const scrapeRecipe = async (url: string): Promise<PrivateRecipe[]> => {
  const response = await apiClient.post(`scrape-recipe/`, {
    url,
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

  return response.data as PrivateRecipe[];
};

export const savePrivateRecipe = async (
  recipe: PrivateRecipe | null
): Promise<PrivateRecipe[]> => {
  if (!recipe) {
    throw new Error("No recipe provided to save.");
  }

  const response = await apiClient.post(`save-private-recipe/`, recipe);

  if (!response.ok) {
    if (response.status === 401 || response.status === 404) {
      throw new Error("Recipe not found or unauthorized access.");
    }
    throw new Error(
      response?.originalError?.message ||
        "Something went wrong while saving the recipe."
    );
  }

  return response.data as PrivateRecipe[];
};

export const getPrivateRecipes = async () => {
  const response = await apiClient.get("private-recipes/");

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

  return data as Recipe[]; // or just `return data;` if it's typed elsewhere
};
