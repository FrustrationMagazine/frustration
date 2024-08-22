"use server";

import { fetchStripeCustomers, Customer } from "@dashboard/libs/stripe";

export async function fetchCustomers({ from, to }: { from: Date; to: Date }): Promise<Customer[]> {
  const customers = await fetchStripeCustomers({ from, to });
  return customers;
}
