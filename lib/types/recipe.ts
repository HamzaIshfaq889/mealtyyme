export interface DishType {
  id: number;
  name: string;
  created_by: number;
}

export interface Cuisine {
  id: number;
  name: string;
  created_at: string;
  created_by: number;
}

export interface Recipe {
  id: number;
  title: string;
  image_url: string;
  ready_in_minutes: number;
  servings: number;
  source_url: string;
  vegetarian: boolean;
  vegan: boolean;
  gluten_free: boolean;
  dairy_free: boolean;
  summary: string;
  spoonacular_score: number;
  nutrition: Nutrition;
  dish_types: DishType[];
  diets: Diet[];
  ingredients: Ingredient[];
  instructions: Instruction[];
  reviews: any[];
  spoonacular_id: number;
  is_featured: boolean;
  created_at: string;
  cuisines: Cuisine[];
  created_by: number;
}

export interface RecipeResponse {
  results: Recipe[];
  total: number;
}

export type Ingredient = {
  ingredient: {
    id: number;
    spoonacular_id: number;
    name: string;
    created_at: string;
    created_by: number;
  };
  amount: number;
  unit: string;
  created_at: string;
  created_by: number;
  recipe_id: number;
};

export type Equipment = {
  equipment: {
    id: number;
    spoonacular_id: number;
    name: string;
    localized_name: string;
    image_url: string;
    created_at: string;
    created_by: number;
  };
  created_by: number;
};

export type Instruction = {
  step_number: number;
  step_text: string;
  created_by: number;
  recipe_id: number;
  equipment: Equipment[];
};

export type Nutrition = {
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  created_by: number;
  recipe_id: number;
};

export type Diet = {
  id: number;
  name: string;
  created_by: number;
};
