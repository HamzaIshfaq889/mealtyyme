import React, { useState } from "react";

import DateTimPicker from "@react-native-community/datetimepicker";
import { TouchableOpacity, View, Pressable, Platform } from "react-native";
import { UserRound } from "lucide-react-native";
import { Text } from "react-native";

import { router } from "expo-router";

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
import { Spinner } from "@/components/ui/spinner";

import { signupUser } from "@/services/authApi";

import Svg1 from "@/assets/svgs/arrow-left.svg";

import Toast from "react-native-toast-message";
import { ScrollView } from "react-native-gesture-handler";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showdatePicker, setShowdatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dateOfBirth: "",
  });

  const toggleDatePicker = () => {
    setShowdatePicker((prev) => !prev);
  };

  const onChange = ({ type }: any, date: Date | undefined) => {
    if (type === "set" && date) {
      const currentDate = date;
      setDate(currentDate);

      if (Platform.OS === "android") {
        toggleDatePicker();

        const dateString = currentDate.toDateString();
        formData.dateOfBirth = dateString;

        validateField("dateOfBirth", dateString);
      }
    } else {
      toggleDatePicker();
    }
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

      case "dateOfBirth":
        if (!value) {
          errorMessage = "Date of Birth required.";
        } else if (value.length < 3) {
          errorMessage = "Date of Birth must be of 3 letters.";
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
    formData?.username &&
    formData?.firstName &&
    formData?.lastName &&
    formData?.email &&
    formData?.password &&
    // formData?.dateOfBirth &&
    !errors.email &&
    !errors.password &&
    !errors?.username &&
    !errors?.firstName &&
    !errors?.lastName;

  const handleSubmit = async () => {
    setIsLoading(true);

    validateAllFields();
    if (!isFormValid) {
      console.log("Form not valid");
      setIsLoading(false);
      return;
    }

    const payload = {
      email: formData?.email,
      password: formData?.password,
      role: "user",
      // dob: formData?.dateOfBirth,
      dob: "1999-07-19",
      first_name: formData?.firstName,
      last_name: formData?.lastName,
    };

    try {
      await signupUser(payload);

      console.log("Signup successful");
      Toast.show({
        type: "success",
        text1: "Signup Successful!",
      });
      router.push("/(auth)/login");
    } catch (error: any) {
      const errorMessage =
        error.message || "Something went wrong. Please try again.";

      Toast.show({
        type: "error",
        text1: errorMessage,
      });
      console.log("Signup Error:", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView>
      <View className="flex flex-col w-full h-full px-9 py-16">
        <View className="flex flex-row justify-between items-center mb-14">
          <TouchableOpacity
            onPress={() => router.push("/(auth)/account-options")}
          >
            <Svg1 width={23} height={23} />
          </TouchableOpacity>
          <Text className="block font-bold text-2xl">Create Account</Text>
          <Text></Text>
        </View>
        <View>
          <FormControl
            size="md"
            className="mb-1"
            isInvalid={!!errors?.username}
          >
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
                  <InputIcon
                    className="!w-6 !h-6 text-primary"
                    as={UserRound}
                  />
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
                  <InputIcon
                    className="!w-6 !h-6 text-primary"
                    as={UserRound}
                  />
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

          <FormControl
            size="md"
            className="mb-1"
            isInvalid={!!errors?.dateOfBirth}
          >
            <FormControlLabel>
              <FormControlLabelText className="font-bold leading-5">
                Date of Birth
              </FormControlLabelText>
            </FormControlLabel>

            {!showdatePicker && (
              <Pressable onPress={toggleDatePicker}>
                <Input className="my-3.5">
                  <InputSlot className="ml-1">
                    <InputIcon
                      className="!w-6 !h-6 text-primary"
                      as={MailIcon}
                    />
                  </InputSlot>

                  <InputField
                    type="text"
                    placeholder="Enter Date of Birth"
                    value={formData?.dateOfBirth}
                    editable={false}
                  />
                </Input>
              </Pressable>
            )}

            {showdatePicker && (
              <DateTimPicker
                mode="date"
                display="spinner"
                value={date}
                onChange={onChange}
              />
            )}
            <FormControlError>
              <FormControlErrorText>{errors?.dateOfBirth}</FormControlErrorText>
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

          <Button
            className="mt-2"
            action="primary"
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {!isLoading ? (
              <ButtonText>Continue</ButtonText>
            ) : (
              <ButtonText>
                <Spinner />
              </ButtonText>
            )}
          </Button>
          <View className="flex flex-col mt-10">
            <Text className="text-center text-sm leading-6 text-primary/75">
              By continuing, you agree to the
            </Text>
            <Text className="text-center">
              <Text className="text-foreground font-extrabold">
                Terms of Services
              </Text>
              {` & `}
              <Text className="text-foreground font-extrabold">
                Privacy Policy
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Signup;
