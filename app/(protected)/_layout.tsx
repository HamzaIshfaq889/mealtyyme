import { Stack } from "expo-router";
import { Redirect } from "expo-router";

import {
  getUserDataFromStorage,
  isOnboardingComplete,
} from "@/utils/storage/authStorage";
import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { setCredentials, setSavedRecipes } from "@/redux/slices/Auth";
import { setAuthToken } from "@/lib/apiClient";

export default function ProtectedLayout() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnboardingProcessComplete, setisOnboardingProcessComplete] =
    useState(false);

  const isSigningIn = useSelector((state: any) => state.auth.isSigningIn);

  useEffect(() => {
    const checkUserData = async () => {
      const user = await getUserDataFromStorage();
      const onboardingComplete = await isOnboardingComplete();
      setisOnboardingProcessComplete(onboardingComplete);

      if (user && user.access) {
        dispatch(setCredentials({ ...user, isAuthenticated: true }));

        setAuthToken(user.access);
        setIsAuthenticated(true);
      }

      setIsLoading(false);
    };

    checkUserData();
  }, []);

  if (isLoading || isSigningIn) {
    return null;
  }

  if (!isAuthenticated) {
    return isOnboardingProcessComplete ? (
      <Redirect href="/(auth)/account-options" />
    ) : (
      <Redirect href="/(auth)/onboarding/onboarding1" />
    );
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
