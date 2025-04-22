import { Recipe } from "@/lib/types/recipe";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RecipeState {
  currentRecipe: Recipe | null;
}

const initialState: RecipeState = {
  currentRecipe: null,
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
  },
});

export const { setCurrentRecipe, clearCurrentRecipe } = recipeSlice.actions;
export default recipeSlice.reducer;
