"use client";

// 🔩 Base
import React from "react";

// 🧱 Components
import { DatePickerWithRange } from "@/ui/components/date-range-picker";
import TitleWithDates from "./TitleWithDates";
import CustomersTable from "./CustomersTable";
import TopBar from "./TopBar";
import Loader from "../../loading";

// 🪝 Hooks
import useCustomers from "../hooks/useCustomers";

/* =============== */
/*       UI        */
/* =============== */

export default function () {
  const {
    customers,
    numberOfActiveCustomers,
    loadingCustomers,
    rangeDate,
    setRangeDate,
  } = useCustomers();

  return (
    <>
      <TitleWithDates rangeDate={rangeDate} />
      <DatePickerWithRange date={rangeDate} setDate={setRangeDate} />
      {loadingCustomers ? (
        <Loader />
      ) : (
        <div className="flex max-w-[1600px] flex-grow flex-col space-y-3">
          <TopBar
            customers={customers}
            numberOfActiveCustomers={numberOfActiveCustomers}
            rangeDate={rangeDate}
          />
          <div className="h-[1px] flex-grow overflow-auto">
            <CustomersTable customers={customers} />
          </div>
        </div>
      )}
    </>
  );
}
