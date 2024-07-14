"use server";

import { getBalanceTransactions, getBalance } from "@/stripe";
import { prisma } from "@/libs/prisma";

export const updateDashboard = async () => {
  updateBalanceTransactions();
  updateBalance();

  return { success: true, message: "Dashboard updated successfully" };
};

async function updateBalanceTransactions() {
  let lastDatabaseUpdate;
  try {
    const result = await prisma.balanceTransactions.findFirst({
      orderBy: {
        updatedAt: "desc",
      },
    });
    lastDatabaseUpdate = result?.updatedAt;
  } catch (error) {
    console.error("Couldn't get last database update date...");
    return;
  }

  let stripeBalanceTransactions = [];

  if (lastDatabaseUpdate) {
    const lastUpdateDate = new Date(lastDatabaseUpdate);
    // We want to update information relating to transactions fetched less than a month ago because their status
    // may have changed since
    const oneMonthBeforeDate = new Date(lastDatabaseUpdate);
    oneMonthBeforeDate.setMonth(lastUpdateDate.getMonth() - 1);
    const unixTimestamp = Math.floor(oneMonthBeforeDate.getTime() / 1000);
    stripeBalanceTransactions = await getBalanceTransactions({ afterTimestamp: unixTimestamp });
  } else {
    stripeBalanceTransactions = await getBalanceTransactions();
  }
  try {
    const result = await prisma.balanceTransactions.createMany({
      data: stripeBalanceTransactions,
      skipDuplicates: true,
    });
    console.log(`${result.count} balance transaction(s) inserted.`);
  } catch (error) {
    console.error("Failed to insert records:", error);
  }
}

async function updateBalance() {
  const stripeBalance = await getBalance();

  const lastBalanceRow = await prisma.balance.findFirst({});

  if (lastBalanceRow) {
    try {
      const result = await prisma.balance.deleteMany({});
      console.log(`${result.count} records deleted.`);
    } catch (error) {
      if (typeof error === "string") return new Error(error);
    }
  }

  try {
    await prisma.balance.create({
      data: stripeBalance,
    });
    console.log(`New balance information inserted`);
  } catch (error) {
    if (typeof error === "string") return new Error(error);
  }
}
