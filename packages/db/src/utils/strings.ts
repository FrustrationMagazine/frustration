// Normalize name
function normalizeName(str: string | undefined | null): string {
  if (str) {
    str = str
      .trim()
      .split(/\s+/)
      .map((x) => {
        x = x.toLowerCase();
        x = x[0].toUpperCase() + x.slice(1);
        return x;
      })
      .join(" ");
  }

  return String(str);
}

module.exports = {
  normalizeName
};
