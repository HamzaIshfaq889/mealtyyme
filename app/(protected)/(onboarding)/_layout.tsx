import "react-native-reanimated";

import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding1" />
        <Stack.Screen name="pick-diet" />
        <Stack.Screen name="allergies" />
      </Stack>
    </>
  );
}
