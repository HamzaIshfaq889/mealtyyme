import { useQuery } from "@tanstack/react-query";
import { getCategories, getCusines, getDiets } from "@/services/recipesAPI"; // adjust path

export const useCuisinesQuery = () => {
  return useQuery({
    queryKey: ["cuisines"],
    queryFn: getCusines,
    staleTime: 1000 * 60 * 10, // 10 minutes
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



