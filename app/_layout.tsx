import { useEffect, useState } from "react";
import {
  DefaultTheme as LightTheme,
  DarkTheme,
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
import { useColorScheme } from "react-native";

import { AuthWrapper, Splash } from "@/components/modules";
import { store, persistor } from "@/redux/store";
import QueryProvider from "@/providers/QueryProvider";
import { View } from "react-native";

import "@/global.css";

SplashScreen.preventAutoHideAsync();

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
              {/* Apply the 'dark' class if needed */}
              <View className={scheme === "dark" ? "dark flex-1" : "flex-1"}>
                <AuthWrapper />
                <Toast />
              </View>
            </ThemeProvider>
          </GestureHandlerRootView>
        </QueryProvider>
      </PersistGate>
    </Provider>
  );
}
