import React, { useState } from "react";

import { Text, TouchableOpacity, View } from "react-native";

import Toast from "react-native-toast-message";

import { router } from "expo-router";

import { useDispatch } from "react-redux";

import { setCredentials } from "@/redux/slices/Auth";

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

import Svg1 from "@/assets/svgs/arrow-left.svg";
import Svg2 from "@/assets/svgs/google.svg";
import Svg3 from "@/assets/svgs/facebook.svg";
import { LoginResponseTypes } from "@/lib/types";

import { loginUser } from "@/services/authApi";

const Login = () => {
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

  return (
    <View className="flex flex-col w-full h-full px-9 py-16">
      <View className="flex flex-row justify-between items-center mb-14">
        <TouchableOpacity
          onPress={() => router.push("/(auth)/account-options")}
        >
          <Svg1 width={23} height={23} />
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
        <Text className="font-bold leading-5 text-center mt-7">
          Forgot Password?
        </Text>
      </TouchableOpacity>
      <View className="mt-auto">
        <Text className="mb-5 text-center text-muted">or continue with</Text>
        <Button action="negative" className="mb-5">
          <Svg2 width={20} height={20} />
          <ButtonText>Login with Google</ButtonText>
        </Button>
        <Button action="negative" className="bg-[#1E76D6]">
          <Svg3 width={20} height={20} />
          <ButtonText>Login with Facebbok</ButtonText>
        </Button>
      </View>
    </View>
  );
};

export default Login;
