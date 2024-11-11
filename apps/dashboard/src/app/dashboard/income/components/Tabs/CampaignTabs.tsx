// 🔩 Base
import React from "react";

// 🧱 Components
import { TabList, Tab } from "@/ui/components/tabs";

// 🗿 Models
import { type Campaign } from "../../_models";

export default ({ campaigns }: { campaigns: Campaign[] }) => {
  return (
    <TabList className="mx-auto mb-5 w-fit rounded-sm bg-white p-2">
      {campaigns.map(({ name }) => (
        <Tab className="rounded-sm p-3 font-bold uppercase focus:outline-none data-[selected]:bg-zinc-100">
          {name}
        </Tab>
      ))}
    </TabList>
  );
};
