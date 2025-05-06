import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  CreditCard,
} from "lucide-react-native";
import { useSelector } from "react-redux";
import { router } from "expo-router";

interface Subscription {
  id: string;
  status: string;
  current_period_end: number;
  plan: {
    interval: string;
    amount: number;
  };
}

const SubscriptionStatusScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  const navigation = useNavigation();
  const token = useSelector(
    (state: any) => state.auth.loginResponseType.access
  );

  // Fetch customer's subscriptions
  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://192.168.0.102:8000/api/subscriptions/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.log("response", response);
        throw new Error("Failed to fetch subscriptions");
      }

      const data = await response.json();
      setSubscriptions(data.subscriptions || []);
      console.log("daataaa, dataaa", data);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Retry a failed or canceled subscription
  const handleRetrySubscription = async (subscriptionId: string) => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://192.168.0.102:8000/api/retry-subscription/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            subscriptionId,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (
          result.error ===
          "No default payment method found. Please add a payment method first."
        ) {
          Alert.alert(
            "Payment Method Required",
            "You need to add a payment method before retrying this subscription.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Add Payment Method",
                onPress: () => navigation.navigate("PaymentMethods" as never),
              },
            ]
          );
          return;
        }

        throw new Error(result.error || "Failed to retry subscription");
      }

      Alert.alert("Success", result.message);
      fetchSubscriptions();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Pull-to-refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  // Get appropriate status icon based on subscription status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle size={20} color="#4CAF50" />;
      case "trialing":
        return <Clock size={20} color="#2196F3" />;
      case "past_due":
      case "incomplete":
        return <AlertTriangle size={20} color="#FF9800" />;
      case "canceled":
      case "unpaid":
      default:
        return <XCircle size={20} color="#F44336" />;
    }
  };

  // Format date from timestamp
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  // Format price with currency
  const formatPrice = (amount: number, interval: string) => {
    const formattedAmount = (amount / 100).toFixed(2);
    return `$${formattedAmount}/${interval === "month" ? "mo" : "yr"}`;
  };

  // Navigate to payment methods screen
  const goToPaymentMethods = () => {
    router.push("/(protected)/(nested)/paymenet-methods");
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://192.168.0.102:8000/api/cancel-subscription/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            subscriptionId,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (
          result.error ===
          "No default payment method found. Please add a payment method first."
        ) {
          Alert.alert(
            "Payment Method Required",
            "You need to add a payment method before retrying this subscription.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Add Payment Method",
                onPress: () => navigation.navigate("PaymentMethods" as never),
              },
            ]
          );
          return;
        }

        throw new Error(result.error || "Failed to retry subscription");
      }

      Alert.alert("Success", result.message);
      fetchSubscriptions();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="pt-12 pb-4 px-4 bg-white shadow">
        <Text className="text-2xl font-bold text-gray-800">Subscriptions</Text>
        <Text className="text-gray-500 mt-1">
          Manage your subscription plans
        </Text>
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
          {subscriptions.length === 0 ? (
            <View className="py-8 flex items-center justify-center">
              <Text className="text-gray-500 text-center mb-4">
                You don't have any active subscriptions.
              </Text>
              <TouchableOpacity
                className="mt-2 bg-blue-500 py-3 px-4 rounded-lg flex-row justify-center items-center"
                onPress={() =>
                  navigation.navigate("SubscriptionScreen" as never)
                }
              >
                <Text className="text-white font-semibold">Subscribe Now</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {subscriptions.map((subscription) => (
                <View
                  key={subscription.id}
                  className="mb-4 bg-white rounded-lg shadow-sm p-4 border border-gray-100"
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                      {getStatusIcon(subscription.status)}
                      <Text className="ml-2 font-semibold text-gray-800">
                        {subscription.status.charAt(0).toUpperCase() +
                          subscription.status.slice(1)}
                      </Text>
                    </View>
                    <Text className="font-bold text-gray-800">
                      {formatPrice(
                        subscription.plan.amount,
                        subscription.plan.interval
                      )}
                    </Text>
                  </View>

                  <View className="py-2 border-t border-gray-100">
                    <Text className="text-gray-600 text-sm mb-1">
                      {subscription.status === "active"
                        ? "Next billing date: "
                        : "Valid until: "}
                      {subscription.current_period_end}
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      Subscription ID: {subscription.id.substring(0, 12)}...
                    </Text>
                  </View>

                  {(subscription.status === "canceled" ||
                    subscription.status === "past_due" ||
                    subscription.status === "incomplete") && (
                    <View className="mt-3 flex-row justify-end pt-2 border-t border-gray-100">
                      <TouchableOpacity
                        className="flex-row items-center"
                        onPress={() => handleRetrySubscription(subscription.id)}
                      >
                        <RefreshCw size={16} color="#2196F3" />
                        <Text className="text-blue-500 ml-1 font-medium">
                          Retry Subscription
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {subscription.status === "active" && (
                    <View className="mt-3 flex-row justify-end pt-2 border-t border-gray-100">
                      <TouchableOpacity
                        className="flex-row items-center"
                        onPress={() =>
                          handleCancelSubscription(subscription.id)
                        }
                      >
                        <Text className="text-red-500 ml-1 font-medium">
                          Cancel Subscription
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}

              <TouchableOpacity
                className="mt-4 mb-2 bg-white py-3 px-4 rounded-lg flex-row justify-center items-center border border-gray-200"
                onPress={goToPaymentMethods}
              >
                <CreditCard size={20} color="#333" />
                <Text className="ml-2 text-gray-800 font-semibold">
                  Manage Payment Methods
                </Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default SubscriptionStatusScreen;
