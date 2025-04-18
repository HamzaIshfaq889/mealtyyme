import React, { useState } from "react";

import { ArrowLeft, MailIcon, UserRound, UserRoundPen } from "lucide-react-native";

import DateTimPicker from "@react-native-community/datetimepicker";
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Platform } from "react-native";

import { router } from "expo-router";

import Svg1 from "@/assets/svgs/arrow-left.svg";

import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { colorScheme } from "react-native-css-interop";

const EditProfile = () => {
  const scheme = useColorScheme();
  const [date, setDate] = useState(new Date());
  const [showdatePicker, setShowdatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    bio: "",
    instagram: "",
    tiktok: "",
    youtube: "",
    website: "",
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

  const validateAllFields = () => {
    const fieldsToValidate = {
      ...formData,
    };

    Object.entries(fieldsToValidate).forEach(([key, value]) => {
      validateField(key, value);
    });
  };

  const isFormValid =
    formData?.email &&
    formData?.dateOfBirth &&
    formData?.firstName &&
    formData?.lastName &&
    // formData?.dateOfBirth &&
    !errors.email &&
    !errors?.dateOfBirth &&
    !errors?.firstName &&
    !errors?.lastName;

  const handleSubmit = () => {
    validateAllFields();

    if (!isFormValid) {
      console.log("Form not valid");
      return;
    }

    console.log(formData);
  };

  return (
    <ScrollView className="min-w-sceen min-h-scr px-6 py-16">
      <View className="flex flex-row justify-between items-center mb-10">
        <TouchableOpacity onPress={() => router.push("/(tabs)/account")}>
          <ArrowLeft
            width={30}
            height={30}
            color={scheme === "dark" ? "#fff" : "#000"}
          />
        </TouchableOpacity>
        <Text className="block font-bold text-2xl text-foreground">
          Edit profile
        </Text>
        <Text></Text>
      </View>

      <View className="flex items-center justify-center mb-10">
        <View className="bg-gray3 p-16 rounded-full border-2 border-secondary"></View>
      </View>

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

      <FormControl size="md" className="mb-1" isInvalid={!!errors?.dateOfBirth}>
        <FormControlLabel>
          <FormControlLabelText className="font-bold leading-5">
            Date of Birth
          </FormControlLabelText>
        </FormControlLabel>

        {!showdatePicker && (
          <Pressable onPress={toggleDatePicker}>
            <Input className="my-3.5">
              <InputSlot className="ml-1">
                <InputIcon className="!w-6 !h-6 text-primary" as={MailIcon} />
              </InputSlot>

              <InputField
                type="text"
                placeholder="Enter Date of Birth"
                value={formData?.dateOfBirth}
                editable={false}
                onChangeText={(text) => validateField("dateOfBirth", text)}
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

      <FormControl size="md" className="mb-1">
        <FormControlLabel>
          <FormControlLabelText className="font-bold leading-5 items-start">
            Bio
          </FormControlLabelText>
        </FormControlLabel>
        <Textarea className="flex flex-row items-start gap-1 px-3 py-2 my-3.5">
          <View className="mt-3">
            <UserRoundPen color={colorScheme ? "#fff" : "#000"} size={23} />
          </View>
          <TextareaInput
            type="text"
            placeholder="Recipe Developer"
            value={formData?.bio}
            onChangeText={(text) => validateField("bio", text)}
            className="placeholder:text-muted !placeholder:text-base !text-base"
          />
        </Textarea>
      </FormControl>

      <FormControl size="md" className="mb-1">
        <FormControlLabel>
          <FormControlLabelText className="font-bold leading-5">
            Instagram
          </FormControlLabelText>
        </FormControlLabel>
        <Input className="my-3.5">
          <InputSlot className="ml-1">
            <InputIcon className="!w-6 !h-6 text-primary" as={UserRoundPen} />
          </InputSlot>
          <InputField
            type="text"
            placeholder="Instagram Link"
            value={formData?.instagram}
            onChangeText={(text) => validateField("instagram", text)}
          />
        </Input>
      </FormControl>

      <FormControl size="md" className="mb-1">
        <FormControlLabel>
          <FormControlLabelText className="font-bold leading-5">
            Tiktok
          </FormControlLabelText>
        </FormControlLabel>
        <Input className="my-3.5">
          <InputSlot className="ml-1">
            <InputIcon className="!w-6 !h-6 text-primary" as={UserRoundPen} />
          </InputSlot>
          <InputField
            type="text"
            placeholder="Tiktok Profile"
            value={formData?.tiktok}
            onChangeText={(text) => validateField("tiktok", text)}
          />
        </Input>
      </FormControl>

      <FormControl size="md" className="mb-1">
        <FormControlLabel>
          <FormControlLabelText className="font-bold leading-5">
            Youtube
          </FormControlLabelText>
        </FormControlLabel>
        <Input className="my-3.5">
          <InputSlot className="ml-1">
            <InputIcon className="!w-6 !h-6 text-primary" as={UserRoundPen} />
          </InputSlot>
          <InputField
            type="text"
            placeholder="Youtube"
            value={formData?.youtube}
            onChangeText={(text) => validateField("youtube", text)}
          />
        </Input>
      </FormControl>

      <FormControl size="md" className="mb-1">
        <FormControlLabel>
          <FormControlLabelText className="font-bold leading-5">
            Website
          </FormControlLabelText>
        </FormControlLabel>
        <Input className="my-3.5">
          <InputSlot className="ml-1">
            <InputIcon className="!w-6 !h-6 text-primary" as={UserRoundPen} />
          </InputSlot>
          <InputField
            type="text"
            placeholder="Website"
            value={formData?.website}
            onChangeText={(text) => validateField("website", text)}
          />
        </Input>
      </FormControl>

      <Button
        className="mt-2 mb-36 bg-secondary"
        action="primary"
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {!isLoading ? (
          <ButtonText>Update Profile</ButtonText>
        ) : (
          <ButtonText>
            <Spinner />
          </ButtonText>
        )}
      </Button>
    </ScrollView>
  );
};

export default EditProfile;
