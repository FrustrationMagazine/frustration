/**
 * getNumberOfDaysFromNow
 *
 * Description:
 * This function calculates the number of days between the current date and a given date.
 *
 * Usage:
 * Call this function with a Date object as the argument. It will return the number of days
 * from the given date to the current date.
 *
 * Example:
 * const pastDate = new Date('2023-01-01');
 * const daysFromNow = getNumberOfDaysFromNow(pastDate);
 * console.log(daysFromNow); // Output: (number of days between January 1, 2023, and today)
 *
 * @param {Date} date - The date from which to calculate the number of days to the current date.
 * @returns {number} - The number of days from the given date to the current date.
 */
export function getNumberOfDaysFromNow(date: Date) {
  const now = new Date();
  const differenceInMilliseconds = now.getTime() - date.getTime();
  const differenceInDays = Math.floor(differenceInMilliseconds / 86400000);
  return differenceInDays;
}

/**
 * convertDifferenceOfDays
 *
 * Description:
 * This function converts a given number of days into a human-readable string in French.
 *
 * Usage:
 * Call this function with a number representing the difference in days. It will return a string
 * describing the difference in days in French.
 *
 * Example:
 * const differenceInDays = 2;
 * const readableString = convertDifferenceOfDays(differenceInDays);
 * console.log(readableString); // Output: "Avant-hier"
 *
 * @param {number} differenceInDays - The number of days to convert into a human-readable string.
 * @returns {string} - A human-readable string describing the difference in days in French.
 */
export function convertDifferenceOfDays(differenceInDays: number): string {
  switch (differenceInDays) {
    case 0:
      return "Aujourd'hui";
    case 1:
      return "Hier";
    case 2:
      return "Avant-hier";
    default:
      return `${differenceInDays} jours`;
  }
}

/* ------------------------------- */
/* Convert local date to date UTC  */
/* ------------------------------- */
/*
  Input : 2023-10-01T12:00:00-04:00
  Output : 2023-10-01T16:00:00.000Z
*/
export function convertLocalDateToDateUTC(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds()));
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
/*
   Input : value: "2023-10-01", monthLength: "long"
   Output: "Octobre 2023"

   Input : value: "2023-10-01", monthLength: "short"
   Output: "Oct. 2023"
*/
export const formatExplicitMonth = (value: string | Date, monthLength: "long" | "short") => {
  const date = !(value instanceof Date) ? new Date(value) : value;
  const explicitMonth = date.toLocaleDateString("fr-FR", {
    month: monthLength,
    year: "numeric"
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
    year: "numeric"
  });
  return explicitDate;
}
