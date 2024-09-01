export function createCSVinURL<T>(headers: string[], rows: T[]): string {
  const CSV_SEPARATOR = ";";
  const csvContent = [headers.join(CSV_SEPARATOR), ...rows.map((row: any) => Object.values(row).join(CSV_SEPARATOR))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const CSVinURL = URL.createObjectURL(blob);
  return CSVinURL;
}

export function downloadFileFromUrl(url: string, filename: string): void {
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
