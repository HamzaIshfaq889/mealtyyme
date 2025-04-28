import { Recipe } from "./recipe";

export type MealType = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";

export interface AddMealSchedulePayload {
  recipe: number;
  meal_type: MealType;
  date: string;
}

export type Meal = {
  id: number;
  customer: number;
  date: string;
  meal_type: MealType;
  recipes: Recipe[];
  created_at: string;
  updated_at: string;
};

export type MealData = {
  BREAKFAST: Meal[];
  DINNER: Meal[];
  LUNCH: Meal[];
  SNACK: Meal[];
};
