import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ingredient } from "@/lib/types/recipe";

const INGREDIENT_CART_KEY = "@ingredient_cart";

const makeCartKey = (userId: string) => `${userId}:${INGREDIENT_CART_KEY}`;

export async function saveIngredientCart(
  userId: string,
  items: Ingredient[]
): Promise<void> {
  try {
    const key = makeCartKey(userId);
    await AsyncStorage.setItem(key, JSON.stringify(items));
  } catch (err) {
    console.error("Error saving ingredient cart:", err);
  }
}

export async function loadIngredientCart(
  userId: string
): Promise<Ingredient[]> {
  try {
    const key = makeCartKey(userId);
    const json = await AsyncStorage.getItem(key);
    return json ? (JSON.parse(json) as Ingredient[]) : [];
  } catch (err) {
    console.error("Error loading ingredient cart:", err);
    return [];
  }
}

export async function clearIngredientCart(userId: string): Promise<void> {
  try {
    const key = makeCartKey(userId);
    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.error("Error clearing ingredient cart:", err);
  }
}

export async function removeIngredientFromCart(
  userId: string,
  ingredientId: number
): Promise<void> {
  try {
    const key = makeCartKey(userId);
    const existing = await AsyncStorage.getItem(key);
    if (!existing) return;

    const items: Ingredient[] = JSON.parse(existing);
    const updated = items.filter((item) => item.ingredient.id !== ingredientId);

    await AsyncStorage.setItem(key, JSON.stringify(updated));
  } catch (err) {
    console.error("Error removing ingredient from cart:", err);
  }
}
