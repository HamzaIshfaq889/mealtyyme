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

import { PortalProvider } from "@gorhom/portal";

import { ClerkProvider } from "@clerk/clerk-expo";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme, View } from "react-native";
import Toast from "react-native-toast-message";

import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { StripeProvider } from "@stripe/stripe-react-native";
import { AppConfig } from "@/constants";

import { Splash } from "@/components/modules";
import QueryProvider from "@/providers/QueryProvider";
import "@/global.css";

import { JSX } from "react";
import {
  BaseToast,
  BaseToastProps,
  ErrorToast,
} from "react-native-toast-message";

const toastConfig = {
  success: (props: JSX.IntrinsicAttributes & BaseToastProps) => (
    <BaseToast
      {...props}
      style={{
        borderLeftWidth: 5,
        borderLeftColor: "#4CAF50", // softer green
        backgroundColor: "#f0fdf4", // very soft green background
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
      }}
      contentContainerStyle={{ paddingHorizontal: 10 }}
      text1Style={{
        fontSize: 17,
        fontWeight: "700",
        color: "#2e7d32",
      }}
      text2Style={{
        fontSize: 15,
        color: "#6b7280", // subtle gray (tailwind slate-500 tone)
      }}
    />
  ),
  error: (props: JSX.IntrinsicAttributes & BaseToastProps) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftWidth: 5,
        borderLeftColor: "#f44336", // softer red
        backgroundColor: "#fef2f2", // very soft red background
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
      }}
      contentContainerStyle={{ paddingHorizontal: 10 }}
      text1Style={{
        fontSize: 17,
        fontWeight: "700",
        color: "#b71c1c",
      }}
      text2Style={{
        fontSize: 15,
        color: "#6b7280",
      }}
    />
  ),
};

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
  console.log("checkpost2");

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
      }, 5100);
      return () => clearTimeout(timer);
    }
  }, [isSplashVisible]);

  if (!loaded || isSplashVisible) {
    return <Splash />;
  }

  return (
    <StripeProvider
      publishableKey="pk_test_51RLiYoQ9GhZlI30ssstOKRRdnVqc2U1TLlLcbLkBlc7QIOuKsYb8HjXL81VtwaTkZMPunuNeRuPS3736dEjfjGcH00emK8MZG2" // 🔐 Replace with your actual Stripe publishable key
      merchantIdentifier="merchant.co.mealtyme.app" // for Apple Pay (optional)
    >
      <ClerkProvider
        publishableKey={AppConfig.CLERK_PUBLISHABLE_KEY}
        tokenCache={tokenCache}
      >
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <QueryProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <ThemeProvider
                  value={scheme === "dark" ? DarkTheme : LightTheme}
                >
                  <PortalProvider>
                    <StatusBar
                      style={scheme === "dark" ? "light" : "dark"}
                      backgroundColor="transparent"
                      translucent
                    />
                    <View
                      className={scheme === "dark" ? "dark flex-1" : "flex-1"}
                    >
                      <Stack screenOptions={{ headerShown: false }}>
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
                            headerShown: false,
                          }}
                        />
                      </Stack>
                      <Toast config={toastConfig} />
                    </View>
                  </PortalProvider>
                </ThemeProvider>
              </GestureHandlerRootView>
            </QueryProvider>
          </PersistGate>
        </Provider>
      </ClerkProvider>
    </StripeProvider>
  );
}
