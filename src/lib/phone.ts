/** Normalize a Swedish mobile number to E.164 (+467XXXXXXXX). Returns null if invalid. */
export function normalizeSwedishMobile(input: string): string | null {
  let d = input.replace(/[\s\-()]/g, "");
  if (d.startsWith("+46")) d = d.slice(3);
  else if (d.startsWith("0046")) d = d.slice(4);
  else if (d.startsWith("0")) d = d.slice(1);
  if (!/^7[02369]\d{7}$/.test(d)) return null;
  return `+46${d}`;
}
