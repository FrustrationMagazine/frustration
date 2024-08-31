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
