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

export interface Transaction {
  id: string;
  created: Date;
  available: Date;
  amount: number;
  net: number;
  source: string;
  type: string;
  status: string;
}
