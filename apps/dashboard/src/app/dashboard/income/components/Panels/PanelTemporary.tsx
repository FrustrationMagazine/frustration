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

export default ({
  name,
  goal,
  begin,
  transactions,
  totalTipeee,
}: {
  name: string;
  begin: Date;
  goal: number;
  transactions: Transactions[];
  totalTipeee: number;
}) => {
  const total = transactions.reduce((acc, cv) => acc + cv.total, 0);
  const progressRoundedFirstDecimal = Math.round(
    ((total + (totalTipeee === 0 ? 10478 : totalTipeee)) * 100) / goal,
  );

  const differenceInTime = new Date().getTime() - begin.getTime();
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  const meanDay =
    (total + (totalTipeee === 0 ? 10478 : totalTipeee)) / differenceInDays;
  return (
    <>
      <Card className="min-w-[350px] overflow-scroll border-none bg-black/90 text-white shadow-lg backdrop-blur-md">
        <CardHeader className="text-3xl font-semibold">
          <CardTitle>Bilan</CardTitle>
          <CardDescription>Indications en temps réel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Début*/}
          <div>
            <h5 className="text-2xl font-bold">Début</h5>
            <p className="text-xl">{explicitDate(begin)}</p>
          </div>
          {/* Durée */}
          <div>
            <h5 className="text-2xl font-bold">Durée</h5>
            <p className="text-xl">{differenceInDays} jours</p>
          </div>
          {/* Objectif */}
          <div>
            <h5 className="text-2xl font-bold">Objectif</h5>
            <p className="text-xl">{inEuros(goal)} </p>
          </div>
          {/* Total page*/}
          <div>
            <h5 className="text-2xl font-bold">Dons site</h5>
            <p className="text-xl">{inEuros(total)} </p>
          </div>
          {/* Tipeee */}
          <div>
            <h5 className="text-2xl font-bold">Tipeee</h5>
            <p className="text-xl">
              {inEuros(totalTipeee === 0 ? 10478 : totalTipeee)}
            </p>
          </div>
          {/* Total + Tipeee */}
          <div>
            <h5 className="text-2xl font-bold">Dons site + Tipeee</h5>
            <p className="text-xl">
              {inEuros(total + (totalTipeee === 0 ? 10478 : totalTipeee))}
            </p>
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
    </>
  );
};
