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

export const searchRecipes = async (
  category_ids?: (string | number)[] | null,
  page: string | number = 1,
  search: string | "" = "",
  cusine_ids?: (string | number)[] | null,
  min_calories?: number,
  max_calories?: number,
  diet_ids?: (string | number)[] | null
): Promise<{ results: Recipe[]; total: number }> => {
  const params: string[] = [];

  if (category_ids && category_ids.length > 0) {
    params.push(...category_ids.map((id) => `dish_types=${id}`));
  }

  if (cusine_ids && cusine_ids.length > 0) {
    params.push(...cusine_ids.map((id) => `cuisines=${id}`));
  }

  if (diet_ids && diet_ids.length > 0) {
    params.push(...diet_ids.map((id) => `diets=${id}`));
  }

  if (search.trim() !== "") {
    params.push(`search=${encodeURIComponent(search.trim())}`);
  }

  if (min_calories !== undefined) {
    params.push(`min_calories=${min_calories}`);
  }

  if (max_calories !== undefined) {
    params.push(`max_calories=${max_calories}`);
  }

  params.push(`pageSize=10`);
  params.push(`page=${page}`);

  const query = `/recipes/?${params.join("&")}`;
  console.log("query", query);

  const response = await apiClient.get<RecipeResponse>(query, {});

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
