import { Button, ButtonText } from "@/components/ui/button";
import React from "react";
import { View, Text } from "react-native";

import NoWifiSvg from "@/assets/svgs/no-wifi.svg";

export default function NoWifiScreen() {
  return (
    <View className="flex-1">
      <View className="flex-1 items-center justify-center px-6">
        <NoWifiSvg />

        <Text className="text-foreground text-2xl font-bold mb-2 mt-8 text-center">
          No Wi-Fi? No worries
        </Text>
        <Text className="text-muted text-base text-center">
          Your saved recipes are ready.
        </Text>
      </View>

      <View className="px-6 mb-8">
        <Button>
          <ButtonText>Try Again</ButtonText>
        </Button>
      </View>
    </View>
  );
}
