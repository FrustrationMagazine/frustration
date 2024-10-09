// 🔩 Base
import { useState, useEffect } from "react";

// 🔧 Libs
import { loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";

// 🧱 Components
import { Elements } from "@stripe/react-stripe-js";
import StripeForm from "./_components/StripeForm";
import FormulaCard from "./_components/FormulaCard";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const { PUBLIC_STRIPE_PUBLIC_KEY } = import.meta.env;
const stripePromise = loadStripe(PUBLIC_STRIPE_PUBLIC_KEY);
const PAYMENT_INTENT_ENDPOINT = "/api/create-stripe-payment-intent";

const {
  PUBLIC_STRIPE_PRICE_SUBSCRIPTION_MINI,
  PUBLIC_STRIPE_PRICE_SUBSCRIPTION_MEDIUM,
  PUBLIC_STRIPE_PRICE_SUBSCRIPTION_MAXI,
} = import.meta.env;

export default function SubscriptionForm() {
  const [paymentIntent, setPaymentIntent] =
    useState<null | Stripe.PaymentIntent>(null);
  const [selectedPriceId, setSelectedPriceId] = useState("");

  // 🔑 Payment Intent
  useEffect(
    () => {
      (async function createStripePaymentIntent() {
        if (selectedPriceId) {
          setPaymentIntent(null);
          const { paymentIntent } = await fetch(PAYMENT_INTENT_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ priceId: selectedPriceId }),
          }).then((res) => res.json());
          setPaymentIntent(paymentIntent);
        }
      })();
    },
    // Each time we opt for a different formula, we create a new payment intent
    [selectedPriceId],
  );

  const options = {
    clientSecret: paymentIntent?.client_secret,
    appearance: {
      theme: "stripe",
    },
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
        {/* 1️⃣ Formula */}
        <h3 className="mb-6 flex flex-col items-center justify-center text-center font-montserrat text-2xl lg:flex-row lg:justify-start lg:gap-2 lg:text-left">
          <span className="max-lg:text-3xl">1️⃣</span>
          <span>Votre formule et vos cadeaux</span>
        </h3>
        <ul className="space-y-2">
          <FormulaCard
            id="mini"
            name="Mini"
            amount={5}
            items={["✊ Autocollants et affiches"]}
            priceId={PUBLIC_STRIPE_PRICE_SUBSCRIPTION_MINI ?? ""}
            selectedPriceId={selectedPriceId}
            setSelectedPriceId={setSelectedPriceId}
          />
          <FormulaCard
            id="medium"
            name="Medium"
            amount={9}
            items={["✊ Autocollants et affiches", "🗞️ Numéro papier annuel"]}
            priceId={PUBLIC_STRIPE_PRICE_SUBSCRIPTION_MEDIUM ?? ""}
            selectedPriceId={selectedPriceId}
            setSelectedPriceId={setSelectedPriceId}
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
            priceId={PUBLIC_STRIPE_PRICE_SUBSCRIPTION_MAXI ?? ""}
            selectedPriceId={selectedPriceId}
            setSelectedPriceId={setSelectedPriceId}
          />
        </ul>
      </div>
      {/* 2️⃣ 🗒️ Client informations and payment */}
      {paymentIntent?.client_secret ? (
        <Elements
          options={options as any}
          stripe={stripePromise}>
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
