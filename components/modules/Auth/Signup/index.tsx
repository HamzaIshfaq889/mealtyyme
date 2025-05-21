import React, { useState } from "react";

import DateTimePicker from "@react-native-community/datetimepicker";
import { TouchableOpacity, View, Pressable } from "react-native";
import { ArrowLeft, UserRound } from "lucide-react-native";
import { Text } from "react-native";
import { useColorScheme, Platform } from "react-native";
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
import { formatDateToYYYYMMDD } from "@/utils";
import { useAuth, useSSO } from "@clerk/clerk-expo";
import { setCredentials, setIsSigningIn } from "@/redux/slices/Auth";
import { setAuthToken } from "@/lib/apiClient";
import { saveUserDataInStorage } from "@/utils/storage/authStorage";
import { AppConfig } from "@/constants";
import { useDispatch } from "react-redux";

import GoogleLogo from "@/assets/svgs/google-logo.svg";
import FacebookLogo from "@/assets/svgs/facebook-logo.svg";
import AppleLogo from "@/assets/svgs/apple-logo.svg";

const Signup = () => {
  const scheme = useColorScheme();
  const dispatch = useDispatch();

  const { startSSOFlow } = useSSO();
  const { isSignedIn } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showdatePicker, setShowdatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();
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

  const confirmDateOnIOS = () => {
    formData.dateOfBirth = date.toDateString();
    toggleDatePicker();
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
      role: "CUSTOMER",
      dob: formatDateToYYYYMMDD(formData?.dateOfBirth),
      first_name: formData?.firstName,
      last_name: formData?.lastName,
    };

    console.log(payload);

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

  //third party signup logic

  const handleGoogleSignIn = async () => {
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

        const data = await sendSessionIdToBackend(createdSessionId);
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

        const data = await sendSessionIdToBackend(createdSessionId);
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

      const response = await fetch(`${AppConfig.API_URL}auth/clerk/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: sessionId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAuthToken(data.access);
        dispatch(setCredentials({ ...data, isAuthenticated: true }));
        if (data.access) {
          await saveUserDataInStorage({ ...data, isAuthenticated: true });
        }

        const isFirstTimeUser = data?.customer_details?.first_time_user;
        if (isFirstTimeUser) {
          router.replace("/(protected)/(tabs)");
        } else {
          router.replace("/(protected)/(tabs)");
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

  return (
    <ScrollView>
      <View className="flex flex-col w-full h-full px-9 pt-16 pb-6 bg-background">
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
          <Text className="block font-bold text-2xl text-foreground">
            Create Account
          </Text>
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
            <Input className="my-3.5 flex flex-row items-center">
              <InputSlot className="ml-1">
                <InputIcon className="!w-6 !h-6 " as={UserRound} />
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
          <View className="w-full flex flex-row gap-2">
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
              <Input className="my-3.5 flex flex-row items-center">
                <InputSlot className="ml-1">
                  <InputIcon className="!w-6 !h-6" as={UserRound} />
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
              <Input className="my-3.5 flex flex-row items-center">
                <InputSlot className="ml-1">
                  <InputIcon className="!w-6 !h-6" as={UserRound} />
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
            <Input className="my-3.5 flex flex-row items-center">
              <InputSlot className="ml-1">
                <InputIcon className="!w-6 !h-6" as={MailIcon} />
              </InputSlot>
              <InputField
                type="text"
                placeholder="Enter Email Address"
                value={formData?.email}
                size="2xl"
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
                <Input className="my-3.5 flex flex-row items-center">
                  <InputSlot className="ml-1">
                    <InputIcon className="!w-6 !h-6" as={MailIcon} />
                  </InputSlot>

                  <InputField
                    type="text"
                    placeholder="Enter Date of Birth"
                    value={formData?.dateOfBirth}
                    editable={false}
                    onPressIn={toggleDatePicker}
                  />
                </Input>
              </Pressable>
            )}

            {showdatePicker && (
              <DateTimePicker
                mode="date"
                display="spinner"
                value={date}
                onChange={onChange}
                themeVariant="light"
              />
            )}

            {showdatePicker && Platform.OS === "ios" && (
              <View className="flex flex-row mt-2 mb-4 mx-auto gap-2">
                <TouchableOpacity
                  className="py-3 px-6 bg-[#CCD4DE] rounded-xl w-32 items-center"
                  onPress={toggleDatePicker}
                >
                  <Text className="text-foreground">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-3 px-6 bg-secondary rounded-xl w-32 items-center"
                  onPress={confirmDateOnIOS}
                >
                  <Text className="text-background">Select</Text>
                </TouchableOpacity>
              </View>
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
            <Input className="my-3.5 flex flex-row items-center">
              <InputSlot className="ml-1">
                <InputIcon className="!w-6 !h-6" as={LockIcon} />
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
            className="mt-2 h-16"
            action="secondary"
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
          <View className="flex flex-col mt-10 mb-12">
            <Text className="text-center text-sm leading-6 text-foreground/75">
              By continuing, you agree to the
            </Text>
            <Text className="text-center text-foreground">
              <Text className="text-foreground font-extrabold">
                Terms of Services
              </Text>
              {` & `}
              <Text className="text-foreground font-extrabold">
                Privacy Policy
              </Text>
            </Text>
          </View>
          <View>
            <Text className="mb-4 font-semibold text-foreground text-lg text-center">
              Or continue with
            </Text>
            <View className="flex flex-row justify-center items-center gap-4">
              <TouchableOpacity
                className="bg-destructive w-14 h-14 justify-center items-center rounded-xl"
                onPress={handleGoogleSignIn}
              >
                <GoogleLogo width={30} height={120} />
              </TouchableOpacity>
              {/* <TouchableOpacity className="bg-[#1E76D6] w-14 h-14 justify-center items-center rounded-xl">
            <FacebookLogo width={30} height={120} />
          </TouchableOpacity> */}
              {Platform.OS === "ios" && (
                <TouchableOpacity
                  className="bg-black w-14 h-14 justify-center items-center rounded-xl"
                  onPress={handleSignApple}
                >
                  <AppleLogo width={30} height={120} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Signup;
