import { configureStore } from "@reduxjs/toolkit";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { persistStore, persistReducer } from "redux-persist";

import authReducer from "../slices/Auth";
import recipeReducer from "../slices/recipies";
import cartReducer from "../slices/cart";

import { AppConfig } from "@/constants";

const persistConfig = {
  key: "auth",
  storage: AsyncStorage,
  whitelist: [
    "access",
    "refresh",
    "email",
    "first_name",
    "role",
    "isAuthenticated",
  ],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    recipe: recipeReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
