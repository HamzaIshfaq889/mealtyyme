import apiClient from "@/lib/apiClient";

import { PatchCustomerPayload } from "@/lib/types/customer";

export const patchCustomer = async ({
  customerId,
  data,
}: PatchCustomerPayload) => {
  const response = await apiClient.patch(`customer/${customerId}/`, data);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Customer not found");
    }

    throw new Error(
      response?.originalError?.message || "Customer update failed"
    );
  }

  return response.data;
};

export const getCustomer = async (customerId: number) => {
  const response = await apiClient.get(`customer/${customerId}/`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Customer not found");
    }

    throw new Error(
      response?.originalError?.message || "Failed to fetch customer details"
    );
  }

  return response.data;
};
