import type { Transactions } from "./_models";

/* ----------------------- */
/* Convert number in euros */
/* ----------------------- */

/*
  Input : 1235
  Output: "1 235 €"
*/

export const inEuros = (number: number): string =>
  Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);

/* ---------------- */
/* Get % difference */
/* ---------------- */

export const diffInPercent = (prev: number, current: number): string => {
  if (prev === 0) return "N/A";
  const percent = ((current - prev) / prev) * 100;
  const roundedPercent = percent.toFixed(0);

  // Early return if the difference is near zero
  const isNearZero = roundedPercent === "0";
  if (isNearZero) return "- %";

  const sign = percent > 0 ? "+" : "";

  // Return the percentage with its sign
  return `${sign}${roundedPercent}%`;
};

/* ------------------------------------------------------ */
/* Group different transactions types by month and sum it */
/* ------------------------------------------------------ */

/*
Input : [
  { month: new Date(2023, 9, 1), stripe: 100, helloasso: 50, total: 150 },
  { month: new Date(2023, 9, 1), stripe: 200, helloasso: 75, total: 275 },
  { month: new Date(2023, 8, 1), stripe: 150, helloasso: 60, total: 210 },
  { month: new Date(2023, 8, 1), stripe: 50, helloasso: 40, total: 90 },
]

Output : [
  { month: "2023-10-01T00:00:00.000Z", stripe: 300, helloasso: 125, total: 425 },
  { month: "2023-09-01T00:00:00.000Z", stripe: 200, helloasso: 100, total: 300 }
]
  */

export const groupByAndSum = (transactions: Transactions[]) => {
  return transactions.reduce(
    (groupedTransactions: Transactions[], currentDate: Transactions) => {
      const alreadyRegisteredMonth = groupedTransactions.find(
        ({ date }) => date.getTime() === currentDate.date.getTime(),
      );

      if (alreadyRegisteredMonth) {
        alreadyRegisteredMonth.stripe += currentDate.stripe;
        alreadyRegisteredMonth.helloasso += currentDate.helloasso;
        alreadyRegisteredMonth.total += currentDate.total;
      } else {
        groupedTransactions.push({ ...currentDate });
      }
      return groupedTransactions;
    },
    [],
  );
};

/* --------------------------------------------------------------------- */
/* Get total month and evolution compared to the previous month (if any) */
/* --------------------------------------------------------------------- */

/*
Input

monthToSearch : Fri Oct 01 2023 00:00:00 GMT+0200 (Central European Summer Time)

transactionsByMonth : [
  { month: Fri Sep 01 2023 00:00:00 GMT+0200 (Central European Summer Time), total: 200 },
  { month: Fri Oct 01 2023 00:00:00 GMT+0200 (Central European Summer Time), total: 400 },
  { month: Fri Nov 01 2023 00:00:00 GMT+0200 (Central European Summer Time), total: 800 },
];

Output

  {
    monthTotal: 400,
    evolution: "+100%"
  }
*/

export const getTotalMonthAndEvolution = (
  monthToSearch: Date,
  transactionsByMonth: Transactions[],
): {
  monthTotal: number | null;
  evolution: string;
} => {
  const FALLBACK = { monthTotal: null, evolution: "" };

  // Early return if no transactions by month to compare with
  if (transactionsByMonth.length === 0) return FALLBACK;

  const matchingIndex = transactionsByMonth.findIndex(
    ({ date }) => date.getTime() === monthToSearch.getTime(),
  );

  // Early return if no matching month
  if (matchingIndex === -1) return FALLBACK;

  const [prevMonth, month] = [
    transactionsByMonth[matchingIndex - 1],
    transactionsByMonth[matchingIndex],
  ];

  let evolution = prevMonth ? diffInPercent(prevMonth.total, month.total) : "";

  return { monthTotal: month.total, evolution };
};

/* --------------------- */
/* Arrays equals */
/* --------------------- */
export function arraysEqual(arr1: any[], arr2: any[]) {
  if (arr1.length !== arr2.length) return false; // Check length
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false; // Check each element
  }
  return true; // All elements are equal
}

/* --------------------- */
/* Generate combinations */
/* --------------------- */

/*
Input : [1, 2, 3]

Output : [
  [1],
  [1, 2],
  [1, 2, 3],
  [1, 3],
  [2],
  [2, 3],
  [3]
]
*/

export const generateUniqueCombinations = <T extends string | number>(
  arr: T[],
): T[][] => {
  const result: T[][] = [];
  const f = (prefix: T[], arr: T[]) => {
    for (let i = 0; i < arr.length; i++) {
      result.push([...prefix, arr[i]]);
      f([...prefix, arr[i]], arr.slice(i + 1));
    }
  };
  f([], arr);
  result.sort((a, b) => b.length - a.length);
  return result;
};

/* -------- */
/* Debounce */
/* -------- */

export const debounce = (fn: any, delay: number): ((...args: any) => void) => {
  let timer: NodeJS.Timeout;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
};

/* ------------------------------------- */
/* Process from stripe to data for chart */
/* ------------------------------------- */

export const processPermanent = (transactions: any, transactionsTypes: any) => {
  // 🔬 Filter transaction type
  let processedTransactions = transactions.filter(
    ({ type }: { type: string }) => transactionsTypes.includes(type),
  );

  // 🥣 Group date
  processedTransactions = groupByAndSum(processedTransactions);

  return processedTransactions;
};

export const processTemporary = (transactions: any, transactionsTypes: any) => {
  let processedTransactions: any[] = [];

  processedTransactions = transactions;
  // processedTransactions = transactions.filter(
  //   ({ status, paid }: { status: string; paid: boolean }) =>
  //     status === "succeeded" && paid,
  // );

  if (arraysEqual(transactionsTypes, ["subscription"])) {
    processedTransactions = processedTransactions.filter(
      (transaction) =>
        transaction.type === "subscription" &&
        transaction.subtype === "creation",
    );
  }

  if (arraysEqual(transactionsTypes, ["donation"])) {
    processedTransactions = processedTransactions.filter(
      (transaction) => transaction.type === "donation",
    );
  }
  // 🥣 Group by day
  processedTransactions = processedTransactions.reduce(
    (acc, { created, amount }) => {
      const alreadyRegisteredDay = acc.find(
        ({ date }: { date: Date }) =>
          date.toDateString() === created.toDateString(),
      );

      if (alreadyRegisteredDay) {
        alreadyRegisteredDay.total += amount;
      } else {
        acc.push({
          date: new Date(
            created.getFullYear(),
            created.getMonth(),
            created.getDate(),
          ),
          total: amount,
        });
      }
      return acc;
    },
    [],
  );

  // 🔄 Order by date
  processedTransactions.sort((a, b) => a.date - b.date);
  return processedTransactions;
};
