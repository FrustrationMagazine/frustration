// 💥 Fetch
import { getTransactionsForPeriod } from "./_actions";

// 🧱 Components
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@dashboard/components/Tabs";
import PanelTemporary from "./components/PanelTemporary";

// 🔧 Libs
import { processTemporary } from "./_utils";

const goal = 40000;
const begin = new Date("2024-11-07");
const totalTipeee = 10478;

// 🐝 Fetch
const transactions = await getTransactionsForPeriod({
  begin,
  end: null,
});

const Transactions = ({
  value,
  children,
}: {
  value: string;
  children: string;
}) => (
  <TabsTrigger
    className="px-2 text-lg data-[state=active]:bg-gray-200 data-[state=active]:font-bold data-[state=active]:text-black"
    value={value}
  >
    {children}
  </TabsTrigger>
);

/* ************** */
/*     🚀 UI      */
/* ************** */
const Temporary = () => {
  return (
    <Tabs defaultValue="all">
      <TabsList className="mx-auto mb-6 grid h-auto w-[600px] grid-cols-3">
        <Transactions value="all">Tout</Transactions>
        <Transactions value="subscriptions">Abonnements</Transactions>
        <Transactions value="donations">Dons</Transactions>
      </TabsList>
      <TabsContent value="all">
        <PanelTemporary
          goal={goal}
          begin={begin}
          transactions={processTemporary(transactions, [
            "subscription",
            "donation",
          ])}
          totalTipeee={totalTipeee}
        />
      </TabsContent>
      <TabsContent value="subscriptions">
        <PanelTemporary
          goal={goal}
          begin={begin}
          transactions={processTemporary(transactions, ["subscription"])}
          totalTipeee={totalTipeee}
        />
      </TabsContent>
      <TabsContent value="donations">
        <PanelTemporary
          goal={goal}
          begin={begin}
          transactions={processTemporary(transactions, ["donation"])}
          totalTipeee={totalTipeee}
        />
      </TabsContent>
    </Tabs>
  );
};

export default Temporary;
