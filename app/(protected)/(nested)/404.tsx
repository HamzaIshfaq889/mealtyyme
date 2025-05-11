import { Button, ButtonText } from "@/components/ui/button";
import React from "react";
import { View, Text } from "react-native";

import Error404 from "@/assets/svgs/404.svg";

export default function Error404Screen() {
  return (
    <View className="flex-1">
      <View className="flex-1 items-center justify-center px-6">
        <Error404 />

        <Text className="text-foreground text-2xl font-bold mb-2 mt-12 text-center">
          Error 404
        </Text>
        <Text className="text-muted text-base text-center">
          Oops, this page is half-baked!
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
