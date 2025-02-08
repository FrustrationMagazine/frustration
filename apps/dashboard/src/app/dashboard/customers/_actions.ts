"use server";

import {
  fetchStripeNewCustomers,
  Customer,
  // fetchActiveSubscriptions,
} from "@/data-access/stripe";
import { fetchNumberOfActiveCustomersLastMonth } from "@/data-access/database";

export async function fetchCustomers({
  from,
  to,
}: {
  from: Date;
  to: Date;
}): Promise<Customer[]> {
  const customers = await fetchStripeNewCustomers({ from, to });

  return customers;
}

export async function fetchActiveCustomersLastMonth() {
  const numberOfActiveCustomers = fetchNumberOfActiveCustomersLastMonth();
  return numberOfActiveCustomers;
}
