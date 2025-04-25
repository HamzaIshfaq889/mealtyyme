import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";
const ONBOARDING_KEY = "has_onboarded";

export const saveToken = async (token: string) => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const getToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const deleteToken = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};

export const setOnboardComplete = async () => {
  await SecureStore.setItemAsync(ONBOARDING_KEY, "true");
};

export const getOnboardStatus = async (): Promise<boolean> => {
  const value = await SecureStore.getItemAsync(ONBOARDING_KEY);
  return value === "true";
};

export const resetOnboardStatus = async () => {
  await SecureStore.deleteItemAsync(ONBOARDING_KEY);
};