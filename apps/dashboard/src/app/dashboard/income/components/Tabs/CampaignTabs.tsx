// 🔩 Base
import React from "react";

// 🧱 Components
import { TabList, Tab } from "@/ui/components/tabs";

// 🗿 Models
import { type Campaign } from "../../_models";

export default ({ campaigns }: { campaigns: Campaign[] }) => {
  return (
    <TabList className="font-bebas mx-auto mb-5 w-fit rounded-md bg-black p-2 text-frustration-yellow">
      {campaigns.map(({ name }) => (
        <Tab className="w-[220px] rounded-sm p-3 text-xl font-bold uppercase focus:outline-none data-[selected]:bg-frustration-yellow data-[selected]:text-black">
          {name}
        </Tab>
      ))}
    </TabList>
  );
};
