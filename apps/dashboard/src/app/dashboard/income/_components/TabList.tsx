import React from "react";

// 🧱 Components
import { TabList, Tab } from "@/ui/components/tabs";

// 🗿 Models
import { type Tab as TabType } from "../_models";

export default ({ tabs }: { tabs: TabType[] }) => {
  return (
    <TabList className='mx-auto mb-10 flex w-fit justify-center gap-4 rounded-full bg-black/90 p-2 shadow-lg backdrop-blur-md'>
      {tabs.map(({ name }) => (
        <Tab
          key={name}
          className='rounded-full px-5 py-1 text-lg font-semibold text-primary text-white transition focus:outline-none data-[selected]:bg-zinc-800 data-[focus]:outline-1 data-[focus]:outline-black'
        >
          {name}
        </Tab>
      ))}
    </TabList>
  );
};
