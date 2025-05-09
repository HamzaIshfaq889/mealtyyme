export type PatchCustomerPayload = {
  customerId: string;
  data: Record<string, any>; // or a specific type if you know the shape
};
