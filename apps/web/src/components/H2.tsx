import { cn } from "@/utils/tailwind";

type Props = {
  readonly className?: string;
  readonly children: string;
};

function H2({ className, children }: Props) {
  return (
    <h2
      className={cn(
        "text-balance text-center font-bakbak font-bold uppercase",
        "mb-6 text-4xl",
        "sm:mb-6 sm:text-5xl",
        "md:zs-8 md:mb-8 md:text-5xl",
        "lg:mb-10 lg:text-6xl",
        className,
      )}>
      {children}
    </h2>
  );
}

export default H2;
