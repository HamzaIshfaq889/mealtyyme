import { Button, ButtonText } from "@/components/ui/button";
import { formatDate, getNextBillingDate, PackagesPrice } from "@/utils";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { View, Text, TouchableOpacity, useColorScheme } from "react-native";

interface ActiveSubscriptionProps {
  status: string | null;
  planName: "month" | "year" | null;
  startDate: string | null;
  subscriptionId: string | null;
}

export default function ActiveSubscription({
  status = "active",
  planName = "month",
  startDate = null,
  subscriptionId = "",
}: ActiveSubscriptionProps) {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  const price = planName && PackagesPrice[planName];

  console.log(typeof startDate);

  return (
    <View className="flex flex-col w-full h-full px-6 py-16">
      <View className="flex-row items-center justify-between mb-8">
        <TouchableOpacity
          onPress={() => router.push("/(protected)/(nested)/settings")}
        >
          <ArrowLeft
            width={30}
            height={30}
            color={scheme === "dark" ? "#fff" : "#000"}
          />
        </TouchableOpacity>

        <View className="flex-1 items-center">
          <Text className="font-bold text-2xl text-primary">
            Active Subscription
          </Text>
        </View>

        <View style={{ width: 30 }} />
      </View>
      <View
        className={`${
          isDarkMode ? "bg-gray4/50" : "bg-background"
        } rounded-3xl p-4 w-full mb-8`}
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
              {planName === "month" ? "Monthly" : "Yearly"}
            </Text>
            <Text className="text-foreground text-lg">{`$${price}/${planName}`}</Text>
          </View>
        </View>

        <View className="space-y-2 mb-6">
          <View className="flex-row justify-between mb-2">
            <Text className="text-foreground/60 text-sm">Started:</Text>
            <Text className="text-foreground text-sm">
              {startDate ? formatDate(startDate) : "N/A"}
            </Text>
          </View>

          <View className="flex-row justify-between mb-2">
            <Text className="text-foreground/60 text-sm">
              Next Billing Date:
            </Text>
            <Text className="text-foreground text-sm">
              {startDate && planName
                ? getNextBillingDate(startDate, planName)
                : "N/A"}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-foreground/60 text-sm">Subscription ID:</Text>
            <Text className="text-foreground text-sm">
              {subscriptionId ? subscriptionId : "N/A"}
            </Text>
          </View>
        </View>

        <Button
          className="w-full !h-14"
          onPress={() =>
            router.push("/(protected)/(nested)/manage-subscription")
          }
        >
          <ButtonText className="!text-lg !font-semibold">
            Manage Subscription
          </ButtonText>
        </Button>
      </View>

      <View
        className={`${
          isDarkMode ? "bg-gray4/50" : "bg-background"
        } flex flex-row justify-between items-center rounded-xl px-4 py-5 w-full`}
        style={{
          boxShadow: isDarkMode ? "" : "0px 2px 12px 0px rgba(0,0,0,0.1)",
        }}
      >
        <Text className="text-foreground font-bold leading-5 text-lg">
          Previous Subscriptions
        </Text>
        <TouchableOpacity
          onPress={() =>
            router.push("/(protected)/(nested)/previous-subscription")
          }
        >
          <Text className="font-bold text-secondary">View All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
