"use client";

// 🔩 Base
import React from "react";

// 🧱 Components
import { DatePickerWithRange } from "@/ui/components/date-range-picker";
import TitleWithDates from "./TitleWithDates";
import CustomersTable from "./CustomersTable";
import BottomBar from "./BottomBar";
import Loader from "../../loading";

// 🪝 Hooks
import useCustomers from "../hooks/useCustomers";

/* =============== */
/*       UI        */
/* =============== */

export default function () {
  const { customers, loadingCustomers, rangeDate, setRangeDate } = useCustomers();

  return (
    <>
      <TitleWithDates rangeDate={rangeDate} />
      <DatePickerWithRange date={rangeDate} setDate={setRangeDate} />
      {loadingCustomers ? (
        <Loader />
      ) : (
        <>
          <CustomersTable customers={customers} />
          <BottomBar customers={customers} rangeDate={rangeDate} />
        </>
      )}
    </>
  );
}
