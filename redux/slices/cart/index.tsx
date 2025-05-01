import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Ingredient } from "@/lib/types/recipe";

interface CartState {
  items: Ingredient[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<Ingredient>) => {
      const newItem = action.payload;

      const existing = state.items.find(
        (item) =>
          item.ingredient.id === newItem.ingredient.id &&
          item.unit === newItem.unit
      );

      if (existing) {
        existing.amount += newItem.amount;
      } else {
        state.items.push(newItem);
      }
    },

    addIngredients: (state, action: PayloadAction<Ingredient[]>) => {
      for (const newItem of action.payload) {
        const existing = state.items.find(
          (item) =>
            item.ingredient.id === newItem.ingredient.id &&
            item.unit === newItem.unit
        );

        if (existing) {
          existing.amount += newItem.amount;
        } else {
          state.items.push(newItem);
        }
      }
    },

    removeIngredient: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        (item) => item.ingredient.id !== action.payload
      );
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addIngredient, addIngredients, removeIngredient, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
