export enum TRANSACTION_TYPES {
  SUBSCRIPTION = "subscription",
  DONATION = "donation",
  PAYMENT_FOR_INVOICE = "payment_for_invoice",
  SALE = "sale",
  PAYOUT = "payout",
  REFUND = "refund",
  FEE = "fee",
  OTHER = "other"
}

export enum TRANSACTION_SUBTYPES {
  SUBSCRIPTION_CREATION = "creation",
  SUBSCRIPTION_UPDATE = "update"
}

export interface Transaction {
  id: string;
  created: Date;
  available: Date;
  amount: number;
  net: number;
  stripe_source: string | null;
  source: string;
  type: string;
  subtype: "creation" | "update" | null;
  status: string;
}
