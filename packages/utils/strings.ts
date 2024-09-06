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
