// Convert date from UTC
export function convertDateUTC(dateUTC: number): Date {
  return new Date(+dateUTC * 1000);
}

// Simplify date format YYYY-MM
export function simplifyDate(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}`;
}

export function setUTCTimezone(
  dateString: string,
  timezone = 'Europe/Paris'
): string {
  const utcDate = new Date(dateString);
  const dateStringModified = utcDate.toLocaleString('fr', {
    timeZone: timezone,
  });
  return dateStringModified;
}
