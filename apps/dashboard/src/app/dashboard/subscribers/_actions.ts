"use server";

import { fetchStripeSubscribers, Customer } from "@dashboard/libs/stripe";

export async function fetchSubscribers({
  from,
  to,
}: {
  from: Date;
  to: Date;
}): Promise<Customer[]> {
  const subscribers = await fetchStripeSubscribers({ from, to });
  return subscribers;
}
