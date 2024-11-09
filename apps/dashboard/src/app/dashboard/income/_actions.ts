"use server";

// 💽 Database
import { prisma } from "@/data-access/prisma";

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
