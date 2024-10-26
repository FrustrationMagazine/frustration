// 🔧 Libs

import { prisma } from "./prisma/client";
import { BalanceTransactions } from "@prisma/client";

/*    ACTIVE CUSTOMERS     */
/* ----------------------- */

export async function fetchNumberOfActiveCustomersLastMonth() {
  const now = new Date();
  let activeSubscribers: BalanceTransactions[] = [];

  try {
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    activeSubscribers = await prisma.balanceTransactions.findMany({
      where: {
        created: {
          gte: lastMonth,
          lt: currentMonth
        },
        type: {
          equals: "subscription"
        },
        status: {
          in: ["available", "pending", "Authorized"]
        }
      }
    });
  } catch (e) {
    console.error("❌ Error while fetching number of active customers last month", e);
  }

  return activeSubscribers.length;
}

/*    LAST UPDATE     */
/* ------------------ */

export async function fetchLastUpdate(): Promise<Date | null> {
  try {
    const lastBalanceRow = await prisma.balance.findFirst({});
    if (lastBalanceRow?.updatedAt) {
      const date = new Date(lastBalanceRow.updatedAt);
      return date;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
  return null;
}
