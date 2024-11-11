"use server";

// 💽 Database
import { prisma } from "@/data-access/prisma";

// 🔧 Libs
import { stripe } from "@/data-access/stripe";

// 🗿 Models
import { type Transactions } from "./_models";

/* ---------------------------- */
/*    Transactions by month     */
/* ---------------------------- */

export async function getTransactions({
  period,
}: {
  period: "month" | "day";
}): Promise<Transactions[]> {
  const transactions: Transactions[] = await prisma.$queryRaw`
     SELECT
      DATE_TRUNC(${period}, created) as date,
      type,
      SUM(CASE WHEN source = 'stripe' THEN net ELSE 0 END) as stripe,
      SUM(CASE WHEN source = 'helloasso' THEN net ELSE 0 END)  as helloasso,
      SUM(net) as total
    FROM
      "BalanceTransactions"
    WHERE
      DATE_TRUNC(${period}, created) <> DATE_TRUNC(${period}, CURRENT_DATE)
    GROUP BY
      date,
      type
    ORDER BY
      date ASC
  `;

  return transactions;
}

/* -------------------------------- */
/*    Transactions for campaign     */
/* -------------------------------- */

export async function getTransactionsForCampaign(
  dateInMilliseconds: number,
  tag: string,
): Promise<any[]> {
  let transactions: any[] = [];
  let has_more;
  let next_page;
  do {
    try {
      const resTransactions = (await stripe.charges.search({
        query: `metadata['campaign']:'${tag}' AND created>${dateInMilliseconds / 1000}`,
        limit: 100,
        ...(next_page ? { page: next_page } : {}),
      })) as any;
      next_page = resTransactions.next_page;
      if (has_more) next_page = resTransactions.next_page;
      transactions = [...transactions, ...resTransactions.data];
    } catch (e) {
      console.error("Error while fetching transactions for campaign", e);
    }
  } while (has_more);
  return transactions;
}
