import React, { useState } from "react";
import {
  PaymentElement,
  AddressElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { MessageCircleWarning } from "lucide-react";
import { type StripePaymentElementOptions } from "@stripe/stripe-js";
import { cn } from "@/utils/tailwind";

const paymentElementOptions: StripePaymentElementOptions = {
  layout: "tabs",
};

const { MODE, SITE } = import.meta.env;

const SUCCESS_PAGE = "paiement-termine";
const REDIRECT_URL =
  MODE === "production"
    ? `${SITE}/${SUCCESS_PAGE}`
    : `http://localhost:4321/${SUCCESS_PAGE}`;

const CREATE_CUSTOMER_ENDPOINT = "/api/create-customer";
const CREATE_SUBSCRIPTION_ENDPOINT = "/api/create-subscription";

export default function StripeForm({ priceId }: { priceId: string }) {
  // 🪝 Hooks
  const stripe = useStripe();
  const elements = useElements();

  // 🔼 State
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const disableCheckout = isLoading || !stripe || !elements;

  /* Handle payment */
  /* -------------- */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    // 1️⃣ Check form is valid
    const { error: submitError } = await elements.submit();
    if (submitError) return;

    setIsLoading(true);

    // 2️⃣ Create customer
    let customer;
    const addressElement = elements.getElement("address");
    if (addressElement && email) {
      const { address, name } = await addressElement
        .getValue()
        .then(({ value }) => value);

      const resCustomerCreation = await fetch(CREATE_CUSTOMER_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, address, email }),
      }).then((res) => res.json());

      if (resCustomerCreation?.customer)
        customer = resCustomerCreation.customer;
    }

    // 3️⃣ Create subscription
    let subscription;
    if (customer) {
      const resSubscriptionCreation = await fetch(
        CREATE_SUBSCRIPTION_ENDPOINT,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId: customer.id,
            customerAddress: customer.address,
            priceId,
          }),
        },
      ).then((res) => res.json());

      if (resSubscriptionCreation?.subscription)
        subscription = resSubscriptionCreation.subscription;
    }

    if (subscription) {
      const clientSecret =
        subscription?.latest_invoice?.payment_intent?.client_secret;

      if (clientSecret) {
        // 4️⃣ Try to confirm payment and redirect if that the case or handle error
        const { error } = await stripe.confirmPayment({
          elements,
          clientSecret,
          confirmParams: {
            return_url: REDIRECT_URL,
          },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
          setMessage(error.message ?? null);
        } else {
          setMessage("Une erreur inattendue est survenue.");
        }
      }
    }

    setIsLoading(false);
  };

  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit}>
      {/* 2️⃣ CONTACT INFO */}
      <h3
        className={`mb-6 flex flex-col items-center justify-center text-center font-montserrat text-2xl lg:flex-row lg:justify-start lg:gap-2 lg:text-left`}>
        <span className="max-lg:text-3xl">2️⃣</span>
        <span>Vos informations de contact</span>
      </h3>
      <LinkAuthenticationElement
        onChange={({ value: { email } }) => setEmail(email)}
      />
      <div className="my-2"></div>
      <AddressElement options={{ mode: "shipping" }} />
      <h3
        className={`mb-6 mt-10 flex flex-col items-center justify-center text-center font-montserrat text-2xl lg:flex-row lg:justify-start lg:gap-2 lg:text-left`}>
        <span className="max-lg:text-3xl">3️⃣</span>
        <span>Vos informations de paiement</span>
      </h3>

      {/* 💬 Error or success message */}
      {/* 3️⃣ PAYMENT */}
      <PaymentElement
        id="payment-element"
        options={paymentElementOptions}
        className="mb-4"
      />

      {/* 💬 Error or success message */}
      {message && (
        <div
          className="mb-4 flex gap-2 rounded bg-purple px-4 py-2 text-white"
          id="payment-message">
          <MessageCircleWarning />
          {message}
        </div>
      )}

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
