import React from "react";
import { ActiveSubscription } from "@/components/modules";
import { useSelector } from "react-redux";
import { Subscription } from "@/lib/types";

const ActiveSubscriptionScreen = () => {
  const currentSubscription: Subscription = useSelector(
    (state: any) => state.auth.loginResponseType.customer_details.subscription
  );

  return (
    <ActiveSubscription
      status={currentSubscription?.status}
      planName={currentSubscription?.subscription_type as "month" | "year"}
      startDate={currentSubscription?.created_at}
      subscriptionId={currentSubscription?.stripe_subscription_id}
    />
  );
};

export default ActiveSubscriptionScreen;
