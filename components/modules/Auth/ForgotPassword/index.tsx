import React, { useState } from "react";

import { TouchableOpacity, useColorScheme } from "react-native";
import { Text, View } from "react-native";

import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { MailIcon } from "@/components/ui/icon";
import { Button, ButtonText } from "@/components/ui/button";

import { forgotPassword } from "@/services/authApi";

import { router } from "expo-router";
import { Spinner } from "@/components/ui/spinner";

import Toast from "react-native-toast-message";
import { ArrowLeft } from "lucide-react-native";

const ForgotPassword = () => {
  const scheme = useColorScheme();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({ email: "" });

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

  const isFormValid = !errors?.email && formData?.email;
  const handleSubmit = async () => {
    setIsLoading(true);

    validateAllFields();
    if (!isFormValid) {
      console.log("Form Not valid");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        email: formData?.email,
      };

      await forgotPassword(payload);

      Toast.show({
        type: "success",
        text1: "Reset code sent to your email!",
      });
      router.push(`/(auth)/otp?email=${formData.email}`);
    } catch (error: any) {
      const errorMessage =
        error.message || "Something went wrong. Please try again.";

      Toast.show({
        type: "error",
        text1: errorMessage,
      });
      console.log("Forget Password Error:", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="w-full h-full px-9 pt-16 pb-12 flex-col relative bg-background">
      {/* Header row */}
      <View className="flex-row items-center justify-between mb-6">
        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
          <ArrowLeft
            width={30}
            height={30}
            color={scheme === "dark" ? "#fff" : "#000"}
          />
        </TouchableOpacity>

        <View className="flex-1 items-center">
          <Text className="font-bold text-2xl text-primary">
            Forgot Password
          </Text>
        </View>

        {/* Invisible View to balance layout */}
        <View style={{ width: 30 }} />
      </View>
      <View>
        <Text className="text-primary/70 text-lg font-medium leading-6 mb-6">
          Enter your email and we will send you a link to reset your password.
        </Text>
        <FormControl isInvalid={!!errors.email} size="md" className="mb-1">
          <FormControlLabel>
            <FormControlLabelText className="font-bold leading-5">
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
      </View>
      <Button
        action="secondary"
        className="mt-auto h-16"
        onPress={handleSubmit}
      >
        {!isLoading ? (
          <ButtonText>Send email</ButtonText>
        ) : (
          <ButtonText>
            <Spinner />
          </ButtonText>
        )}
      </Button>
    </View>
  );
};

export default ForgotPassword;
