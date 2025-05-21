import React, { useState, useRef } from "react";
import {
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useDispatch } from "react-redux";
import { setResetToken } from "@/redux/slices/Auth";

import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Button, ButtonText } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import Toast from "react-native-toast-message";
import { verifyOtp } from "@/services/authApi";

// OTP Input Component
const OtpInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => {
  const scheme = useColorScheme();
  const inputRefs = useRef<TextInput[]>([]);
  const length = 6;

  const handleChange = (text: string, index: number) => {
    const digitsOnly = text.replace(/[^0-9]/g, "").slice(0, 1);
    const otpChars = value.split("");
    otpChars[index] = digitsOnly;
    const updatedOtp = otpChars.join("");
    onChange(updatedOtp);

    if (digitsOnly && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.otpContainer}>
      {[...Array(length)].map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            if (ref) inputRefs.current[index] = ref;
          }}
          value={value[index] || ""}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="numeric"
          maxLength={1}
          style={[
            styles.otpInput,
            {
              color: scheme === "dark" ? "#fff" : "#000",
              borderColor: scheme === "dark" ? "#444" : "#ccc",
              backgroundColor: scheme === "dark" ? "#1c1c1e" : "#f2f2f2",
            },
          ]}
        />
      ))}
    </View>
  );
};

const Otp = () => {
  const scheme = useColorScheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({ otp: "" });

  const { email } = useLocalSearchParams<{ email: string }>();

  const validateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    let errorMessage = "";

    if (key === "otp") {
      if (!value) {
        errorMessage = "Otp is required.";
      } else if (value.length !== 6) {
        errorMessage = "Please enter 6 digit otp.";
      }
    }

    setErrors((prev) => ({ ...prev, [key]: errorMessage }));
  };

  const isFormValid = !errors?.otp && formData?.otp;

  const validateAllFields = () => {
    validateField("otp", formData.otp);
  };

  const handleSubmit = async () => {
    setLoading(true);
    validateAllFields();

    if (!isFormValid) {
      setLoading(false);
      return;
    }

    const payload = {
      email: email,
      otp: Number(formData?.otp),
    };

    try {
      const response = await verifyOtp(payload);
      dispatch(setResetToken(response.reset_token));

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="w-full h-full px-9 pt-16 pb-6 flex flex-col relative">
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

        <View style={{ width: 30 }} />
      </View>

      <FormControl isInvalid={!!errors.otp} size="md" className="mb-1">
        <FormControlLabel>
          <FormControlLabelText className="text-primary/70 text-lg font-medium leading-6 mb-2">
            Enter the 6-digit code sent to your email{" "}
            <Text className="text-secondary">{email}</Text>
          </FormControlLabelText>
        </FormControlLabel>

        <OtpInput
          value={formData.otp}
          onChange={(val) => validateField("otp", val)}
        />

        <FormControlError>
          <FormControlErrorText>{errors?.otp}</FormControlErrorText>
        </FormControlError>
      </FormControl>

      <Button className="h-16 mt-auto" action="secondary" onPress={handleSubmit}>
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

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 14,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderRadius: 10,
    borderWidth: 1,
    textAlign: "center",
    fontSize: 20,
  },
});

export default Otp;
