import React, { useState } from "react";

import {
  Platform,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import Toast from "react-native-toast-message";

import { router } from "expo-router";

import { useDispatch } from "react-redux";

import { setCredentials, setIsSigningIn } from "@/redux/slices/Auth";

import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";

import { LoginResponseTypes } from "@/lib/types";

import { loginUser } from "@/services/authApi";
import { setAuthToken } from "@/lib/apiClient";
import { ArrowLeft } from "lucide-react-native";
import * as WebBrowser from "expo-web-browser";
import { saveUserDataInStorage } from "@/utils/storage/authStorage";

import GoogleLogo from "@/assets/svgs/google-logo.svg";
import FacebookLogo from "@/assets/svgs/facebook-logo.svg";
import AppleLogo from "@/assets/svgs/apple-logo.svg";
import { AppConfig } from "@/constants";
import { useAuth, useSSO } from "@clerk/clerk-expo";

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
  const scheme = useColorScheme();
  const dispatch = useDispatch();

  const { startSSOFlow } = useSSO();
  const { isSignedIn } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({ email: "", password: "" });

  const [isNavigating, setIsNavigating] = useState(false);

  const handlePress = (route: string) => {
    if (isNavigating) return;

    setIsNavigating(true);
    router.push(route as any);

    setTimeout(() => setIsNavigating(false), 1000);
  };

  const validateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));

    let errorMessage = "";

    // Validation rules for each field
    switch (key) {
      case "email":
        if (!value) {
          errorMessage = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errorMessage = "Please enter a valid email.";
        }
        break;

      case "password":
        if (!value) {
          errorMessage = "Password is required.";
        } else if (value.length < 6) {
          errorMessage = "Password must be at least 6 characters.";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [key]: errorMessage }));
  };

  const validateAllFields = () => {
    const fieldsToValidate = {
      ...formData,
    };

    Object.entries(fieldsToValidate).forEach(([key, value]) => {
      validateField(key, value);
    });
  };

  const isFormValid =
    formData.email && formData.password && !errors.email && !errors.password;

  const handleSubmit = async () => {
    setIsLoading(true);

    validateAllFields();
    if (!isFormValid) {
      console.log("not valid");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
      };

      const response = (await loginUser(payload)) as LoginResponseTypes;
      const isFirstTimeUser = response?.customer_details?.first_time_user;

      if (response.access) {
        await saveUserDataInStorage({ ...response, isAuthenticated: true });
      }
      setAuthToken(response.access);
      dispatch(setCredentials({ ...response, isAuthenticated: true }));

      if (isFirstTimeUser) {
        router.replace("/(protected)/(onboarding)/onboarding1");
      } else {
        router.replace("/(protected)/(tabs)");
      }
      Toast.show({
        type: "success",
        text1: "Login Successful!",
      });
    } catch (error: any) {
      const errorMessage =
        error.message || "Something went wrong. Please try again.";

      Toast.show({
        type: "error",
        text1: errorMessage,
      });

      console.log("Login Error:", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // third party login logic

  const handleGoogleSignIn = async () => {
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

        const data = await sendSessionIdToBackend(createdSessionId);
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

        const data = await sendSessionIdToBackend(createdSessionId);
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

      const response = await fetch(`${AppConfig.API_URL}auth/clerk/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: sessionId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAuthToken(data.access);
        dispatch(setCredentials({ ...data, isAuthenticated: true }));
        if (data.access) {
          await saveUserDataInStorage({ ...data, isAuthenticated: true });
        }

        const isFirstTimeUser = data?.customer_details?.first_time_user;
        if (isFirstTimeUser) {
          router.replace("/(protected)/(tabs)");
        } else {
          router.replace("/(protected)/(tabs)");
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
    <View className="w-full h-full px-9 pt-16 pb-20 flex-col relative bg-background">
      {/* Header row */}
      <View className="flex-row items-center justify-between mb-8">
        <TouchableOpacity
          onPress={() => router.push("/(auth)/account-options")}
        >
          <ArrowLeft
            width={30}
            height={30}
            color={scheme === "dark" ? "#fff" : "#000"}
          />
        </TouchableOpacity>

        <View className="flex-1 items-center">
          <Text className="font-bold text-2xl text-primary">Login</Text>
        </View>

        <View style={{ width: 30 }} />
      </View>

      <View>
        <FormControl
          isInvalid={!!errors.email}
          size="md"
          isDisabled={false}
          isReadOnly={false}
          isRequired={false}
          className="mb-1"
        >
          <FormControlLabel>
            <FormControlLabelText className="font-bold leading-5 text-foreground">
              Email Address
            </FormControlLabelText>
          </FormControlLabel>
          <Input className="my-3.5">
            <InputSlot className="ml-1">
              <InputIcon className="!w-6 !h-6" as={MailIcon} />
            </InputSlot>
            <InputField
              type="text"
              placeholder="Enter Email Address"
              value={formData?.email}
              onChangeText={(text) => validateField("email", text)}
            />
          </Input>
          <FormControlError>
            <FormControlErrorText>{errors?.email}</FormControlErrorText>
          </FormControlError>
        </FormControl>

        <FormControl
          isInvalid={!!errors.password}
          size="md"
          isDisabled={false}
          isReadOnly={false}
          isRequired={false}
        >
          <FormControlLabel>
            <FormControlLabelText className="font-bold leading-5">
              Password
            </FormControlLabelText>
          </FormControlLabel>
          <Input className="my-3.5">
            <InputSlot className="ml-1">
              <InputIcon className="!w-6 !h-6" as={LockIcon} />
            </InputSlot>
            <InputField
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={formData?.password}
              onChangeText={(text) => validateField("password", text)}
            />
            <InputSlot
              className="mr-1"
              onPress={() => setShowPassword(!showPassword)}
            >
              <InputIcon
                as={showPassword ? EyeIcon : EyeOffIcon}
                color="#EE8427"
              />
            </InputSlot>
          </Input>
          <FormControlError>
            <FormControlErrorText>{errors?.password}</FormControlErrorText>
          </FormControlError>
        </FormControl>
      </View>

      <View>
        <Button className="mt-2 h-16" action="secondary" onPress={handleSubmit}>
          {!isLoading ? (
            <ButtonText>Let's get you cooking!</ButtonText>
          ) : (
            <ButtonText>
              <Spinner />
            </ButtonText>
          )}
        </Button>
        <TouchableOpacity
          disabled={isNavigating}
          onPress={() => handlePress("/(auth)/forget-password")}
        >
          <Text className="font-bold leading-5 text-center mt-7 text-secondary text-lg">
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mt-auto">
        <Text className="mb-4 font-semibold text-foreground text-lg text-center">
          Or continue with
        </Text>
        <View className="flex flex-row justify-center items-center gap-4">
          <TouchableOpacity
            className="bg-destructive w-14 h-14 justify-center items-center rounded-xl"
            onPress={handleGoogleSignIn}
          >
            <GoogleLogo width={30} height={120} />
          </TouchableOpacity>
          {/* <TouchableOpacity className="bg-[#1E76D6] w-14 h-14 justify-center items-center rounded-xl">
            <FacebookLogo width={30} height={120} />
          </TouchableOpacity> */}
          {Platform.OS === "ios" && (
            <TouchableOpacity
              className="bg-black w-14 h-14 justify-center items-center rounded-xl"
              onPress={handleSignApple}
            >
              <AppleLogo width={30} height={120} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default Login;
