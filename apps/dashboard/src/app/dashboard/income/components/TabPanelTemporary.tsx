"use client";

// 🔩 Base
import { useState } from "react";

// 🧱 Components
import { TabPanel } from "@/ui/components/tabs";
import TransactionsChart from "./Chart/Chart2";
import { type Transactions } from "../_models";

export default ({
  name,
  transactions,
}: {
  name: string;
  transactions: Transactions[];
}) => {
  return (
    <TabPanel className="flex h-full gap-6">
      <TransactionsChart transactions={transactions} />
    </TabPanel>
  );
};
