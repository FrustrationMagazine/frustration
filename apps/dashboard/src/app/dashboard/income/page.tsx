// 💥 Fetch
import { getTransactionsByMonth } from "./_actions";

// 🧱 Components
import { TabGroup, TabPanels } from "@/ui/components/tabs";
import TabList from "./components/TabList";
import TabPanel from "./components/TabPanel";

// 🔧 Libs
import { groupByMonthAndSum } from "./_utils";

// 🗿 Models
import { type Tab as TabType, TransactionType } from "./_models";

// 📦 Data
const tabs: TabType[] = [
  { name: "Global", transactionsTypes: ["subscription", "donation"] },
  { name: "Abonnements", transactionsTypes: ["subscription"] },
  { name: "Dons", transactionsTypes: ["donation"] },
];

// 🧰 Config
export const dynamic = "force-dynamic";

export default async () => {
  const transactionsByMonth = await getTransactionsByMonth();
  return (
    <TabGroup className='flex h-full w-full flex-col'>
      <TabList tabs={tabs} />
      <TabPanels className='grow overflow-auto'>
        {tabs.map(({ name, transactionsTypes }) => {
          let filteredTransactionsByMonth = transactionsByMonth.filter(({ type }) =>
            transactionsTypes.includes(type),
          );
          filteredTransactionsByMonth = groupByMonthAndSum(filteredTransactionsByMonth);
          return (
            <TabPanel key={name} name={name} transactionsByMonth={filteredTransactionsByMonth} />
          );
        })}
      </TabPanels>
    </TabGroup>
  );
};
