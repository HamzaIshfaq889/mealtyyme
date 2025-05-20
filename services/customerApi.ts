import { AppConfig } from "@/constants";
import apiClient from "@/lib/apiClient";
import { LoginResponseTypes } from "@/lib/types";

import {
  PatchCustomerPayload,
  UploadAvatarResponse,
} from "@/lib/types/customer";

export const patchCustomer = async ({
  customerId,
  data,
}: PatchCustomerPayload) => {
  console.log("Therrrrrrrrrrrrrrrr",customerId, data);
  const response = await apiClient.patch(`customer/${customerId}/`, data);
  
  console.log('a,aa',response);
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

export const getCustomer = async () => {
  const response = await apiClient.get(`customer/`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Customer not found");
    }

    throw new Error(
      response?.originalError?.message || "Failed to fetch customer details"
    );
  }

  return response.data as LoginResponseTypes["customer_details"][];
};

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  console.log(file);

  const response = await apiClient.post(
    `${AppConfig.API_URL}attachments/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  console.log(response?.data);
  console.log(response?.status);

  if (!response.ok) {
    throw new Error(response.problem || "Failed to upload file");
  }

  return response.data as UploadAvatarResponse;
};
