import React from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@/ui/components/tabs";
import TransactionsChart from "./_components/TransactionsChart";
import { prisma } from "../../../../prisma/prisma";
const Income = async () => {
  const transactions = await prisma.$queryRaw`
     SELECT
      DATE_TRUNC('month', created) as month,
      SUM(CASE WHEN source = 'stripe' THEN net ELSE 0 END) as stripe,
      SUM(CASE WHEN source = 'helloasso' THEN net ELSE 0 END)  as helloasso,
      SUM(net) as total
    FROM
      "BalanceTransactions"
    WHERE type='subscription'
    GROUP BY
      month
    ORDER BY
      month ASC
  `;
  // 👉 What it looks like
  // {
  //   day: 2020-05-20T00:00:00.000Z,
  //   source: 'helloasso',
  //   type: 'subscription',
  //   amount: 20,
  //   net: 20
  // }

  const tabs = [
    { name: "Par mois", precision: "month" },
    { name: "Par jour", precision: "day" },
  ];

  return (
    <div className='flex w-full justify-center px-4 pt-14'>
      <TabGroup>
        <TabList className='mx-auto mb-16 flex w-fit justify-center gap-4 rounded-full bg-black p-2 shadow-lg backdrop-blur-md'>
          {tabs.map(({ name }) => (
            <Tab
              key={name}
              className='rounded-full px-5 py-1 text-lg font-semibold text-primary text-white transition focus:outline-none data-[hover]:bg-zinc-900 data-[hover]:data-[selected]:bg-zinc-800 data-[selected]:bg-zinc-800 data-[focus]:outline-1 data-[focus]:outline-black'
            >
              {name}
            </Tab>
          ))}
        </TabList>
        <TabPanels className='rounded-md bg-transparent p-10 backdrop-blur-md'>
          {/* {tabs.map(({ name, precision }) => (
              <TabPanel key={name} className='rounded-xl bg-white/5 p-3'>
                <p>{precision}</p>
              </TabPanel>
            ))} */}
          <TransactionsChart chartData={transactions} />
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default Income;
