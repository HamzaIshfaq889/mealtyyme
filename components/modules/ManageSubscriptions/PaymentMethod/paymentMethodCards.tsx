import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from "react-native";

import Circle from "@/assets/svgs/circle.svg";

import Visa from "@/assets/svgs/visa.svg";
import Bank from "@/assets/svgs/bank.svg";
import Master from "@/assets/svgs/master-card.svg";
import Paypal from "@/assets/svgs/paypal.svg";
import { Button, ButtonText } from "@/components/ui/button";

const PaymentMethodsCards = () => {
  const [selectedMethod, setSelectedMethod] = useState("visa");
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  const paymentMethods = [
    {
      id: "visa",
      name: "Visa",
      number: "•••• •••• •••• 4242",
      icon: Visa,
    },
    {
      id: "mastercard",
      name: "Master Card",
      number: "•••• •••• •••• 5555",
      icon: Master,
    },
    {
      id: "bank",
      name: "Bank Account",
      number: "•••• 6789",
      icon: Bank,
    },
    {
      id: "paypal",
      name: "Paypal",
      number: "•••• •••• •••• 1253",
      icon: Paypal,
    },
  ];

  return (
    <View className="w-full h-full px-6 pt-16 pb-6">
      <View className="space-y-3">
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            className={`p-4 rounded-xl flex-row items-center justify-between mb-3 ${
              selectedMethod === method.id
                ? "border border-secondary"
                : isDarkMode
                ? "bg-gray4/50"
                : "bg-background"
            }`}
            onPress={() => setSelectedMethod(method.id)}
          >
            <View className="flex-row items-center gap-3">
              <method.icon />
              <View>
                <Text className="text-foreground font-medium">
                  {method.name}
                </Text>
                <Text className="text-foreground/60 text-sm">
                  {method.number}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-2.5">
              <Text className="text-red-500">Remove</Text>
              {selectedMethod === method?.id ? (
                <Circle />
              ) : (
                <View className="w-6 h-6 rounded-xl border border-white"></View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <View className="mt-auto">
        <Button>
          <ButtonText>Add Payment Method</ButtonText>
        </Button>
      </View>
    </View>
  );
};

export default PaymentMethodsCards;
