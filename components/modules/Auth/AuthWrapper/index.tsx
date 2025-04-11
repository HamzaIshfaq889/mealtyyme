import { Stack, router, useSegments } from "expo-router";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const AuthWrapper = () => {
  const token = useSelector(
    (state: any) => state.auth.loginResponseType.access
  );

  const segments = useSegments();

  console.log(token);

  useEffect(() => {
    const currentGroup = segments[0];

    const isPublicGroup =
      currentGroup === "(auth)" || currentGroup === "(onboarding)";
    const isPrivateGroup = !isPublicGroup;

    if (!token && isPrivateGroup) {
      router.replace("/(onboarding)/onboarding2");
    }

    if (token && isPublicGroup) {
      router.replace("/");
    }
  }, [token, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="+not-found" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(auth)" />
    </Stack>
  );
};

export default AuthWrapper;
