// hooks/useCategories.ts
import { useQuery } from "@tanstack/react-query";

import { getCategories } from "@/services/recipesAPI";

import { Categories } from "@/lib/types/recipe";

export const useCategories = () => {
  return useQuery<Categories[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 3,
  });
};
