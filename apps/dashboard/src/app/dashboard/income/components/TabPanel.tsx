"use client";

// 🔩 Base
import { useState } from "react";

// 🧱 Components
import { TabPanel } from "@/ui/components/tabs";
import CardMonths from "./Card/CardMonths";
import TransactionsChart from "./Chart/Chart";
import { type TransactionsByMonth } from "../_models";

export default ({
  name,
  transactionsByMonth,
}: {
  name: string;
  transactionsByMonth: TransactionsByMonth[];
}) => {
  const [highlightedMonth, setHighlightedMonth] = useState<number>(-1);

  return (
    <TabPanel className='flex h-full gap-6'>
      <CardMonths
        cardName={name}
        transactionsByMonth={transactionsByMonth}
        highlightedMonth={highlightedMonth}
      />
      <TransactionsChart
        transactionsByMonth={transactionsByMonth}
        setHighlightedMonth={setHighlightedMonth}
      />
    </TabPanel>
  );
};
