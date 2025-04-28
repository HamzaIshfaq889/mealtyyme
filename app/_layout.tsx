import { useEffect, useState } from "react";
import {
  DefaultTheme as LightTheme,
  DarkTheme,
  ThemeProvider,
} from "@react-navigation/native";
import "react-native-reanimated";

import { Provider } from "react-redux";
import { store, persistor } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";

import { ClerkProvider } from "@clerk/clerk-expo";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme, View } from "react-native";
import Toast from "react-native-toast-message";

import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";

import { AppConfig } from "@/constants";

import { Splash } from "@/components/modules";
import QueryProvider from "@/providers/QueryProvider";
import "@/global.css";

SplashScreen.preventAutoHideAsync();
const tokenCache = {
  async getToken(key: string) {
    return SecureStore.getItemAsync(key);
  },
  async saveToken(key: string, value: string) {
    return SecureStore.setItemAsync(key, value);
  },
};

export default function RootLayout() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const scheme = useColorScheme(); // <- ✅ Get OS theme

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/Sofia Pro Regular Az.ttf"),
    roborto: require("../assets/fonts/Roboto-Regular.ttf"),
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

  return (
    <ClerkProvider
      publishableKey={AppConfig.CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <ThemeProvider value={scheme === "dark" ? DarkTheme : LightTheme}>
                <StatusBar
                  style={scheme === "dark" ? "light" : "dark"}
                  backgroundColor="transparent"
                  translucent
                />
                <View className={scheme === "dark" ? "dark flex-1" : "flex-1"}>
                  <Stack>
                    <Stack.Screen
                      name="(protected)"
                      options={{
                        headerShown: false,
                        animation: "none",
                      }}
                    />
                    <Stack.Screen
                      name="(auth)"
                      options={{
                        animation: "none",
                      }}
                    />
                  </Stack>
                  <Toast />
                </View>
              </ThemeProvider>
            </GestureHandlerRootView>
          </QueryProvider>
        </PersistGate>
      </Provider>
    </ClerkProvider>
  );
}
