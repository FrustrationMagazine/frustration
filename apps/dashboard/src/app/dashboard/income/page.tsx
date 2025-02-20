// 🧱 Components
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@dashboard/components/Tabs";

import Permanent from "./Permanent";
// import Temporary from "./Temporary";

// 🧰 Config
export const dynamic = "force-dynamic";

const Tab = ({ value, children }: { value: string; children: string }) => (
  <TabsTrigger
    className="text-yellow bg-black py-2 font-bebas text-4xl font-bold uppercase leading-tight data-[state=inactive]:opacity-30"
    value={value}
  >
    {children}
  </TabsTrigger>
);

/* ************** */
/*     🚀 UI      */
/* ************** */
const IncomePage = () => (
  <Tabs
    defaultValue="permanent"
    className="flex h-full w-full flex-col overflow-auto"
  >
    <TabsList className="mx-auto mb-3 grid h-fit w-[400px] grid-cols-1 gap-2 bg-transparent">
      <Tab value="permanent">Global</Tab>
      {/* <Tab value="temporary">Campagne</Tab> */}
    </TabsList>
    <TabsContent className="grow overflow-auto" value="permanent">
      <Permanent />
    </TabsContent>
    {/* <TabsContent className="grow overflow-auto" value="temporary">
      <Temporary />
    </TabsContent> */}
  </Tabs>
);

export default IncomePage;
