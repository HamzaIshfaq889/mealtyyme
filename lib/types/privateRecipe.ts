type Nutrients = {
  calories: string;
  carbohydrateContent: string;
  cholesterolContent: string;
  fiberContent: string;
  proteinContent: string;
  saturatedFatContent: string;
  sodiumContent: string;
  sugarContent: string;
  fatContent: string;
  unsaturatedFatContent: string;
};

type IngredientGroup = {
  ingredients: string[];
  purpose: string | null;
};

export type PrivateRecipe = {
  author: string;
  category: string;
  cook_time: string;
  description: string;
  host: string;
  image: string;
  ingredient_groups: IngredientGroup[];
  ingredients: string[];
  instructions: string;
  instructions_list: string[];
  language: string;
  nutrients: Nutrients;
  prep_time: string;
  ratings: number;
  ratings_count: number;
  site_name: string;
  title: string;
  total_time: string;
  servings: string;
  url: string;
};
