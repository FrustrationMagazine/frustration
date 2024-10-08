import type { APIRoute } from "astro";
import { stripe } from "@/data-access/stripe";

export const prerender = "false";

export const POST: APIRoute = async ({ request }: { request: any }) => {
  const { formula } = await request.json();
  const REGEX_SUBSCRIPTION_PRODUCT = /Abonnement/;

  // 1️⃣ Get the subscription product
  const products = await stripe.products.list().then((res) => res.data);
  const productSubscription = products.find(({ name }) =>
    REGEX_SUBSCRIPTION_PRODUCT.test(name),
  );

  // 2️⃣ Get the price of the chosen formula
  if (productSubscription) {
    const prices = await stripe.prices.list().then((res) => res.data);
    const chosenPrice = prices.find(
      ({ metadata: { name }, product }) =>
        name === formula && product === productSubscription.id,
    );

    // 3️⃣ Create a payment intent
    if (chosenPrice && chosenPrice.unit_amount) {
      const amount = chosenPrice.unit_amount;
      const currency = chosenPrice.currency;
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
      });

      // 4️⃣ Return the payment intent
      return new Response(JSON.stringify({ paymentIntent }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }

  return new Response();
};
