import { Stack } from "expo-router";
import { Redirect } from "expo-router";

import { Splash } from "@/components/modules";
import { getUserDataFromStorage } from "@/utils/storage/authStorage";
import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/slices/Auth";

export default function ProtectedLayout() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkUserData = async () => {
      const user = await getUserDataFromStorage();
      if (user && user.access) {
        dispatch(setCredentials({ ...user, isAuthenticated: true }));
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
