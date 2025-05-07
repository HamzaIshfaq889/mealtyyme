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
    }: {
      token: string;
      interval: "month" | "year";
      customerEmail: string;
    }) => subscribe(token, interval, customerEmail),
  });
};
