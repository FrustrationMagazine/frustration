import Stripe from "stripe";
import { prisma } from "@dashboard/prisma";
import { TRANSACTION_TYPES, StripeTransaction, FormattedTransaction } from "./models/transactions";
import { convertUTCtoDate } from "../../utils/dates";

export const stripe = new Stripe(process.env.STRIPE_PROD_SECRET_KEY as string, {
  apiVersion: null as any,
});

/****************** EXPORTS *************************/

export async function fetchStripeTransactions({ afterTimestamp } = { afterTimestamp: 0 }) {
  let balanceTransactions: StripeTransaction[] = [];
  balanceTransactions = await fetchStripeData({ afterTimestamp });

  const formattedBalanceTransactions: FormattedTransaction[] =
    balanceTransactions.map(formatStripeTransactions);

  return formattedBalanceTransactions;
}

export async function fetchStripeBalance(): Promise<StripeFormattedBalance> {
  const balance = await stripe.balance.retrieve();
  let date = new Date();
  date.setHours(0, 0, 0, 0);
  const formattedBalance = {
    available: balance.available[0].amount / 100,
    pending: balance.pending[0].amount / 100,
  };
  return formattedBalance;
}

/****************** EXPORTS *************************/

function getTransactionType(description: string): string {
  if (/(Subscription creation)|(Subscription update)/.test(description))
    return TRANSACTION_TYPES.SUBSCRIPTION;
  if (/numéro/gi.test(description)) return TRANSACTION_TYPES.SALE;
  if (/(🙏 Faire un don)|(Montant libre)|(\d+€)/.test(description))
    return TRANSACTION_TYPES.DONATION;
  if (/STRIPE PAYOUT/.test(description)) return TRANSACTION_TYPES.PAYOUT;
  if (/REFUND FOR CHARGE/.test(description)) return TRANSACTION_TYPES.REFUND;
  if (/Payment for Invoice/.test(description)) return TRANSACTION_TYPES.PAYMENT_FOR_INVOICE;
  if (/^Billing/.test(description)) return TRANSACTION_TYPES.FEE;
  else return TRANSACTION_TYPES.OTHER;
}

const formatStripeTransactions = ({
  id,
  description,
  amount,
  net,
  available_on,
  created,
  status,
}: StripeTransaction): FormattedTransaction => {
  const transactionType = getTransactionType(description);
  if (transactionType === TRANSACTION_TYPES.OTHER) {
    console.log(`Unknown type: ${description}\n`);
    console.log({
      id,
      description,
      amount,
      net,
      available_on,
      created,
      status,
    });
  }
  return {
    id,
    created: convertUTCtoDate(created),
    available: convertUTCtoDate(available_on),
    amount: amount / 100,
    net: net / 100,
    source: "stripe",
    type: transactionType,
    status,
  };
};

export async function fetchLastDashboardUpdatedDate(): Promise<[Date, string] | [null, null]> {
  try {
    const lastBalanceRow = await prisma.balance.findFirst({});
    if (lastBalanceRow?.updatedAt) {
      const date = new Date(lastBalanceRow.updatedAt);
      const formattedDate = date.toLocaleDateString("fr-FR", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
      });
      return [date, formattedDate];
    }
  } catch (error) {
    console.error(error);
    return [null, null];
  }
  return [null, null];
}

async function fetchStripeData({ afterTimestamp } = { afterTimestamp: 0 }): Promise<any[]> {
  const PAGE_SIZE = 100;
  let data = [];
  let hasMore = true;
  let starting_after;
  let page = 0;

  while (hasMore) {
    try {
      console.log(`📄 [STRIPE] Page de paiements : ${page + 1}`);
      const { data: stripeData, has_more } = await stripe.balanceTransactions.list({
        limit: PAGE_SIZE,
        starting_after,
        created: { gt: afterTimestamp },
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
        console.log("Invalid request error:", error.message);
      } else {
        console.log("Unexpected error:", error);
      }
    }
  }

  return data;
}

/****************** BALANCE *************************/

interface StripeBalance {
  object: "balance";
  available: StripeBalanceAmount[];
  pending: StripeBalanceAmount[];
  livemode: boolean;
}

interface StripeBalanceAmount {
  amount: number;
  currency: string;
  source_types: {
    card: number;
    [key: string]: number;
  };
}

interface StripeFormattedBalance {
  available: number;
  pending: number;
}
