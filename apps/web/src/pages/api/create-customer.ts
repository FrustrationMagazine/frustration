import type { APIRoute } from "astro";
import { stripe } from "@/data-access/stripe";
import { generateResponseError } from "@web/utils";

export const prerender = "false";

export const POST: APIRoute = async ({ request }: { request: any }) => {
  const customerInformations = await request.json();

  // 1️⃣ Create a customer if needed
  let customer;
  if (customerInformations.email) {
    // 🔎 Look for existing customer
    try {
      const customers = await stripe.customers.search({
        query: `email:'${customerInformations.email}'`,
      });
      console.log("customers", customers);
      if (customers.data.length > 0) {
        customer = customers.data[0];
      }
    } catch (error) {
      console.error("Error while searching customer with email:", error);
      generateResponseError({ errorMessage: "Failed to search customer" });
    }
  }

  // ❌ If no customer found with corresponding email, create one
  if (!customer) {
    try {
      customer = await stripe.customers.create(customerInformations);
    } catch (error) {
      console.error("Error creating customer:", error);
      generateResponseError({ errorMessage: "Failed to create customer" });
    }
  }

  // 2️⃣ Return customer found or created
  if (customer) {
    return new Response(JSON.stringify({ customer }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new Response();
};
