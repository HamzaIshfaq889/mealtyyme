import { Stack } from "expo-router";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

export default function AuthLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="account-options" />
        <Stack.Screen name="forget-password" />
        <Stack.Screen name="login" />
        <Stack.Screen name="otp" />
        <Stack.Screen name="reset-password" />
        <Stack.Screen name="signup" />
      </Stack>
      <Toast />
    </>
  );
}
