// 🧱 Components
import { Separator } from "@/ui/components/separator";

// 🔧 Libs
import { cn } from "@/utils/tailwind";

export const YearSeparator = ({ year }: { year: number }) => (
  <div className={cn("w-[40%] px-2" /*, index > 0 && "!mt-8"*/)}>
    <Separator className='mb-1.5 bg-white/30' />
    <span className='text-white/70'>{year}</span>
  </div>
);
