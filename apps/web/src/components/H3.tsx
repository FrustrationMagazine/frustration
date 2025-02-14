import { cn } from "@/utils/tailwind";

type Props = {
  readonly className?: string;
  readonly children: string;
};

function H3({ className, children }: Props) {
  return (
    <div
      className={cn(
        "mb-2 text-balance font-bold",
        "text-2xl",
        "lg:text-3xl",
        className,
      )}>
      {children}
    </div>
  );
}

export default H3;
