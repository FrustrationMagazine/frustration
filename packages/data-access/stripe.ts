import Stripe from "stripe";
import { TRANSACTION_TYPES, TRANSACTION_SUBTYPES, Transaction } from "./models/transactions";
import { convertUTCtoDate } from "@/utils/dates";
import { convertCountryInitials, prettifyName } from "@/utils/strings";
import { writeFileSync } from "fs";

/* ------------------- */
/*        STRIPE       */
/* ------------------- */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  telemetry: false
});

export const { STRIPE_PRICE_SUBSCRIPTION_MINI, STRIPE_PRICE_SUBSCRIPTION_MEDIUM, STRIPE_PRICE_SUBSCRIPTION_MAXI } = process.env;

/* ================== */
/*      FORMAT        */
/* ================== */

function getTransactionType(description: string): string {
  if (/^(Subscription creation)|(Subscription update)/.test(description)) return TRANSACTION_TYPES.SUBSCRIPTION;
  if (/numéro/gi.test(description)) return TRANSACTION_TYPES.SALE;
  if (/(🙏 Faire un don)|(Montant libre)|(\d+€)/.test(description)) return TRANSACTION_TYPES.DONATION;
  if (/STRIPE PAYOUT/.test(description)) return TRANSACTION_TYPES.PAYOUT;
  if (/REFUND FOR CHARGE/.test(description)) return TRANSACTION_TYPES.REFUND;
  if (/Payment for Invoice/.test(description)) return TRANSACTION_TYPES.PAYMENT_FOR_INVOICE;
  if (/^Billing/.test(description)) return TRANSACTION_TYPES.FEE;
  else return TRANSACTION_TYPES.OTHER;
}

function getTransactionSubtype(description: string): "creation" | "update" | null {
  if (/Subscription creation/.test(description)) return TRANSACTION_SUBTYPES.SUBSCRIPTION_CREATION;
  if (/Subscription update/.test(description)) return TRANSACTION_SUBTYPES.SUBSCRIPTION_UPDATE;
  else return null;
}

export const formatStripeTransactions = ({ id, description, amount, net, available_on, created, status, source }: StripeTransaction): Transaction => {
  const transactionType = getTransactionType(description);
  const transactionSubtype = getTransactionSubtype(description);
  if (transactionType === TRANSACTION_TYPES.OTHER) console.info(`Unknown type: ${description}\n`);
  return {
    id,
    created: convertUTCtoDate(created),
    available: convertUTCtoDate(available_on),
    amount: amount / 100,
    net: net / 100,
    stripe_source: source ?? null,
    source: "stripe",
    type: transactionType,
    subtype: transactionSubtype,
    status
  };
};

/* ================== */
/*        READ        */
/* ================== */

async function fetchStripeData({ getAll, afterTimestamp } = { getAll: false, afterTimestamp: 0 }): Promise<any[]> {
  const PAGE_SIZE = 100;
  let data = [];
  let hasMore = true;
  let starting_after;
  let page = 0;

  console.info(`📄 [STRIPE] Récupération des données...`);

  do {
    try {
      console.info(`📄 [STRIPE] Page de résultats : ${page + 1}`);
      let listOptions: any = {
        limit: PAGE_SIZE,
        starting_after
      };

      // List options
      if (afterTimestamp) {
        listOptions = {
          ...listOptions,
          created: { gt: afterTimestamp }
        };
      }
      const { data: stripeData, has_more } = await stripe.balanceTransactions.list({
        limit: PAGE_SIZE,
        starting_after,
        created: { gt: afterTimestamp }
      });

      data.push(...stripeData);
      hasMore = has_more;
      if (hasMore) {
        const lastItem: any = data.slice(-1)[0];
        starting_after = lastItem.id;
        page++;
      }
    } catch (error: any) {
      if (error.type === "StripeInvalidRequestError") {
        console.info("Invalid request error:", error.message);
      } else {
        console.info("Unexpected error:", error);
      }
    }
  } while (getAll && hasMore);

  return data;
}

