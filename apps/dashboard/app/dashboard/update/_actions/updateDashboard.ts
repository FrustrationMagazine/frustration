"use server";

import { getBalanceTransactions, getBalance } from "@/stripe";
import { prisma } from "@/libs/prisma";
import {
  UpdateDashboardResponse,
  SUCCESS,
  ERROR_GET_LAST_RECORD,
  ERROR_UPSERT_PAYMENTS,
  ERROR_GET_BALANCE,
  ERROR_UNKNOWN,
  ERROR_UPDATE_BALANCE,
} from "../_models/formState";

export const updateDashboard = async () => {
  let result = null;
  result = await updateBalance();
  if (result.errorMessage) return result;
  result = await updateBalanceTransactions();
  return result;
};

async function updateBalanceTransactions(): Promise<UpdateDashboardResponse> {
  let lastDatabaseUpdate;
  try {
    const result = await prisma.balanceTransactions.findFirst({
      orderBy: {
        updatedAt: "desc",
      },
    });
    lastDatabaseUpdate = result?.updatedAt;
  } catch (error) {
    console.error(error);
    return ERROR_GET_LAST_RECORD;
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
    return ERROR_UPSERT_PAYMENTS;
  }
  return SUCCESS;
}

async function updateBalance(): Promise<UpdateDashboardResponse> {
  const stripeBalance = await getBalance();
  try {
    const lastBalanceRow = await prisma.balance.findFirst({});
    if (lastBalanceRow) {
      await prisma.balance.deleteMany({});
    }
  } catch (error) {
    if (typeof error === "string") {
      console.error(error);
      return ERROR_GET_BALANCE;
    }
    console.error(error);
    return ERROR_UNKNOWN;
  }

  try {
    await prisma.balance.create({
      data: stripeBalance,
    });
  } catch (error) {
    if (typeof error === "string") {
      console.error(error);
      return ERROR_UPDATE_BALANCE;
    }
    console.error(error);
    return ERROR_UNKNOWN;
  }

  return SUCCESS;
}
