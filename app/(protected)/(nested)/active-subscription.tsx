import React from "react";
import { ActiveSubscription } from "@/components/modules";

const ActiveSubscriptionScreen = () => {
  const handleChangePlan = () => {};
  return (
    <ActiveSubscription
      status="active"
      planName="Premium Annual"
      startDate="Jun 15, 2023"
      price="$50/Year"
      nextBillingDate="2025-06-06 11:32 UTC"
      subscriptionId="sub_tr1JjEQ9"
      onChangePlan={handleChangePlan}
    />
  );
};

export default ActiveSubscriptionScreen;
