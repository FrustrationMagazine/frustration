// 🔩 Base
import { useState, useEffect } from "react";

// 🔧 Libs
import { loadStripe } from "@stripe/stripe-js";
// import { stripe } from "@/data-access/stripe";
import Stripe from "stripe";
// 🧱 Components
import { Elements } from "@stripe/react-stripe-js";
import StripeForm from "./_components/StripeForm";
import FormulaCard from "./_components/FormulaCard";

// https://docs.stripe.com/security/guide
// https://zellwk.com/blog/stripe-astro-recipe/

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  "pk_test_51LmuVdDkQL5ueMP8JnZtHdkuUJ9V9EIDlzQVUByHETjVtnmZHOlAyK341DRhwyG4XCoxuO4ntda3WsbNn1AgIOVn00vO0NqGml",
);
const PAYMENT_INTENT_ENDPOINT = "/api/create-stripe-payment-intent";
const PAYMENT_INTENT_SUBSCRIPTION = "/api/create-stripe-subscription";

const stripeAppearance = {
  theme: "stripe",
};

// const products = await stripe.products.list().then((res) => res.data);
// const subscriptionProduct = products.find(({ name }) =>
//   /Abonnement/.test(name),
// );
// stripe.subscriptions.create({

// })
// console.log("subscriptionProduct", subscriptionProduct);

// const test2 = await stripe.prices.list();
// console.log("test2", test2);

export default function SubscriptionForm() {
  // 💸 Stripe
  const [paymentIntent, setPaymentIntent] =
    useState<null | Stripe.PaymentIntent>(null);
  const [formula, setFormula] = useState("");

  // 🔑 PaymentIntent
  useEffect(
    function createStripePaymentIntent() {
      if (formula) {
        fetch(PAYMENT_INTENT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ formula }),
        })
          .then((res) => res.json())
          .then(({ paymentIntent }) => setPaymentIntent(paymentIntent));
      }
    },
    [formula],
  );

  const options = {
    clientSecret: paymentIntent?.client_secret,
    appearance: stripeAppearance,
  };

  return (
    <div className="mx-auto mt-32 max-w-[500px]">
      {/* 🔠 Titres */}
      <div className="mb-10">
        <h3 className="text-center font-bebas text-6xl font-bold uppercase">
          S'abonner à Frustration
        </h3>
        <h5 className="text-center text-lg text-zinc-500">
          Soutenez notre média pour toujours plus de contenu offensif !
        </h5>
      </div>

      <div className="!mb-10">
        {/* 1️⃣ FORMULA */}
        <h3 className="font-montserrat mb-6 flex flex-col items-center justify-center text-center text-2xl lg:flex-row lg:justify-start lg:gap-2 lg:text-left">
          <span className="max-lg:text-3xl">1️⃣</span>
          <span>Votre formule et vos cadeaux</span>
        </h3>
        <ul className="space-y-2">
          <FormulaCard
            id="mini"
            name="Mini"
            amount={5}
            items={["✊ Autocollants et affiches"]}
            formula={formula}
            setFormula={setFormula}
          />
          <FormulaCard
            id="medium"
            name="Medium"
            amount={9}
            items={["✊ Autocollants et affiches", "🗞️ Numéro papier annuel"]}
            formula={formula}
            setFormula={setFormula}
          />
          <FormulaCard
            id="maxi"
            name="Maxi"
            amount={15}
            items={[
              "✊ Autocollants et affiches",
              "🗞️ Numéro papier annuel",
              "📕 1 exemplaire de Parasites",
            ]}
            formula={formula}
            setFormula={setFormula}
          />
        </ul>
      </div>

      {/* 🗒️ Form */}
      {/* 3️⃣ PAYMENT */}
      {/* 💰 Stripe */}
      {paymentIntent?.client_secret ? (
        <Elements
          options={options as any}
          stripe={stripePromise}>
          {/* 🗒️ Checkout form */}
          <StripeForm paymentIntent={paymentIntent} />
        </Elements>
      ) : null}

      {/* Specific rule for displaying check icon only on selected card */}
      <style>
        {`
          input:not(:checked) ~ label .check-card {
            display: none;
            }`}
      </style>
    </div>
  );
}
