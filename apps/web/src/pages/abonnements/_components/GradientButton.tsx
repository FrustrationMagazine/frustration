import React from "react";
import { cn } from "@/utils/tailwind";
import { Button } from "@/ui/components/button";

interface Props {
  readonly gradient?: string;
  readonly id: string;
  readonly children: React.ReactNode;
}

function GradientButton({ gradient, id, children }: Props) {
  return (
    <Button
      variant="ghost"
      data-button={id}
      className={cn(
        "group !relative mt-auto inline-flex h-11 w-[80%] overflow-hidden rounded-none p-[3px] ring-offset-black will-change-transform",
      )}>
      <div
        className={cn(
          "bg-gradient-conic absolute inset-[-1000%] animate-spin blur [animation-duration:5s]",
          gradient,
        )}
      />
      <div
        className={cn(
          "inline-flex h-full w-full cursor-pointer items-center justify-center px-8 py-1 font-bakbak text-2xl font-medium",
          "bg-gradient-to-t from-neutral-50 to-white text-neutral-950 backdrop-blur-3xl",
        )}>
        <span
          className={cn(
            "bg-gradient-to-tr bg-clip-text text-transparent transition-transform duration-100 ease-in-out",
            gradient,
          )}>
          {children}
        </span>
      </div>
    </Button>
  );
}

export default GradientButton;
