import React, { useState } from "react";

import { Text } from "react-native";
import { TouchableOpacity, View } from "react-native";

import { RectangleEllipsis } from "lucide-react-native";

import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";

import Svg1 from "@/assets/svgs/arrow-left.svg";
import { Button, ButtonText } from "@/components/ui/button";
import { router } from "expo-router";

const Otp = () => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({ otp: "" });

  const validateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));

    let errorMessage = "";

    // Validation rules for each field
    switch (key) {
      case "otp":
        if (!value) {
          errorMessage = "Otp is required.";
        } else if (value.length !== 5) {
          errorMessage = "Please enter 5 digit otp.";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [key]: errorMessage }));
  };

  const isFormValid = !errors?.otp;

  const handleSubmit = () => {
    if (!isFormValid) {
      console.log("not valid");
      return;
    }
    router.push("reset-password");
    console.log("valid");
  };

  return (
    <View className="flex flex-col w-full h-full px-9 py-16">
      <View className="flex flex-row justify-between items-center mb-14">
        <TouchableOpacity onPress={() => router.push("forget-password")}>
          <Svg1 width={23} height={23} />
        </TouchableOpacity>
        <Text className="block font-bold text-2xl">Otp</Text>
        <Text></Text>
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
        <ButtonText>Confirm</ButtonText>
      </Button>
    </View>
  );
};

export default Otp;
