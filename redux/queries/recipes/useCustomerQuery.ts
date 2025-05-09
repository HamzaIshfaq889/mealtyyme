import { getCustomer, patchCustomer } from "@/services/customerApi";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useUpdateCustomer = () => {
  return useMutation({
    mutationFn: patchCustomer,
  });
};

export const useGetCustomer = (customerId: number) => {
  return useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => getCustomer(customerId),
    enabled: !!customerId,
  });
};
