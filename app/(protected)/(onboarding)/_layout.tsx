import { Stack } from "expo-router";
import "react-native-reanimated";

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
