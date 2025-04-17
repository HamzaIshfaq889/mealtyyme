import { useEffect } from "react";
import { useSelector } from "react-redux";

import { Slot, router, useSegments } from "expo-router";

const AuthWrapper = () => {
  const token = useSelector(
    (state: any) => state.auth.loginResponseType.access
  );

  const hasOnboarded = useSelector((state: any) => state.auth.hasOnboarded);

  console.log(hasOnboarded);

  const segments = useSegments();

  // useEffect(() => {
  //   const inAuthGroup = segments[0] === "(auth)";
  //   const inOnboarding = segments[0] === "(onboarding)";
  //   const inTabs = segments[0] === "(tabs)";

  //   //Still onboarding
  //   if (!hasOnboarded && !inOnboarding) {
  //     console.log("to onboaring");
  //     router.push("/(onboarding)/onboarding1");
  //     return;
  //   }

  //   //Complete onboarding screens but not logged in yet
  //   if (hasOnboarded && !token && !inAuthGroup) {
  //     console.log("to account options");
  //     router.push("/(auth)/account-options");
  //     return;
  //   }

  //   // 3. Logged in and not in tabs
  //   if (hasOnboarded && token && !inTabs) {
  //     console.log("to Home");
  //     router.push("/(tabs)/Home");
  //     return;
  //   }
  // }, [token, segments, hasOnboarded]);

  useEffect(() => {
    const currentRoute = "/" + segments.join("/");

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboarding = segments[0] === "(onboarding)";
    const inTabs = segments[0] === "(tabs)";
    const inNested = segments[0] === "(nested)";

    // 1. Still onboarding
    if (!hasOnboarded && !inOnboarding) {
      router.replace("/(onboarding)/onboarding1");
      return;
    }

    // 2. Onboarded but not logged in
    if (hasOnboarded && !token && !inAuthGroup) {
      router.replace("/(auth)/account-options");
      return;
    }

    // 3. Logged in but trying to access unknown screen
    const isAllowedGroup = inTabs || inNested;

    if (hasOnboarded && token && !isAllowedGroup) {
      router.replace("/(tabs)/Home");
      return;
    }
  }, [token, segments, hasOnboarded]);

  return <Slot />;
};

export default AuthWrapper;
