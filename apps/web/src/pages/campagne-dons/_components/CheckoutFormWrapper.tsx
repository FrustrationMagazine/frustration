// 🔩 Base
import React from "react";
import { styled } from "@mui/material/styles";

// 🎨 Styles
import "./styles.css";

// 🖼️ Assets
import { TbBulb } from "react-icons/tb";

// 🔧 Utils
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";
import { formatCurrency } from "@/utils/strings";

// 🧱 Components
import { Elements } from "@stripe/react-stripe-js";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup, {
  toggleButtonGroupClasses,
} from "@mui/material/ToggleButtonGroup";
import CheckoutForm from "./CheckoutForm";

// 💽 Data

export enum FREQUENCY {
  ONETIME = "onetime",
  RECURRING = "recurring",
}

export enum GIFTS {
  MAGAZINE = "magazine",
  BOOK = "book",
}

const DONATION_FREQUENCIES = [
  {
    value: FREQUENCY.ONETIME,
    text: "Don unique",
  },
  {
    value: FREQUENCY.RECURRING,
    text: "Don mensuel",
  },
];
const DONATION_AMOUNTS = [
  {
    value: 1500,
    emoji: "😄",
    gifts: [GIFTS.MAGAZINE],
  },
  {
    value: 3000,
    emoji: "😃",
    gifts: [GIFTS.MAGAZINE],
  },
  {
    value: 5000,
    emoji: "😙",
    gifts: [GIFTS.MAGAZINE, GIFTS.BOOK],
  },
  {
    value: 10000,
    emoji: "😘",
    gifts: [GIFTS.MAGAZINE, GIFTS.BOOK],
  },
  {
    value: 20000,
    emoji: "🥰",
    gifts: [GIFTS.MAGAZINE, GIFTS.BOOK],
  },
  {
    value: 50000,
    emoji: "🤩",
    gifts: [GIFTS.MAGAZINE, GIFTS.BOOK],
  },
];

// 🎨 Styles
const StyledToggleButtonGroup = styled(ToggleButtonGroup)(() => ({
  [`& .${toggleButtonGroupClasses.selected}`]: {
    backgroundColor: "black !important",
    color: "#FFF200 !important",
  },
}));

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const { PUBLIC_STRIPE_PUBLIC_KEY } = import.meta.env;
const stripePromise = loadStripe(PUBLIC_STRIPE_PUBLIC_KEY);

