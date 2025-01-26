"use server";

// 💽 Database
import { prisma } from "@/data-access/prisma";

// 🔧 Libs
import { stripe, formatStripeTransactions } from "@/data-access/stripe";

// 🗿 Models
import { type Transactions } from "./_models";

/* ---------------- */
/*    Permanent     */
/* ---------------- */
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

/* ---------------- */
/*    Temporary     */
/* ---------------- */
export async function getTransactionsForPeriod({
  begin,
  end = null,
}: {
  begin: Date | null;
  end: Date | null;
}): Promise<any[]> {
  // ❌ Early return if no begin date provided
  if (!begin) return [];

  const PAGE_SIZE = 100;
  let data: any = [];
  let hasMore = true;
  let starting_after;

  do {
    try {
      let listOptions: any = {
        limit: 100,
        starting_after,
      };

      // List options
      listOptions = {
        ...listOptions,
        created: {
          gt: begin.getTime() / 1000,
          ...(end ? { lt: end.getTime() / 1000 } : {}),
        },
      };

      const { data: stripeData, has_more } =
        await stripe.balanceTransactions.list({
          limit: PAGE_SIZE,
          starting_after,
          created: { gt: begin.getTime() / 1000 },
        });

      data.push(...stripeData);
      hasMore = has_more;
      if (hasMore) {
        const lastItem: any = data.slice(-1)[0];
        starting_after = lastItem.id;
      }
    } catch (error: any) {
      if (error.type === "StripeInvalidRequestError") {
        console.info("Invalid request error:", error.message);
      } else {
        console.info("Unexpected error:", error);
      }
    }
  } while (hasMore);

  data = data.map(formatStripeTransactions);
  data = data.filter(
    ({ type, subtype }: { type: any; subtype: any }) =>
      type === "donation" ||
      (type === "subscription" && subtype === "creation"),
  );

  return data;
}

/* -------------------------------- */
/*    Transactions for campaign     */
/* -------------------------------- */
// export async function getTransactionsForCampaign(
//   dateInMilliseconds: number,
//   tag: string,
// ): Promise<any[]> {
//   let transactions: any[] = [];
//   let has_more;
//   let next_page;

//   do {
//     try {
//       const resTransactions = (await stripe.charges.search({
//         query: `metadata['campaign']:'${tag}' AND created>${dateInMilliseconds / 1000}`,
//         limit: 100,
//         ...(next_page ? { page: next_page } : {}),
//       })) as any;
//       next_page = resTransactions.next_page;
//       if (has_more) next_page = resTransactions.next_page;
//       transactions = [...transactions, ...resTransactions.data];
//     } catch (e) {
//       console.error("Error while fetching transactions for campaign", e);
//     }
//   } while (has_more);
//   return transactions;
// }
