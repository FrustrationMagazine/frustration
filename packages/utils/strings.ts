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

/* ---------------- */
/* Create id anchor */
/* ---------------- */
/*
  Input : "Un nouveau coup d'État se prépare"
  Output : "un-nuveau-coup-detat-se-prepare"
*/
export function createIdAnchor(title: string): string {
  const idAnchor = title
    .normalize("NFD") // Normalize the string to decompose combined letters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return idAnchor;
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

/* ----------------- */
/* Format currency € */
/* ----------------- */
/*
  Input : 1500
  Output : "15 €"
*/
export function formatCurrency({ amount, decimals = true }: { amount: number; decimals: boolean }): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0
  }).format(amount);
}

/* -------------------------- */
/* Convert country initials   */
/* -------------------------- */
/*
  Input : "FR"
  Output : "France"
*/
export function convertCountryInitials(initials: string): string {
  const countries: { [key: string]: string } = {
    FR: "France",
    BE: "Belgique",
    CA: "Canada",
    GB: "United Kingdom",
    MF: "Saint-Martin",
    NL: "Pays-Bas",
    US: "United States",
    DE: "Germany",
    ES: "Spain",
    IT: "Italy",
    LU: "Luxembourg",
    CH: "Suisse"
  };

  return countries[initials?.toUpperCase()] || initials || "";
}
