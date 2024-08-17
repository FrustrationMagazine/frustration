import type { TransactionsByMonth } from "./_models";

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

export const groupByMonthAndSum = (transactionsByMonth: TransactionsByMonth[]) => {
  return transactionsByMonth.reduce(
    (groupedTransactionsByMonth: TransactionsByMonth[], currentMonth: TransactionsByMonth) => {
      const alreadyRegisteredMonth = groupedTransactionsByMonth.find(
        ({ month }) => month.getTime() === currentMonth.month.getTime(),
      );

      if (alreadyRegisteredMonth) {
        alreadyRegisteredMonth.stripe += currentMonth.stripe;
        alreadyRegisteredMonth.helloasso += currentMonth.helloasso;
        alreadyRegisteredMonth.total += currentMonth.total;
      } else {
        groupedTransactionsByMonth.push({ ...currentMonth });
      }
      return groupedTransactionsByMonth;
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
  transactionsByMonth: TransactionsByMonth[],
): {
  monthTotal: number | null;
  evolution: string;
} => {
  const FALLBACK = { monthTotal: null, evolution: "" };

  // Early return if no transactions by month to compare with
  if (transactionsByMonth.length === 0) return FALLBACK;

  const matchingIndex = transactionsByMonth.findIndex(
    ({ month }) => month.getTime() === monthToSearch.getTime(),
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

/* ----------------------------------------------- */
/* Month and year of a date (long or short format) */
/* ----------------------------------------------- */

// Input : value: "2023-10-01", monthLength: "long"
// Output: "Octobre 2023"

// Input : value: "2023-10-01", monthLength: "short"
// Output: "Oct. 2023"

export const formatExplicitMonth = (value: string, monthLength: "long" | "short") => {
  const explicitMonth = new Date(value).toLocaleDateString("fr-FR", {
    month: monthLength,
    year: "numeric",
  });
  return explicitMonth.charAt(0).toUpperCase() + explicitMonth.slice(1);
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
