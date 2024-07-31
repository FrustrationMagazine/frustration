"use server";

import { fetchStripeCustomers } from "@dashboard/stripe";

export const getLastSubscribers = async ({ begin, end }: { begin: Date; end: Date }) => {
  const customers = await fetchStripeCustomers({ begin, end });
  return customers;
};
