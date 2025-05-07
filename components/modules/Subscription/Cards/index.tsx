import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import {
  Trash2,
  CreditCard,
  CheckCircle,
  PlusCircle,
} from "lucide-react-native";
import { useSelector } from "react-redux";
import { AppConfig } from "@/constants";

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

const PaymentMethodsScreen: React.FC = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const token = useSelector(
    (state: any) => state.auth.loginResponseType.access
  );

  // Fetch customer's saved payment methods
  const fetchPaymentMethods = useCallback(async () => {
    try {
      const response = await fetch(`${AppConfig.API_URL}payment-methods/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch payment methods");
      }

      const data = await response.json();
      setPaymentMethods(data.paymentMethods || []);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Set up a new payment method
  const setupNewPaymentMethod = async () => {
    try {
      setLoading(true);

      // 1. Fetch setup intent from backend
      const response = await fetch(
        `${AppConfig.API_URL}setup-payment-method/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create setup intent");
      }

      const { setupIntent, ephemeralKey, customer } = await response.json();

      // 2. Initialize payment sheet
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: "Mealtyme",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        setupIntentClientSecret: setupIntent,
        allowsDelayedPaymentMethods: false,
      });

      if (initError) {
        throw new Error(initError.message);
      }

      // 3. Present payment sheet
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        if (presentError.code !== "Canceled") {
          throw new Error(presentError.message);
        }
        return; // User canceled, no need for error alert
      }

      // Refresh payment methods list
      Alert.alert("Success", "Payment method added successfully!");
      fetchPaymentMethods();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Set a payment method as default
  const setDefaultPaymentMethod = async (paymentMethodId: string) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${AppConfig.API_URL}set-default-payment-method/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            paymentMethodId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to set default payment method");
      }

      Alert.alert("Success", "Default payment method updated!");
      fetchPaymentMethods();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete a payment method
  const deletePaymentMethod = async (paymentMethodId: string) => {
    // Confirm with user before deleting
    Alert.alert(
      "Delete Payment Method",
      "Are you sure you want to remove this payment method?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);

              const response = await fetch(
                `${AppConfig.API_URL}delete-payment-method/`,
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    paymentMethodId,
                  }),
                }
              );

              if (!response.ok) {
                throw new Error("Failed to delete payment method");
              }

              Alert.alert("Success", "Payment method removed successfully");
              fetchPaymentMethods();
            } catch (error: any) {
              Alert.alert("Error", error.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // Handle pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  useEffect(() => {
    fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  const getCardIcon = (brand: string) => {
    // You can customize this with proper card brand icons
    return <CreditCard size={24} color="#333" />;
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="pt-12 pb-4 px-4 bg-white shadow">
        <Text className="text-2xl font-bold text-gray-800">
          Payment Methods
        </Text>
        <Text className="text-gray-500 mt-1">Manage your payment option</Text>
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-4 pt-4"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {paymentMethods.length === 0 ? (
            <View className="py-8 flex items-center justify-center">
              <Text className="text-gray-500 text-center">
                You don't have any payment methods yet.
              </Text>
            </View>
          ) : (
            paymentMethods.map((method) => (
              <View
                key={method.id}
                className="mb-4 bg-white rounded-lg shadow-sm p-4 border border-gray-100"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    {getCardIcon(method.brand)}
                    <View className="ml-3">
                      <Text className="font-semibold text-gray-800">
                        {method.brand.charAt(0).toUpperCase() +
                          method.brand.slice(1)}{" "}
                        •••• {method.last4}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </Text>
                    </View>
                  </View>

                  {method.isDefault && (
                    <View className="bg-blue-100 px-2 py-1 rounded-full">
                      <Text className="text-blue-700 text-xs font-medium">
                        Default
                      </Text>
                    </View>
                  )}
                </View>

                <View className="flex-row justify-end mt-4 pt-3 border-t border-gray-100">
                  {!method.isDefault && (
                    <TouchableOpacity
                      className="flex-row items-center mr-4"
                      onPress={() => setDefaultPaymentMethod(method.id)}
                    >
                      <CheckCircle size={16} color="#4CAF50" />
                      <Text className="text-green-600 ml-1 font-medium">
                        Set Default
                      </Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    className="flex-row items-center"
                    onPress={() => deletePaymentMethod(method.id)}
                  >
                    <Trash2 size={16} color="#F44336" />
                    <Text className="text-red-500 ml-1 font-medium">
                      Remove
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          <TouchableOpacity
            className="mt-4 mb-8 bg-blue-500 py-3 px-4 rounded-lg flex-row justify-center items-center"
            onPress={setupNewPaymentMethod}
            disabled={loading}
          >
            <PlusCircle size={20} color="#fff" />
            <Text className="ml-2 text-white font-semibold">
              Add Payment Method
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

export default PaymentMethodsScreen;
