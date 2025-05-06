import { AuthSliceType, LoginResponseTypes } from "@/lib/types";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthSliceType = {
  loginResponseType: {
    access: null,
    refresh: null,
    email: null,
    first_name: null,
    role: null,
    image_url: null,
    isAuthenticated: false,
    customer_details: {
      user: 0,
      diet_preferences: [],
      allergies: [],
      subscription: null,
      first_time_user: true,
      created_at: "",
      updated_at: "",
      saved_recipes: [],
    },
  },
  hasOnboarded: false,
  isSigningIn: false,
  "reset-token": null,
  savedRecipes: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<LoginResponseTypes>) => {
      const {
        access,
        refresh,
        email,
        first_name,
        role,
        isAuthenticated,
        customer_details,
        image_url,
      } = action.payload;

      // Log the incoming customer details
      console.log("Incoming Customer Details:", customer_details);

      // Set the credentials
      state.loginResponseType.access = access;
      state.loginResponseType.refresh = refresh;
      state.loginResponseType.email = email;
      state.loginResponseType.first_name = first_name;
      state.loginResponseType.role = role;
      state.loginResponseType.image_url = image_url;
      state.loginResponseType.isAuthenticated = isAuthenticated;
      state.loginResponseType.customer_details = customer_details;

      // Log the set customer details in the state
      console.log(
        "Set Customer Details in State:",
        state.loginResponseType.customer_details
      );
    },

    setResetToken: (state, action: PayloadAction<string>) => {
      state["reset-token"] = action.payload;
    },
    clearResetToken: (state) => {
      state["reset-token"] = null;
    },

    setIsSigningIn: (state, action: PayloadAction<boolean>) => {
      state.isSigningIn = action.payload;
    },

    setOnboardingComplete: (state, action: PayloadAction<boolean>) => {
      state.hasOnboarded = action.payload;
    },

    logout: (state) => {
      state.loginResponseType.access = null;
      state.loginResponseType.refresh = null;
      state.loginResponseType.email = null;
      state.loginResponseType.first_name = null;
      state.loginResponseType.role = null;
      state.loginResponseType.role = null;
      state.loginResponseType.isAuthenticated = false;
      state.loginResponseType.image_url = null;
      state.loginResponseType.customer_details = null;
    },

    updateSavedRecipes: (state, action: PayloadAction<number>) => {
      const currentSavedRecipes: number[] = state.savedRecipes;

      if (!currentSavedRecipes.includes(action.payload)) {
        state.savedRecipes = [...currentSavedRecipes, action.payload];
      }
    },
    setSavedRecipes: (state, action: PayloadAction<number[] | null>) => {
      if (!action.payload) return;
      state.savedRecipes = action.payload;
    },
  },
});

export const {
  setCredentials,
  logout,
  setResetToken,
  clearResetToken,
  setOnboardingComplete,
  setIsSigningIn,
  updateSavedRecipes,
  setSavedRecipes,
} = authSlice.actions;
export default authSlice.reducer;
