import React from "react";

import { Text, View, useColorScheme } from "react-native";
import { CircleAlert } from "lucide-react-native";

import { router } from "expo-router";

import { Button, ButtonText } from "@/components/ui/button";

type ErrorProps = {
  errorMessage: string;
  errorButtonText?: string;
  errorButtonLink?: string;
};

const Error = ({
  errorButtonLink,
  errorButtonText,
  errorMessage,
}: ErrorProps) => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";
  return (
    <View className="flex justify-center items-center w-full h-full px-10 mt-10">
      <CircleAlert size={70} color={isDarkMode ? "#fff" : "#000"} />
      <Text className="text-primary text-3xl text-center font-semibold my-6">
        {errorMessage}
      </Text>
      {errorButtonText && errorButtonLink && (
        <Button
          className="w-full"
          onPress={() => router.push(errorButtonLink as any)}
        >
          <ButtonText>{errorButtonText}</ButtonText>
        </Button>
      )}
    </View>
  );
};

export default Error;
