import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";
import SubscriptionCard from "./activeSubscription";
import ManageSubscription from "./manageSubscription";

const SubscriptionHistory = () => {
  const theme = useColorScheme();
  const isDarkMode = theme === "dark";

  const handleChangePlan = () => {
    console.log("Change plan pressed");
    // Navigate to plan selection screen or show modal
  };

  return (
    <View
      className={`flex flex-col w-full h-full px-6 py-16 ${
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
          <Text className="font-bold text-2xl text-foreground">
            Subscriptions
          </Text>
        </View>

        <View style={{ width: 30 }} />
      </View>

      <View>
        {/* <SubscriptionCard
          status="active"
          planName="Premium Annual"
          startDate="Jun 15, 2023"
          price="$50/Year"
          nextBillingDate="2025-06-06 11:32 UTC"
          subscriptionId="sub_tr1JjEQ9"
          onChangePlan={handleChangePlan}
        /> */}

        <ManageSubscription
          status="active"
          planName="Premium Annual"
          startDate="Jun 15, 2023"
          price="$50/Year"
          nextBillingDate="2025-06-06 11:32 UTC"
          subscriptionId="sub_tr1JjEQ9"
          onChangePlan={handleChangePlan}
        />
        
      </View>
    </View>
  );
};

export default SubscriptionHistory;
