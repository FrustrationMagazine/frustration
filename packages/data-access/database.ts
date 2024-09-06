// 🔧 Libs

import { prisma } from "./prisma/client";
import { BalanceTransactions } from "@prisma/client";

export async function fetchNumberOfActiveCustomersLastMonth() {
  const now = new Date();
  let activeSubscribers: BalanceTransactions[] = [];

  try {
    activeSubscribers = await prisma.balanceTransactions.findMany({
      where: {
        created: {
          gte: new Date(now.getFullYear(), now.getMonth() - 1, 1),
          lt: new Date(now.getFullYear(), now.getMonth(), 1)
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