/*    TRANSACTIONS     */
/* ------------------- */

interface StripeTransaction {
  id: string;
  amount: number;
  available_on: number;
  created: number;
  description: string;
  source?: string;
  net: number;
  status: string;
}

export async function fetchStripeTransactions({ afterTimestamp } = { afterTimestamp: 0 }) {
  let balanceTransactions: StripeTransaction[] = [];
  balanceTransactions = await fetchStripeData({ getAll: true, afterTimestamp });

  const formattedBalanceTransactions: Transaction[] = balanceTransactions.map(formatStripeTransactions);

  return formattedBalanceTransactions;
}

/*    SUBSCRIPTIONS     */
/* -------------------- */

export async function fetchActiveSubscriptions(
  { from, to } = {
    from: firstDayOfCurrentYear,
    to: now
  }
) {
  let hasMore;
  let subscriptions: any[] = [];

  // 1️⃣ We fetch active subscriptions
  do {
    console.log("start fetching subscriptions...");
    const { data, has_more } = await stripe.subscriptions.list({
      limit: 100,
      created: {
        gte: convertDateTimestamp(new Date(2024, 10, 7)),
        lt: convertDateTimestamp(new Date(2025, 1, 1))
      },
      starting_after: subscriptions.at(-1)?.id
    });
    hasMore = has_more;
    const newSubscriptions = data.filter((subscription: any) => subscription.status === "active");
    subscriptions = [...subscriptions, ...newSubscriptions];
  } while (hasMore);

  console.log("subscriptions", subscriptions);
  const subscriptions_f = subscriptions
    .map((subscription) => {
      return {
        id: subscription.id,
        name: "",
        email: "",
        created: new Date(subscription.created * 1000),
        amount: subscription.items.data[0].price.unit_amount / 100,
        customerId: subscription.customer,
        line1: (subscription.metadata.line1 || subscription.metadata.adresse) ?? "",
        city: (subscription.metadata.city || subscription.metadata.ville) ?? "",
        postal_codal: (subscription.metadata.postal_code || subscription.metadata.code_postal) ?? "",
        country: (subscription.metadata.country || subscription.metadata.pays) ?? "",
        state: subscription.metadata.state ?? ""
      };
    })
    .filter((s) => s.amount >= 15);
  console.log("subscriptions_f", subscriptions_f);
  // 2️⃣ We fetch customers
  let customers: any = [];
  let paymentMethods: any = [];
  const customersId: any = subscriptions_f.map(({ customerId }: { customerId: string }) => customerId);

  for (let i = 0; i < customersId.length; i += 100) {
    const sliceCustomersId = customersId.slice(i, i + 100);
    const sliceCustomers = await Promise.all(sliceCustomersId.map((customerId: any) => stripe.customers.retrieve(customerId)));
    customers = [...customers, ...sliceCustomers];
    console.log("wait...");
    await wait(1000);
    let slicePaymentMethods = await Promise.all(sliceCustomersId.map((customerId: any) => stripe.paymentMethods.list({ customer: customerId })));
    slicePaymentMethods = slicePaymentMethods.map((paymentMethod: any) => paymentMethod?.data.at(0));
    paymentMethods = [...paymentMethods, ...slicePaymentMethods];
    console.log("wait...");
    await wait(1000);
  }
  subscriptions_f.forEach((subscription) => {
    const customer = customers.find((customer: any) => customer.id === subscription.customerId);
    const paymentMethod = paymentMethods.find((paymentMethod: any) => paymentMethod.customer === subscription.customerId);

    subscription.name = customer?.name;
    subscription.email = customer?.email;
    subscription.country = convertCountryInitials(subscription.country || paymentMethod?.card?.country);
  });

  // subscriptions_f.forEach(async (subscription) => {
  //   const customer = await stripe.customers.retrieve(subscription.customer);
  //   console.log("customer", customer);
  //   subscription.customer = customer;
  // });

  // let customers: any[] = [];
  // const csv = parse(subscriptions_f);
  // writeFileSync("./subscriptions.csv", csv);
}

