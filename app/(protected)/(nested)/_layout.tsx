import { Stack } from "expo-router";

import "react-native-reanimated";

import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="recipe" />
        <Stack.Screen name="cooking" />
        <Stack.Screen name="search" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="edit-profile" />
        <Stack.Screen name="manage-subscriptions" />
      </Stack>
      <Toast />
    </>
  );
}
