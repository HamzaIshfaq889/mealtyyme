import { useMutation, useQuery } from "@tanstack/react-query";

import {
  addPaymentMethod,
  cancelSubscription,
  fetchPaymentMethods,
  fetchPreviousSubscriptions,
  getPackagePrices,
  removePaymentMethod,
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

export const useAddPaymentMethod = () => {
  return useMutation({
    mutationFn: ({
      token,
      customerEmail,
      isDarkMode,
    }: {
      token: string;
      customerEmail: string;
      isDarkMode: boolean;
    }) => addPaymentMethod(token, customerEmail, isDarkMode),
  });
};

export const useRemovePaymentMethod = () => {
  return useMutation({
    mutationFn: ({
      id,
    }: {
      id: string;
    }) => removePaymentMethod(id),
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
