import { router } from "expo-router";

import { ArrowLeft } from "lucide-react-native";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";
import PaymentMethodsCards from "./paymentMethodCards";

const PaymentMethods = () => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

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

      <PaymentMethodsCards />
    </View>
  );
};

export default PaymentMethods;
