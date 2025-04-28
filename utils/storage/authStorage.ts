// utils/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LoginResponseTypes } from "@/lib/types";

const USER_DATA_KEY = "USER_DATA";

export const saveUserDataInStorage = async (
  userData: LoginResponseTypes
): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(userData);
    await AsyncStorage.setItem(USER_DATA_KEY, jsonValue);
  } catch (error) {
    console.error("Error saving user data:", error);
    throw error;
  }
};

export const getUserDataFromStorage =
  async (): Promise<LoginResponseTypes | null> => {
    try {
      const jsonValue = await AsyncStorage.getItem(USER_DATA_KEY);
      return jsonValue != null
        ? (JSON.parse(jsonValue) as LoginResponseTypes)
        : null;
    } catch (error) {
      console.error("Error retrieving user data:", error);
      throw error;
    }
  };

export const clearUserDataFromStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_DATA_KEY);
  } catch (error) {
    console.error("Error clearing user data:", error);
    throw error;
  }
};

const SAVED_RECIPES_KEY = "saved_recipes";

export const saveSavedRecipesInStorage = async (
  savedRecipes: number[]
): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(savedRecipes);
    await AsyncStorage.setItem(SAVED_RECIPES_KEY, jsonValue);
  } catch (error) {
    console.error("Error saving saved recipes:", error);
    throw error;
  }
};

export const getSavedRecipesFromStorage = async (): Promise<
  number[] | null
> => {
  try {
    const jsonValue = await AsyncStorage.getItem(SAVED_RECIPES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error("Error retrieving saved recipes:", error);
    return null;
  }
};
