import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Recipe, SearchRecipeQueryOptions } from "@/lib/types/recipe";

import {
  getFeaturedRecipes,
  getPopularRecipes,
  searchRecipes,
} from "@/services/recipesAPI";

export const useRecipesQuery = (options: SearchRecipeQueryOptions = {}) => {
  return useInfiniteQuery({
    queryKey: ["recipes", options],
    queryFn: ({ pageParam = 1 }) =>
      searchRecipes({
        ...options,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.flatMap((p) => p.results).length;
      return totalFetched < lastPage.total ? allPages.length + 1 : undefined;
    },
  });
};

export const useFeaturedRecipes = () => {
  return useQuery<Recipe[]>({
    queryKey: ["featuredRecipes"],
    queryFn: getFeaturedRecipes,
    staleTime: 1000 * 60 * 5,
  });
};

export const usePopularRecipes = (categoryId: string | number | null) => {
  return useQuery<Recipe[]>({
    queryKey: ["popularRecipes", categoryId || "all"],
    queryFn: () => getPopularRecipes(categoryId === "all" ? null : categoryId),
    staleTime: 1000 * 60 * 5,
  });
};
