export function createCSVinURL<T>(headers: string[], data: T[]): string {
  const CSV_SEPARATOR = ";";
  const headersLine = headers.join(CSV_SEPARATOR);
  const rows = data.map((entity: any) => {
    let values = Object.values(entity);
    values = values.map((value) => (typeof value === "string" ? value.replace(CSV_SEPARATOR, "") : value));
    return values.join(CSV_SEPARATOR);
  });
  const csvContent = [headersLine, ...rows].join("\n");
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
