export function normalizeName(name: string): string {
  const normalizedName = name
    .toLowerCase()
    .replace(" ", "_")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return normalizedName;
}
