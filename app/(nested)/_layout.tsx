import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import "react-native-reanimated";

import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="recipe" />
        <Stack.Screen name="search" />
      </Stack>
      <Toast />
      <StatusBar style="auto" />
    </>
  );
}
