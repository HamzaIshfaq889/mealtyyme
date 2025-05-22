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
import {
  useRemovePaymentMethod,
  useSetDefaultPaymentMethod,
} from "@/redux/queries/recipes/useStripeQuery";
import { router } from "expo-router";
import { Spinner } from "@/components/ui/spinner";

import Dialog from "react-native-dialog";
import { Button, ButtonText } from "@/components/ui/button";

type paymentMethodProps = {
  paymentMethod: PaymentMethod;
  refetch: () => void;
};

const PaymentMethodsCard = ({
  paymentMethod,
  refetch: refetchPaymentMethod,
}: paymentMethodProps) => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  const [defaultPaymentLoading, setDefaultPaymentLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);

  const { mutate: setDefault } = useSetDefaultPaymentMethod();
  const { mutate: removePaymentMethod } = useRemovePaymentMethod();

  const handleSetDefault = (id: string) => {
    setDefaultPaymentLoading(true);
    setDefault(id, {
      onSuccess: () => {
        setDefaultPaymentLoading(false);
        refetchPaymentMethod();

        Alert.alert("Success", `Payment method set Successfully!`);
      },
      onError: (err) => {
        setDefaultPaymentLoading(false);

        console.error("Setup payment method failed:", err.message);
      },
    });
  };

  const handleRemovePaymentMethod = (id: string) => {
    setRemoveLoading(true);

    removePaymentMethod(
      { id },
      {
        onSuccess: () => {
          setRemoveLoading(false);
          refetchPaymentMethod();

          Alert.alert("Success", `Payment method removed Successfully!`);
        },
        onError: (err) => {
          setRemoveLoading(false);

          console.error("Error while removing payment method:", err.message);
        },
      }
    );

    setShowDeleteModal(false);
  };

  return (
    <>
      <TouchableOpacity key={1} className={`p-4 rounded-xl mb-3 bg-card`}>
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
          <Pressable
            className="flex flex-row items-center gap-2.5"
            onPress={() => setShowDeleteModal(true)}
          >
            <Trash color={"#ff0000"} size={18} />

            <Text className="text-destructive">Remove</Text>
          </Pressable>
        </View>
      </TouchableOpacity>
      <Dialog.Container
        visible={showDeleteModal}
        contentStyle={{
          backgroundColor: scheme === "dark" ? "#1a1a1a" : "#fdf8f4",
          paddingVertical: 50,
          marginLeft: 30,
          marginRight: 20,
          borderRadius: 30,
        }}
      >
        <View className="flex flex-row justify-center mb-6">
          <View className="bg-destructive flex flex-row justify-center items-center w-24 h-24 p-8 rounded-full basis-1/">
            <Trash color="#fff" size={35} />
          </View>
        </View>
        <View>
          <Text className="font-bold leading-5 text-foreground text-lg text-center mb-3">
            Remove Payment Method
          </Text>
          <Text className="font-bold leading-5 text-foreground text-lg text-center mb-7 ">
            Are you sure to remove this payment method?
          </Text>
        </View>
        <View className="flex flex-row justify-center items-center gap-2">
          <Button
            action="muted"
            className="basis-1/2 h-16"
            onPress={() => setShowDeleteModal(false)}
          >
            <ButtonText>Back</ButtonText>
          </Button>
          <Button
            action="negative"
            onPress={() => handleRemovePaymentMethod(paymentMethod?.id)}
            disabled={!!removeLoading}
            className="basis-1/2 h-16"
          >
            <ButtonText className="!text-white">
              {removeLoading ? <Spinner size={30} /> : "Remove"}
            </ButtonText>
          </Button>
        </View>
      </Dialog.Container>
    </>
  );
};

export default PaymentMethodsCard;
