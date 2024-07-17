const stripe = require("../config/stripe.config.js");
const { convertDateUTC, saveFile } = require("../utils/index");
const { TRANSACTION_TYPES } = require("../config/constants");

async function fetchStripeData(operation: string, lastUpdateDate = 0): Promise<any[]> {
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
        const lastItem: any = data.slice(-1)[0];
        startingAfter = lastItem.id;
        page++;
      }
    } catch (error: any) {
      if (error.type === "StripeInvalidRequestError") {
        process.stdout.write("Invalid request error:", error.message);
      } else {
        process.stdout.write("Unexpected error:", error);
      }
    }
  }

  return data;
}

function getTransactionType(description: string): string {
  if (/(Subscription creation)|(Subscription update)/.test(description)) return TRANSACTION_TYPES.SUBSCRIPTION;
  if (/numéro/gi.test(description)) return TRANSACTION_TYPES.SALE;
  if (/(🙏 Faire un don)|(Montant libre)|(\d+€)/.test(description)) return TRANSACTION_TYPES.DONATION;
  if (/STRIPE PAYOUT/.test(description)) return TRANSACTION_TYPES.PAYOUT;
  if (/REFUND FOR CHARGE/.test(description)) return TRANSACTION_TYPES.REFUND;
  if (/^Billing/.test(description)) return TRANSACTION_TYPES.FEE;
  else return TRANSACTION_TYPES.OTHER;
}

/****************** BALANCE TRANSACTION *************************/

interface BalanceTransaction {
  id: string;
  amount: number;
  available_on: number;
  created: number;
  description: string;
  net: number;
  status: string;
}

interface FormattedTransaction {
  id: string;
  created: Date;
  available: Date;
  amount: number;
  net: number;
  source: string;
  type: string;
  status: string;
}
const formatStripeTransactions = ({ id, description, amount, net, available_on, created, status }: StripeTransaction): FormattedTransaction => {
  const transactionType = getTransactionType(description);
  if (transactionType === TRANSACTION_TYPES.OTHER) {
    process.stdout.write(`Unknown type: ${description}\n`);
  }
  return {
    id,
    created: convertDateUTC(created),
    available: convertDateUTC(available_on),
    amount: amount / 100,
    net: net / 100,
    source: "stripe",
    type: transactionType,
    status
  };
};

async function fetchStripeTransactions(filepath = "./logs/stripe/balance_transactions.json", lastUpdateDate = 0) {
  let balanceTransactions: StripeTransaction[] = [];
  balanceTransactions = await fetchStripeData("balanceTransactions", lastUpdateDate);

  const formattedBalanceTransactions: FormattedTransaction[] = balanceTransactions.map(formatStripeTransactions);

  process.stdout.write(`💾 Save data to ${filepath} \r\n`);
  saveFile(formattedBalanceTransactions, filepath);

  return formattedBalanceTransactions;
}

/****************** BALANCE *************************/

interface Balance {
  object: "balance";
  available: BalanceAmount[];
  pending: BalanceAmount[];
  livemode: boolean;
}

interface BalanceAmount {
  amount: number;
  currency: string;
  source_types: {
    card: number;
    [key: string]: number;
  };
}

interface FormattedBalance {
  date: Date;
  available: number;
  pending: number;
}

export async function getStripeBalance(): Promise<FormattedBalance> {
  return new Promise<FormattedBalance>(async (resolve, reject) => {
    try {
      const balance: Balance = await stripe.balance.retrieve();
      let date = new Date();
      date.setHours(0, 0, 0, 0);
      const formattedBalance = {
        date,
        available: balance.available[0].amount / 100,
        pending: balance.pending[0].amount / 100
      };
      resolve(formattedBalance);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  fetchStripeData,
  fetchStripeTransactions
};
