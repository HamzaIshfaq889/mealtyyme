import { deleteRecipe, getSavedRecipes, saveRecipe } from "@/services/saveRecipeApi";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useSavedRecipes = () => {
  return useQuery({
    queryKey: ["saved-recipes"],
    queryFn: getSavedRecipes,
    staleTime: 0,
    retry: 2,
  });
};

export const useSaveRecipe = () => {
  return useMutation({
    mutationFn: (recipeId: number) => saveRecipe(recipeId),
  });
};

export const useRemoveRecipe = () => {
  return useMutation({
    mutationFn: (recipeId: number) => deleteRecipe(recipeId),
  });
};
