import { Splash } from "@/components/modules";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/Sofia Pro Regular Az.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (isSplashVisible) {
      const timer = setTimeout(() => {
        setIsSplashVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSplashVisible]);

  if (!loaded || isSplashVisible) {
    return <Splash />;
  }

  const colorScheme = "dark";

  return (
    <ThemeProvider value={colorScheme !== "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="onboarding2" />
        <Stack.Screen name="onboarding3" />
        <Stack.Screen name="pick-diet" />
        <Stack.Screen name="allergies" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="forget-password" />
        <Stack.Screen name="reset-password" />
        <Stack.Screen name="account-options" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
