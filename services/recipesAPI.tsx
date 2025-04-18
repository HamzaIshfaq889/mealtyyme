import apiClient from "@/lib/apiClient";

import {
  ForgotPasswordPayload,
  LoginPayload,
  OtpPayload,
  OtpResponseTypes,
  ResetPasswordPayload,
  SignupPayload,
} from "@/lib/types";
import { Categories, Recipe, RecipeResponse } from "@/lib/types/recipe";

export const getFeaturedRecipes = async (): Promise<Recipe[]> => {
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

export const getPopularRecipes = async (
  id: string | number | null
): Promise<Recipe[]> => {
  console.log("id", id);

  // Construct the endpoint based on whether id is null or not
  const endpoint =
    id !== null
      ? `/recipes/?dish_types=${id}&pageSize=10`
      : `/recipes/?pageSize=10`;
  console.log("endpoin", endpoint);
  const response = await apiClient.get<RecipeResponse>(endpoint, {});

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

export const getCategories = async (): Promise<Categories[]> => {
  const response = await apiClient.get<Categories[]>(
    `/categories/?pageSize=all`,
    {}
  );

  if (!response.ok) {
    if (response.status === 401 || response.status === 404) {
      throw new Error("Invalid credentials or categories not found");
    }
    throw new Error(
      response?.originalError?.message || "Failed to fetch categories"
    );
  }

  const result = response.data;

  if (!result || result.length === 0) {
    throw new Error("No categories found.");
  }

  return result;
};
