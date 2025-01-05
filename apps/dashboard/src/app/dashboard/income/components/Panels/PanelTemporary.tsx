"use client";

// 🧱 Components
import TransactionsChart from "../Chart/Chart2";
import { type Transactions } from "../../_models";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/components/card";

// 🔧 Libs
import { inEuros } from "../../_utils";
import { explicitDate } from "@/utils/dates";

const Entry = ({ title, value }: { title: string; value: string | number }) => (
  <div>
    <h5 className="text-2xl font-bold">{title}</h5>
    <p className="text-xl">{value}</p>
  </div>
);

export default ({
  goal,
  begin,
  transactions,
  totalTipeee,
}: {
  begin: Date;
  goal: number;
  transactions: Transactions[];
  totalTipeee: number;
}) => {
  const total = transactions.reduce((acc, cv) => acc + cv.total, 0);
  const progress = Math.round(((total + totalTipeee) * 100) / goal);

  const differenceInTime = new Date().getTime() - begin.getTime();
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  const meanDay = (total + totalTipeee) / differenceInDays;
  return (
    <>
      <Card className="min-w-[350px] overflow-scroll border-none bg-black/90 text-white shadow-lg backdrop-blur-md">
        <CardHeader className="text-3xl font-semibold">
          <CardTitle>Bilan</CardTitle>
          <CardDescription>Indications en temps réel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Entry title="Début" value={explicitDate(begin)} />
          <Entry title="Durée" value={differenceInDays} />
          <Entry title="Objectif" value={inEuros(goal)} />
          <Entry title="Stripe" value={inEuros(total)} />
          <Entry title="Tipeee" value={inEuros(totalTipeee)} />
          <Entry title="Stripe" value={inEuros(total + totalTipeee)} />
          <Entry title="Progression" value={`${progress}%`} />
          <Entry title="Moyenne journalière" value={inEuros(meanDay)} />
        </CardContent>
      </Card>
      <TransactionsChart transactions={transactions} />
    </>
  );
};
