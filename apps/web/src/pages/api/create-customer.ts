import type { APIRoute } from "astro";
import { stripe } from "@/data-access/stripe";

export const prerender = "false";

export const POST: APIRoute = async ({ request }: { request: any }) => {
  const { name, address, email } = await request.json();
  console.info("🛜 /api/create-customer", name, address, email);

  // 1️⃣ Create a customer
  let customer;
  try {
    customer = await stripe.customers.create({
      name,
      address,
      email,
    });
  } catch (error) {
    console.error("Error creating customer:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create customer" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  // 2️⃣ Return customer if successful
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
