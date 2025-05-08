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

export type SubscriptionStatus =
  | "active"
  | "past_due"
  | "unpaid"
  | "canceled"
  | "incomplete"
  | "trialing";
