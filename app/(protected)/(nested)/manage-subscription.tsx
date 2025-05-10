import React from "react";
import { ManageSubscription } from "@/components/modules";

const ManageSubscriptionScreen = () => {
  const handleChangePlan = () => {};
  
  return (
    <ManageSubscription
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

export default ManageSubscriptionScreen;
