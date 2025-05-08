import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import NoSubscriptionSVG from "@/assets/svgs/np-subscription.svg";
import NoSubscriptionSVGLight from "@/assets/svgs/no-subscription-light.svg";

import { Button, ButtonText } from "@/components/ui/button";

const ManageSubscriptions = () => {
  const theme = useColorScheme();
  const isDarkMode = theme === "dark";

  return (
    <View
      className={`flex flex-col w-full h-full px-9 py-16 ${
        isDarkMode ? "bg-black" : "bg-background"
      }`}
    >
      <View className="flex-row items-center justify-between mb-8">
        <TouchableOpacity onPress={() => router.push("/")}>
          <ArrowLeft
            width={30}
            height={30}
            color={isDarkMode ? "#fff" : "#000"}
          />
        </TouchableOpacity>

        <View className="flex-1 items-center ml-5">
          <Text className="font-bold text-2xl text-primary">Subscriptions</Text>
        </View>

        <View style={{ width: 30 }} />
      </View>

      <View className="pt-[25%]">
        {isDarkMode ? <NoSubscriptionSVG /> : <NoSubscriptionSVGLight />}
      </View>

      <View className="mt-auto mb-6">
        <Text className="font-bold text-3xl leading-10 text-foreground text-center mb-4">
          You don't have an active subscription
        </Text>
        <Button>
          <ButtonText>Buy Subscription</ButtonText>
        </Button>
      </View>
    </View>
  );
};

export default ManageSubscriptions;
