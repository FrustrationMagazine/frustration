/* ================= */
/*     CAMPAIGNS     */
/* ================= */

export type Campaign = {
  id: string;
  name: string;
  type: "permanent" | "temporary";
  tag?: string;
  goal?: number;
  begin: Date;
  end: Date | null;
};

export const CAMPAIGNS: Campaign[] = [
  {
    id: "cmp_1",
    name: "Total",
    type: "permanent",
    begin: new Date("2022-01-01"),
    end: null,
  },
  {
    id: "cmp_2",
    name: "Campagne 2024",
    type: "temporary",
    tag: "dons-fin-2024",
    goal: 40000,
    begin: new Date("2024-11-07"),
    end: null,
  },
];

/* ==================== */
/*     TRANSACTIONS     */
/* ==================== */
export type Transactions = {
  date: Date;
  type: "subscription" | "donation";
  stripe: number;
  helloasso: number;
  total: number;
};

export type TabTransactions = {
  id: string;
  name: string;
  transactionType: string;
};

export const TABS_TRANSACTIONS: TabTransactions[] = [
  { id: "tt_1", name: "Global", transactionType: "all" },
  { id: "tt_2", name: "Abonnements", transactionType: "subscription" },
  { id: "tt_3", name: "Dons", transactionType: "donation" },
];
