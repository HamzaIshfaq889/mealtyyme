import { useMutation, useQuery } from "@tanstack/react-query";

import { getPackagePrices, subscribe } from "@/services/stripeApi";

export const useProductPrices = () => {
  return useQuery({
    queryKey: ["productPrices"],
    queryFn: getPackagePrices,
  });
};

export const useSubscribe = () => {
  return useMutation({
    mutationFn: ({
      token,
      interval,
      customerEmail,
      isDarkMode,
    }: {
      token: string;
      interval: "month" | "year";
      customerEmail: string;
      isDarkMode: boolean;
    }) => subscribe(token, interval, customerEmail, isDarkMode),
  });
};
