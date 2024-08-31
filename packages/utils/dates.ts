export function getNumberOfDaysFromNow(date: Date) {
  const now = new Date();
  const differenceInMilliseconds = now.getTime() - date.getTime();
  const differenceInDays = Math.floor(differenceInMilliseconds / 86400000);
  return differenceInDays;
}

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
