import { TRANSACTION_TYPES, Transaction } from "./models/transactions";

/* ------------------ */
/*     HELLOASSO      */
/* ------------------ */

async function fetchHelloAssoToken({ endpoint_access_token }: { endpoint_access_token: string }): Promise<string | null> {
  console.info("🔁 Récupération d'un token HelloAsso");
  let accessToken = null;

  const params = new URLSearchParams({
    grant_type: "client_credentials",
    client_secret: process.env.HELLOASSO_CLIENT_SECRET ?? "",
    client_id: process.env.HELLOASSO_CLIENT_ID ?? ""
  });

  await fetch(endpoint_access_token, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  })
    .then((response) => response.json())
    .then(({ access_token }) => {
      console.info("✅ Récupération d'un token HelloAsso réussie");
      accessToken = access_token;
    })
    .catch((err) => console.error("Error while trying to get Helloasso access token", err));

  return accessToken;
}

/* ------------------- */
/*    TRANSACTIONS     */
/* ------------------- */

const START_DATE_STRING = "2020-01-01T00:00:00Z";

export interface HelloAssoTransaction {
  id: string;
  date: string;
  amount: number;
  items: { type: string }[];
  state: string;
}

function getTransactionType(helloassoType: string): string {
  if (helloassoType === "MonthlyDonation") return TRANSACTION_TYPES.SUBSCRIPTION;
  if (helloassoType === "Donation") return TRANSACTION_TYPES.DONATION;
  if (helloassoType === "Payment") return TRANSACTION_TYPES.PAYMENT_FOR_INVOICE;
  return TRANSACTION_TYPES.OTHER;
}

function formatHelloAssoTransactions({ id, date, amount, items, state }: HelloAssoTransaction): Transaction {
  const type = items[0]?.type;
  const transactionType = getTransactionType(type);

  if (transactionType === TRANSACTION_TYPES.OTHER) {
    console.info(`Unknown type: ${type}\n`);
    console.info({
      id,
      date,
      amount,
      items,
      state
    });
  }

  return {
    id: String(id),
    created: new Date(date),
    available: new Date(date),
    amount: amount / 100,
    net: amount / 100,
    source: "helloasso",
    type: transactionType,
    stripe_source: null,
    subtype: null,
    status: state
  };
}

async function fetchHelloAssoTransactionsAndToken(endpoint_payments: string): Promise<{ payments: any[]; nextToken: string | null }> {
  const access_token = await fetchHelloAssoToken({
    endpoint_access_token: process.env.HELLOASSO_API_ENDPOINT ?? ""
  });

  let payments: any[] = [];
  let nextToken = null;

  console.info("🔁 Récupération d'une page de paiements \r\n");
  await fetch(endpoint_payments, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  })
    .then((res) => res.json())
    .then(({ data, pagination: { continuationToken } }) => {
      console.info("✅ Récupération d'une page de paiements réussie \r\n");
      payments = data;
      nextToken = continuationToken;
    })
    .catch((error) => console.error(error));

  return {
    payments,
    nextToken
  };
}

export async function fetchHelloAssoTransactions({ from } = { from: START_DATE_STRING }): Promise<any[]> {
  const PAGE_SIZE = "100";
  let ENDPOINT_PAYMENTS;

  const payments = [];
  let continuationToken = null;
  let counter = 1;

  const startingDate = new Date(from);
  let endingDate = new Date();

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };
  console.info(`Récupération des données entre le ${startingDate.toLocaleDateString("fr-FR", options)} et le ${endingDate.toLocaleDateString("fr-FR", options)}`);

  const params = new URLSearchParams({
    organizationSlug: process.env.HELLOASSO_ORGANIZATION_SLUG ?? "",
    from,
    to: endingDate.toISOString(),
    pageSize: PAGE_SIZE
  });

  while (true) {
    console.info(`📄 [HELLO ASSO] Page de paiements : ${counter}`);
    if (continuationToken) params.set("continuationToken", continuationToken);
    ENDPOINT_PAYMENTS = `https://api.helloasso.com/v5/organizations/${process.env.HELLOASSO_ORGANIZATION_SLUG ?? ""}/payments?${params}`;
    const { payments: nextPayments, nextToken } = await fetchHelloAssoTransactionsAndToken(ENDPOINT_PAYMENTS);
    const thereAreNoNextPayments = !nextPayments || nextPayments.length === 0;
    if (thereAreNoNextPayments) {
      break;
    } else {
      payments.push(...nextPayments);
      continuationToken = nextToken;
      ++counter;
    }
  }

  const formattedTransactions: Transaction[] = payments.map(formatHelloAssoTransactions);
  return formattedTransactions;
}
