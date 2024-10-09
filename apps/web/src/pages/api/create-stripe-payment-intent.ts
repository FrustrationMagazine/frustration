import type { APIRoute } from "astro";
import { stripe } from "@/data-access/stripe";

export const prerender = "false";

export const POST: APIRoute = async ({ request }: { request: any }) => {
  const { priceId } = await request.json();

  // // 1️⃣ Get the subscription product
  // const products = await stripe.products.list().then(({ data }) => data);
  // const productSubscription = products.find(({ name }) =>
  //   REGEX_SUBSCRIPTION_PRODUCT.test(name),
  // );

  // 1️⃣ Get the full price object
  let price;
  try {
    price = await stripe.prices.retrieve(priceId);
  } catch (e) {
    console.error("Error retrieving price:", e);
    return new Response(JSON.stringify({ error: "Failed to retrieve price" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // 2️⃣ Create the payment intent
  if (price && price.unit_amount) {
    let paymentIntent;
    try {
      paymentIntent = await stripe.paymentIntents.create({
        amount: price.unit_amount,
        currency: price.currency,
      });
    } catch (e) {
      console.error("Error creating payment intent:", e);
      return new Response(
        JSON.stringify({ error: "Failed to create payment intent" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    // 3️⃣ Return the payment intent
    return new Response(JSON.stringify({ paymentIntent }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
