export type PatchCustomerPayload = {
  customerId: string;
  data: Record<string, any>; // or a specific type if you know the shape
};

export type UploadAvatarResponse = {
  id: number;
  file: string;
  uploaded_by: number;
  created_at: string;
};
