import React from "react";
import {
  PaymentElement,
  AddressElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { type StripePaymentElementOptions } from "@stripe/stripe-js";
import { FREQUENCY } from "./CheckoutFormWrapper";
import CircleLoader from "@/ui/components/loaders/loader-circle";
import { actions } from "astro:actions";

// 🔧 Utils
import { cn } from "@/utils/tailwind";
import { MessageCircleWarning } from "lucide-react";

const paymentElementOptions: StripePaymentElementOptions = {
  layout: "tabs",
};

const CREATE_CUSTOMER_ENDPOINT = "/api/create-customer";
const CREATE_PAYMENT_INTENT_ENDPOINT = "/api/create-payment-intent";
const CREATE_SUBSCRIPTION_ENDPOINT = "/api/create-subscription";
const ADD_NEWSLETTER_SUBSCRIBER_ENDPOINT = "/api/add-newsletter-subscriber";
const { MODE, SITE, PUBLIC_STRIPE_PRODUCT_SUBSCRIPTION } = import.meta.env;

const SUCCESS_PAGE = "paiement-termine";
const REDIRECT_URL_BASE =
  MODE === "production"
    ? `${SITE}/${SUCCESS_PAGE}`
    : `http://localhost:4321/${SUCCESS_PAGE}`;

const CheckoutForm = ({
  frequency,
  amount,
  hasGifts = false,
  wantsNewsletter = false,
}: {
  frequency: FREQUENCY;
  amount: number;
  hasGifts?: boolean;
  wantsNewsletter: boolean;
}) => {
  // 🪝 Hooks
  const stripe = useStripe();
  const elements = useElements();

  // 🔼 State
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const mode = frequency === FREQUENCY.ONETIME ? "payment" : "subscription";
  const [message, setMessage] = React.useState<string | null>(null);

  const disableCheckout = isLoading || !stripe || !elements;

  /* Handle payment */
  /* -------------- */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("stripe", stripe);
    console.log("elements", elements);
    if (!stripe || !elements) return;

    // 📝 Check form is valid
    const { error: submitError } = await elements.submit();
    if (submitError) {
      console.error("submit error", submitError);
      return;
    }

    setIsLoading(true);

    let clientSecret;

    /* ---------------- */
    /* ONE TIME PAYMENT */
    /* ---------------- */
    if (frequency === FREQUENCY.ONETIME) {
      //  2️⃣ Create customer
      let customer;
      if (email) {
        const resCustomerCreation = await fetch(CREATE_CUSTOMER_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            metadata: {
              campaign: "dons-fin-2024",
            },
          }),
        }).then((res) => res.json());

        if (resCustomerCreation?.customer)
          customer = resCustomerCreation.customer;
        console.log("customer", customer);
      }

      // 3️⃣ Create payment intent for this customer
      let paymentIntent;
      if (customer) {
        const resPaymentIntentCreation = await fetch(
          CREATE_PAYMENT_INTENT_ENDPOINT,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customer: customer.id,
              amount,
              receipt_email: customer.email,
              currency: "eur",
              metadata: {
                hasGifts,
              },
              description: `${amount / 100}€`,
            }),
          },
        ).then((res) => res.json());

        if (resPaymentIntentCreation?.paymentIntent) {
          paymentIntent = resPaymentIntentCreation.paymentIntent;
          clientSecret = paymentIntent.client_secret;
        }
      }
    }

    /* ---------------- */
    /*   SUBSCRIPTION   */
    /* ---------------- */
    if (frequency === FREQUENCY.RECURRING) {
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
              productId: PUBLIC_STRIPE_PRODUCT_SUBSCRIPTION,
              amount,
              nickname: `Abonnement de soutien à Frustation Magazine de ${amount / 100}€/mois`,
            }),
          },
        ).then((res) => res.json());

        if (resSubscriptionCreation?.subscription) {
          subscription = resSubscriptionCreation.subscription;
          console.log("subscription", subscription);
          clientSecret =
            subscription?.latest_invoice?.payment_intent?.client_secret;
        }
      }
    }

    if (clientSecret) {
      // 3️⃣ Try to confirm payment and redirect if that the case or handle error
      const return_url = `${REDIRECT_URL_BASE}?mode=${mode}&status=success${hasGifts ? "&has_gifts" : ""}`;

      if (wantsNewsletter) {
        let firstName = "";
        let lastName = "";
        const addressElement = elements.getElement("address");
        if (addressElement) {
          const { name } = await addressElement
            .getValue()
            .then(({ value }) => value);
          firstName = name;
        }
        const formData = new FormData();
        formData.append("email", email);
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);

        actions.addSubscriber(formData);
      }

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url,
        },
      });

      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message ?? null);
      } else {
        setMessage("Une erreur inattendue est survenue.");
      }
    }

    setIsLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-16 w-full">
      {/* ====================================================================== */}
      {/* 1️⃣ CONTACT INFO */}
      <h3 className="mb-6 flex flex-col items-center justify-center text-center font-montserrat text-2xl lg:flex-row lg:justify-start lg:gap-2 lg:text-left">
        <span className="max-lg:text-3xl">1️⃣</span>
        <span>Vos informations de contact</span>
      </h3>
      <LinkAuthenticationElement
        onChange={({ value: { email } }) => setEmail(email)}
      />
      <div className="my-2"></div>
      {hasGifts ? (
        <AddressElement
          options={{
            mode: "shipping",
          }}
        />
      ) : null}
      {/* ====================================================================== */}
      {/* 2️⃣ PAYMENT */}
      <h3 className="mb-6 mt-10 flex flex-col items-center justify-center text-center font-montserrat text-2xl lg:flex-row lg:justify-start lg:gap-2 lg:text-left">
        <span className="max-lg:text-3xl">2️⃣</span>
        <span>Vos informations de paiement</span>
      </h3>
      <PaymentElement
        id="payment-element"
        options={paymentElementOptions}
        className="mb-4"
      />

      {/* ====================================================================== */}
      {/* 💬 Error or success message */}
      {message && (
        <div
          className="mb-4 flex gap-2 rounded bg-purple px-4 py-2 text-white"
          id="payment-message">
          <MessageCircleWarning />
          {message}
        </div>
      )}

      {/* ====================================================================== */}

      {/* ⬛ Validation */}
      <button
        className={cn(
          "mx-auto mt-16 block max-h-[70px] rounded bg-black px-6 py-4 text-2xl font-bold text-yellow",
          disableCheckout && "opacity-30",
        )}
        type="submit"
        id="submit">
        <span id="button-text">
          {isLoading ? (
            <CircleLoader color="#FFF200" />
          ) : (
            "💝 Soutenir Frustration"
          )}
        </span>
      </button>
    </form>
  );
};

export default CheckoutForm;
