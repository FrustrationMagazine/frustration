import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

const stripeApiKey = process.env.STRIPE_SECRET_KEY;

if (!stripeApiKey) {
  throw new Error("Stripe API key is not defined in the environment variables");
}
const stripe = new Stripe(stripeApiKey);

const startingDate = process.argv[2];

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

async function getTransactions(startDate, endDate) {
  const transactions = [];
  let hasMore = true;
  let startingAfter = null;

  while (hasMore) {
    const params = {
      created: {
        gte: startDate,
        lte: endDate
      },
      limit: 100
    };

    if (startingAfter) {
      params.starting_after = startingAfter;
    }

    const response = await stripe.balanceTransactions.list(params);

    transactions.push(...response.data);
    hasMore = response.has_more;
    if (hasMore) {
      startingAfter = response.data[response.data.length - 1].id;
    }
  }

  return transactions;
}

// Example usage
const startDate = Math.floor(new Date("2024-11-22").getTime() / 1000);
const endDate = Math.floor(new Date().getTime() / 1000);
console.log("startDate", startDate);
console.log("endDate", endDate);
getTransactions(startDate, endDate)
  .then((transactions) => {
    const filteredTransactions = transactions.filter((tr) => {
      return tr.description !== "Subscription update" && tr.type !== "payout" && tr.type !== "stripe_fee";
    });
    console.log(filteredTransactions);
  })
  .catch((error) => {
    console.error(error);
  });
