import { Stack } from "expo-router";
import { Redirect } from "expo-router";

import { Splash } from "@/components/modules";
import {
  getSavedRecipesFromStorage,
  getUserDataFromStorage,
} from "@/utils/storage/authStorage";
import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { setCredentials, setSavedRecipes } from "@/redux/slices/Auth";
import { setAuthToken } from "@/lib/apiClient";

export default function ProtectedLayout() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkUserData = async () => {
      const user = await getUserDataFromStorage();

      if (user && user.access) {
        dispatch(setCredentials({ ...user, isAuthenticated: true }));

        setAuthToken(user.access);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkUserData();
  }, []);

  if (isLoading) {
    return <Splash />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/account-options" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(nested)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(onboarding)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
