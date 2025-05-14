import { router } from "expo-router";

import { ArrowLeft } from "lucide-react-native";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import { usePaymentMethods } from "@/redux/queries/recipes/useStripeQuery";

import PaymentMethodsCard from "./paymentMethodCard";

const PaymentMethods = () => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  const { data, isLoading, isError, error } = usePaymentMethods();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (isError) {
    return <Text>Error: {(error as Error).message}</Text>;
  }

  console.log("paymentMethods", data?.paymentMethods);

  return (
    <View
      className={`flex flex-col w-full h-full px-6 py-16 ${
        isDarkMode ? "bg-black" : "bg-background"
      }`}
    >
      <View className="flex-row items-center justify-between mb-8">
        <TouchableOpacity
          onPress={() =>
            router.push("/(protected)/(nested)/manage-subscription")
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
            Payment Methods
          </Text>
        </View>

        <View style={{ width: 30 }} />
      </View>

      {data?.paymentMethods
        ?.sort((a, b) => (a.isDefault ? -1 : b.isDefault ? 1 : 0))
        .map((paymentMethod, index) => (
          <PaymentMethodsCard paymentMethod={paymentMethod} key={index} />
        ))}
    </View>
  );
};

export default PaymentMethods;
