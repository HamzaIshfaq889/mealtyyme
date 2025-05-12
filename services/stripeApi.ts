import { AppConfig } from "@/constants";
import apiClient from "@/lib/apiClient";
import { Packages, SubscriptionsResponse } from "@/lib/types/subscription";
import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import { Alert, Platform } from "react-native";

export const getPackagePrices = async () => {
  const response = await apiClient.get(`${AppConfig.API_URL}products/`);

  if (!response.ok) {
    if (response.status === 401 || response.status === 404) {
      throw new Error("Products not found or unauthorized access.");
    }
    throw new Error(
      response?.originalError?.message ||
        "Something went wrong while fetching product prices."
    );
  }

  return response.data as Packages;
};

export const fetchPaymentSheetParams = async () => {
  const response = await apiClient.post(`${AppConfig.API_URL}payment-intent/`);

  if (!response.ok) {
    if (response.status === 401 || response.status === 404) {
      throw new Error("Error while setting up payment intent.");
    }
    throw new Error(
      response?.originalError?.message ||
        "Failed to fetch setup intent parameters."
    );
  }

  return response.data;
};

export const subscribe = async (
  token: string,
  interval: "year" | "month",
  customerEmail: string,
  isDarkMode: boolean
): Promise<any> => {
  try {
    const { setupIntent, ephemeralKey, customer }: any =
      await fetchPaymentSheetParams();

    const applePayParams =
      Platform.OS === "ios"
        ? {
            merchantCountryCode: "US",
            cartItems: [
              {
                label:
                  interval === "month"
                    ? "Mealtyme Monthly Subscription"
                    : "Mealtyme Annual Subscription",
                amount: interval === "month" ? "9.99" : "99.99",
                paymentType: "Recurring" as const,
                intervalUnit: interval,
                intervalCount: 1,
              },
            ],
          }
        : undefined;

    const googlePayParams =
      Platform.OS === "android"
        ? {
            merchantCountryCode: "US",
            currencyCode: "USD",
            testEnv: __DEV__,
            label:
              interval === "month"
                ? "Monthly Subscription"
                : "Annual Subscription",
            amount: interval === "month" ? "9.99" : "99.99",
          }
        : undefined;

    const { error: initError } = await initPaymentSheet({
      merchantDisplayName: "Mealtyme",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      setupIntentClientSecret: setupIntent,
      allowsDelayedPaymentMethods: false,
      defaultBillingDetails: { email: customerEmail },
      applePay: applePayParams,
      googlePay: googlePayParams,
      appearance: {
        colors: {
          primary: "#3A83F1",
          background: isDarkMode ? "#121212" : "#FFFFFF",
          componentBackground: isDarkMode ? "#1E1E1E" : "#F3F8FF",
          componentBorder: isDarkMode ? "#333333" : "#C1D9FA",
          componentDivider: isDarkMode ? "#2C2C2E" : "#E3EFFF",
          primaryText: isDarkMode ? "#FFFFFF" : "#1A1A1A",
          secondaryText: isDarkMode ? "#CCCCCC" : "#7A7A7A",
          placeholderText: isDarkMode ? "#888888" : "#AAAAAA",
        },
      },
      paymentMethodOrder: ["card", "apple_pay", "google_pay"],
    });

    if (initError) {
      throw new Error(
        initError.message || "Failed to initialize payment sheet"
      );
    }

    const { error: presentError } = await presentPaymentSheet();

    if (presentError) {
      throw new Error(presentError.message || "Payment failed");
    }

    const confirmResponse = await apiClient.post(
      "confirm-payment/",
      {
        customerId: customer,
        interval,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!confirmResponse.ok) {
      throw new Error(
        confirmResponse.originalError?.message ||
          "Something went wrong while subscribing."
      );
    }

    return confirmResponse;
  } catch (error: any) {
    Alert.alert("Error", error.message);
  }
};

export const cancelSubscription = async (subscriptionId: string) => {
  const response = await apiClient.post(
    `${AppConfig.API_URL}cancel-subscription/`,
    {
      subscriptionId,
    }
  );

  if (!response.ok) {
    if (response.status === 401 || response.status === 404) {
      throw new Error("Error while cancelling subscription.");
    }
    throw new Error(
      response?.originalError?.message || "Failed to cancel subscription."
    );
  }

  return response.data;
};

export const fetchPreviousSubscriptions = async () => {
  const response = await apiClient.get(`${AppConfig.API_URL}subscriptions/`);

  if (!response.ok) {
    if (response.status === 401 || response.status === 404) {
      throw new Error("Error while fetching previous subscriptions.");
    }
    throw new Error(
      response?.originalError?.message ||
        "Failed to fetch previous subscriptions."
    );
  }

  return response.data as SubscriptionsResponse;
};
