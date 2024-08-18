"use client";

// 🔩 Base
import { useState, useEffect } from "react";

// 🐝 API
import { fetchSubscribers } from "../_actions";

// 🗿 Models
import { Customer } from "@dashboard/libs/stripe";

const useSubscribers = () => {
  const [loadingSubscribers, setLoadingSubscribers] = useState(true);
  const [subscribers, setSubscribers] = useState<Customer[]>([]);

  const [date, setDate] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });

  useEffect(() => {
    (async () => {
      if (date?.from && date?.to) {
        setLoadingSubscribers(true);
        const nextDay = new Date(date.to);
        nextDay.setDate(nextDay.getDate() + 1);
        const subscribers = await fetchSubscribers({
          from: date.from,
          to: nextDay,
        });
        setSubscribers(subscribers);
        setLoadingSubscribers(false);
      }
    })();
  }, [date]);

  return { loadingSubscribers, subscribers, date, setDate };
};

export default useSubscribers;
