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
  },
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
    logout: (state) => {
      state.loginResponseType.access = null;
      state.loginResponseType.refresh = null;
      state.loginResponseType.email = null;
      state.loginResponseType.first_name = null;
      state.loginResponseType.role = null;
      state.loginResponseType.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout, setResetToken, clearResetToken } =
  authSlice.actions;
export default authSlice.reducer;
