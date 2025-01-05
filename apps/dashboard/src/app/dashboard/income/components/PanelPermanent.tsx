"use client";
// 🔩 Base
import React, { useState } from "react";

// 🧱 Components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dashboard/components/Card";
import { Separator } from "@dashboard/components/Separator";
import TransactionsChart from "./ChartPermanent";
import NoData from "./NoData";

// 🗿 Models
import { type Transactions } from "../_models";

// 🔧 Libs
import { getTotalMonthAndEvolution, inEuros } from "../_utils";
import { cn } from "@dashboard/utils/style";

const Entry = ({
  name,
  total,
  evolutionFromPrevious,
  highlighted,
}: {
  name: string;
  total: number;
  evolutionFromPrevious: string | null;
  highlighted: boolean;
}) => {
  return (
    <div
      key={String(total)}
      className={cn("rounded-md p-2", highlighted && "bg-white text-black")}
    >
      <h3 className="text-xl font-semibold capitalize">{name} </h3>
      <p className="flex justify-between">
        <span>{inEuros(total)}</span>
        {evolutionFromPrevious ? (
          <span className="ml-3 text-muted-foreground">
            {evolutionFromPrevious}
          </span>
        ) : null}
      </p>
    </div>
  );
};

const YearSeparator = ({ index, month }: { index: number; month: Date }) => (
  <div className={cn("w-[40%] px-2", index !== 0 && "!mt-8")}>
    <Separator className="mb-1.5 bg-white/30" />
    <span className="text-white/70"> {month.getFullYear()}</span>
  </div>
);

/* ************** */
/*     🚀 UI      */
/* ************** */

const PanelPermanent = ({
  name,
  transactions,
}: {
  name: string;
  transactions: Transactions[];
}) => {
  const [highlightedMonth, setHighlightedMonth] = useState<number>(-1);
  const months = transactions.map(({ date }) => date).toReversed();

  if (transactions.length === 0) return <NoData />;

  return (
    <section className="flex h-full gap-6">
      <Card className="min-w-[300px] overflow-scroll border-none bg-black/90 text-white shadow-lg backdrop-blur-md">
        <CardHeader className="text-3xl font-semibold">
          <CardTitle>{name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 px-4">
          {months.map((month, index) => {
            const needsSeparator =
              index === 0 ||
              month.getFullYear() !== months[index - 1].getFullYear();
            const highlighted = index === highlightedMonth;

            const monthName = month.toLocaleDateString("fr-FR", {
              month: "long",
            });
            const { monthTotal, evolution } = getTotalMonthAndEvolution(
              month,
              transactions,
            );
            if (typeof monthTotal !== "number") return null;
            return (
              <React.Fragment key={String(month)}>
                {needsSeparator && (
                  <YearSeparator index={index} month={month} />
                )}
                <Entry
                  name={monthName}
                  total={monthTotal}
                  evolutionFromPrevious={evolution}
                  highlighted={highlighted}
                />
              </React.Fragment>
            );
          })}
        </CardContent>
      </Card>
      <TransactionsChart
        transactions={transactions}
        setHighlightedMonth={setHighlightedMonth}
      />
    </section>
  );
};

export default PanelPermanent;
