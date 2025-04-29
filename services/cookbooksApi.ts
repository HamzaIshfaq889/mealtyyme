import apiClient from "@/lib/apiClient";
import {
  AddRecipePayload,
  cookbooks,
  CreateCookbookPayload,
  CreateCookBookResponse,
  UpdateCookbookPayload,
} from "@/lib/types";
import { Recipe } from "@/lib/types/recipe";
import { useQuery } from "@tanstack/react-query";
import { getSingleRecipe } from "./recipesAPI";

export const getCookBooks = async () => {
  const response = await apiClient.get("customer-cookbooks/");

  if (!response.ok) {
    if (response.status === 401 || response.status === 404) {
      throw new Error("Cookbooks not found.Please add one.");
    }
    throw new Error(response?.originalError?.message || "Something went wrong");
  }

  return response.data as cookbooks[];
};

export const createCookbook = async ({ name }: CreateCookbookPayload) => {
  const response = await apiClient.post("customer-cookbooks/", {
    name,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized.Please provide Valid token.");
    }
    throw new Error(response?.originalError?.message || "Something went wrong");
  }

  return response.data as CreateCookBookResponse;
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

export const useCookbookRecipes = (recipeIds: number[] | undefined) => {
  return useQuery<Recipe[]>({
    queryKey: ["cookbook-recipes", recipeIds],
    queryFn: async () => {
      if (!recipeIds || recipeIds.length === 0) return [];
      const recipes = await Promise.all(
        recipeIds.map((id) => getSingleRecipe(id.toString()))
      );
      return recipes;
    },
    enabled: !!recipeIds && recipeIds.length > 0,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
};

export const updateCookbookName = async ({
  id,
  name,
}: UpdateCookbookPayload) => {
  const response = await apiClient.patch(`customer-cookbooks/${id}/`, {
    name,
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 404) {
      throw new Error("Cookbook not found or unauthorized access.");
    }
    throw new Error(
      response?.originalError?.message || "Something went wrong while updating."
    );
  }

  return response.data;
};

export const deleteCookbook = async (id: number) => {
  const response = await apiClient.delete(`customer-cookbooks/${id}/`);

  if (!response.ok) {
    if (response.status === 401 || response.status === 404) {
      throw new Error("Cookbook not found or unauthorized to delete.");
    }
    throw new Error(
      response?.originalError?.message || "Something went wrong while deleting."
    );
  }

  return response.data;
};
