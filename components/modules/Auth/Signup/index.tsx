import React, { useState } from "react";

import { UserRound } from "lucide-react-native";

import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native";

import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Button, ButtonText } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";

import Svg1 from "@/assets/svgs/arrow-left.svg";
import { router } from "expo-router";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

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

      case "username":
        if (!value) {
          errorMessage = "User Name is required.";
        } else if (value.length < 3) {
          errorMessage = "User Name must be of 3 letters.";
        }
        break;

      case "firstName":
        if (!value) {
          errorMessage = "First Name is required.";
        } else if (value.length < 3) {
          errorMessage = "First Name must be of 3 letters.";
        }
        break;

      case "lastName":
        if (!value) {
          errorMessage = "Last Name required.";
        } else if (value.length < 3) {
          errorMessage = "Last Name must be of 3 letters.";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [key]: errorMessage }));
  };

  const isFormValid =
    !errors.email &&
    !errors.password &&
    !errors?.username &&
    !errors?.firstName &&
    !errors?.lastName;

  const handleSubmit = () => {
    if (!isFormValid) {
      console.log("Not valid");
      return;
    }
    console.log("formValid");
  };

  return (
    <View className="flex flex-col w-full h-full px-9 py-16">
      <View className="flex flex-row justify-between items-center mb-14">
        <TouchableOpacity onPress={() => router.push("account-options")}>
          <Svg1 width={23} height={23} />
        </TouchableOpacity>
        <Text className="block font-bold text-2xl">Create Account</Text>
        <Text></Text>
      </View>
      <View>
        <FormControl size="md" className="mb-1" isInvalid={!!errors?.username}>
          <FormControlLabel>
            <FormControlLabelText className="font-bold leading-5">
              Username
            </FormControlLabelText>
          </FormControlLabel>
          <Input className="my-3.5">
            <InputSlot className="ml-1">
              <InputIcon className="!w-6 !h-6 text-primary" as={UserRound} />
            </InputSlot>
            <InputField
              type="text"
              placeholder="Username"
              value={formData?.username}
              onChangeText={(text) => validateField("username", text)}
            />
          </Input>
          <FormControlError>
            <FormControlErrorText>{errors?.username}</FormControlErrorText>
          </FormControlError>
        </FormControl>
        <View className="w-full flex flex-row gap-6">
          <FormControl
            size="md"
            className="mb-1 basis-1/2"
            isInvalid={!!errors?.firstName}
          >
            <FormControlLabel>
              <FormControlLabelText className="font-bold leading-5">
                First Name
              </FormControlLabelText>
            </FormControlLabel>
            <Input className="my-3.5">
              <InputSlot className="ml-1">
                <InputIcon className="!w-6 !h-6 text-primary" as={UserRound} />
              </InputSlot>
              <InputField
                type="text"
                placeholder="First Name"
                value={formData?.firstName}
                onChangeText={(text) => validateField("firstName", text)}
              />
            </Input>
            <FormControlError>
              <FormControlErrorText>{errors?.firstName}</FormControlErrorText>
            </FormControlError>
          </FormControl>
          <FormControl
            size="md"
            className="mb-1 basis-1/2"
            isInvalid={!!errors?.lastName}
          >
            <FormControlLabel>
              <FormControlLabelText className="font-bold leading-5">
                Last Name
              </FormControlLabelText>
            </FormControlLabel>
            <Input className="my-3.5">
              <InputSlot className="ml-1">
                <InputIcon className="!w-6 !h-6 text-primary" as={UserRound} />
              </InputSlot>
              <InputField
                type="text"
                placeholder="Last Name"
                value={formData?.lastName}
                onChangeText={(text) => validateField("lastName", text)}
              />
            </Input>
            <FormControlError>
              <FormControlErrorText>{errors?.lastName}</FormControlErrorText>
            </FormControlError>
          </FormControl>
        </View>

        <FormControl size="md" className="mb-1" isInvalid={!!errors?.email}>
          <FormControlLabel>
            <FormControlLabelText className="font-bold leading-5">
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

        <FormControl size="md" isInvalid={!!errors?.password}>
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

        <Button className="mt-2" action="primary" onPress={handleSubmit}>
          <ButtonText>Continue</ButtonText>
        </Button>
        <View className="flex flex-col mt-10">
          <Text className="text-center text-sm leading-6 text-primary/75">
            By continuing, you agree to the
          </Text>
          <Text className="text-center">
            <Text className="text-accent-foreground font-extrabold">
              Terms of Services
            </Text>
            {` & `}
            <Text className="text-accent-foreground font-extrabold">
              Privacy Policy
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Signup;
