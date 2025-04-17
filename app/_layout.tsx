import { useEffect, useState } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import "react-native-reanimated";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import Toast from "react-native-toast-message";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

import { AuthWrapper, Splash } from "@/components/modules";
import { store, persistor } from "@/redux/store";
import QueryProvider from "@/providers/QueryProvider";

import "@/global.css";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
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

  const colorScheme = "dark";

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryProvider>
          <GestureHandlerRootView>
            <ThemeProvider
              value={colorScheme !== "dark" ? DarkTheme : DefaultTheme}
            >
              <AuthWrapper />
              <StatusBar style="auto" />
              <Toast />
            </ThemeProvider>
          </GestureHandlerRootView>
        </QueryProvider>
      </PersistGate>
    </Provider>
  );
}
