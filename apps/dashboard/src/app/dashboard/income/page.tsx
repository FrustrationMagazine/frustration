// 💥 Fetch
import { getTransactions, getTransactionsForPeriod } from "./_actions";

// 🧱 Components
import { TabGroup, TabPanels, TabPanel } from "@/ui/components/tabs";

import TransactionTypeTabs from "./components/Tabs/TransactionTypeTabs";
import CampaignTabs from "./components/Tabs/CampaignTabs";
import PanelPermanent from "./components/Panels/PanelPermanent";
import PanelTemporary from "./components/Panels/PanelTemporary";
import NoData from "./components/NoData";

// 🔧 Libs
import { processPermanent, processTemporary } from "./_utils";

// 🗿 Models
import { CAMPAIGNS, TRANSACTIONS_TABS, type TabTransactions } from "./_models";

// 🧰 Config
export const dynamic = "force-dynamic";

let totalTipeee = 10478;

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
      <CampaignTabs campaigns={CAMPAIGNS} />
      <TabPanels className="overflow-auto">
        {TRANSACTIONS_TABS.map((tabs, index) => (
          <TabPanel key={index} className="h-full w-full">
            {/* Level 2️⃣ - Choose transaction type (subscription and/or donation) */}
            <TabGroup className="flex h-full w-full flex-col items-center">
              {/* TabList */}
              <TransactionTypeTabs tabs={tabs} />
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
                      // let transactionsCampaign: any[] =
                      //   await getTransactionsForCampaign(begin.getTime(), tag);

                      let transactionsCampaign: any[] =
                        await getTransactionsForPeriod({
                          begin,
                          end: null,
                        });

                      // ❌ Early return if no transactions by month
                      if (transactionsCampaign.length === 0) return NoData;
                      const transactions = processTemporary(
                        transactionsCampaign,
                        transactionsTypes,
                      );

                      TabContent = (
                        <PanelTemporary
                          key={name}
                          begin={begin}
                          goal={goal}
                          transactions={transactions}
                          totalTipeee={totalTipeee}
                        />
                      );
                    }

                    if (!TabContent) return null;
                    return (
                      <TabPanel key={name} className="flex h-full gap-6">
                        {TabContent}
                      </TabPanel>
                    );
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
