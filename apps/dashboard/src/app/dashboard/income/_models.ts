/* ==================== */
/*     TRANSACTIONS     */

import { generateUniqueCombinations } from "./_utils";

/* ==================== */
export type TransactionType = "subscription" | "donation";

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

/* ================= */
/*     CAMPAIGNS     */
/* ================= */
type CampaignType = "permanent" | "temporary";

export type Campaign = {
  name: string;
  type: CampaignType;
  tag?: string;
  goal?: number;
  begin: Date;
  end: Date | null;
};
// 👉 Example of what it looks like
// {
//   name: 'Campagne fin 2024',
//   type: 'temporary',
//   tag: 'dons-fin-2024',
//   goal: 40000,
//   begin: 2024-11-07T00:00:00.000Z,
//   end: null
// }

export const CAMPAIGNS: Campaign[] = [
  {
    name: "Régulier",
    type: "permanent",
    begin: new Date("2022-01-01"),
    end: null,
  },
  {
    name: "Campagne 2024",
    type: "temporary",
    tag: "dons-fin-2024",
    goal: 40000,
    begin: new Date("2024-11-07"),
    end: null,
  },
];

/* ============ */
/*     TABS     */
/* ============ */
export type TabCampaign = {
  name: string;
  transactionsTypes: TransactionType[];
  campaignType: CampaignType;
};
// 👉 Example of what it looks like
// {
//   name: 'Campagne fin 2024',
//   transactionsTypes: ['subscription', 'donation'],
//   campaignType: 'temporary'
// }

export type TabTransactions = TabCampaign & {
  goal: number;
  begin: Date;
  tag: string;
};

export const TRANSACTION_TYPES = generateUniqueCombinations<string>([
  "subscription",
  "donation",
]);

export const TRANSACTIONS_TABS: any[] = CAMPAIGNS.map((campaign) => {
  return TRANSACTION_TYPES.map((transactionsTypes) => {
    let name;
    if (transactionsTypes.length > 1) name = "Global";
    if (
      transactionsTypes.length === 1 &&
      transactionsTypes[0] === "subscription"
    )
      name = "Abonnements";
    if (transactionsTypes.length === 1 && transactionsTypes[0] === "donation")
      name = "Dons";

    return {
      name,
      campaignName: campaign.name,
      campaignType: campaign.type,
      begin: campaign?.begin,
      tag: campaign?.tag,
      goal: campaign?.goal,
      transactionsTypes,
    };
  });
});
