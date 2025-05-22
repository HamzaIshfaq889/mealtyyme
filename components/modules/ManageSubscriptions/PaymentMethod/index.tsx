import { router } from "expo-router";

import { ArrowLeft } from "lucide-react-native";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import {
  useAddPaymentMethod,
  usePaymentMethods,
} from "@/redux/queries/recipes/useStripeQuery";

import PaymentMethodsCard from "./paymentMethodCard";
import { Button, ButtonText } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { useState } from "react";

const PaymentMethods = () => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  const [loading, setLoading] = useState(false);
  const token = useSelector(
    (state: any) => state.auth.loginResponseType.access
  );
  const customerEmail = useSelector(
    (state: any) => state.auth.loginResponseType.email
  );

  const {
    data,
    isLoading,
    isError,
    error,
    refetch: refetchPaymentMethods,
  } = usePaymentMethods();
  const { mutate: addPayment } = useAddPaymentMethod();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (isError) {
    return <Text>Error: {(error as Error).message}</Text>;
  }

  const handleAddPaymentMethod = () => {
    if (!token || !customerEmail) return;
    setLoading(true);

    addPayment(
      {
        token,
        customerEmail,
        isDarkMode,
      },
      {
        onSuccess: (data) => {
          if (data) {
            Alert.alert("Success", "Payment Method added successfully!");
            refetchPaymentMethods();
          }
          setLoading(false);
        },
        onError: (error) => {
          console.log(
            "Something went wrong while adding payment method.Please try again!",
            error
          );

          // Alert.alert(
          //   "Error while adding payment method.Please try again!",
          //   error?.message
          // );
          setLoading(false);
        },
      }
    );
  };

  return (
    <View
      className={`flex flex-col w-full h-full px-6 pt-16 pb-4 bg-background`}
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
          <PaymentMethodsCard
            paymentMethod={paymentMethod}
            key={index}
            refetch={refetchPaymentMethods}
          />
        ))}

      <View className="mt-auto">
        <Button
          action="secondary"
          onPress={handleAddPaymentMethod}
          disabled={!!loading}
          className="h-16"
        >
          <ButtonText className="!text-white">
            {loading ? "Loading..." : "Add Payment Method"}
          </ButtonText>
        </Button>
      </View>
    </View>
  );
};

export default PaymentMethods;
