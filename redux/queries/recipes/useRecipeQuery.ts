import { useInfiniteQuery } from "@tanstack/react-query";
import { searchRecipes } from "@/services/recipesAPI";

export const useRecipesQuery = (
  searchValue: string,
  categoriesIds: number[],
  cusinesIds: number[],
  dietIds: number[],
  protien: number[],
  fat: number[],
  carbs: number[],
  low: number,
  high: number
) => {
  return useInfiniteQuery({
    queryKey: [
      "recipes",
      searchValue,
      categoriesIds,
      cusinesIds,
      dietIds,
      protien,
      fat,
      carbs,
      low,
      high,
    ],
    queryFn: ({ pageParam }: { pageParam?: number }) =>
      searchRecipes(
        categoriesIds,
        pageParam ?? 1,
        searchValue,
        cusinesIds,
        low,
        high,
        dietIds,
        protien,
        fat,
        carbs
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.flatMap((p) => p.results).length;
      return totalFetched < lastPage.total ? allPages.length + 1 : undefined;
    },
  });
};
