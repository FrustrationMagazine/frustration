import React, { useState } from "react";
import {
  PaymentElement,
  AddressElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Stripe from "stripe";
import { type StripePaymentElementOptions } from "@stripe/stripe-js";
import { MessageCircleWarning } from "lucide-react";
import { cn } from "@/utils/tailwind";

const paymentElementOptions: StripePaymentElementOptions = {
  layout: "tabs",
};

const CREATE_CUSTOMER_ENDPOINT = "/api/create-stripe-customer";
const CREATE_SUBSCRIPTION_ENDPOINT = "/api/create-stripe-subscription";

export default function StripeForm({
  paymentIntent,
}: {
  paymentIntent: Stripe.PaymentIntent;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const disableCheckout = isLoading || !stripe || !elements;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const addressElement = elements.getElement("address");

    let subscription;

    if (addressElement && email) {
      const {
        complete,
        value: { address, name },
      } = await addressElement.getValue();

      if (complete && address && name) {
        const { customer } = await fetch(CREATE_CUSTOMER_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, address, email, paymentIntent }),
        }).then((res) => res.json());

        console.log("customer", customer);
      }
    }

    // const { error } = await stripe.confirmPayment({
    //   elements,
    //   confirmParams: {
    //     // Make sure to change this to your payment completion page
    //     return_url: "http://localhost:3000/complete",
    //   },
    // });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    // if (error.type === "card_error" || error.type === "validation_error") {
    //   setMessage(error.message || null);
    // } else {
    //   setMessage("Une erreur inattendue est survenue.");
    // }

    setIsLoading(false);
  };

  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit}>
      {/* 2️⃣ CONTACT INFO */}
      <h3 className="font-montserrat mb-6 flex flex-col items-center justify-center text-center text-2xl lg:flex-row lg:justify-start lg:gap-2 lg:text-left">
        <span className="max-lg:text-3xl">2️⃣</span>
        <span>Vos informations de contact</span>
      </h3>
      <LinkAuthenticationElement
        onChange={(event) => {
          setEmail(event.value.email);
        }}
      />
      <div className="my-2"></div>
      <AddressElement options={{ mode: "shipping" }} />
      <h3 className="font-montserrat mb-6 mt-10 flex flex-col items-center justify-center text-center text-2xl lg:flex-row lg:justify-start lg:gap-2 lg:text-left">
        <span className="max-lg:text-3xl">3️⃣</span>
        <span>Vos informations de paiement</span>
      </h3>

      {/* 💬 Error or success message */}
      {message && (
        <div
          className="mb-4 flex gap-2 rounded bg-purple px-4 py-2 text-white"
          id="payment-message">
          <MessageCircleWarning />
          {message}
        </div>
      )}
      {/* 3️⃣ PAYMENT */}
      <PaymentElement
        id="payment-element"
        options={paymentElementOptions}
        className="mb-4"
      />

      {/* ⬛ VALIDATION */}
      <button
        className={cn(
          "mx-auto mt-16 block rounded bg-black px-4 py-2 text-lg font-bold text-yellow",
          disableCheckout && "opacity-30",
        )}
        type="submit"
        id="submit">
        <span id="button-text">
          {isLoading ? (
            <div
              className="spinner"
              id="spinner"></div>
          ) : (
            "💝  Soutenir Frustration"
          )}
        </span>
      </button>
    </form>
  );
}
