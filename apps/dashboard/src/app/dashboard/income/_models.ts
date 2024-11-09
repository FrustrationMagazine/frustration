export type TransactionType = "subscription" | "donation";

type CampaignType = "permanent" | "temporary";

export type Tab = {
  name: string;
  transactionsTypes: TransactionType[];
  campaignType: CampaignType;
};

export type Transactions = {
  date: Date;
  type: TransactionType;
  stripe: number;
  helloasso: number;
  total: number;
};
// 👉 Example of what it looks like
// {
//   date: 2020-05-20T00:00:00.000Z,
//   type: 'subscription',
//   stripe: 100,
//   helloasso: 100,
//   total: 200
// }

export type Campaign = {
  name: string;
  type: CampaignType;
  tag?: string;
  goal?: number;
  begin: Date;
  end: Date | null;
};
