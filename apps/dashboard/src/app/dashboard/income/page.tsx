"use client";

import { useState, useEffect } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@/ui/components/tabs";
import TransactionsChart from "./_components/TransactionsChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/components/card";
import { getTransactionsByMonth } from "./_actions/getTransactionsByMonth";
import type { TransactionsByMonth } from "./_models/transactionsByMonth";
import { inEuros, diffInPercent, groupByMonthAndSum, getTotalMonthAndEvolution } from "./_utils";
import { cn } from "@dashboard/libs/utils";
import { Separator } from "@/ui/components/separator";

type Tab = {
  name: string;
  types: string[];
};

const Income = () => {
  const [transactions, setTransactions] = useState<TransactionsByMonth[]>([]);
  // const [month, setMonth] = useState<Date | null>(new Date());
  // 👉 What it looks like
  // {
  //   month: 2020-05-20T00:00:00.000Z,
  //   type: 'subscription',
  //   stripe: 100,
  //   helloasso: 100,
  //   total: 200
  // }

  useEffect(() => {
    async function fetchTransactionsByMonth() {
      const result = await getTransactionsByMonth();
      if (result) {
        setTransactions(result);
        // const lastMonth = result.at(-1)?.month;
        // if (lastMonth) setMonth(lastMonth);
      }
    }
    fetchTransactionsByMonth();
  }, []);

  const tabs: Tab[] = [
    { name: "Tout", types: ["subscription", "donation"] },
    { name: "Abonnements", types: ["subscription"] },
    { name: "Dons", types: ["donation"] },
  ];

  return (
    <TabGroup className='w-full px-4 pt-14'>
      <TabList className='mx-auto mb-16 flex w-fit justify-center gap-4 rounded-full bg-black p-2 shadow-lg backdrop-blur-md'>
        {tabs.map(({ name }) => (
          <Tab
            key={name}
            className='rounded-full px-5 py-1 text-lg font-semibold text-primary text-white transition focus:outline-none data-[selected]:bg-zinc-800 data-[focus]:outline-1 data-[focus]:outline-black'
          >
            {name}
          </Tab>
        ))}
      </TabList>
      <TabPanels className='mx-auto w-[80%]'>
        {tabs.map(({ name, types }) => {
          let chartData = transactions.filter(({ type }) => types.includes(type));
          if (types.length > 1) chartData = groupByMonthAndSum(chartData);

          const allMonths = chartData.map(({ month }) => month).toReversed();

          return (
            <TabPanel key={name} className='flex gap-6'>
              <Card className='max-h-[1000px] min-w-[350px] overflow-scroll border-none bg-black/90 text-white backdrop-blur-md'>
                <CardHeader className='text-3xl font-semibold'>
                  <CardTitle>{name}</CardTitle>
                  <CardDescription>Par mois</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {allMonths.map((month, index) => {
                    const isNewYear =
                      index === 0 || month.getFullYear() !== allMonths[index - 1].getFullYear();

                    const YearSeparator = isNewYear ? (
                      <p className={cn(index > 0 && "!mt-8")}>
                        <Separator className='mb-1.5 bg-white/30' />
                        <span className='text-white/70'> {month.getFullYear()}</span>
                      </p>
                    ) : null;

                    const { totalMonth, evolution } = getTotalMonthAndEvolution(month, chartData);

                    return month && totalMonth && typeof totalMonth === "number" ? (
                      <>
                        {YearSeparator}
                        <div key={String(month)}>
                          <h3 className='text-xl font-semibold capitalize'>
                            {month.toLocaleDateString("fr-FR", { month: "long" })}{" "}
                            {index === 0 ? (
                              <span className='text-sm lowercase italic text-muted-foreground'>
                                {" "}
                                (en cours)
                              </span>
                            ) : null}
                          </h3>
                          <p className='flex justify-between'>
                            <span>{inEuros(totalMonth)}</span>
                            {evolution ? (
                              <span className='ml-3 text-muted-foreground'>{evolution}</span>
                            ) : null}
                          </p>
                        </div>
                      </>
                    ) : null;
                  })}
                </CardContent>
              </Card>
              <TransactionsChart name={name} chartData={chartData} />
            </TabPanel>
          );
        })}
      </TabPanels>
    </TabGroup>
  );
};

export default Income;
