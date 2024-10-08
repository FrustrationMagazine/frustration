import type { APIRoute } from "astro";
import { stripe } from "@/data-access/stripe";

export const prerender = "false";

export const POST: APIRoute = async ({ request }: { request: any }) => {
  const { customerId, priceId } = await request.json();

  // 1️⃣ Create a subscription
  let subscription;
  try {
    subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create subscription" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  // 2️⃣ Return subscription if successful
  return new Response(JSON.stringify({ subscription }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
