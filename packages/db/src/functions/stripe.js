const stripe = require("../config/stripe.config.js");
const { convertDateUTC, saveFile, readFile } = require("../utils/index");
import SUPABASE_TYPES from "../config/constants";

async function getStripeData(operation, lastUpdateDate = 0) {
  const PAGE_SIZE = 100;
  let data = [];
  let hasMore = true;
  let startingAfter;
  let page = 0;

  while (hasMore) {
    try {
      process.stdout.write(`\n\n📄 [STRIPE] Page de paiements : ${page + 1} \r\n`);
      const { data: stripeData, has_more } = await stripe[operation].list({
        limit: PAGE_SIZE,
        starting_after: startingAfter,
        created: { gt: lastUpdateDate }
      });
      data.push(...stripeData);
      hasMore = has_more;
      if (hasMore) {
        const lastItem = data.slice(-1)[0];
        startingAfter = lastItem.id;
        page++;
      }
    } catch (error) {
      if (error.type === "StripeInvalidRequestError") {
        process.stdout.write("Invalid request error:", error.message);
      } else {
        process.stdout.write("Unexpected error:", error);
      }
    }
  }

  return data;
}

// Convert
function getSupabaseType(description) {
  if (/(Subscription creation)|(Subscription update)/.test(description)) return SUPABASE_TYPES.SUBSCRIPTION;
  if (/numéro/gi.test(description)) return SUPABASE_TYPES.SALE;
  if (/(🙏 Faire un don)|(Montant libre)|(\d+€)/.test(description)) return SUPABASE_TYPES.DONATION;
  if (/STRIPE PAYOUT/.test(description)) return SUPABASE_TYPES.PAYOUT;
  if (/REFUND FOR CHARGE/.test(description)) return SUPABASE_TYPES.REFUND;
  if (/^Billing/.test(description)) return SUPABASE_TYPES.FEE;
  else return SUPABASE_TYPES.OTHER;
}

const mapStripeBalanceTransactionsToSupabase = ({ id, description, amount, net, available_on, created, status }) => {
  const supabaseType = getSupabaseType(description);
  if (supabaseType === SUPABASE_TYPES.OTHER) {
    process.stdout.write(`Unknown type: ${description}\n`);
  }
  return {
    id,
    created: convertDateUTC(created),
    available: convertDateUTC(available_on),
    amount: amount / 100,
    net: net / 100,
    source: "stripe",
    type: supabaseType,
    status
  };
};

async function getStripeBalanceTransactions(filepath = "./logs/stripe/balance_transactions.json", lastUpdateDate = 0) {
  let balanceTransactions = [];

  balanceTransactions = await getStripeData("balanceTransactions", lastUpdateDate);
  balanceTransactions = balanceTransactions.map(mapStripeBalanceTransactionsToSupabase);

  process.stdout.write(`💾 Save data to ${filepath} \r\n`);
  saveFile(balanceTransactions, filepath);

  return balanceTransactions;
}

async function getStripeBalance() {
  let balance = await stripe.balance.retrieve();
  let date = new Date();
  date.setHours(0, 0, 0, 0);
  balance = {
    date,
    available: balance.available[0].amount / 100,
    pending: balance.pending[0].amount / 100
  };
  return balance;
}

module.exports = {
  getStripeData,
  getStripeBalance,
  getStripeBalanceTransactions
};
