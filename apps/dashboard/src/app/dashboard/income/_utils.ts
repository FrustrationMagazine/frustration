import type { TransactionsByMonth } from "./_models/transactionsByMonth";

export const inEuros = (number: number): string =>
  Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);

export const diffInPercent = (prev: number, current: number): string => {
  if (prev === 0) return "N/A";
  const diff = current - prev;
  const percent = (diff / prev) * 100;
  if(percent.toFixed(0) === "0") return "- %"
  return `${percent > 0 ? "+" : ""}${percent.toFixed(0)}%`;
};

export const groupByMonthAndSum = (arr: any[]) => {
  return arr.reduce((acc: any[], curr: any) => {
    const existing = acc.find((item) => item.month.getTime() === curr.month.getTime());
    if (existing) {
      existing.stripe += curr.stripe;
      existing.helloasso += curr.helloasso;
      existing.total += curr.total;
    } else {
      acc.push({ ...curr });
    }
    return acc;
  }, []);
};

export const getTotalMonthAndEvolution = (
  month: Date,
  chartData: TransactionsByMonth[],
): { totalMonth: number | null | undefined; evolution: string | null } => {

  let totalMonth = null;
  let totalPrevMonth = null;

  if (month && chartData.length > 0) {
    totalMonth = chartData.find(
      (datapoint) => datapoint.month.getTime() === month.getTime(),
    )?.total;
    let prevIndex = chartData.findIndex(
      (datapoint) => datapoint.month.getTime() === month.getTime(),
    );
    if (prevIndex > 0) totalPrevMonth = chartData[prevIndex - 1].total;
  }
  const evolution = totalPrevMonth && totalMonth ? diffInPercent(totalPrevMonth, totalMonth) : null;

  return { totalMonth, evolution };
};

export const formatExplicitMonth = (value: string, monthLength: "long" | "short") => {
  const explicitMonth = new Date(value).toLocaleDateString("fr-FR", {
    month: monthLength,
    year: "numeric",
  });
  return explicitMonth.charAt(0).toUpperCase() + explicitMonth.slice(1);
};

export const debounce = (fn: any, delay: number): (...args: any) => void => {
  let timer: NodeJS.Timeout;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}
