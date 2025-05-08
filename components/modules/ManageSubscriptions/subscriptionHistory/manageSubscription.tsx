import { Button, ButtonText } from "@/components/ui/button";
import React from "react";
import { View, Text, TouchableOpacity, useColorScheme } from "react-native";

interface ManageSubscriptionProps {
  status: "active" | "inactive" | "expired";
  planName: string;
  price: string;
  startDate: string;
  nextBillingDate: string;
  subscriptionId: string;
  onChangePlan: () => void;
}

export default function ManageSubscription({
  status = "active",
  planName = "Premium Annual",
  price = "$50/Year",
  startDate = "Jun 15, 2023",
  nextBillingDate = "2025-06-06 11:32 UTC",
  subscriptionId = "sub_tr1JjEQ9",
  onChangePlan = () => console.log("Change plan pressed"),
}: ManageSubscriptionProps) {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  return (
    <View
      className={`${
        isDarkMode ? "bg-gray4/50" : "bg-background"
      } rounded-3xl p-4 w-full max-w-sm mb-8`}
      style={{
        boxShadow: isDarkMode ? "" : "0px 2px 12px 0px rgba(0,0,0,0.1)",
      }}
    >
      {/* Status and Plan Info */}
      <View className="mb-4">
        <View className="flex-row justify-between items-start">
          <View className="bg-[#1C3A1F] px-2 py-1 rounded-md mb-2">
            <Text className="text-[#4ADE80] text-xs font-medium">
              {status === "active"
                ? "Active"
                : status === "inactive"
                ? "Inactive"
                : "Expired"}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-foreground text-lg font-semibold">
            {planName}
          </Text>
          <Text className="text-foreground text-lg">{price}</Text>
        </View>
      </View>

      <View className="space-y-2 mb-6">
        <View className="flex-row justify-between mb-2">
          <Text className="text-foreground/60 text-sm">Started:</Text>
          <Text className="text-foreground text-sm">{startDate}</Text>
        </View>

        <View className="flex-row justify-between mb-2">
          <Text className="text-foreground/60 text-sm">Next Billing Date:</Text>
          <Text className="text-foreground text-sm">{nextBillingDate}</Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-foreground/60 text-sm">Subscription ID:</Text>
          <Text className="text-foreground text-sm">{subscriptionId}</Text>
        </View>
      </View>

      {/* Change Plan Button */}

      <View className="flex flex-row gap-1.5 w-full">
        <View className="w-1/2">
          <Button variant="outline" className="border border-destructive !h-14">
            <ButtonText className="!text-lg !font-semibold !text-destructive">
              Cancel
            </ButtonText>
          </Button>
        </View>
        <Button className="w-1/2 !h-14">
          <ButtonText className="!text-lg !font-semibold">
            Change Plan
          </ButtonText>
        </Button>
      </View>
    </View>
  );
}
