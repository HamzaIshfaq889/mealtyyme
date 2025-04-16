import apiClient from "@/lib/apiClient";

import {
  ForgotPasswordPayload,
  LoginPayload,
  OtpPayload,
  OtpResponseTypes,
  ResetPasswordPayload,
  SignupPayload,
} from "@/lib/types";
import { Recipe, RecipeResponse } from "@/lib/types/recipe";

export const getRecipes = async (): Promise<Recipe[]> => {
  const response = await apiClient.get<RecipeResponse>(
    "/recipes/?is_featured=true",
    {}
  );

  if (!response.ok) {
    if (response.status === 401 || response.status === 404) {
      throw new Error("Invalid Credentials");
    }
    throw new Error(response?.originalError?.message || "Recipe Error");
  }

  const results = response.data?.results;

  if (!results) {
    throw new Error("No recipe data found.");
  }
  return results;
};
export const getSingleRecipe = async (id: string | null): Promise<Recipe> => {
  const response = await apiClient.get<Recipe>(`/recipe-detail/${id}/`, {});

  if (!response.ok) {
    if (response.status === 401 || response.status === 404) {
      throw new Error("Invalid Credentials or Recipe Not Found");
    }
    throw new Error(response?.originalError?.message || "Recipe Error");
  }

  const result = response.data;

  if (!result) {
    throw new Error("No recipe data found.");
  }

  return result;
};
