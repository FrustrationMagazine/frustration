"use client";

// 🔩 Base
import { useState } from "react";

// 🧱 Components
import { TabPanel } from "@/ui/components/tabs";
import CardMonths from "../Card/CardMonths";
import TransactionsChart from "../Chart/Chart";
import { type Transactions } from "../../_models";

export default ({
  name,
  transactions,
}: {
  name: string;
  transactions: Transactions[];
}) => {
  const [highlightedMonth, setHighlightedMonth] = useState<number>(-1);

  return (
    <>
      <CardMonths
        cardName={name}
        transactions={transactions}
        highlightedMonth={highlightedMonth}
      />
      <TransactionsChart
        transactions={transactions}
        setHighlightedMonth={setHighlightedMonth}
      />
    </>
  );
};
