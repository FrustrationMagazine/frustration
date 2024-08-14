"use server";

import { prisma } from "@/data-access/prisma";
import type { TransactionsByMonth } from "../_models/transactionsByMonth";

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
  // 👉 What it looks like
  // {
  //   month: 2020-05-20T00:00:00.000Z,
  //   type: 'subscription',
  //   stripe: 100,
  //   helloasso: 100,
  //   total: 200
  // }

  return transactions;
}
