import React, { useState } from "react";

import { Text, useColorScheme } from "react-native";
import { TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";

import { ArrowLeft, RectangleEllipsis } from "lucide-react-native";

import { useDispatch } from "react-redux";
import { setResetToken } from "@/redux/slices/Auth";

import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";

import { verifyOtp } from "@/services/authApi";

import Svg1 from "@/assets/svgs/arrow-left.svg";
import { Button, ButtonText } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import Toast from "react-native-toast-message";

const Otp = () => {
  const scheme = useColorScheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({ otp: "" });

  const { email } = useLocalSearchParams<{ email: string }>();

  const validateAllFields = () => {
    const fieldsToValidate = {
      ...formData,
    };

    Object.entries(fieldsToValidate).forEach(([key, value]) => {
      validateField(key, value);
    });
  };

  const validateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));

    let errorMessage = "";

    // Validation rules for each field
    switch (key) {
      case "otp":
        if (!value) {
          errorMessage = "Otp is required.";
        } else if (value.length !== 6) {
          errorMessage = "Please enter 6 digit otp.";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [key]: errorMessage }));
  };

  const isFormValid = !errors?.otp && formData?.otp;

  const handleSubmit = async () => {
    setLoading(true);

    validateAllFields();
    if (!isFormValid) {
      console.log("not valid");
      setLoading(false);
      return;
    }

    const payload = {
      email: email,
      otp: Number(formData?.otp),
    };

    console.log("payload", payload);

    try {
      const response = await verifyOtp(payload);
      const reset_token = response.reset_token;

      dispatch(setResetToken(reset_token));

      Toast.show({
        type: "success",
        text1: "Please reset your password",
      });
      router.push(`/(auth)/reset-password?email=${email}`);
    } catch (error: any) {
      const errorMessage =
        error.message || "Something went wrong. Please try again.";

      Toast.show({
        type: "error",
        text1: errorMessage,
      });

      console.log("Otp Error:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="w-full h-full px-9 py-16 flex-col relative">
      {/* Header row */}
      <View className="flex-row items-center justify-between mb-8">
        <TouchableOpacity
          onPress={() => router.push("/(auth)/forget-password")}
        >
          <ArrowLeft
            width={30}
            height={30}
            color={scheme === "dark" ? "#fff" : "#000"}
          />
        </TouchableOpacity>

        <View className="flex-1 items-center">
          <Text className="font-bold text-2xl text-primary">OTP</Text>
        </View>

        {/* Invisible View to balance layout */}
        <View style={{ width: 30 }} />
      </View>
      <View>
        <FormControl isInvalid={!!errors.otp} size="md" className="mb-1">
          <FormControlLabel>
            <FormControlLabelText className="font-bold leading-5">
              Otp
            </FormControlLabelText>
          </FormControlLabel>
          <Input className="my-3.5">
            <InputSlot className="ml-1">
              <InputIcon
                className="!w-6 !h-6 text-primary"
                as={RectangleEllipsis}
              />
            </InputSlot>
            <InputField
              type="text"
              placeholder="Enter Otp"
              value={formData?.otp}
              onChangeText={(text) => validateField("otp", text)}
            />
          </Input>
          <FormControlError>
            <FormControlErrorText>{errors?.otp}</FormControlErrorText>
          </FormControlError>
        </FormControl>
      </View>
      <Button className="mt-2" action="primary" onPress={handleSubmit}>
        {!loading ? (
          <ButtonText>Confirm</ButtonText>
        ) : (
          <ButtonText>
            <Spinner />
          </ButtonText>
        )}
      </Button>
    </View>
  );
};

export default Otp;
