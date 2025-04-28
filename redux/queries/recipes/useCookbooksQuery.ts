import { useQuery, useMutation } from "@tanstack/react-query";
import { getCookBooks, addRecipeToCookbook } from "@/services/cookbooksApi";

export const useCookBooks = () => {
  return useQuery({
    queryKey: ["cookbooks"],
    queryFn: getCookBooks,
    staleTime: 0,
    retry: 2,
  });
};

export const useAddRecipeToCookbook = () => {
  return useMutation({
    mutationFn: addRecipeToCookbook,
  });
};
