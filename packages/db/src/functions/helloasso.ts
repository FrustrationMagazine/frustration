const { HELLOASSO_CLIENT_ID, HELLOASSO_CLIENT_SECRET, HELLOASSO_API_ENDPOINT, HELLOASSO_ORGANIZATION_SLUG } = require("../config/constants");
const { saveFile } = require("../utils");

// Get token
async function getToken({ endpoint_access_token }: { endpoint_access_token: string }): Promise<string | null> {
  process.stdout.write("🔁 Récupération d'un token HelloAsso");
  let accessToken = null;

  const params = new URLSearchParams({
    grant_type: "client_credentials",
    client_secret: HELLOASSO_CLIENT_SECRET,
    client_id: HELLOASSO_CLIENT_ID
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
      process.stdout.write("✅ Récupération d'un token HelloAsso réussie \r\n");
      accessToken = access_token;
    })
    .catch((err) => process.stdout.write("Error while trying to get Helloasso access token", err));

  return accessToken;
}

// Get page of payments and continuation token
async function getPaymentsAndContinuationToken(endpoint_payments: string): Promise<{ payments: any[]; nextToken: string | null }> {
  const access_token = await getToken({ endpoint_access_token: HELLOASSO_API_ENDPOINT });

  let payments: any[] = [];
  let nextToken = null;

  process.stdout.write("🔁 Récupération d'une page de paiements \r\n");
  await fetch(endpoint_payments, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  })
    .then((res) => res.json())
    .then(({ data, pagination: { continuationToken } }) => {
      process.stdout.write("✅ Récupération d'une page de paiements réussie \r\n");
      payments = data;
      nextToken = continuationToken;
    })
    .catch((error) => console.error(error));

  return {
    payments,
    nextToken
  };
}

// Concatenate all payments
async function getPayments(from = "2024-04-01T00:00:00Z"): Promise<any[]> {
  const PAGE_SIZE = "100";
  let ENDPOINT_PAYMENTS;

  const payments = [];
  let continuationToken = null;
  let counter = 1;

  const startingDate = new Date(from);
  let endingDate = new Date(from);
  endingDate.setMonth(startingDate.getMonth() + 1, 0);

  const options: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  process.stdout.write(`Récupération des données entre le ${startingDate.toLocaleDateString("fr-FR", options)} et le ${endingDate.toLocaleDateString("fr-FR", options)}  \r\n`);

  const params = new URLSearchParams({
    organizationSlug: HELLOASSO_ORGANIZATION_SLUG,
    from,
    to: endingDate.toISOString(),
    pageSize: PAGE_SIZE
  });

  while (true) {
    process.stdout.write(`\n\n📄 [HELLO ASSO] Page de paiements : ${counter} \r\n`);
    if (continuationToken) params.set("continuationToken", continuationToken);
    ENDPOINT_PAYMENTS = `https://api.helloasso.com/v5/organizations/${HELLOASSO_ORGANIZATION_SLUG}/payments?${params}`;
    const { payments: nextPayments, nextToken } = await getPaymentsAndContinuationToken(ENDPOINT_PAYMENTS);
    const thereAreNoNextPayments = !nextPayments || nextPayments.length === 0;
    if (thereAreNoNextPayments) {
      break;
    } else {
      payments.push(...nextPayments);
      continuationToken = nextToken;
      ++counter;
    }
  }

  const formattedTransactions: FormattedPayment[] = payments.map(formatPayment);
  saveFile(formattedTransactions, `./logs/helloasso/formattedTransactions-${startingDate.toLocaleString("fr-FR", { month: "long" })}-${startingDate.getFullYear()}.json`);
  return formattedTransactions;
}

// Convert

const TRANSACTION_TYPES = {
  SUBSCRIPTION: "subscription",
  DONATION: "donation",
  OTHER: "other"
};

function getTransactionType(helloassoType: string): string {
  if (helloassoType === "MonthlyDonation") return TRANSACTION_TYPES.SUBSCRIPTION;
  if (helloassoType === "Donation") return TRANSACTION_TYPES.DONATION;
  return TRANSACTION_TYPES.OTHER;
}

/****************** PAYMENTS *************************/

interface Payment {
  id: string;
  date: string;
  amount: number;
  items: { type: string }[];
  state: string;
}

interface FormattedPayment {
  id: string;
  created: Date;
  available: Date;
  amount: number;
  net: number;
  source: string;
  type: string;
  status: string;
}

function formatPayment({ id, date, amount, items, state }: Payment): FormattedPayment {
  const type = items[0]?.type;
  const transactionType = getTransactionType(type);

  if (transactionType === TRANSACTION_TYPES.OTHER) {
    process.stdout.write(`Unknown type: ${type}\n`);
  }

  return {
    id,
    created: new Date(date),
    available: new Date(date),
    amount: amount / 100,
    net: amount / 100,
    source: "helloasso",
    type: transactionType,
    status: state
  };
}

module.exports = {
  getPayments
};
