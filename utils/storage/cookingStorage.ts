import { Recipe } from "@/lib/types/recipe";
import AsyncStorage from "@react-native-async-storage/async-storage";

type TimerState = {
  duration: number;
  startTime: number;
  pausedSecs: number;
  isPlaying: boolean;
  isComplete: boolean;
  key: number;
};

export const RECIPE_STORAGE_KEY = "@cooking_recipe";
const STEP_TIMERS_KEY = "@cooking_step_timers";

const makeRecipeKey = (userId: string) => `${userId}:${RECIPE_STORAGE_KEY}`;
const makeTimersKey = (userId: string) => `${userId}:${STEP_TIMERS_KEY}`;
const PREFIX = "cookingPrivacy_";

export const saveCookingPrivacy = async (
  customerId: string,
  isPrivate: boolean
): Promise<void> => {
  try {
    const key = PREFIX + customerId;
    await AsyncStorage.setItem(key, JSON.stringify(isPrivate));
  } catch (err) {
    console.error("Error saving cooking privacy flag:", err);
  }
};

export const getCookingPrivacy = async (
  customerId: string
): Promise<boolean> => {
  try {
    const key = PREFIX + customerId;
    const json = await AsyncStorage.getItem(key);
    return json != null ? (JSON.parse(json) as boolean) : false;
  } catch (err) {
    console.error("Error reading cooking privacy flag:", err);
    return false;
  }
};

export const removeCookingPrivacy = async (
  customerId: string
): Promise<void> => {
  try {
    const key = PREFIX + customerId;
    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.error("Error removing cooking privacy flag:", err);
  }
};

export async function saveCookingRecipe(
  userId: string,
  recipe: Recipe | null
): Promise<void> {
  const key = makeRecipeKey(userId);
  const payload = recipe ? JSON.stringify(recipe) : "";
  await AsyncStorage.setItem(key, payload);
}

export async function getCookingRecipe(userId: string): Promise<Recipe | null> {
  const key = makeRecipeKey(userId);
  const json = await AsyncStorage.getItem(key);
  return json ? JSON.parse(json) : null;
}

export async function clearCookingRecipe(userId: string): Promise<void> {
  const key = makeRecipeKey(userId);
  await AsyncStorage.removeItem(key);
}

export async function loadStepTimers(
  userId: string
): Promise<Record<number, TimerState>> {
  const key = makeTimersKey(userId);
  const json = await AsyncStorage.getItem(key);
  return json ? (JSON.parse(json) as Record<number, TimerState>) : {};
}

export async function saveStepTimers(
  userId: string,
  timers: Record<number, TimerState>
): Promise<void> {
  const key = makeTimersKey(userId);
  await AsyncStorage.setItem(key, JSON.stringify(timers));
}

export async function clearStepTimers(userId: string): Promise<void> {
  const key = makeTimersKey(userId);
  await AsyncStorage.removeItem(key);
}
