// 🔩 Base
import { useState } from "react";

// 🔧 Libs
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";

// 🧱 Components
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

import FormulaCard from "./FormulaCard";

const { PUBLIC_STRIPE_PUBLIC_KEY } = import.meta.env;
const stripePromise = loadStripe(PUBLIC_STRIPE_PUBLIC_KEY);

const DEFAULT_AMOUNT = 900;

const options: StripeElementsOptions = {
  mode: "subscription",
  amount: DEFAULT_AMOUNT,
  currency: "eur",
  appearance: {
    theme: "stripe",
  },
};

/* ==================================================== */
/* ==================================================== */

export default function SubscriptionForm() {
  const [selectedAmount, setSelectedAmount] = useState(900);
  return (
    <div className="mx-auto mt-32">
      {/* 🔠 Titres */}
      <div className="mb-10">
        <h3 className="text-pretty text-center font-bakbak text-4xl font-bold uppercase sm:text-5xl md:text-5xl lg:text-6xl">
          S'abonner à Frustration
        </h3>
        <h5 className="text-center text-lg text-zinc-500 lg:text-2xl">
          Soutenez notre média pour toujours plus de contenu offensif !
        </h5>
      </div>

      <div className="mx-auto w-[500px] max-w-[90vw]">
        <div className="!mb-10">
          {/* 1️⃣ Formula */}
          <h3 className="mb-6 flex flex-col items-center justify-center text-center font-montserrat text-2xl lg:flex-row lg:justify-start lg:gap-2 lg:text-left">
            <span className="max-lg:text-3xl">1️⃣</span>
            <span>Votre formule et vos cadeaux</span>
          </h3>
          <ul className="space-y-3">
            <FormulaCard
              id="mini"
              name="Mini"
              amount={500}
              items={["✊ Newsletter"]}
              selectedAmount={selectedAmount}
              select={() => setSelectedAmount(500)}
            />
            <FormulaCard
              id="medium"
              name="Medium"
              amount={900}
              items={["✊ Newsletter", "🗞️ Numéro papier 2025"]}
              selectedAmount={selectedAmount}
              select={() => setSelectedAmount(900)}
            />
            <FormulaCard
              id="maxi"
              name="Maxi"
              amount={1500}
              items={[
                "✊ Newsletter",
                "🗞️ Numéro papier 2025",
                "📕 1 exemplaire de Parasites",
              ]}
              selectedAmount={selectedAmount}
              select={() => setSelectedAmount(1500)}
            />
          </ul>
        </div>
        {/* 2️⃣ 🗒️ Client informations and payment */}
        <Elements
          options={options as any}
          stripe={stripePromise}>
          <CheckoutForm
            amount={selectedAmount}
            frequency="recurring"
          />
        </Elements>
      </div>

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
