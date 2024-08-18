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
    <h2 className='text-center text-xl font-bold text-accent-foreground'>
      Du {explicitDate(date.from)} au {explicitDate(date.to)}
    </h2>
  ) : null;
};

export default TitleWithDates;
