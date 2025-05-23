import React from "react";
import { ManageSubscription } from "@/components/modules";
import { useSelector } from "react-redux";

import { Subscription } from "@/lib/types";

const ManageSubscriptionScreen = () => {
  const currentSubscription: Subscription = useSelector(
    (state: any) => state?.auth?.loginResponseType?.customer_details?.subscription
  );

  return (
    <ManageSubscription
      status={currentSubscription?.status}
      planName={currentSubscription?.subscription_type as "month" | "year"}
      startDate={currentSubscription?.created_at}
      subscriptionId={currentSubscription?.stripe_subscription_id}
    />
  );
};

export default ManageSubscriptionScreen;
