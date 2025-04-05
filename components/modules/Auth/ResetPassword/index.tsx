import React, { useState } from "react";

import { Text, TouchableOpacity, View } from "react-native";

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

import Svg1 from "@/assets/svgs/arrow-left.svg";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const validateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));

    let errorMessage = "";

    console.log(formData?.password);

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

  const isFormValid = !errors.password && !errors.confirmPassword;
  const handleSubmit = () => {
    if (!isFormValid) {
      console.log("not valid");
      return;
    }

    console.log("valid");
  };

  return (
    <View className="flex flex-col w-full h-full px-9 py-16">
      <View className="flex flex-row justify-between items-center mb-14">
        <TouchableOpacity>
          <Svg1 width={23} height={23} />
        </TouchableOpacity>
        <Text className="block font-bold text-2xl">Reset Password</Text>
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
              <InputIcon className="!w-6 !h-6 text-primary" as={LockIcon} />
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
              <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
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
              <InputIcon className="!w-6 !h-6 text-primary" as={LockIcon} />
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
              <InputIcon as={showConfirmPassword ? EyeIcon : EyeOffIcon} />
            </InputSlot>
          </Input>
          <FormControlError>
            <FormControlErrorText>
              {errors?.confirmPassword}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>
      </View>
      <Button className="mt-2" action="primary" onPress={handleSubmit}>
        <ButtonText>Reset</ButtonText>
      </Button>
    </View>
  );
};

export default ResetPassword;
