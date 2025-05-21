import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { checkInUser, getGamificationStats } from "@/services/gamification";

export const useGamificationStats = () => {
  return useQuery({
    queryKey: ["gamification", "stats"],
    queryFn: getGamificationStats,
  });
};

export const useCheckInUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkInUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gamification", "stats"] });
    },
  });
};
