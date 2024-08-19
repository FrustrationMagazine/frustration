/* ------------- */
/* Prettify name */
/* ------------- */
/*
  Input : jean-philippe TROGNEUX
  Output : Jean-Philippe Trogneux
*/
export function prettifyName(uglyName: string): string {
  return uglyName.toLowerCase().replace(/(?<=(\s|-|^))\b./g, (char) => char.toUpperCase());
}
