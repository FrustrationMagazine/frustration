export type TransactionType = "subscription" | "donation";

export type Tab = {
  name: string;
  transactionsTypes: TransactionType[];
};

export type TransactionsByMonth = {
  month: Date;
  transactionType: TransactionType;
  stripe: number;
  helloasso: number;
  total: number;
};
// 👉 Example of what it looks like
// {
//   month: 2020-05-20T00:00:00.000Z,
//   type: 'subscription',
//   stripe: 100,
//   helloasso: 100,
//   total: 200
// }
