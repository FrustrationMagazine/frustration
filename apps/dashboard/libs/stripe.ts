import Stripe from "stripe";
import { prisma } from "@/libs/prisma";
import {
  TRANSACTION_TYPES,
  BalanceTransaction,
  FormattedBalanceTransaction,
} from "@/models/transactions";
import { convertDateUTC } from "@/utils/dates";

export const stripe = new Stripe(process.env.STRIPE_PROD_SECRET_KEY as string, {
  apiVersion: null as any,
});

export async function getLastDashboardUpdatedDate(): Promise<[Date, string] | [null, null]> {
  const lastBalanceRow = await prisma.balance.findFirst({});
  if (lastBalanceRow?.createdAt) {
    const date = new Date(lastBalanceRow.createdAt);
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
  return [null, null];
}

/****************** BALANCE TRANSACTIONS *************************/

export async function getBalanceTransactions({ afterTimestamp } = { afterTimestamp: 0 }) {
  let balanceTransactions: BalanceTransaction[] = [];
  balanceTransactions = await getStripeData({ afterTimestamp });

  const formattedBalanceTransactions: FormattedBalanceTransaction[] =
    balanceTransactions.map(formatBalanceTransactions);

  return formattedBalanceTransactions;
}

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

const formatBalanceTransactions = ({
  id,
  description,
  amount,
  net,
  available_on,
  created,
  status,
}: BalanceTransaction): FormattedBalanceTransaction => {
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
    created: convertDateUTC(created),
    available: convertDateUTC(available_on),
    amount: amount / 100,
    net: net / 100,
    source: "stripe",
    type: transactionType,
    status,
  };
};

async function getStripeData({ afterTimestamp } = { afterTimestamp: 0 }): Promise<any[]> {
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

export async function getBalance(): Promise<FormattedBalance> {
  const balance = await stripe.balance.retrieve();
  let date = new Date();
  date.setHours(0, 0, 0, 0);
  const formattedBalance = {
    date,
    available: balance.available[0].amount / 100,
    pending: balance.pending[0].amount / 100,
  };
  return formattedBalance;
}
