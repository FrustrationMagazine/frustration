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
    <TabPanel className='flex h-[65vh] gap-6'>
      <CardMonths
        cardName={name}
        transactionsByMonth={transactionsByMonth}
        highlightedMonth={highlightedMonth}
      />
      <div className='flex-grow'>
        <TransactionsChart
          transactionsByMonth={transactionsByMonth}
          setHighlightedMonth={setHighlightedMonth}
        />
      </div>
    </TabPanel>
  );
};
