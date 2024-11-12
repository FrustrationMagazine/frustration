"use client";

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
    <span className="flex items-baseline gap-1">
      <span
        className="text-2xl font-bold"
        ref={ref}>
        0%
      </span>
      <span className="whitespace-nowrap text-sm font-bold">de l'objectif</span>
    </span>
  );
}
