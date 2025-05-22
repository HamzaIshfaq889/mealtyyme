import { getUserDataFromStorage } from "@/utils/storage/authStorage";
import { useAuth, useClerk } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import { useEffect } from "react";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

export default function AuthLayout() {
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  useEffect(() => {
    const checkUserData = async () => {
      const user = await getUserDataFromStorage();

      if (isSignedIn && (!user || !user.access)) {
        console.log("no data but session thereee");
        await signOut();
      }
    };

    checkUserData();
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="account-options" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="login" />
        <Stack.Screen name="forget-password" />
        <Stack.Screen name="reset-password" />
        <Stack.Screen name="otp" />
      </Stack>
      <Toast />
    </>
  );
}
