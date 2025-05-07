import React, { useEffect, useState } from "react";
import { Pressable, Text, View, Alert } from "react-native";
import { useColorScheme } from "react-native";
import { Soup, Cookie } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStripe } from "@stripe/stripe-react-native";
import { useSelector } from "react-redux";
import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import { Platform } from "react-native";

import { AppConfig } from "@/constants";

const SubscribeDrawer = () => {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const customerEmail = useSelector(
    (state: any) => state.auth.loginResponseType.email
  );
  const token = useSelector(
    (state: any) => state.auth.loginResponseType.access
  );

  console.log(token);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState(null);

  const productPrices = async () => {
    try {
      const response = await fetch(`${AppConfig.API_URL}products/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch product prices.");
      }
      console.log("resoonse", response);
      return response.json();
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await productPrices();
        setProductData(data.data); // Set the data to state
        console.log("product data", productData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Once the fetch is complete, set loading to false
      }
    };

    fetchData();
  }, []); // You can add token or other dependencies if needed

  const fetchPaymentSheetParams = async (token: string) => {
    const response = await fetch(`${AppConfig.API_URL}payment-intent/"`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch setup intent parameters.");
    }

    return response.json(); // expects { setupIntent, ephemeralKey, customer }
  };

  const subscribe = async (interval: "year" | "month") => {
    try {
      setLoading(true);

      const { setupIntent, ephemeralKey, customer } =
        await fetchPaymentSheetParams(token);

      // Configure Apple Pay parameters
      const applePayParams =
        Platform.OS === "ios"
          ? {
              merchantCountryCode: "US", // Replace with your country code
              cartItems: [
                {
                  label:
                    interval === "month"
                      ? "Mealtyme Monthly Subscription"
                      : "Mealtyme Annual Subscription",
                  amount: interval === "month" ? "9.99" : "99.99", // Replace with your actual prices
                  paymentType: "Recurring" as const,
                  intervalUnit: (interval === "month" ? "month" : "year") as
                    | "month"
                    | "year",
                  intervalCount: 1,
                },
              ],
              //   buttonType: ButtonType.Subscribe,
            }
          : undefined;

      // Configure Google Pay parameters
      const googlePayParams =
        Platform.OS === "android"
          ? {
              merchantCountryCode: "US", // Replace with your country code
              currencyCode: "USD", // Replace with your currency
              testEnv: __DEV__, // Use test environment in development
              label:
                interval === "month"
                  ? "Monthly Subscription"
                  : "Annual Subscription",
              amount: interval === "month" ? "9.99" : "99.99", // Replace with your actual prices
              //   buttonType: ButtonType.Subscribe,
            }
          : undefined;

      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: "Mealtyme",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        setupIntentClientSecret: setupIntent,
        allowsDelayedPaymentMethods: false,
        defaultBillingDetails: { email: customerEmail },
        // Add Apple Pay support
        applePay: applePayParams,
        // Add Google Pay support
        googlePay: googlePayParams,
        // Optional: Customize appearance
        appearance: {
          colors: {
            primary: "#3A83F1", // Replace with your app's primary color
            background: "#FFFFFF",
            componentBackground: "#F3F8FF",
            componentBorder: "#C1D9FA",
            componentDivider: "#E3EFFF",
            primaryText: "#1A1A1A",
            secondaryText: "#7A7A7A",
            placeholderText: "#AAAAAA",
          },
        },
        // Optional: Show saved payment methods first
        paymentMethodOrder: ["card", "apple_pay", "google_pay"],
      });

      if (initError) {
        Alert.alert("Stripe Error", initError.message);
        return;
      }

      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        Alert.alert("Payment Failed", presentError.message);
      } else {
        // Confirm on backend
        const confirmResponse = await fetch(
          `${AppConfig.API_URL}confirm-payment/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              customerId: customer,
              interval,
            }),
          }
        );

        const confirmResult = await confirmResponse.json();

        if (!confirmResponse.ok) {
          Alert.alert(
            "Subscription Error",
            confirmResult.error || "Unknown error"
          );
          return;
        }

        Alert.alert("Success", `Subscription for ${interval} is now active!`);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // For reference, here's what you need to do on your backend:
  // 1. Configure your Stripe account to support Apple Pay and Google Pay
  // 2. Ensure your domain is verified for Apple Pay
  // 3. Update your backend to handle payment confirmations from these methods

  return (
    <SafeAreaView className="flex flex-col w-full h-full pl-7 bg-background">
      <View>
        <Pressable
          className="flex flex-row items-center mb-11 gap-4"
          onPress={() => subscribe("year")}
          disabled={loading}
        >
          <Soup color={isDark ? "#fff" : "#000"} size={25} />
          <Text className="text-foreground/80 text-lg font-medium">Year</Text>
        </Pressable>

        <Pressable
          className="flex flex-row items-center mb-11 gap-4"
          onPress={() => subscribe("month")}
          disabled={loading}
        >
          <Cookie color={isDark ? "#fff" : "#000"} size={25} />
          <Text className="text-foreground/80 text-lg font-medium">Month</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default SubscribeDrawer;
