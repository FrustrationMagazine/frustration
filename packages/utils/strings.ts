/* -------------- */
/* Normalize name */
/* -------------- */
/*
  Input : "Thibaut D'Anvers"
  Output : "thibaut_danvers"
*/
export function normalizeName(name: string): string {
  const normalizedName = name
    .toLowerCase()
    .replace(" ", "_")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return normalizedName;
}

/* ------------- */
/* Prettify name */
/* ------------- */
/*
  Input : "jean-micheL TROGNEUX"
  Output : "Jean-Michel Trogneux"
*/
export function prettifyName(uglyName: string): string {
  return uglyName.toLowerCase().replace(/(?<=(\s|-|^))\b./g, (char) => char.toUpperCase());
}
