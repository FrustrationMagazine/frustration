import type { APIRoute } from "astro";
import { stripe } from "@/data-access/stripe";

export const prerender = "false";

export const POST: APIRoute = async ({ request }: { request: any }) => {
  const { name, address, email } = await request.json();

  // 1️⃣ Create a customer
  const customer = await stripe.customers.create({
    name,
    address,
    email,
  });

  if (customer) {
    // 2️⃣ Return customer
    return new Response(JSON.stringify({ customer }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new Response();
};
