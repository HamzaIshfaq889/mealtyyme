import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Recipe, SearchRecipeQueryOptions } from "@/lib/types/recipe";

import {
  getFeaturedRecipes,
  getPopularRecipes,
  searchRecipes,
} from "@/services/recipesAPI";
import { useSelector } from "react-redux";

export const useRecipesQuery = (options: SearchRecipeQueryOptions = {}) => {
  const allergies = useSelector(
    (state: any) => state.auth.loginResponseType.customer_details?.allergies
  );

  return useInfiniteQuery({
    queryKey: ["recipes", options],
    queryFn: ({ pageParam = 1 }) =>
      searchRecipes({
        ...options,
        allergies: allergies,
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

export const usePopularRecipes = () => {
  return useQuery<Recipe[]>({
    queryKey: ["popularRecipes"],
    queryFn: getPopularRecipes,
    staleTime: 1000 * 5,
  });
};