const Form = () => {
  // 🔼 State
  const [selectedFrequency, setSelectedFrequency] = React.useState(
    FREQUENCY.ONETIME,
  );

  /* Amount */
  /* ------ */
  const queryParams = new URLSearchParams(window.location.search);
  const initialAmount = queryParams.get("amount")
    ? parseInt(queryParams.get("amount")!) * 100
    : DONATION_AMOUNTS[1].value;
  let initialIsCustom = false;
  if (!DONATION_AMOUNTS.map(({ value }) => value).includes(initialAmount)) {
    initialIsCustom = true;
  }

  const [{ selectedAmount, isCustom }, setSelectedAmount] = React.useState({
    selectedAmount: initialAmount,
    isCustom: initialIsCustom,
  });

  /* Newsletter */
  /* ---------- */
  const [wantsNewsletter, setWantsNewsletter] = React.useState(true);

  const gifts =
    DONATION_AMOUNTS.findLast(({ value }) => selectedAmount >= value)?.gifts ||
    [];
  const hasGifts =
    selectedFrequency === FREQUENCY.RECURRING && gifts.length > 0;

  // 💳 Stripe
  const options: StripeElementsOptions = {
    mode: selectedFrequency === FREQUENCY.ONETIME ? "payment" : "subscription",
    amount: selectedAmount,
    currency: "eur",
    appearance: {
      theme: "stripe",
    },
    loader: "auto",
  };

  return (
    <div className="mx-auto mt-12 flex max-w-[500px] flex-col items-center">
      <div className="mb-8 text-center">
        <h3 className="font-bebas text-7xl"> Don direct</h3>
        <p className="text-3xl font-bold">Aidez-nous à grandir ! 🌱</p>
      </div>

      {/* 📅 FREQUENCY */}
      <StyledToggleButtonGroup
        value={selectedFrequency}
        exclusive
        onChange={(_, newDonationType) => setSelectedFrequency(newDonationType)}
        aria-label="text donation-frequency"
        className="mb-8">
        {DONATION_FREQUENCIES.map(({ value: frequency, text }) => (
          <ToggleButton
            sx={{ padding: "10px 30px", fontSize: "17px", lineHeight: "1.3" }}
            key={frequency}
            value={frequency}
            aria-label={frequency}>
            {text}
          </ToggleButton>
        ))}
      </StyledToggleButtonGroup>
      {/* ====================================================================== */}

      <div>
        {/* 🔢 AMOUNT */}
        {DONATION_AMOUNTS.map(({ value: amount, gifts }) => (
          <label
            htmlFor={`amount-${amount}`}
            key={`amount-${amount}`}
            className="inline-block w-1/2 cursor-pointer rounded-sm border px-6 py-4 text-center font-bold hover:bg-gray-100 has-[:checked]:bg-black has-[:checked]:text-yellow">
            <input
              type="radio"
              className="button-amount hidden"
              checked={selectedAmount === amount && !isCustom}
              onClick={() =>
                setSelectedAmount({ selectedAmount: amount, isCustom: false })
              }
              id={`amount-${amount}`}
            />
            <span className="relative">
              {formatCurrency({ amount: amount / 100, decimals: false })}
              {selectedFrequency === FREQUENCY.RECURRING && gifts.length > 0 ? (
                <small className="absolute -right-1 top-0 -translate-y-3/4 translate-x-full">
                  🎁{gifts.length > 1 ? ` x${gifts.length}` : ""}
                </small>
              ) : null}
            </span>
          </label>
        ))}

        {/* 🍡 CUSTOM */}
        <label
          htmlFor="amount-custom"
          className="mx-auto mt-4 block w-full cursor-pointer rounded-sm border px-6 py-4 text-center text-lg font-bold hover:bg-gray-100 has-[:checked]:bg-black has-[:checked]:text-yellow">
          <input
            type="radio"
            name="amount"
            className="hidden"
            id="amount-custom"
            checked={isCustom}
            onClick={() =>
              setSelectedAmount(({ selectedAmount }) => ({
                selectedAmount,
                isCustom: true,
              }))
            }
          />
          Montant de votre choix
        </label>
        {isCustom && (
          <div className="items-center gap-2 py-4 text-4xl">
            <div className="mb-2 flex items-center justify-center text-center">
              <input
                type="number"
                className="border-2 border-black px-0 py-2 text-right font-bold"
                style={{
                  width: `${(selectedAmount / 100).toString().length + 1}ch`,
                }}
                value={selectedAmount / 100}
                min="1"
                onChange={(e) => {
                  let wantedAmount = +e.target.value;
                  if (wantedAmount < 15) wantedAmount = 15;

                  setSelectedAmount({
                    selectedAmount: wantedAmount * 100,
                    isCustom: true,
                  });
                }}
              />
              <span>€</span>
            </div>
            <div className="flex items-center">
              <input
                type="range"
                className="mr-4 grow"
                min="1"
                max={DONATION_AMOUNTS.map(({ value }) => value / 100)
                  .sort((a, b) => b - a)
                  .at(0)}
                value={selectedAmount / 100}
                onChange={(e) =>
                  setSelectedAmount({
                    selectedAmount: +e.target.value * 100,
                    isCustom: true,
                  })
                }
              />
              <span className="ml-3">
                {DONATION_AMOUNTS.findLast(
                  ({ value }) => selectedAmount >= value,
                )?.emoji ?? ""}
              </span>
            </div>
          </div>
        )}
        {selectedFrequency === FREQUENCY.ONETIME && selectedAmount >= 900 && (
          <p
            className="my-4 flex cursor-pointer items-center gap-2 font-bold leading-tight hover:underline"
            onClick={() => setSelectedFrequency(FREQUENCY.RECURRING)}>
            <TbBulb size={36} />
            <span>
              Passez à un don mensuel pour recevoir des contreparties en échange{" "}
              <small>🎁 </small>
            </span>
          </p>
        )}

        {/* 🎁 GIFTS */}
        {selectedFrequency === FREQUENCY.RECURRING && gifts.length > 0 && (
          <div>
            <h5 className="mb-2 mt-5 flex gap-2 text-xl font-bold">
              <span>🎁 </span>
              <span>
                Pour vous remercier de votre soutien, nous vous enverrons :{" "}
              </span>
            </h5>
            {gifts.includes(GIFTS.MAGAZINE) && (
              <p>🗞️ Le dernier numéro papier annuel</p>
            )}
            {gifts.includes(GIFTS.BOOK) && (
              <p>
                📔 1 exemplaire de
                <i>
                  <b> Parasites</b>
                </i>{" "}
                (éd. de Poche) de Nicolas Framont
              </p>
            )}
          </div>
        )}

        {/* 📨 Newsletter */}
        <label
          htmlFor="newsletter"
          className="mt-6 flex items-center gap-2">
          <input
            type="checkbox"
            name="newsletter"
            checked={wantsNewsletter}
            onChange={() => setWantsNewsletter(!wantsNewsletter)}
            id="newsletter"
          />
          <span className="text-pretty leading-none">
            Je souhaite recevoir la newsletter de{" "}
            <span style={{ fontVariant: "all-small-caps" }}>
              Frustration Magazine
            </span>
          </span>
        </label>
      </div>
      {/* 3️⃣ 🗒️ PAYMENT */}
      <Elements
        options={options as any}
        stripe={stripePromise}>
        <CheckoutForm
          frequency={selectedFrequency}
          setFrequency={setSelectedFrequency}
          amount={selectedAmount}
          hasGifts={hasGifts}
          wantsNewsletter={wantsNewsletter}
        />
      </Elements>
    </div>
  );
};

export default Form;
