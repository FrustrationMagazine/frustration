// 🔩 Base
import React from "react";

// 🧱 Components
import { TabList, Tab } from "@/ui/components/tabs";

// 🗿 Models
import { type TabTransactions } from "../../_models";

export default ({ tabs }: { tabs: TabTransactions[] }) => {
  return (
    <TabList className="mx-auto mb-10 w-fit rounded-full bg-black/90 p-2 shadow-lg">
      {tabs.map(({ name }) => (
        <Tab
          key={name}
          className="rounded-full px-5 py-1 text-lg font-semibold text-white transition focus:outline-none data-[selected]:bg-zinc-800"
        >
          {name}
        </Tab>
      ))}
    </TabList>
  );
};
