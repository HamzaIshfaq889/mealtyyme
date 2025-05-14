import { useMutation, useQuery } from "@tanstack/react-query";

import {
  cancelSubscription,
  fetchPaymentMethods,
  fetchPreviousSubscriptions,
  getPackagePrices,
  resumeSubscription,
  setDefaultPaymentMethod,
  subscribe,
  upgradeSubscription,
} from "@/services/stripeApi";

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

export const useCancelSubscription = () => {
  return useMutation({
    mutationFn: (subscriptionId: string) => cancelSubscription(subscriptionId),
  });
};

export const usePreviousSubscriptions = () => {
  return useQuery({
    queryKey: ["previousSubscriptions"],
    queryFn: fetchPreviousSubscriptions,
  });
};

export const usePaymentMethods = () => {
  return useQuery({
    queryKey: ["paymentMethods"],
    queryFn: fetchPaymentMethods,
  });
};

export const useUpgradeSubscription = () => {
  return useMutation({
    mutationFn: upgradeSubscription,
  });
};

export const useSetDefaultPaymentMethod = () => {
  return useMutation({
    mutationFn: setDefaultPaymentMethod,
  });
};

export const useResumeSubscription = () => {
  return useMutation({
    mutationFn: resumeSubscription,
  });
};
