"use client";

// 🔩 Base
import React from "react";

// 🔧 Utils
import { explicitDate } from "@dashboard/utils/dates";

const TitleWithDates = ({
  date,
}: {
  date: {
    from: Date;
    to: Date;
  };
}) => {
  return date?.from && date?.to ? (
    <h2 className='bg-black px-4 py-1 text-center text-2xl font-bold text-accent-foreground text-frustration-yellow'>
      Du {explicitDate(date.from)} au {explicitDate(date.to)}
    </h2>
  ) : null;
};

export default TitleWithDates;
