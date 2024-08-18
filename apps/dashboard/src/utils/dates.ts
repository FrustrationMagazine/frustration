/* -------------------- */
/* Convert date to UTC  */
/* -------------------- */
/*
  Input : 811111000
  Output : Thu Sep 14 1995 22:36:40 GMT+0200 (Central European Summer Time)
*/
export function convertUTCtoDate(dateUTC: number): Date {
  return new Date(+dateUTC * 1000);
}

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
