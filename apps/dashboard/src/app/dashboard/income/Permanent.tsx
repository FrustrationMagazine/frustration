// 💥 Fetch
import { getTransactions } from "./_actions";

// 🧱 Components
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@dashboard/components/Tabs";
import PanelPermanent from "./components/PanelPermanent";

// 🔧 Libs
import { processPermanent } from "./_utils";

// 🐝 Fetch
const transactionsPermanent = await getTransactions({ period: "month" });

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
const Permanent = () => {
  return (
    <Tabs defaultValue="all" className="flex h-full flex-col">
      <TabsList className="mx-auto mb-6 grid h-auto w-[600px] grid-cols-3">
        <Transactions value="all">Tout</Transactions>
        <Transactions value="subscriptions">Abonnements</Transactions>
        <Transactions value="donations">Dons</Transactions>
      </TabsList>
      <TabsContent className="grow overflow-auto" value="all">
        <PanelPermanent
          name="Tout"
          transactions={processPermanent(transactionsPermanent, [
            "subscription",
            "donation",
          ])}
        />
      </TabsContent>
      <TabsContent className="grow overflow-auto" value="subscriptions">
        <PanelPermanent
          name="Abonnements"
          transactions={processPermanent(transactionsPermanent, [
            "subscription",
          ])}
        />
      </TabsContent>
      <TabsContent className="grow overflow-auto" value="donations">
        <PanelPermanent
          name="Dons"
          transactions={processPermanent(transactionsPermanent, ["donation"])}
        />
      </TabsContent>
    </Tabs>
  );
};

export default Permanent;
