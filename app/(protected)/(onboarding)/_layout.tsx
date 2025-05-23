import "react-native-reanimated";

import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "none",
          animationDuration: 0,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name="onboarding1" />
        <Stack.Screen name="pick-diet" />
        <Stack.Screen name="allergies" />
      </Stack>
    </>
  );
}
