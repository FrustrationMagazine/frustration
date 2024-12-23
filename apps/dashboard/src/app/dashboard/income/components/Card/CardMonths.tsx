"use client";

// 🔩 Base
import React from "react";

// 🧱 Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/components/card";
import { Separator } from "@/ui/components/separator";
import BulletMonth from "./BulletMonth";

// 🗿 Models
import { type Transactions } from "../../_models";

// 🔧 Libs
import { cn } from "@/utils/tailwind";
import { getTotalMonthAndEvolution } from "../../_utils";

export default ({
  cardName,
  transactions,
  highlightedMonth,
}: {
  cardName: string;
  transactions: Transactions[];
  highlightedMonth: number;
}) => {
  const months = transactions.map(({ date }) => date).toReversed();
  return (
    <Card className="min-w-[350px] overflow-scroll border-none bg-black/90 text-white shadow-lg backdrop-blur-md">
      <CardHeader className="text-3xl font-semibold">
        <CardTitle>{cardName}</CardTitle>
        <CardDescription>Par mois</CardDescription>
      </CardHeader>
      <CardContent className="space-y-1 px-4">
        {months.map((month, index) => {
          const isFirstMonthOfList = index === 0;
          const isFirstMonthOfAYear =
            !isFirstMonthOfList &&
            month.getFullYear() !== months[index - 1].getFullYear();
          const isStartingNewYear = isFirstMonthOfList || isFirstMonthOfAYear;
          const isHighlighted = index === highlightedMonth;

          const YearSeparator = isStartingNewYear ? (
            <div className={cn("w-[40%] px-2", !isFirstMonthOfList && "!mt-8")}>
              <Separator className="mb-1.5 bg-white/30" />
              <span className="text-white/70"> {month.getFullYear()}</span>
            </div>
          ) : null;

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
