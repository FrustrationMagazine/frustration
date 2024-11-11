// 💥 Fetch
import { getTransactions, getTransactionsForCampaign } from "./_actions";

// 🧱 Components
import { TabGroup, TabPanels, TabPanel } from "@/ui/components/tabs";
import TransactionTypeTabs from "./components/Tabs/TransactionTypeTabs";
import CampaignTabs from "./components/Tabs/CampaignTabs";
import PanelPermanent from "./components/Panels/PanelPermanent";
import PanelTemporary from "./components/Panels/PanelTemporary";
import NoData from "./components/NoData";

// 🔧 Libs
import { groupByAndSum, arraysEqual } from "./_utils";

// 🗿 Models
import { CAMPAIGNS, TRANSACTIONS_TABS, type TabTransactions } from "./_models";

// 🧰 Config
export const dynamic = "force-dynamic";

const processPermanent = (transactions: any, transactionsTypes: any) => {
  // 🔬 Filter transaction type
  let processedTransactions = transactions.filter(
    ({ type }: { type: string }) => transactionsTypes.includes(type),
  );

  // 🥣 Group date
  processedTransactions = groupByAndSum(processedTransactions);

  return processedTransactions;
};

const processTemporary = (transactions: any, transactionsTypes: any) => {
  let processedTransactions: any[] = [];

  processedTransactions = transactions.filter(
    ({ status, paid }: { status: string; paid: boolean }) =>
      status === "succeeded" && paid,
  );

  if (arraysEqual(transactionsTypes, ["subscription"])) {
    processedTransactions = processedTransactions.filter(
      (transaction) => transaction.invoice,
    );
  }

  if (arraysEqual(transactionsTypes, ["donation"])) {
    processedTransactions = processedTransactions.filter(
      (transaction) => !transaction.invoice,
    );
  }

  // 🥣 Group day
  processedTransactions = processedTransactions.reduce(
    (acc, { created, amount }) => {
      const alreadyRegisteredDay = acc.find(
        ({ date }: { date: Date }) =>
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

  // 🔄 Order by date
  processedTransactions.sort((a, b) => a.date - b.date);
  return processedTransactions;
};

/* ============================================= */
/*              🚀 Component                     */
/* ============================================= */
export default async () => {
  let transactionsByMonth = await getTransactions({ period: "month" });

  // ❌ Early return if no data
  if (transactionsByMonth.length === 0) return NoData;

  return (
    // Level 1️⃣ - Choose campaign
    <TabGroup className="flex h-full w-full flex-col">
      {/* TabList */} <CampaignTabs campaigns={CAMPAIGNS} />
      <TabPanels className="overflow-auto">
        {TRANSACTIONS_TABS.map((tabs) => (
          <TabPanel className="h-full w-full">
            {/* Level 2️⃣ - Choose transaction type (subscription and/or donation) */}
            <TabGroup className="flex h-full w-full flex-col items-center">
              {/* TabList */} <TransactionTypeTabs tabs={tabs} />
              <TabPanels className="w-full grow overflow-auto">
                {tabs.map(
                  async ({
                    name,
                    transactionsTypes,
                    campaignType,
                    goal,
                    begin,
                    tag,
                  }: TabTransactions) => {
                    let TabContent = null;

                    /* 📅 PERMANENT */
                    /* ============= */
                    if (campaignType === "permanent") {
                      // ❌ Early return if no transactions by month
                      if (transactionsByMonth.length === 0) return NoData;
                      let transactions = processPermanent(
                        transactionsByMonth,
                        transactionsTypes,
                      );

                      TabContent = (
                        <PanelPermanent
                          key={name}
                          name={name}
                          transactions={transactions}
                        />
                      );
                    }

                    /* ⌛ TEMPORARY */
                    /* ============ */
                    if (campaignType === "temporary") {
                      // 🐝 Fetch from Stripe API
                      let transactionsCampaign: any[] =
                        await getTransactionsForCampaign(begin.getTime(), tag);

                      // ❌ Early return if no transactions by month
                      if (transactionsCampaign.length === 0) return NoData;
                      const transactions = processTemporary(
                        transactionsCampaign,
                        transactionsTypes,
                      );

                      TabContent = (
                        <PanelTemporary
                          key={name}
                          name={name}
                          begin={begin}
                          goal={goal}
                          transactions={transactions}
                        />
                      );
                    }

                    if (TabContent)
                      return (
                        <TabPanel className="flex h-full gap-6">
                          {TabContent}
                        </TabPanel>
                      );

                    return null;
                  },
                )}
              </TabPanels>
            </TabGroup>
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
};
