const { HELLOASSO_CLIENT_ID, HELLOASSO_CLIENT_SECRET, HELLOASSO_API_ENDPOINT, HELLOASSO_ORGANIZATION_SLUG } = require("../config/constants");
const { saveFile, readFile } = require("../utils");
const fs = require("fs");
const fetch = require("node-fetch");

// Get token
async function getHelloAssoAccessToken({ endpoint_access_token }) {
  process.stdout.write("🔁 Récupération d'un token HelloAsso  \r\n");
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
async function getPaymentsAndContinuationToken(endpoint_payments) {
  const access_token = await getHelloAssoAccessToken({ endpoint_access_token: HELLOASSO_API_ENDPOINT });

  let payments = [];
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
async function getHelloAssoPayments(from = "2024-04-01T00:00:00Z") {
  const PAGE_SIZE = 100;
  let ENDPOINT_PAYMENTS;

  const payments = [];
  let continuationToken = null;
  let counter = 1;

  const startingDate = new Date(from);
  let endingDate = new Date(from);
  endingDate.setMonth(startingDate.getMonth() + 1, 0);

  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
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

  saveFile(payments, `./logs/helloasso/payments-${startingDate.toLocaleString("fr-FR", { month: "long" })}-${startingDate.getFullYear()}.json`);
  return payments;
}

// Convert

const SUPABASE_TYPES = {
  SUBSCRIPTION: "subscription",
  DONATION: "donation",
  OTHER: "other"
};

function getSupabaseType(helloassoType) {
  if (helloassoType === "MonthlyDonation") return SUPABASE_TYPES.SUBSCRIPTION;
  if (helloassoType === "Donation") return SUPABASE_TYPES.DONATION;
  return SUPABASE_TYPES.OTHER;
}

function mapHelloAssoToSupabase({ id, date, amount, items, state }) {
  const type = items[0]?.type;
  const supabaseType = getSupabaseType(type);

  if (supabaseType === SUPABASE_TYPES.OTHER) {
    process.stdout.write(`Unknown type: ${type}\n`);
  }

  return {
    id,
    created: new Date(date),
    available: new Date(date),
    amount: amount / 100,
    net: amount / 100,
    source: "helloasso",
    type: supabaseType,
    status: state
  };
}

function convertHelloAssoPaymentsToSupabase(payments) {
  return payments.map(mapHelloAssoToSupabase);
}

module.exports = {
  getHelloAssoPayments,
  convertHelloAssoPaymentsToSupabase
};
