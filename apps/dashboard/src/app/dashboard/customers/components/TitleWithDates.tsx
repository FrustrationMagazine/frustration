"use client";

// 🔩 Base
import React from "react";

// 🔧 Utils
import { explicitDate } from "@dashboard/utils/dates";

/* =============== */
/*       UI        */
/* =============== */

export default function ({
  rangeDate,
}: {
  rangeDate: {
    from: Date;
    to: Date;
  };
}) {
  const yellowOnBlack =
    "bg-black px-4 py-1 text-center text-2xl font-bold w-fit text-accent-foreground text-frustration-yellow";

  return rangeDate?.from && rangeDate?.to ? (
    <h2 className={yellowOnBlack}>
      Du {explicitDate(rangeDate.from)} au {explicitDate(rangeDate.to)}
    </h2>
  ) : null;
}
