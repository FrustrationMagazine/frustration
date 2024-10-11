import type { APIRoute } from "astro";
import { stripe } from "@/data-access/stripe";

export const prerender = "false";

// https://docs.stripe.com/payments/accept-a-payment-deferred?type=subscription
export const POST: APIRoute = async ({ request }: { request: any }) => {
  const { customerId, priceId } = await request.json();
  console.info("🛜 /api/create-subscription", { priceId });

  // 1️⃣ Create a subscription
  let subscription;
  try {
    subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: priceId,
        },
      ],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent", "pending_setup_intent"],
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
