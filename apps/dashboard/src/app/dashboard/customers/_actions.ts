"use server";

import {
  // fetchStripeNewCustomers,
  Customer,
  fetchActiveSubscriptions,
} from "@/data-access/stripe";
import { fetchNumberOfActiveCustomersLastMonth } from "@/data-access/database";

export async function fetchCustomers({
  from,
  to,
}: {
  from: Date;
  to: Date;
}): Promise<Customer[]> {
  const newSubscriptions = await fetchActiveSubscriptions({ from, to });
  return [];
}

export async function fetchActiveCustomersLastMonth() {
  const numberOfActiveCustomers = fetchNumberOfActiveCustomersLastMonth();
  return numberOfActiveCustomers;
}
