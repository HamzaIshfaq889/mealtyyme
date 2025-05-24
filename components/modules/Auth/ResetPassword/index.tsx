import React, { useState } from "react";

import { Text, View } from "react-native";

import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";

import { useDispatch, useSelector } from "react-redux";

import { resetPassword } from "@/services/authApi";

import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon, LockIcon } from "@/components/ui/icon";

import { Spinner } from "@/components/ui/spinner";

import Svg1 from "@/assets/svgs/arrow-left.svg";
import { clearResetToken } from "@/redux/slices/Auth";

import Toast from "react-native-toast-message";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const resetToken = useSelector((state: any) => state.auth["reset-token"]);
  const { email } = useLocalSearchParams<{ email: string }>();

  const validateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));

    let errorMessage = "";

    // Validation rules for each field
    switch (key) {
      case "password":
        if (!value) {
          errorMessage = "Password is required.";
        } else if (value.length < 6) {
          errorMessage = "Password must be at least 6 characters";
        }
        break;

      case "confirmPassword":
        if (!value) {
          errorMessage = "Confirm password is required.";
        } else if (value !== formData.password) {
          errorMessage = "Password does not match.";
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
    !errors.password &&
    !errors.confirmPassword &&
    formData.password &&
    formData.confirmPassword;
  const handleSubmit = async () => {
    setIsLoading(true);

    validateAllFields();
    if (!isFormValid) {
      console.log("not valid");
      setIsLoading(false);
      return;
    }

    const payload = {
      email: email,
      reset_token: resetToken,
      new_password: formData.confirmPassword,
    };

    try {
      await resetPassword(payload);

      dispatch(clearResetToken());

      Toast.show({
        type: "success",
        text1: "Password reset successfully!",
      });
      router.push("/(auth)/login");
    } catch (error: any) {
      const errorMessage =
        error.message || "Something went wrong. Please try again.";

      Toast.show({
        type: "error",
        text1: errorMessage,
      });
      console.log("Reset Password Error:", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex flex-col w-full h-full px-9 pt-16 pb-6 bg-background">
      <View className="flex flex-row justify-between items-center mb-14">
        <Text></Text>
        <Text className="block font-bold text-2xl text-primary">
          Reset Password
        </Text>
        <Text></Text>
      </View>

      <View>
        <FormControl
          isInvalid={!!errors.password}
          size="md"
          isDisabled={false}
          isReadOnly={false}
          isRequired={false}
          className="mb-1"
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
              placeholder="Enter New Password"
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

        <FormControl
          isInvalid={!!errors.confirmPassword}
          size="md"
          isDisabled={false}
          isReadOnly={false}
          isRequired={false}
        >
          <FormControlLabel>
            <FormControlLabelText className="font-bold leading-5">
              Confirm Password
            </FormControlLabelText>
          </FormControlLabel>
          <Input className="my-3.5">
            <InputSlot className="ml-1">
              <InputIcon className="!w-6 !h-6" as={LockIcon} />
            </InputSlot>
            <InputField
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Enter Confirm Password"
              value={formData?.confirmPassword}
              onChangeText={(text) => validateField("confirmPassword", text)}
            />
            <InputSlot
              className="mr-1"
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <InputIcon
                as={showConfirmPassword ? EyeIcon : EyeOffIcon}
                color="#EE8427"
              />
            </InputSlot>
          </Input>
          <FormControlError>
            <FormControlErrorText>
              {errors?.confirmPassword}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>
      </View>
      <Button
        className="mt-auto h-16"
        action="secondary"
        onPress={handleSubmit}
      >
        {!isLoading ? (
          <ButtonText>Reset</ButtonText>
        ) : (
          <ButtonText>
            <Spinner />
          </ButtonText>
        )}
      </Button>
    </View>
  );
};

export default ResetPassword;
