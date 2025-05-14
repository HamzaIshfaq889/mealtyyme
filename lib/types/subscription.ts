export type ProductPrice = {
  stripe_price_id: string;
  amount: string;
  currency: string;
  interval: "month" | "year";
  active: boolean;
};

export type Packages = {
  stripe_product_id: string;
  name: string;
  description: string;
  active: boolean;
  prices: ProductPrice[];
}[];

export type PreviousSubscription = {
  id: string;
  status: "active" | "canceled" | "incomplete" | string;
  current_period_start: string | null;
  current_period_end: string;
  next_billing_date: string;
  created: number;
  canceled_at: string | null;
  plan: {
    id: string;
    interval: "month" | "year";
    amount: number;
    currency: string;
    product_id: string;
  };
  payment_method: {
    id: string;
    type: string;
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
};

export type SubscriptionsResponse = {
  subscriptions: PreviousSubscription[];
};

export type PaymentMethod = {
  id: string;
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
};

export type PaymentMethodsResponse = { paymentMethods: PaymentMethod[] };

export type SubscriptionStatus =
  | "active"
  | "past_due"
  | "unpaid"
  | "canceled"
  | "incomplete"
  | "trialing";
