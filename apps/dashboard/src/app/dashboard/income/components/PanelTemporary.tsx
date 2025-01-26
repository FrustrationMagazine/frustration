"use client";

// 🧱 Components
import TransactionsChart from "./ChartTemporary";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@dashboard/components/Card";
import NoData from "./NoData";

// 🗿 Models
import { type Transactions } from "../_models";

// 🔧 Libs
import { inEuros } from "../_utils";
import { explicitDate } from "@/utils/dates";

const Entry = ({ title, value }: { title: string; value: string | number }) => (
  <div>
    <h5 className="text-xl font-bold">{title}</h5>
    <p className="text-lg">{value}</p>
  </div>
);

/* ************** */
/*     🚀 UI      */
/* ************** */

const PanelTemporary = ({
  goal,
  begin,
  end,
  transactions,
  totalTipeee,
}: {
  begin: Date;
  end?: Date;
  goal: number;
  transactions: Transactions[];
  totalTipeee: number;
}) => {
  if (transactions.length === 0) return <NoData />;

  const total = transactions.reduce((acc, cv) => acc + cv.total, 0);
  const progress = Math.round(((total + totalTipeee) * 100) / goal);

  const differenceInTime = new Date().getTime() - begin.getTime();
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  const meanDay = (total + totalTipeee) / differenceInDays;
  return (
    <section className="flex h-full gap-6">
      <Card className="min-w-[250px] overflow-scroll border-none bg-black/90 text-white shadow-lg backdrop-blur-md">
        <CardHeader className="text-3xl font-semibold">
          <CardTitle>Bilan</CardTitle>
          <CardDescription>Indications en temps réel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Entry title="Début" value={explicitDate(begin)} />
          {end && <Entry title="Fin" value={explicitDate(end)} />}
          <Entry title="Durée" value={`${differenceInDays} jours`} />
          <Entry title="Objectif" value={inEuros(goal)} />
          <Entry title="Progression" value={`${progress}%`} />
          <Entry title="Stripe + Tipeee" value={inEuros(total + totalTipeee)} />
          <Entry title="Stripe" value={inEuros(total)} />
          <Entry title="Tipeee" value={inEuros(totalTipeee)} />
          <Entry title="Moyenne journalière" value={inEuros(meanDay)} />
        </CardContent>
      </Card>
      <TransactionsChart transactions={transactions} />
    </section>
  );
};

export default PanelTemporary;
