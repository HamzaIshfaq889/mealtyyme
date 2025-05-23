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

const CHECKED_INGREDIENTS_KEY = "@checked_ingredients";

const makeCheckedKey = (userId: string) =>
  `${userId}:${CHECKED_INGREDIENTS_KEY}`;

// Save the full list of checked items
export async function saveCheckedIngredient(
  userId: string,
  item: Ingredient
): Promise<void> {
  try {
    const key = makeCheckedKey(userId);
    const existing = await AsyncStorage.getItem(key);

    let items: Ingredient[] = [];

    // Ensure we safely parse only if it's a valid array
    if (existing) {
      const parsed = JSON.parse(existing);
      if (Array.isArray(parsed)) {
        items = parsed;
      } else {
        console.warn("Checked ingredient data is not an array. Resetting.");
      }
    }

    const alreadyExists = items.some(
      (i) => i.ingredient.id === item.ingredient.id
    );

    if (!alreadyExists) {
      items.push(item);
      await AsyncStorage.setItem(key, JSON.stringify(items));
    }
  } catch (err) {
    console.error("Error saving checked ingredient:", err);
  }
}

// Load checked items
export async function loadCheckedIngredients(
  userId: string
): Promise<Ingredient[] | null> {
  try {
    const key = makeCheckedKey(userId);
    const json = await AsyncStorage.getItem(key);
    return json ? (JSON.parse(json) as Ingredient[]) : null;
  } catch (err) {
    console.error("Error loading checked ingredient:", err);
    return null;
  }
}

// Remove one checked item by ingredientId
export async function removeCheckedIngredient(
  userId: string,
  ingredientId: number
): Promise<void> {
  try {
    const key = makeCheckedKey(userId);
    const existing = await AsyncStorage.getItem(key);
    if (!existing) return;

    const items: Ingredient[] = JSON.parse(existing);
    const updated = items.filter((item) => item.ingredient.id !== ingredientId);

    await AsyncStorage.setItem(key, JSON.stringify(updated));
  } catch (err) {
    console.error("Error removing checked ingredient:", err);
  }
}

// Clear all checked ingredients
export async function clearCheckedIngredients(userId: string): Promise<void> {
  try {
    const key = makeCheckedKey(userId);
    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.error("Error clearing checked ingredients:", err);
  }
}
