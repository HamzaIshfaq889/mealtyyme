import { Button, ButtonText } from "@/components/ui/button";
import React from "react";
import { View, Text, useColorScheme } from "react-native";

import MaintainanceLight from "@/assets/svgs/maintenance-light.svg";
import MaintainanceDark from "@/assets/svgs/maintenance-dark.svg";

export default function MaintenanceScreen() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        {isDarkMode ? <MaintainanceLight /> : <MaintainanceDark />}

        <Text className="text-foreground text-2xl font-bold mb-2 mt-8 text-center">
          Maintenance Mode
        </Text>
        <Text className="text-muted text-base text-center">
          Our server is currently under maintenance
        </Text>
      </View>

      <View className="px-6 mb-8">
        <Button action="secondary" className="h-16">
          <ButtonText>Try Again</ButtonText>
        </Button>
      </View>
    </View>
  );
}
