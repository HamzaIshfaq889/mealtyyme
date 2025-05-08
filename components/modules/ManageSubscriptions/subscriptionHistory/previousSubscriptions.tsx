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
import { Button, ButtonText } from "@/components/ui/button";

const PreviousSubscriptions = () => {
  const theme = useColorScheme();
  const isDarkMode = theme === "dark";

  // Dummy data for subscriptions
  const subscriptions = [
    {
      id: "sub_12345",
      status: "active",
      planName: "Pro Monthly",
      price: "$9.99/month",
      startDate: "Jan 15, 2023",
      nextBillingDate: "Feb 15, 2023",
      subscriptionId: "sub_12345",
    },
    {
      id: "sub_67890",
      status: "inactive",
      planName: "Pro Annual",
      price: "$99.99/year",
      startDate: "Mar 1, 2022",
      nextBillingDate: "Mar 1, 2023",
      subscriptionId: "sub_67890",
    },
    {
      id: "sub_54321",
      status: "expired",
      planName: "Basic Monthly",
      price: "$4.99/month",
      startDate: "Nov 10, 2022",
      nextBillingDate: "Dec 10, 2022",
      subscriptionId: "sub_54321",
    },
    {
      id: "sub_09876",
      status: "active",
      planName: "Pro Annual",
      price: "$99.99/year",
      startDate: "Jul 5, 2022",
      nextBillingDate: "Jul 5, 2023",
      subscriptionId: "sub_09876",
    },
    {
      id: "sub_13579",
      status: "inactive",
      planName: "Basic Monthly",
      price: "$4.99/month",
      startDate: "Sep 20, 2022",
      nextBillingDate: "Oct 20, 2022",
      subscriptionId: "sub_13579",
    },
  ];

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
                      {subscription.status === "active"
                        ? "Active"
                        : subscription.status === "inactive"
                        ? "Inactive"
                        : "Expired"}
                    </Text>
                  </View>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-foreground text-lg font-semibold">
                    {subscription.planName}
                  </Text>
                  <Text className="text-foreground text-lg">
                    {subscription.price}
                  </Text>
                </View>
              </View>

              <View className="space-y-2 mb-6">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-foreground/60 text-sm">Started:</Text>
                  <Text className="text-foreground text-sm">
                    {subscription.startDate}
                  </Text>
                </View>

                <View className="flex-row justify-between mb-2">
                  <Text className="text-foreground/60 text-sm">
                    Next Billing Date:
                  </Text>
                  <Text className="text-foreground text-sm">
                    {subscription.nextBillingDate}
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-foreground/60 text-sm">
                    Subscription ID:
                  </Text>
                  <Text className="text-foreground text-sm">
                    {subscription.subscriptionId}
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
