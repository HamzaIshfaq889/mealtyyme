import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import BuySubscription from "@/assets/svgs/buy-subscription.svg";

import { Button, ButtonText } from "@/components/ui/button";
import SubcriptionCTA from "../SubscriptionsCTA";

const BuySubscriptions = () => {
  const theme = useColorScheme();
  const isDarkMode = theme === "dark";
  const [showSubscribeCTA, setShowSubscribeCTA] = useState(false);

  const handleBuySubscription = () => {
    setShowSubscribeCTA(true);
  };

  return (
    <View
      className={`flex flex-col w-full h-full px-9 pt-16 pb-2 ${
        isDarkMode ? "bg-black" : "bg-background"
      }`}
    >
      <View className="flex-row items-center justify-between mb-8">
        <TouchableOpacity
          onPress={() => router.push("/(protected)/(nested)/settings")}
        >
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
        <BuySubscription />
      </View>

      <View className="mt-auto mb-6">
        <Text className="font-bold text-3xl leading-10 text-foreground text-center mb-4">
          You don't have an active subscription
        </Text>
        <Button
          action="secondary"
          className="h-16"
          onPress={handleBuySubscription}
        >
          <ButtonText className="!text-white">Buy Subscription</ButtonText>
        </Button>
      </View>

      {showSubscribeCTA && (
        <SubcriptionCTA
          setShowSubscribeCTA={setShowSubscribeCTA}
          forceShow={true}
        />
      )}
    </View>
  );
};

export default BuySubscriptions;
