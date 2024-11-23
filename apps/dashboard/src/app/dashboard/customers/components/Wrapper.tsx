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

const NoData = (
  <h3 className="mx-auto mt-5 w-[50%] max-w-[700px] text-center text-xl">
    😔 Aucun nouvel abonné sur cette période
  </h3>
);

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
        <div className="flex min-w-[1100px] max-w-[1600px] flex-grow flex-col space-y-3">
          <TopBar
            customers={customers}
            numberOfActiveCustomers={numberOfActiveCustomers}
            rangeDate={rangeDate}
          />
          <div className="h-[1px] flex-grow overflow-auto">
            {customers.length === 0 ? (
              NoData
            ) : (
              <CustomersTable customers={customers} />
            )}
          </div>
        </div>
      )}
    </>
  );
}
