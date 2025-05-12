import React from "react";

import { Text, View } from "react-native";

import { usePreviousSubscriptions } from "@/redux/queries/recipes/useStripeQuery";

import { PreviousSubscription } from "@/lib/types/subscription";

import { PreviousSubscriptions } from "@/components/modules";
import { PreviousSubscriptionSkeleton } from "@/components/modules/Skeletons";

const previousSubscriptionScreen = () => {
  const { data, isLoading, error } = usePreviousSubscriptions();

  const subscriptions: PreviousSubscription[] | undefined = data?.subscriptions;

  if (isLoading) {
    <PreviousSubscriptionSkeleton />;
  }
  if (error) return <Text className="text-foreground p-24 text-center text-lg">Error fetching subscriptions</Text>;

  return <PreviousSubscriptions subscriptions={subscriptions || []} />;
};

export default previousSubscriptionScreen;
