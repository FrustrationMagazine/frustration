"use server";

import { fetchStripeCustomers } from "@dashboard/libs/stripe";

export const getLastSubscribers = async ({ begin, end }: { begin: Date; end: Date }) => {
  const customers = await fetchStripeCustomers({ begin, end });
  return customers;
};
