"use client";

// 🔩 Base
import React from "react";

// 🧱 Components
import { DatePickerWithRange } from "@/ui/components/date-range-picker";
import TitleWithDates from "./TitleWithDates";
import SubscribersList from "./SubscribersList";
import BottomBar from "./BottomBar";
import Loader from "../loading";

// 🪝 Hooks
import useSubscribers from "../hooks/useSubscribers";

const SubscribersWidget = () => {
  const { subscribers, loadingSubscribers, date, setDate } = useSubscribers();

  return (
    <>
      <TitleWithDates date={date} />
      <DatePickerWithRange date={date} setDate={setDate} />
      {loadingSubscribers ? (
        <Loader />
      ) : (
        <>
          <SubscribersList subscribers={subscribers} />
          <BottomBar subscribers={subscribers} date={date} />
        </>
      )}
    </>
  );
};

export default SubscribersWidget;
