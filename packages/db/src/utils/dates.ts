// Convert date from UTC
function convertUTCtoDate(dateUTC: number): Date {
  return new Date(+dateUTC * 1000);
}

// Simplify date format YYYY-MM
function simplifyDate(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}`;
}

function setUTCTimezone(dateString: string, timezone = "Europe/Paris"): string {
  const utcDate = new Date(dateString);
  const dateStringModified = utcDate.toLocaleString("fr", { timeZone: timezone });
  return dateStringModified;
}

module.exports = {
  convertUTCtoDate,
  simplifyDate,
  setUTCTimezone
};
