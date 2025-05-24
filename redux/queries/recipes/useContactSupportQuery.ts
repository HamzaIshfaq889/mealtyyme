import { contactSupport } from "@/services/customerSupoortApi";
import { useMutation } from "@tanstack/react-query";

export const usecontactSupport = () => {
  return useMutation({
    mutationFn: contactSupport,
  });
};
