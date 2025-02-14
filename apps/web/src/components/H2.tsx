import { cn } from "@/utils/tailwind";

type Props = {
  readonly className?: string;
  readonly children: string;
};

function H2({ className, children }: Props) {
  return (
    <div
      className={cn(
        "mb-2 text-balance text-center font-bakbak font-bold uppercase",
        "text-4xl",
        "sm:text-5xl",
        "md:zs-8 md:text-5xl",
        "lg:text-7xl",
        className,
      )}>
      {children}
    </div>
  );
}

export default H2;
