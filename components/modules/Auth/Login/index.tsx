import React, { useState } from "react";

import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

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

import Svg2 from "@/assets/svgs/google.svg";
import Svg3 from "@/assets/svgs/apple-14.svg";
import { LoginResponseTypes } from "@/lib/types";

import { loginUser } from "@/services/authApi";
import { setAuthToken } from "@/lib/apiClient";
import { ArrowLeft } from "lucide-react-native";
import * as WebBrowser from "expo-web-browser";
import { useAuth, useSSO } from "@clerk/clerk-expo";
import { SignedIn, useClerk } from "@clerk/clerk-react";
import { saveToken } from "@/redux/store/expoStore";
WebBrowser.maybeCompleteAuthSession();

const Login = () => {
  const { startSSOFlow } = useSSO();
  const { signOut } = useClerk();
  const { isSignedIn } = useAuth();

  const scheme = useColorScheme();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({ email: "", password: "" });

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

      setAuthToken(response.access);

      if (response.access) {
        await saveToken(response.access);
      }
      dispatch(setCredentials({ ...response, isAuthenticated: true }));
      Toast.show({
        type: "success",
        text1: "Login Successful!",
      });
      router.push("/(tabs)/Home");
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
        `${process.env.EXPO_PUBLIC_API_URL}auth/clerk/`,
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
  const handleSignOut = () => {
    signOut();
  };

  return (
    <View className="flex flex-col w-full h-full px-9 py-16">
      <View className="flex flex-row justify-between items-center mb-14">
        <TouchableOpacity
          onPress={() => router.push("/(auth)/account-options")}
        >
          <ArrowLeft
            width={30}
            height={30}
            color={scheme === "dark" ? "#fff" : "#000"}
          />
        </TouchableOpacity>
        <Text className="block font-bold text-2xl text-foreground">Login</Text>
        <Text></Text>
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
              <InputIcon className="!w-6 !h-6 text-primary" as={MailIcon} />
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
              <InputIcon className="!w-6 !h-6 text-primary" as={LockIcon} />
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
              <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
            </InputSlot>
          </Input>
          <FormControlError>
            <FormControlErrorText>{errors?.password}</FormControlErrorText>
          </FormControlError>
        </FormControl>
      </View>
      <Button className="mt-2" action="primary" onPress={handleSubmit}>
        {!isLoading ? (
          <ButtonText>Login</ButtonText>
        ) : (
          <ButtonText>
            <Spinner />
          </ButtonText>
        )}
      </Button>
      <TouchableOpacity onPress={() => router.push("/(auth)/forget-password")}>
        <Text className="font-bold leading-5 text-center mt-7 text-primary">
          Forgot Password?
        </Text>
      </TouchableOpacity>
      <View className="mt-auto">
        <Text className="mb-5 text-center text-muted">or continue with</Text>
        <Button
          onPress={() => handleSignIn()}
          action="negative"
          className="mb-5"
        >
          <Svg2 width={20} height={20} />
          <ButtonText>Login with Google</ButtonText>
        </Button>
        <Button
          action="negative"
          onPress={() => handleSignApple()}
          className="bg-gray-500"
        >
          <Svg3 width={20} height={20} color="#fff" />
          <ButtonText>Login with Apple</ButtonText>
        </Button>
      </View>
    </View>
  );
};

export default Login;