/*    CUSTOMERS     */
/* ---------------- */

export interface Customer {
  id: string;
  created: Date;
  name: string;
  email: string;
  adresse: string;
  code_postal: string;
  ville: string;
  pays: string;
  amount: number;
  campaign: string;
}

const firstDayOfCurrentYear = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
const now = new Date();

const convertDateTimestamp = (date: Date) => Math.floor(date.getTime() / 1000);

function wait(ns: number) {
  return new Promise((resolve) => setTimeout(resolve, ns));
}

export async function fetchStripeNewCustomers(
  { from, to } = {
    from: firstDayOfCurrentYear,
    to: now
  }
) {
  let hasMore;
  let subscriptions: any[] = [];
  let customersId: any[] = [];

  // 1️⃣ We fetch new subscriptions
  // do {
  console.log("start fetching subscriptions...");
  const { data, has_more } = await stripe.subscriptions.list({
    created: {
      gte: convertDateTimestamp(from),
      lte: convertDateTimestamp(to)
    },
    limit: 100,
    starting_after: subscriptions.at(-1)?.id
  });

  hasMore = has_more;

  // Filter out non valid subscriptions
  const newSubscriptions = data.filter((subscription: any) => subscription.status === "active");
  subscriptions = [...subscriptions, ...newSubscriptions];

  const newCustomersId = newSubscriptions.map(({ customer }: { customer: string }) => customer);
  customersId = [...customersId, ...newCustomersId];
  // } while (hasMore);

  // 2️⃣ We fetch new customers
  let customers: any[] = [];
  let paymentMethods: any[] = [];

  for (let i = 0; i < customersId.length; i += 100) {
    console.log("start fetching customers...");
    const sliceCustomersId = customersId.slice(i, i + 99);
    const sliceCustomers = await Promise.all(sliceCustomersId.map((customerId: any) => stripe.customers.retrieve(customerId)));
    customers = [...customers, ...sliceCustomers];
    let slicePaymentMethods = await Promise.all(sliceCustomersId.map((customerId: any) => stripe.paymentMethods.list({ customer: customerId })));
    slicePaymentMethods = slicePaymentMethods.map((paymentMethod: any) => paymentMethod?.data.at(0));
    paymentMethods = [...paymentMethods, ...slicePaymentMethods];
  }

  const formattedCustomers: Customer[] = customers.map(({ id, created, name, email, metadata, address }) => {
    const subscription = subscriptions.find((subscription) => subscription.customer === id);
    const paymentMethod = paymentMethods.find((paymentMethod) => paymentMethod.customer === id);

    const adresse = address?.line1 || subscription.metadata?.adresse || subscription.metadata?.line1;
    const ville = address?.city || subscription.metadata?.ville || subscription.metadata?.city;
    const code_postal = address?.postal_code || subscription.metadata?.code_postal || subscription.metadata?.postal_code;
    const amount = subscription.items.data[0].price.unit_amount;
    const pays = convertCountryInitials(address?.country || paymentMethod?.card?.country);
    const campaign = metadata?.campaign || "permanente";

    return {
      id,
      created: new Date(created * 1000),
      name: name ? prettifyName(name) : "-",
      email,
      adresse,
      code_postal,
      ville,
      pays,
      amount,
      campaign
    };
  });
  return formattedCustomers;
}

/*    BALANCE     */
/* -------------- */

export async function fetchStripeBalance(): Promise<{
  available: number;
  pending: number;
}> {
  const balance = await stripe.balance.retrieve();
  const formattedBalance = {
    available: balance.available[0].amount / 100,
    pending: balance.pending[0].amount / 100
  };
  return formattedBalance;
}

/* ==================== */
/*        CREATE        */
/* ==================== */

export async function createStripeSubscription(customerId: string, priceId: string) {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }]
  });
  return subscription;
}
