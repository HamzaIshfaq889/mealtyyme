import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getCategories,
  getCusines,
  getDiets,
  searchIngredients,
} from "@/services/recipesAPI";

export const useCuisinesQuery = () => {
  return useQuery({
    queryKey: ["cuisines"],
    queryFn: getCusines,
    staleTime: 1000 * 60 * 10,
  });
};

export const useDietsQuery = () => {
  return useQuery({
    queryKey: ["diets"],
    queryFn: getDiets,
    staleTime: 1000 * 60 * 10,
  });
};

export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 10,
  });
};

export const useIngredientsQuery = (options: { search?: string } = {}) => {
  return useQuery({
    queryKey: ["ingredients", options.search],
    queryFn: () => searchIngredients(options),
    // enabled: !!options.search,
  });
};
