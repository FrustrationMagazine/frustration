import { useEffect, useRef } from "react";
import { useMotionValue, useSpring } from "framer-motion";

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
}: {
  value: number;
  direction?: "up" | "down";
  className?: string;
  delay?: number; // delay in s
  decimalPlaces?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 85,
  });
  useEffect(() => {
    setTimeout(() => {
      motionValue.set(direction === "down" ? 0 : value);
    }, delay * 1000);
  }, [motionValue, delay, value, direction]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent = `${Math.round(latest)}%`;
        }
      }),
    [springValue, decimalPlaces],
  );

  return (
    <span className="flex flex-col items-baseline md:flex-row md:gap-2">
      <span
        className="text-xl font-bold md:text-2xl"
        ref={ref}>
        0%
      </span>
      <span className="-mt-1 whitespace-nowrap text-xs font-bold md:mt-0 md:text-sm">
        de l'objectif
      </span>
    </span>
  );
}
