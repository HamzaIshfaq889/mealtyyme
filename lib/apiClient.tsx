// apiClient.ts
import { create } from "apisauce";

const apiClient = create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.setHeader("Authorization", `Bearer ${token}`);
    console.log("Auth token set:", token);
  } else {
    apiClient.deleteHeader("Authorization");
    console.log("Auth token removed");
  }
};

export default apiClient;
