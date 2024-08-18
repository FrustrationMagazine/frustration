"use server";

// 💽 Database
import { prisma } from "@/data-access/prisma";

// 🗿 Models
import { type TransactionsByMonth } from "./_models";

/* ---------------------------- */
/*    Transactions by month     */
/* ---------------------------- */

export async function getTransactionsByMonth(): Promise<TransactionsByMonth[]> {
  const transactions: TransactionsByMonth[] = await prisma.$queryRaw`
     SELECT
      DATE_TRUNC('month', created) as month,
      type,
      SUM(CASE WHEN source = 'stripe' THEN net ELSE 0 END) as stripe,
      SUM(CASE WHEN source = 'helloasso' THEN net ELSE 0 END)  as helloasso,
      SUM(net) as total
    FROM
      "BalanceTransactions"
    WHERE
      DATE_TRUNC('month', created) <> DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY
      month,
      type
    ORDER BY
      month ASC
  `;

  return transactions;
}
