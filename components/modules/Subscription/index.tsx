import React, { useEffect, useState } from "react";
import { View, Button, Alert } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";

interface PaymentSheetParams {
  paymentIntent: string;
  ephemeralKey: string;
  customer: string;
}

const SubscriptionScreen: React.FC = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [customerEmail] = useState("hamza123@gmail.com"); // Replace with dynamic user

  // 1. Fetch SetupIntent, EphemeralKey, and Customer from your backend
  const fetchPaymentSheetParams = async () => {
    const response = await fetch(
      "http://192.168.0.102:8000/api/payment-intent/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: customerEmail, interval: "year" }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch setup intent parameters.");
    }

    return response.json(); // expects { setupIntent, ephemeralKey, customer }
  };

  // 2. Initialize Stripe PaymentSheet using SetupIntent
  const initializePaymentSheet = async () => {
    try {
      setLoading(true);

      const { setupIntent, ephemeralKey, customer } =
        await fetchPaymentSheetParams();

      setClientSecret(setupIntent);
      setCustomerId(customer);
      console.log("citomer", customer);
      const { error } = await initPaymentSheet({
        merchantDisplayName: "Mealtyme",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        setupIntentClientSecret: setupIntent, // use setupIntent instead of paymentIntent
        allowsDelayedPaymentMethods: false,
        defaultBillingDetails: { email: customerEmail },
      });

      if (error) {
        Alert.alert("Error initializing payment sheet", error.message);
      }
    } catch (error: any) {
      Alert.alert("Initialization Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Present PaymentSheet and confirm subscription on backend
  const openPaymentSheet = async () => {
    if (!clientSecret || !customerId) {
      Alert.alert("Error", "Missing client secret or customer ID");
      return;
    }

    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Setup failed: ${error.code}`, error.message);
    } else {
      // Notify backend to create subscription for this customer
      const response = await fetch(
        "http://192.168.0.102:8000/api/confirm-payment/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: customerEmail,
            customerId, // identify the customer on backend
            interval: "year",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        Alert.alert("Subscription failed", result.error || "Unknown error");
        console.log("result error", result.error);
        return;
      }

      Alert.alert("Success", "Subscription is now active!");
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <View className="w-full h-full">
      <View className="mt-16 px-4">
        <Button
          title="Subscribe"
          onPress={openPaymentSheet}
          disabled={loading}
        />
      </View>
    </View>
  );
};

export default SubscriptionScreen;
