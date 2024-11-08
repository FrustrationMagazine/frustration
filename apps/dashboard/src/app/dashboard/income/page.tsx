// 💥 Fetch
import { getTransactions } from "./_actions";

// 🧱 Components
import { TabGroup, TabPanels } from "@/ui/components/tabs";
import TabList from "./components/TabList";
import TabPanelPermanent from "./components/TabPanelPermanent";
import TabPanelTemporary from "./components/TabPanelTemporary";

// 🔧 Libs
import { groupByAndSum } from "./_utils";
import { stripe } from "@/data-access/stripe";

// 🗿 Models
import { type Tab as TabType } from "./_models";

// 📦 Data
const tabs: TabType[] = [
  {
    name: "Global",
    transactionsTypes: ["subscription", "donation"],
    campaignType: "permanent",
  },
  {
    name: "Abonnements",
    transactionsTypes: ["subscription"],
    campaignType: "permanent",
  },
  { name: "Dons", transactionsTypes: ["donation"], campaignType: "permanent" },
  {
    name: "✨ Campagne",
    transactionsTypes: ["subscription", "donation"],
    campaignType: "temporary",
  },
];

export default async () => {
  const transactionsByMonth = await getTransactions({ period: "month" });

  // Campaign 2024
  const beginDate = new Date("2024-11-07");
  let transactionsCampaign: any[] = [];
  let has_more;
  let starting_after;
  do {
    const resTransactionsCampaign = (await stripe.charges.list({
      created: {
        gte: beginDate.getTime() / 1000,
      },
      limit: 100,
      starting_after: starting_after,
    })) as any;
    has_more = resTransactionsCampaign.has_more;
    if (has_more) starting_after = resTransactionsCampaign.data.at(-1)?.id;
    transactionsCampaign = [
      ...transactionsCampaign,
      ...resTransactionsCampaign.data,
    ];
  } while (has_more);
  console.log("🚀 ~ transactionsCampaign", transactionsCampaign.length);

  transactionsCampaign = transactionsCampaign.filter(
    ({
      status,
      paid,
      metadata,
    }: {
      status: string;
      paid: boolean;
      metadata: any;
    }) =>
      status === "succeeded" && paid && metadata?.campaign === "dons-fin-2024",
  );
  console.log("🚀 ~ transactionsCampaign:", transactionsCampaign.length);

  transactionsCampaign = transactionsCampaign.reduce(
    (acc, { created, amount }) => {
      const alreadyRegisteredDay = acc.find(
        ({ date }: any) =>
          date.toDateString() === new Date(created * 1000).toDateString(),
      );

      if (alreadyRegisteredDay) {
        alreadyRegisteredDay.total += amount;
      } else {
        const newDate = new Date(created * 1000);
        acc.push({
          date: new Date(
            newDate.getFullYear(),
            newDate.getMonth(),
            newDate.getDate(),
          ),
          total: amount,
        });
      }
      return acc;
    },
    [],
  );

  transactionsCampaign = transactionsCampaign.toReversed();
  console.log("transactionsCampaign", transactionsCampaign);

  // ❌ Early return if no data
  if (transactionsByMonth.length === 0)
    return (
      <h3 className="grid w-[50%] max-w-[700px] grow place-items-center text-center text-2xl font-bold">
        🤷‍♂️ Aucune donnée disponible à afficher, essayez de mettre à jour la base
        de données depuis l'onglet "Mises à jour"
      </h3>
    );

  return (
    <TabGroup className="flex h-full w-full flex-col">
      <TabList tabs={tabs} />
      <TabPanels className="grow overflow-auto">
        {tabs.map(({ name, transactionsTypes, campaignType }) => {
          /* PERMANENT */
          if (campaignType === "permanent") {
            let filteredTransactionsByMonth = transactionsByMonth.filter(
              ({ type }) => transactionsTypes.includes(type),
            );
            filteredTransactionsByMonth = groupByAndSum(
              filteredTransactionsByMonth,
            );
            return (
              <TabPanelPermanent
                key={name}
                name={name}
                transactionsByMonth={filteredTransactionsByMonth}
              />
            );
          }

          /* TEMPORARY */
          if (campaignType === "temporary") {
            return (
              <TabPanelTemporary
                key={name}
                name={name}
                transactions={transactionsCampaign}
              />
            );
          }

          return null;
        })}
      </TabPanels>
    </TabGroup>
  );
};
