export enum TRANSACTION_TYPES {
  SUBSCRIPTION = "subscription",
  DONATION = "donation",
  PAYMENT_FOR_INVOICE = "payment_for_invoice",
  SALE = "sale",
  PAYOUT = "payout",
  REFUND = "refund",
  FEE = "fee",
  OTHER = "other",
}

export interface StripeTransaction {
  id: string;
  amount: number;
  available_on: number;
  created: number;
  description: string;
  net: number;
  status: string;
}

export interface HelloAssoTransaction {
  id: string;
  date: string;
  amount: number;
  items: { type: string }[];
  state: string;
}

export interface FormattedTransaction {
  id: string;
  created: Date;
  available: Date;
  amount: number;
  net: number;
  source: string;
  type: string;
  status: string;
}
