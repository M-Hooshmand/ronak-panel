/* ------------------------------------------------------------------
   Formatting helpers — Persian digits, grouping, money, dates
   ------------------------------------------------------------------ */

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toFaDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}

/** Number with Persian digits and thousand separators (٬). */
export function faNum(value: number, fractionDigits = 0): string {
  const abs = Math.abs(value);
  let out: string;
  try {
    out = abs.toLocaleString("fa-IR", {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });
  } catch {
    const fixed = abs.toFixed(fractionDigits);
    const [int, frac] = fixed.split(".");
    out =
      int.replace(/\B(?=(\d{3})+(?!\d))/g, "٬") +
      (frac ? "٫" + frac : "");
  }
  return (value < 0 ? "−" : "") + out;
}

/** Compact currency amount, e.g. ۲٫۴ میلیارد */
export function shortNum(value: number): string {
  const abs = Math.abs(value);
  const units: Array<[number, string]> = [
    [1_000_000_000_000, "هزار میلیارد"],
    [1_000_000_000, "میلیارد"],
    [1_000_000, "میلیون"],
    [1_000, "هزار"],
  ];
  for (const [div, label] of units) {
    if (abs >= div) {
      const v = value / div;
      const digits = Math.abs(v) >= 100 ? 0 : Math.abs(v) >= 10 ? 1 : 2;
      return `${faNum(v, digits)} ${label}`;
    }
  }
  return faNum(value);
}

export function money(value: number): string {
  return faNum(value);
}

/** thousands of Rial -> "۱۲٫۴ میلیارد ریال" */
export function rialShort(value: number): string {
  return `${shortNum(value)} ریال`;
}

export function pct(value: number, digits = 1): string {
  return `${faNum(value, digits)}٪`;
}

export function initials(name: string): string {
  const clean = name.replace(/^(شرکت|گروه|بازرگانی|صنایع|داروسازی)\s+/, "").trim();
  const parts = clean.split(/[\s‌]+/).filter(Boolean);
  if (parts.length === 0) return "؟";
  return parts[0].slice(0, 1);
}

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

export const today = { date: "۱۴۰۵/۰۸/۲۹", label: "جمعه ۲۹ آبان ۱۴۰۵" };
