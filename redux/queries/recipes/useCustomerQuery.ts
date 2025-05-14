import { getCustomer, patchCustomer, uploadFile } from "@/services/customerApi";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useUpdateCustomer = () => {
  return useMutation({
    mutationFn: patchCustomer,
  });
};

export const useGetCustomer = () => {
  return useQuery({
    queryKey: ["get_customer"],
    queryFn: () => getCustomer(),
  });
};

export const useUploadProfileImage = () => {
  return useMutation({
    mutationFn: uploadFile,
  });
};
