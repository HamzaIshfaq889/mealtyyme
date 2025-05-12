import { PreviousSubscription } from "@/lib/types/subscription";
import { capitalizeFirstLetter, formatDate, formatUnixTimestamp, formatUtcDateString } from "@/utils";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type PreviousSubscriptionsProps = {
  subscriptions: PreviousSubscription[];
};

const PreviousSubscriptions = ({
  subscriptions,
}: PreviousSubscriptionsProps) => {
  const theme = useColorScheme();
  const isDarkMode = theme === "dark";

  return (
    <View
      className={`flex flex-col w-full h-full px-6 py-16 ${
        isDarkMode ? "bg-black" : "bg-background"
      }`}
    >
      <View className="flex-row items-center justify-between mb-8">
        <TouchableOpacity
          onPress={() =>
            router.push("/(protected)/(nested)/active-subscription")
          }
        >
          <ArrowLeft
            width={30}
            height={30}
            color={isDarkMode ? "#fff" : "#000"}
          />
        </TouchableOpacity>

        <View className="flex-1 items-center ml-5">
          <Text className="font-bold text-2xl text-foreground">
            Previous Subscriptions
          </Text>
        </View>

        <View style={{ width: 30 }} />
      </View>

      <ScrollView className="pb-20">
        {subscriptions.map((subscription) => {
          return (
            <View
              key={subscription.id}
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
                  <View
                    className={`px-2 py-1 rounded-md mb-2 ${
                      subscription.status === "active"
                        ? "bg-[#1C3A1F]"
                        : subscription.status === "inactive"
                        ? "bg-[#333]"
                        : "bg-[#3A1C1C]"
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        subscription.status === "active"
                          ? "text-[#4ADE80]"
                          : subscription.status === "inactive"
                          ? "text-[#A3A3A3]"
                          : "text-[#F87171]"
                      }`}
                    >
                      {subscription?.status === "active"
                        ? "Active"
                        : subscription?.status === "inactive"
                        ? "Inactive"
                        : "Expired"}
                    </Text>
                  </View>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-foreground text-lg font-semibold">
                    {capitalizeFirstLetter(subscription?.plan?.interval) || "N/A"}
                  </Text>
                  <Text className="text-foreground text-lg">
                    {`$${subscription?.plan?.amount / 100}/${
                      subscription?.plan?.interval
                    }` || "N/A"}
                  </Text>
                </View>
              </View>

              <View className="space-y-2 mb-6">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-foreground/60 text-sm">Started:</Text>
                  <Text className="text-foreground text-sm">
                    {formatUnixTimestamp(subscription?.created) || "N/A"}
                  </Text>
                </View>

                <View className="flex-row justify-between mb-2">
                  <Text className="text-foreground/60 text-sm">
                    Next Billing Date:
                  </Text>
                  <Text className="text-foreground text-sm">
                    {formatUtcDateString(subscription?.next_billing_date) ||
                      "N/A"}
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-foreground/60 text-sm">
                    Subscription ID:
                  </Text>
                  <Text className="text-foreground text-sm">
                    {subscription?.id || "N/A"}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default PreviousSubscriptions;
