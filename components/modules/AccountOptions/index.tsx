import React, { useState } from "react";

import { router } from "expo-router";

import { Text, TouchableOpacity, View } from "react-native";

import { Button, ButtonText } from "@/components/ui/button";

import AccountOption from "@/assets/svgs/account-option.svg";

const AccountsOptions = () => {
  const [isNavigating, setIsNavigating] = useState(false);

  const handlePress = (route: string) => {
    if (isNavigating) return;

    setIsNavigating(true);
    router.push(route as any);

    setTimeout(() => setIsNavigating(false), 1000);
  };

  return (
    <View className="bg-background w-full h-full flex flex-col px-6 pb-8">
      <View className="flex-grow flex items-center justify-center pt-20">
        <AccountOption />
      </View>

      <View className="mt-auto w-full">
        <View className="mb-6">
          <Text className="text-foreground text-center text-3xl font-semibold leading-10">
            Discover the joy of cooking at home!
          </Text>
        </View>

        <View className="w-full">
          <Button
            onPress={() => handlePress("/(auth)/login")}
            disabled={isNavigating}
            action="secondary"
            className="h-16"
          >
            <ButtonText className="text-white">Get Started</ButtonText>
          </Button>

          <TouchableOpacity
            onPress={() => handlePress("/(auth)/signup")}
            disabled={isNavigating}
          >
            <Text className="text-lg text-center font-bold text-secondary mb-12 mt-6">
              Create New Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AccountsOptions;
