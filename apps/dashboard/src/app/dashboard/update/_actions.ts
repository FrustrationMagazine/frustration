"use server";

// 🐝 Fetch
import {
  fetchStripeTransactions,
  fetchStripeBalance,
} from "@/data-access/stripe";
import { fetchHelloAssoTransactions } from "@/data-access/helloasso";

// 🫙 Database
import { prisma } from "@/data-access/prisma";
import { fetchLastUpdate } from "@/data-access/database";

// 🗿 Models
import {
  FormUpdateSchema,
  UpdateDashboardResponse,
  SUCCESS,
  ERROR,
  ERROR_UPSERT_PAYMENTS,
  ERROR_GET_BALANCE,
  ERROR_UNKNOWN,
  ERROR_UPDATE_BALANCE,
} from "./_models";

import { Transaction } from "@/data-access/models/transactions";

// 🔧 Utils
import { convertLocalDateToDateUTC } from "@/utils/dates";

const isProduction = process.env.NODE_ENV === "production";

/* **************** */
/*  Get last update */
/* **************** */
export async function getLastUpdate() {
  const lastUpdate = await fetchLastUpdate();
  return lastUpdate instanceof Date ? lastUpdate.toISOString() : null;
}

/* **************** */
/* Update dashboard */
/* **************** */
export async function updateDashboard(
  prevState: UpdateDashboardResponse,
  data: FormData,
): Promise<UpdateDashboardResponse> {
  const formData = Object.fromEntries(data);
  const parsed = FormUpdateSchema.safeParse(formData);

  if (!parsed.success) return ERROR;

  let result = null;
  result = await updateBalance();
  if (result.error) return result;
  result = await updateTransactions({ updateMethod: parsed.data.method });
  return result;
}

/* ******************* */
/* Update transactions */
/* ******************* */
const DEFAULT_UPDATE_TRANSACTION = { updateMethod: "smart" };

export async function updateTransactions({
  updateMethod,
}: {
  updateMethod: string;
} = DEFAULT_UPDATE_TRANSACTION): Promise<UpdateDashboardResponse> {
  let lastUpdate;
  try {
    const result = await prisma.balance.findFirst();
    lastUpdate = result?.updatedAt;
  } catch (error) {
    console.error(error);
  }

  let stripeTransactions: Transaction[] = [];
  let helloassoTransactions: Transaction[] = [];

  if (lastUpdate && updateMethod === "smart") {
    const lastUpdateDate = new Date(lastUpdate);
    // We want to update information relating to transactions fetched less than a month ago because their status
    // may have changed since
    const oneMonthBeforeLastUpdate = new Date(lastUpdate);
    oneMonthBeforeLastUpdate.setMonth(lastUpdateDate.getMonth() - 1);
    const unixTimestamp = Math.floor(oneMonthBeforeLastUpdate.getTime() / 1000);

    stripeTransactions = await fetchStripeTransactions({
      afterTimestamp: unixTimestamp,
    });

    helloassoTransactions = isProduction
      ? await fetchHelloAssoTransactions({
          from: oneMonthBeforeLastUpdate.toISOString(),
        })
      : [];
  }

  if (!lastUpdate || updateMethod !== "smart") {
    stripeTransactions = await fetchStripeTransactions();
    helloassoTransactions = isProduction
      ? await fetchHelloAssoTransactions()
      : [];
  }

  try {
    let allTransactions = [...stripeTransactions, ...helloassoTransactions];

    // 1️⃣ Insert new transactions between the last update and now
    /* --------------------------------------------------------- */
    // @ts-ignore
    const newTransactions: Transaction[] =
      await prisma.balanceTransactions.createManyAndReturn({
        data: allTransactions,
        skipDuplicates: true,
      });
    console.info(`${newTransactions.length} transaction(s) inserted.`);

    // 2️⃣ Get transactions recorded < 1 month
    /* ------------------------------------------------------ */
    const transactionsAlreadyRegistered = allTransactions.filter(
      (transaction) =>
        !newTransactions.some(
          (newTransaction: any) => newTransaction.id === transaction.id,
        ),
    );

    // 3️⃣ Update transactions recorded < 1 month
    /* ------------------------------------------------------ */
    transactionsAlreadyRegistered.forEach(async ({ id, status }) => {
      await prisma.balanceTransactions.update({
        where: { id },
        data: { status },
      });
    });
    console.info(
      `${transactionsAlreadyRegistered.length} transaction(s) updated.`,
    );
  } catch (error) {
    console.error("Failed to insert records:", error);
    return ERROR_UPSERT_PAYMENTS;
  }
  return SUCCESS;
}

/* ********************* */
/* Update Stripe balance */
/* ********************* */

export async function updateBalance(): Promise<UpdateDashboardResponse> {
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
      data: {
        ...stripeBalance,
        updatedAt: convertLocalDateToDateUTC(new Date()),
      },
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
