/**
 * normalizeName
 *
 * Description:
 * This function normalizes a given name string by converting it to lowercase, replacing spaces with underscores,
 * and removing diacritical marks (accents).
 *
 * Usage:
 * Call this function with a string representing a name. It will return a normalized version of the name.
 *
 * Example:
 * const name = "Thibaut D'Anvers";
 * const normalized = normalizeName(name);
 * console.log(normalized); // Output: "thibaut_danvers"
 *
 * @param {string} name - The name string to normalize.
 * @returns {string} - The normalized name string.
 */
export function normalizeName(name: string): string {
  const normalizedName = name
    .toLowerCase()
    .replace(" ", "_")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return normalizedName;
}
