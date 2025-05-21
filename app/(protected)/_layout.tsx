import { Stack } from "expo-router";
import { Redirect } from "expo-router";

import { getUserDataFromStorage } from "@/utils/storage/authStorage";
import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "@/redux/slices/Auth";
import { setAuthToken } from "@/lib/apiClient";
import { useAuth, useClerk } from "@clerk/clerk-expo";

export default function ProtectedLayout() {
  const dispatch = useDispatch();
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isSigningIn = useSelector((state: any) => state.auth.isSigningIn);

  useEffect(() => {
    const checkUserData = async () => {
      const user = await getUserDataFromStorage();

      if (isSignedIn && (!user || !user.access)) {
        await signOut();
      }

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
    return <Redirect href="/(auth)/account-options" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        animationDuration: 200,
        gestureEnabled: true,
        gestureDirection: "horizontal",
        presentation: "card",
      }}
    >
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
