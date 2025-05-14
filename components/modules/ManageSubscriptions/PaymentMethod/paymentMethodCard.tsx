import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  Pressable,
  Alert,
} from "react-native";

import Circle from "@/assets/svgs/circle.svg";

import Visa from "@/assets/svgs/visa.svg";
import Bank from "@/assets/svgs/bank.svg";
import Paypal from "@/assets/svgs/paypal.svg";
import Master from "@/assets/svgs/master-card.svg";

import { CircleCheckBig, Trash } from "lucide-react-native";
import { PaymentMethod } from "@/lib/types/subscription";
import { capitalizeFirstLetter } from "@/utils";
import { useSetDefaultPaymentMethod } from "@/redux/queries/recipes/useStripeQuery";
import { router } from "expo-router";
import { Spinner } from "@/components/ui/spinner";

type paymentMethodProps = {
  paymentMethod: PaymentMethod;
};

const PaymentMethodsCard = ({ paymentMethod }: paymentMethodProps) => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  const [defaultPaymentLoading, setDefaultPaymentLoading] = useState(false);

  const { mutate: setDefault } = useSetDefaultPaymentMethod();

  const handleSetDefault = (id: string) => {
    setDefaultPaymentLoading(true);
    setDefault(id, {
      onSuccess: () => {
        setDefaultPaymentLoading(false);
        router.push("/(protected)/(nested)/manage-subscription");
        Alert.alert("Success", `Payment method set Successfully!`);
      },
      onError: (err) => {
        setDefaultPaymentLoading(false);
        console.error("Setup payment method failed:", err.message);
      },
    });
  };

  return (
    <TouchableOpacity
      key={1}
      className={`p-4 rounded-xl mb-3 ${
        isDarkMode ? "bg-gray4/50" : "bg-background"
      }`}
      style={{
        boxShadow: isDarkMode ? "" : "0px 2px 12px 0px rgba(0,0,0,0.1)",
      }}
    >
      <View className="flex flex-row items-start justify-between">
        <View className="flex-row items-center gap-3">
          <Master />
          <View>
            <Text className="text-foreground font-medium text-lg">
              {capitalizeFirstLetter(paymentMethod?.brand) || "N/A"}
            </Text>
            <Text className="text-foreground/60 text-lg">
              {`.... .... .... ${paymentMethod.last4}`}
            </Text>
          </View>
        </View>
        {paymentMethod?.isDefault && (
          <View className="bg-green-200 py-2 px-4 rounded-full">
            <Text className="text-green-800 text-sm">Default</Text>
          </View>
        )}
      </View>
      <View className="w-full h-[1px] bg-muted/80 mt-3 mb-3"></View>
      <View
        className={`flex flex-row ${
          paymentMethod?.isDefault ? "justify-end" : "justify-between"
        }`}
      >
        {!paymentMethod?.isDefault &&
          (defaultPaymentLoading ? (
            <Spinner size={24} />
          ) : (
            <Pressable
              className={`flex flex-row  items-center gap-2.5 `}
              onPress={() => handleSetDefault(paymentMethod?.id)}
            >
              <CircleCheckBig color={"#00c3ff"} size={20} />
              <Text className="text-secondary">Set as Default</Text>
            </Pressable>
          ))}
        <View className="flex flex-row items-center gap-2.5">
          <Trash color={"#ff0000"} size={18} />
          <Text className="text-destructive">Remove</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PaymentMethodsCard;
