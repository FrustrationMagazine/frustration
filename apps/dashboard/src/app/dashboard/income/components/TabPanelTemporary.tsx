"use client";

// 🧱 Components
import { TabPanel } from "@/ui/components/tabs";
import TransactionsChart from "./Chart/Chart2";
import { type Transactions } from "../_models";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/components/card";

// 🔧 Libs
import { inEuros } from "../_utils";

export default ({
  name,
  goal,
  begin,
  transactions,
}: {
  name: string;
  begin: Date;
  goal: number;
  transactions: Transactions[];
}) => {
  console.log(goal, "goal");
  const total = transactions.reduce((acc, cv) => acc + cv.total / 100, 0);
  const progressRoundedFirstDecimal = Math.round((total * 1000) / goal) / 10;

  const differenceInTime = new Date().getTime() - begin.getTime();
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  const meanDay = total / differenceInDays;
  return (
    <TabPanel className="flex h-full gap-6">
      <Card className="min-w-[350px] overflow-scroll border-none bg-black/90 text-white shadow-lg backdrop-blur-md">
        <CardHeader className="text-3xl font-semibold">
          <CardTitle>Bilan</CardTitle>
          <CardDescription>Indications en temps réel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Débutée il y a */}
          <div>
            <h5 className="text-2xl font-bold">Durée</h5>
            <p className="text-xl">{differenceInDays} jours</p>
          </div>
          {/* Objectif */}
          <div>
            <h5 className="text-2xl font-bold">Objectif</h5>
            <p className="text-xl">{inEuros(goal)} </p>
          </div>
          {/* Total */}
          <div>
            <h5 className="text-2xl font-bold">Total</h5>
            <p className="text-xl">{inEuros(total)} </p>
          </div>
          {/* Progress */}
          <div>
            <h5 className="text-2xl font-bold">Progression</h5>
            <p className="text-xl">{progressRoundedFirstDecimal}%</p>
          </div>
          {/* Moyenne journalière */}
          <div>
            <h5 className="text-2xl font-bold">Moyenne journalière</h5>
            <p className="text-xl">{inEuros(meanDay)}</p>
          </div>
        </CardContent>
      </Card>
      <TransactionsChart transactions={transactions} />
    </TabPanel>
  );
};
