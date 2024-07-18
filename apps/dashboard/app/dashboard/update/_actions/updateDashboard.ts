"use server";

import { fetchStripeTransactions, fetchStripeBalance } from "@/libs/transactions/stripe";
import { fetchHelloAssoTransactions } from "@/libs/transactions/helloasso";
import { prisma } from "@/libs/prisma";
import {
  UpdateFormSchema,
  UpdateDashboardResponse,
  SUCCESS,
  ERROR,
  ERROR_UPSERT_PAYMENTS,
  ERROR_GET_BALANCE,
  ERROR_UNKNOWN,
  ERROR_UPDATE_BALANCE,
} from "../_models/updateDashboard";

/****************** EXPORTS *************************/

export async function updateDashboard(
  prevState: UpdateDashboardResponse,
  data: FormData,
): Promise<UpdateDashboardResponse> {
  const formData = Object.fromEntries(data);
  const parsed = UpdateFormSchema.safeParse(formData);

  if (!parsed.success) return ERROR;

  let result = null;
  result = await updateStripeBalance();
  if (result.errorMessage) return result;
  result = await updateTransactions({ updateMethod: parsed.data.method });
  return result;
}

/****************** EXPORTS *************************/

async function updateTransactions(
  {
    updateMethod,
  }: {
    updateMethod: string;
  } = { updateMethod: "smart" },
): Promise<UpdateDashboardResponse> {
  let lastDatabaseUpdate;
  try {
    const result = await prisma.balance.findFirst();
    lastDatabaseUpdate = result?.updatedAt;
  } catch (error) {
    console.error(error);
  }

  let stripeTransactions = [];
  let helloassoTransactions = [];

  if (lastDatabaseUpdate && updateMethod === "smart") {
    const lastUpdateDate = new Date(lastDatabaseUpdate);
    // We want to update information relating to transactions fetched less than a month ago because their status
    // may have changed since
    const oneMonthBeforeDate = new Date(lastDatabaseUpdate);
    oneMonthBeforeDate.setMonth(lastUpdateDate.getMonth() - 1);
    const unixTimestamp = Math.floor(oneMonthBeforeDate.getTime() / 1000);
    stripeTransactions = await fetchStripeTransactions({ afterTimestamp: unixTimestamp });
    helloassoTransactions = await fetchHelloAssoTransactions({
      from: oneMonthBeforeDate.toISOString(),
    });
  } else {
    stripeTransactions = await fetchStripeTransactions();
    helloassoTransactions = await fetchHelloAssoTransactions();
  }
  try {
    const allTransactions = [...stripeTransactions, ...helloassoTransactions];
    const newTransactions = await prisma.balanceTransactions.createManyAndReturn({
      data: allTransactions,
      skipDuplicates: true,
    });
    console.log(`${newTransactions.length} transaction(s) inserted.`);
    const transactionsToUpdate = allTransactions.filter(
      (transaction) =>
        !newTransactions.some((newTransaction) => newTransaction.id === transaction.id),
    );
    transactionsToUpdate.forEach(async (transaction) => {
      await prisma.balanceTransactions.update({
        where: {
          id: transaction.id,
        },
        data: {
          status: transaction.status,
        },
      });
    });
    console.log(`${transactionsToUpdate.length} transaction(s) updated.`);
  } catch (error) {
    console.error("Failed to insert records:", error);
    return ERROR_UPSERT_PAYMENTS;
  }
  return SUCCESS;
}

async function updateStripeBalance(): Promise<UpdateDashboardResponse> {
  const stripeBalance = await fetchStripeBalance();
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
