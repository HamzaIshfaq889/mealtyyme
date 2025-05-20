import { Recipe } from "@/lib/types/recipe";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RecipeState {
  currentRecipe: Recipe | null;
  isCooking: boolean;
  cookingRecipe: Recipe | null;
  isCookingPrivate: boolean;
}

const initialState: RecipeState = {
  currentRecipe: null,
  isCooking: false,
  cookingRecipe: null,
  isCookingPrivate: false,
};

const recipeSlice = createSlice({
  name: "recipe",
  initialState,
  reducers: {
    setCurrentRecipe: (state, action: PayloadAction<Recipe>) => {
      state.currentRecipe = action.payload;
    },

    clearCurrentRecipe: (state) => {
      state.currentRecipe = null;
    },

    startCooking: (
      state,
      action: PayloadAction<{ recipe: Recipe; isPrivate?: boolean }>
    ) => {
      state.isCooking = true;
      state.cookingRecipe = action.payload.recipe;
      state.isCookingPrivate = action.payload.isPrivate ?? false;
    },

    stopCooking: (state) => {
      state.isCooking = false;
      state.cookingRecipe = null;
      state.isCookingPrivate = false;
    },
  },
});

export const {
  setCurrentRecipe,
  clearCurrentRecipe,
  startCooking,
  stopCooking,
} = recipeSlice.actions;

export default recipeSlice.reducer;
