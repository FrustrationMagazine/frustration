"use client";

// 🔩 Base
import React from "react";

// 🧱 Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/components/card";
import { Separator } from "@/ui/components/separator";
import BulletMonth from "./BulletMonth";

// 🗿 Models
import { type TransactionsByMonth } from "../../_models";

// 🔧 Libs
import { cn } from "@dashboard/libs/utils";
import { getTotalMonthAndEvolution, inEuros } from "../../_utils";

export default ({
  cardName,
  transactionsByMonth,
  highlightedMonth,
}: {
  cardName: string;
  transactionsByMonth: TransactionsByMonth[];
  highlightedMonth: number;
}) => {
  const months = transactionsByMonth.map(({ month }) => month).toReversed();

  return (
    <Card className='min-w-[350px] overflow-scroll border-none bg-black/90 text-white shadow-lg backdrop-blur-md'>
      <CardHeader className='text-3xl font-semibold'>
        <CardTitle>{cardName}</CardTitle>
        <CardDescription>Par mois</CardDescription>
      </CardHeader>
      <CardContent className='space-y-1 px-4'>
        {months.map((month, index) => {
          const isFirstMonthOfList = index === 0;
          const isFirstMonthOfAYear =
            !isFirstMonthOfList && month.getFullYear() !== months[index - 1].getFullYear();
          const isStartingNewYear = isFirstMonthOfList || isFirstMonthOfAYear;
          const isHighlighted = index === highlightedMonth;

          const YearSeparator = isStartingNewYear ? (
            <div className={cn("w-[40%] px-2", !isFirstMonthOfList && "!mt-8")}>
              <Separator className='mb-1.5 bg-white/30' />
              <span className='text-white/70'> {month.getFullYear()}</span>
            </div>
          ) : null;

          const monthName = month.toLocaleDateString("fr-FR", { month: "long" });
          const { monthTotal, evolution } = getTotalMonthAndEvolution(month, transactionsByMonth);
          if (typeof monthTotal !== "number") return null;
          return (
            <React.Fragment key={String(month)}>
              {YearSeparator}
              <BulletMonth
                monthName={monthName}
                monthTotal={monthTotal}
                evolutionFromLastMonthInPercent={evolution}
                isHighlighted={isHighlighted}
              />
            </React.Fragment>
          );
        })}
      </CardContent>
    </Card>
  );
};
