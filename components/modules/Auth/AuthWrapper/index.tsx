"use client";

import { Slot, router, useSegments } from "expo-router";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { getOnboardStatus, getToken } from "@/redux/store/expoStore";
import { setAuthToken } from "@/lib/apiClient";
import Splash from "../../Splash";

const AuthWrapper = () => {
  const [secureStoreToken, setSecureStoreToken] = useState<string | null>(null);
  const [hasOnboardedFromSecure, setHasOnboardedFromSecure] = useState(true);
  const [isCheckingStore, setIsCheckingStore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const reduxToken = useSelector(
    (state: any) => state.auth.loginResponseType.access
  );

  const isSigningIn = useSelector((state: any) => state.auth.isSigningIn);

  const segments = useSegments();

  const checkSecureStore = async () => {
    setIsLoading(true);
    console.log("Checking....");
    try {
      const storedToken = await getToken();
      const onboardingStatus = await getOnboardStatus();

      setSecureStoreToken(storedToken);
      setHasOnboardedFromSecure(onboardingStatus);
    } catch (error) {
      console.error("Error fetching token from SecureStore:", error);
    } finally {
      setIsCheckingStore(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSecureStore();
  }, [segments]);

  useEffect(() => {
    if (isCheckingStore || isSigningIn) return;

    const timeout = setTimeout(() => {
      const token = secureStoreToken || reduxToken;

      if (token) {
        setAuthToken(token);
      }

      const inAuthGroup = segments[0] === "(auth)";
      const inOnboarding = segments[0] === "(onboarding)";
      const inTabs = segments[0] === "(tabs)";
      const inNested = segments[0] === "(nested)";

      // 1. Still onboarding
      if (!inOnboarding && !hasOnboardedFromSecure) {
        router.replace("/(onboarding)/onboarding1");
        return;
      }

      // 2. Onboarded but not logged in
      if (hasOnboardedFromSecure && !token && !inAuthGroup) {
        router.replace("/(auth)/account-options");
        return;
      }

      // 3. Logged in but trying to access unknown screen
      const isAllowedGroup = inTabs || inNested;

      if (hasOnboardedFromSecure && token && !isAllowedGroup) {
        router.replace("/(tabs)/Home");
      }
    }, 3000); // delay in milliseconds

    return () => clearTimeout(timeout); 
  }, [
    secureStoreToken,
    reduxToken,
    segments,
    hasOnboardedFromSecure,
    isCheckingStore,
    isSigningIn,
  ]);

  // Show nothing while checking SecureStore to prevent flashes
  if (isCheckingStore || isSigningIn) {
    return <Slot />;
  }

  return <Slot />;
};

export default AuthWrapper;
