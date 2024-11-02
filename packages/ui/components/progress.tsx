import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "../utils";

interface ProgressBarProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  background?: string;
}

const ProgressBar = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressBarProps>(({ className, value, background, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn("relative h-2 w-full overflow-hidden rounded-full bg-transparent", className)}
    {...props}
  >
    <div className="w-60 h-20 bg-primary"></div>
    <ProgressPrimitive.Indicator
      className={`h-full w-full flex-1 ${background} transition-all`}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    >
      <div className="top-1.5 right-2.5 opacity-70 bg-white w-[20%] h-[25%] absolute rounded-full"></div>
    </ProgressPrimitive.Indicator>
    <div className="animate-disco absolute aspect-[2/1] blur-lg rounded-full h-full  bg-white left-0 top-0"></div>
  </ProgressPrimitive.Root>
));
ProgressBar.displayName = ProgressPrimitive.Root.displayName;

export default ProgressBar;
