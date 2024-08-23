/* ------------------------------- */
/* Convert local date to date UTC  */
/* ------------------------------- */
/*
  Input : 2023-10-01T12:00:00-04:00
  Output : 2023-10-01T16:00:00.000Z
*/
export function convertLocalDateToDateUTC(date: Date): Date {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds(),
    ),
  );
}

/* ------------------------------------ */
/* Convert unix timestamp to Date UTC   */
/* ------------------------------------ */
/*
  Input : 811111000
  Output : Thu Sep 14 1995 22:36:40 GMT+0200 (Central European Summer Time)
*/
export function convertUTCtoDate(dateUTC: number): Date {
  return new Date(+dateUTC * 1000);
}

/* ----------------------------------------------- */
/* Month and year of a date (long or short format) */
/* ----------------------------------------------- */

// Input : value: "2023-10-01", monthLength: "long"
// Output: "Octobre 2023"

// Input : value: "2023-10-01", monthLength: "short"
// Output: "Oct. 2023"

export const formatExplicitMonth = (value: string | Date, monthLength: "long" | "short") => {
  const date = !(value instanceof Date) ? new Date(value) : value;
  const explicitMonth = date.toLocaleDateString("fr-FR", {
    month: monthLength,
    year: "numeric",
  });
  return explicitMonth.charAt(0).toUpperCase() + explicitMonth.slice(1);
};

/* ------------- */
/* Explicit date */
/* ------------- */
/*
  Input : Sun Aug 18 2024 18:16:35 GMT+0200 (Central European Summer Time)
  Output : 18 août 2024
*/
export function explicitDate(date: Date): string {
  const explicitDate = date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return explicitDate;
}
