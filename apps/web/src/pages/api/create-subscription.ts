import type { APIRoute } from "astro";
import { stripe } from "@/data-access/stripe";
import { generateResponseError } from "@web/utils";
export const prerender = false;

const { PUBLIC_STRIPE_PRODUCT_SUBSCRIPTION } = import.meta.env;

// https://docs.stripe.com/payments/accept-a-payment-deferred?type=subscription
export const POST: APIRoute = async ({ request }: { request: any }) => {
  const { customerId, customerAddress, priceId, productId, amount, nickname } =
    await request.json();

  // 1️⃣ Create a price for a product if needed
  let price;
  if (!priceId && productId && amount) {
    // 🔎 Look for existing price
    try {
      const prices = await stripe.prices.search({
        query: `active:'true' AND product:'${PUBLIC_STRIPE_PRODUCT_SUBSCRIPTION}'`,
      });

      price = prices.data.find(
        (price) => price.unit_amount === amount && price.currency === "eur",
      );
    } catch (error) {
      console.error("Error retrieving price for subscription:", error);
      generateResponseError({
        errorMessage: "Failed to look for a price for subscription",
      });
    }

    // 🛠 If not found create price
    if (!price) {
      try {
        price = await stripe.prices.create({
          product: productId,
          unit_amount: amount,
          currency: "eur",
          recurring: { interval: "month" },
          ...(nickname ? { nickname } : null),
          metadata: {
            name: "custom",
          },
        });
      } catch (error) {
        console.error("Error creating price for subscription:", error);
        generateResponseError({
          errorMessage: "Failed to create price for subscription",
        });
      }
    }
  }

  // 2️⃣ Create a subscription
  let subscription;
  try {
    subscription = await stripe.subscriptions.create({
      customer: customerId,
      ...(priceId || price?.id
        ? {
            items: [
              {
                price: priceId || price?.id,
              },
            ],
          }
        : null),
      ...(customerAddress ? { metadata: { ...customerAddress } } : null),
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent", "pending_setup_intent"],
    });

    // 2️⃣ Return subscription if successful
    return new Response(JSON.stringify({ subscription }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    generateResponseError({
      errorMessage: "Failed to create subscription",
    });
  }

  return new Response();
};
