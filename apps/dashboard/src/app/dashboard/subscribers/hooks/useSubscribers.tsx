"use client";

// 🔩 Base
import { useState, useEffect } from "react";

// 🐝 API
import { fetchSubscribers } from "../_actions";

// 🗿 Models
import { Customer } from "@dashboard/libs/stripe";

const currentDate = new Date();
const prevMonth = currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1;
const prevMonthYear =
  currentDate.getMonth() === 0 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();

const useSubscribers = () => {
  const [loadingSubscribers, setLoadingSubscribers] = useState(true);
  const [subscribers, setSubscribers] = useState<Customer[]>([]);

  const [date, setDate] = useState({
    from: new Date(prevMonthYear, prevMonth, 1),
    to: new Date(),
  });

  useEffect(() => {
    (async () => {
      if (date?.from && date?.to) {
        setLoadingSubscribers(true);
        const subscribers = await fetchSubscribers({
          from: date.from,
          to: date.to,
        });
        setSubscribers(subscribers);
        setLoadingSubscribers(false);
      }
    })();
  }, [date]);

  return { loadingSubscribers, subscribers, date, setDate };
};

export default useSubscribers;
