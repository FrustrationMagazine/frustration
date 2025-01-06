import type { APIRoute } from "astro";
import { stripe } from "@/data-access/stripe";

export const prerender = false;

export const POST: APIRoute = async ({ request }: { request: any }) => {
  const { paymentIntentId, paymentIntentUpdatedInformations } =
    await request.json();

  // 1️⃣ Create a payment intent
  let paymentIntent;
  try {
    paymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
      ...paymentIntentUpdatedInformations,
    });
  } catch (error) {
    console.error("Error updating payment intent:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update payment intent" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  // 2️⃣ Return payment intent if successful
  if (paymentIntent) {
    return new Response(JSON.stringify({ paymentIntent }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new Response();
};
