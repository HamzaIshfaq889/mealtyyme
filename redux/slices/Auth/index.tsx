import { AuthSliceType, LoginResponseTypes } from "@/lib/types";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthSliceType = {
  loginResponseType: {
    access: null,
    refresh: null,
    email: null,
    first_name: null,
    role: null,
    isAuthenticated: false,
    customer_details: {
      user: 17,
      diet_preferences: [],
      allergies: [],
      trial_start_date: null,
      trial_used: false,
      is_pro_user: false,
      avatar: null,
      subscription_type: null,
      subscription_expiry: null,
      created_at: "",
      updated_at: "",
      saved_recipes: [],
    },
  },
  hasOnboarded: false,
  isSigningIn: false,
  "reset-token": null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<LoginResponseTypes>) => {
      const { access, refresh, email, first_name, role, isAuthenticated } =
        action.payload;
      state.loginResponseType.access = access;
      state.loginResponseType.refresh = refresh;
      state.loginResponseType.email = email;
      state.loginResponseType.first_name = first_name;
      state.loginResponseType.role = role;
      state.loginResponseType.isAuthenticated = isAuthenticated;
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
} = authSlice.actions;
export default authSlice.reducer;
