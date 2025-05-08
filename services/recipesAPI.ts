import apiClient from "@/lib/apiClient";

import {
  ForgotPasswordPayload,
  LoginPayload,
  OtpPayload,
  OtpResponseTypes,
  ResetPasswordPayload,
  SignupPayload,
} from "@/lib/types";
import {
  Categories,
  Cuisine,
  Diet,
  Recipe,
  RecipeResponse,
  SearchRecipeQueryOptions,
} from "@/lib/types/recipe";

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

export const getCusines = async (): Promise<Cuisine[]> => {
  const response = await apiClient.get<Cuisine[]>(
    `/cuisines/?pageSize=all`,
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

export const getDiets = async (): Promise<Diet[]> => {
  const response = await apiClient.get<Diet[]>(`/diets/?pageSize=all`, {});

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

export const searchRecipes = async ({
  searchValue = "",
  categoryIds,
  cuisineIds,
  dietIds,
  protein,
  fat,
  carbs,
  calories,
  page,
  readyInMinutes,
}: SearchRecipeQueryOptions & { page: number }): Promise<{
  results: Recipe[];
  total: number;
}> => {
  const params: string[] = [];

  if (categoryIds?.length) {
    params.push(...categoryIds.map((id) => `dish_types=${id}`));
  }

  if (cuisineIds?.length) {
    params.push(...cuisineIds.map((id) => `cuisines=${id}`));
  }

  if (dietIds?.length) {
    params.push(...dietIds.map((id) => `diets=${id}`));
  }

  if (searchValue.trim() !== "") {
    params.push(`search=${encodeURIComponent(searchValue.trim())}`);
  }

  if (protein && (protein[0] > 0 || protein[1] < 1000)) {
    params.push(`min_protein=${protein[0]}`);
    params.push(`max_protein=${protein[1]}`);
  }

  if (calories && (calories[0] > 0 || calories[1] < 500)) {
    params.push(`min_calories=${calories[0]}`);
    params.push(`max_calories=${calories[1]}`);
  }

  if (fat && (fat[0] > 0 || fat[1] < 100)) {
    params.push(`min_fat=${fat[0]}`);
    params.push(`max_fat=${fat[1]}`);
  }

  if (carbs && (carbs[0] > 0 || carbs[1] < 700)) {
    params.push(`min_carbs=${carbs[0]}`);
    params.push(`max_carbs=${carbs[1]}`);
  }

  if (readyInMinutes && (readyInMinutes[0] > 0 || readyInMinutes[1] < 300)) {
    params.push(`min_ready_in_minutes=${readyInMinutes[0]}`);
    params.push(`max_ready_in_minutes=${readyInMinutes[1]}`);
  }

  params.push(`pageSize=10`);
  params.push(`page=${page}`);

  const query = `/recipes/?${params.join("&")}`;
  console.log("query", query);

  const response = await apiClient.get<RecipeResponse>(query);

  if (!response.ok) {
    if (response.status === 401 || response.status === 404) {
      throw new Error("Invalid Credentials");
    }
    throw new Error(response?.originalError?.message || "Recipe Error");
  }

  const results = response.data?.results;
  const total = response.data?.total ?? 0;

  if (!results) {
    throw new Error("No recipe data found.");
  }

  return { results, total };
};

export const addReview = async ({
  recipeId,
  rating,
  reviewText,
}: {
  recipeId: number;
  rating: number;
  reviewText?: string; // Make optional if not always required
}) => {
  console.log("recipe id", recipeId);
  const response = await apiClient.post(`/recipe-reviews/`, {
    recipe: recipeId,
    rating: rating,
    review_text: reviewText || "", // Send empty string if not provided
  });

  console.log("response", response);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("You need to be logged in to submit a review");
    }
    if (response.status === 404) {
      throw new Error("Recipe not found");
    }
    throw new Error(
      response?.originalError?.message || "Failed to submit review"
    );
  }

  return response.data;
};
