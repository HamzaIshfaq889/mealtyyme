import React from "react";

import { Text, View } from "react-native";

import { router } from "expo-router";

import Svg1 from "../../../assets/svgs/account-option.svg";
import { Button, ButtonText } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { useAuth, useClerk, useSSO } from "@clerk/clerk-expo";
import { setCredentials, setIsSigningIn } from "@/redux/slices/Auth";
import Svg2 from "@/assets/svgs/google.svg";
import Svg3 from "@/assets/svgs/apple-filled.svg";
import Toast from "react-native-toast-message";
import { setAuthToken } from "@/lib/apiClient";
import { saveToken } from "@/redux/store/expoStore";

import { AppConfig } from "@/constants";

const AccountsOptions = () => {
  const { startSSOFlow } = useSSO();
  const { signOut } = useClerk();
  const { isSignedIn } = useAuth();
  const dispatch = useDispatch();

  const handleSignIn = async () => {
    if (isSignedIn) {
      Toast.show({
        type: "error",
        text1: "You are already Signed in",
      });
      return;
    }

    dispatch(setIsSigningIn(true));

    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        console.log("🔐 Clerk session activated");

        const data = await sendSessionIdToBackend(createdSessionId);
        console.log("Response from backend:", data);

        // ✅ Wait for next frame before navigating
        setTimeout(() => {
          router.push("/(tabs)/Home");
          console.log("check 1 ");
        }, 0); // You can also try requestAnimationFrame()
      } else {
        console.error("❌ setActive failed or undefined");
      }
    } catch (error) {
      console.error("SSO error:", error);
    } finally {
      dispatch(setIsSigningIn(false));
    }
  };
  const handleSignApple = async () => {
    if (isSignedIn) {
      Toast.show({
        type: "error",
        text1: "You are already Signed in",
      });
      return;
    }

    dispatch(setIsSigningIn(true));

    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_apple",
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        console.log("🔐 Clerk session activated");

        // Send the session ID to the backend
        const data = await sendSessionIdToBackend(createdSessionId);
        console.log("Response from backend:", data);

        router.push("/(tabs)/Home");
      } else {
        console.error("❌ setActive failed or undefined");
      }
    } catch (error) {
      console.error("SSO error:", error);
    } finally {
      dispatch(setIsSigningIn(false));
    }
  };

  const sendSessionIdToBackend = async (sessionId: string) => {
    try {
      if (!sessionId) {
        console.error("No session ID received from Clerk");
        return;
      }

      const response = await fetch(
        `${AppConfig.API_URL}auth/clerk/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: sessionId,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setAuthToken(data.access);
        dispatch(setCredentials({ ...data, isAuthenticated: true }));
        if (data.access) {
          await saveToken(data.access);
        }

        Toast.show({
          type: "success",
          text1: "Login Successful!",
        });
      } else {
        console.error("❌ Backend error:", data);
      }
    } catch (err) {
      console.error("Error sending session ID to backend:", err);
    }
  };
  return (
    <View className="bg-secondary w-full h-full flex flex-col px-6 pb-8">
      {/* Top Illustration - uses flex-grow to push content down */}
      <View className="flex-grow flex items-center justify-center">
        <Svg1 width={280} height={280} />
      </View>

      {/* Auth Sections at Bottom */}
      <View className="w-full">
        {/* Email Auth Buttons */}
        <View className="w-full mb-6">
          <Button
            className="mb-3"
            action="primary"
            onPress={() => router.push("/(auth)/login")}
          >
            <ButtonText>Login with email</ButtonText>
          </Button>

          <Button action="muted" onPress={() => router.push("/(auth)/signup")}>
            <ButtonText>Signup with email</ButtonText>
          </Button>
        </View>

        {/* Social Auth Section */}
        <View className="w-full">
          <Text className="text-center text-primary mb-4">
            or continue with
          </Text>

          <Button
            onPress={() => handleSignIn()}
            action="muted"
            className="flex-row justify-center items-center gap-2 mb-3 bg-red-500"
          >
            <Svg2 width={20} height={20} />
            <ButtonText className="text-white">Google</ButtonText>
          </Button>

          <Button
            onPress={() => handleSignApple()}
            action="muted"
            className="flex-row justify-center items-center gap-2 bg-gray-700"
          >
            <Svg3 width={20} height={20} color="#fff" />
            <ButtonText className="text-white">Apple</ButtonText>
          </Button>
        </View>
      </View>
    </View>
  );
};

export default AccountsOptions;
