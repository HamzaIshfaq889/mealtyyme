import { Recipe } from "@/lib/types/recipe";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RecipeState {
  currentRecipe: Recipe | null;
  isCooking: boolean;
  cookingRecipe: Recipe | null;
}

const initialState: RecipeState = {
  currentRecipe: null,
  isCooking: false,
  cookingRecipe: null,
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

    startCooking: (state, action: PayloadAction<Recipe>) => {
      state.isCooking = true;
      state.cookingRecipe = action.payload;
    },

    stopCooking: (state) => {
      state.isCooking = false;
      state.cookingRecipe = null;
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
