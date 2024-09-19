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
        <div className="max-w-[1600px] space-y-3">
          <TopBar
            customers={customers}
            numberOfActiveCustomers={numberOfActiveCustomers}
            rangeDate={rangeDate}
          />
          <CustomersTable customers={customers} />
        </div>
      )}
    </>
  );
}
