// 💥 Fetch
import { getTransactions } from "./_actions";

// 🧱 Components
import { TabGroup, TabPanels } from "@/ui/components/tabs";
import CustomTabList from "./components/TabList";
import { TabPanel, TabList, Tab } from "@/ui/components/tabs";
import TabPanelPermanent from "./components/TabPanelPermanent";
import TabPanelTemporary from "./components/TabPanelTemporary";

// 🔧 Libs
import { groupByAndSum, generateUniqueCombinations } from "./_utils";
import { stripe } from "@/data-access/stripe";

// 🗿 Models
import { type Tab as TabType, type Campaign } from "./_models";

export const dynamic = "force-dynamic";

// 📦 Data
const campaigns: Campaign[] = [
  {
    name: "Régulier",
    type: "permanent",
    begin: new Date("2022-01-01"),
    end: null,
  },
  {
    name: "Campagne 2024",
    type: "temporary",
    tag: "dons-fin-2024",
    goal: 40000,
    begin: new Date("2024-11-07"),
    end: null,
  },
];

const TRANSACTION_TYPES = generateUniqueCombinations<string>([
  "subscription",
  "donation",
]);
TRANSACTION_TYPES.sort((a, b) => b.length - a.length);

const TABS_GROUPS: any[] = campaigns.map((campaign) => {
  return TRANSACTION_TYPES.map((transactionsTypes) => {
    let name;
    if (transactionsTypes.length > 1) name = "Global";
    if (
      transactionsTypes.length === 1 &&
      transactionsTypes[0] === "subscription"
    )
      name = "Abonnements";
    if (transactionsTypes.length === 1 && transactionsTypes[0] === "donation")
      name = "Dons";

    return {
      name,
      campaignName: campaign.name,
      campaignType: campaign.type,
      begin: campaign?.begin,
      tag: campaign?.tag,
      goal: campaign?.goal,
      transactionsTypes,
    };
  });
});

const NoData = (
  <h3 className="grid w-[50%] max-w-[700px] grow place-items-center text-center text-2xl font-bold">
    🤷‍♂️ Aucune donnée disponible à afficher, essayez de mettre à jour la base de
    données depuis l'onglet "Mises à jour"
  </h3>
);

/* ============================================= */
/*              🚀 Component                     */
/* ============================================= */
export default async () => {
  let transactionsByMonth = await getTransactions({ period: "month" });

  // ❌ Early return if no data
  if (transactionsByMonth.length === 0) return NoData;

  return (
    <TabGroup className="flex h-full w-full flex-col">
      <TabList className="mx-auto mb-5 w-fit rounded-sm bg-white p-2">
        {campaigns.map(({ name }) => (
          <Tab className="rounded-sm p-3 font-bold uppercase focus:outline-none data-[selected]:bg-zinc-100">
            {name}
          </Tab>
        ))}
      </TabList>
      <TabPanels className="overflow-auto">
        {TABS_GROUPS.map((tabs) => {
          return (
            <TabPanel className="h-full w-full">
              <TabGroup className="flex h-full w-full flex-col items-center">
                <CustomTabList tabs={tabs} />
                <TabPanels className="w-full grow overflow-auto">
                  {tabs.map(
                    async ({
                      name,
                      transactionsTypes,
                      campaignType,
                      goal,
                      begin,
                      tag,
                    }: {
                      name: string;
                      transactionsTypes: string[];
                      campaignType: string;
                      goal: number;
                      begin: Date;
                      tag: string;
                    }) => {
                      /* 📅 PERMANENT */
                      if (campaignType === "permanent") {
                        // ❌ Early return if no transactions by month
                        if (transactionsByMonth.length === 0) return NoData;
                        const filteredTransactionsByMonth =
                          transactionsByMonth.filter(({ type }) =>
                            transactionsTypes.includes(type),
                          );
                        const groupedTransactionsByMonth = groupByAndSum(
                          filteredTransactionsByMonth,
                        );
                        return (
                          <TabPanelPermanent
                            key={name}
                            name={name}
                            transactionsByMonth={groupedTransactionsByMonth}
                          />
                        );
                      }

                      /* ⌛ TEMPORARY */
                      if (campaignType === "temporary") {
                        // Campaign 2024
                        let transactionsCampaign: any[] = [];
                        let has_more;
                        let starting_after;
                        do {
                          const resTransactionsCampaign =
                            (await stripe.charges.list({
                              created: {
                                gte: begin.getTime() / 1000,
                              },
                              limit: 100,
                              starting_after: starting_after,
                            })) as any;
                          has_more = resTransactionsCampaign.has_more;
                          if (has_more)
                            starting_after =
                              resTransactionsCampaign.data.at(-1)?.id;
                          transactionsCampaign = [
                            ...transactionsCampaign,
                            ...resTransactionsCampaign.data,
                          ];
                        } while (has_more);

                        if (transactionsCampaign.length === 0) return NoData;

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
                            status === "succeeded" &&
                            paid &&
                            metadata?.campaign === tag,
                        );

                        let filteredTransactionsCampaign: any[] = [];
                        if (transactionsTypes.includes("subscription"))
                          filteredTransactionsCampaign = [
                            ...filteredTransactionsCampaign,
                            ...transactionsCampaign.filter(
                              ({ invoice }) => invoice,
                            ),
                          ];
                        if (transactionsTypes.includes("donation"))
                          filteredTransactionsCampaign = [
                            ...filteredTransactionsCampaign,
                            ...transactionsCampaign.filter(
                              ({ invoice }) => !invoice,
                            ),
                          ];

                        // Group
                        filteredTransactionsCampaign =
                          filteredTransactionsCampaign.reduce(
                            (acc, { created, amount }) => {
                              const alreadyRegisteredDay = acc.find(
                                ({ date }: any) =>
                                  date.toDateString() ===
                                  new Date(created * 1000).toDateString(),
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

                        // Order by date
                        filteredTransactionsCampaign.sort(
                          (a, b) => a.date - b.date,
                        );

                        return (
                          <TabPanelTemporary
                            key={name}
                            name={name}
                            begin={begin}
                            goal={goal}
                            transactions={filteredTransactionsCampaign}
                          />
                        );
                      }

                      return null;
                    },
                  )}
                </TabPanels>
              </TabGroup>
            </TabPanel>
          );
        })}
      </TabPanels>
    </TabGroup>
  );
};
