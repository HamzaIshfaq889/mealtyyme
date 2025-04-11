import { create } from "apisauce";

const apiClient = create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
