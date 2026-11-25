/* ---------------------------------------------------------------
   Sepidar data layer — generated from the 1404/1403 ledger export
   Values are RIAL unless a helper says otherwise.
   --------------------------------------------------------------- */
import raw from "../data/sepidar.json";

export type Pair = [string, number];

export interface SepidarBundle {
  meta: {
    source: string;
    company: { name: string; economicCode: string; nationalId: string; address: string; postalCode: string; vat: string };
    fy: { id: number; label: string; start: string; end: string };
    prev: { id: number; label: string };
    currency: string;
    counts: { vouchers: number; lines: number; accounts: number; parties: number; checks: number; invoices: number; items: number };
  };
  kpi: Record<string, number>;
  prev: Record<string, number>;
  monthly: Array<{ jm: number; jmt: string; vouchers: number; dr: number; cr: number }>;
  l1: Record<string, number>;
  l2: Record<string, number>;
  cash: {
    accounts: Array<{ name: string; balance: number; movement: number; entries: number }>;
    total: number;
    monthly: Array<{ jm: number; jmt: string; net: number; cum: number }>;
  };
  checks: Array<{ id: string; dir: string; party: string; bank: string; amount: number; due: string; state: number; status: string; descr: string }>;
  inventory: Array<{ sku: string; name: string; unit: string; qty: number; reorder: number; price: number; out: number; in: number; turnover: number; active: boolean }>;
  inventoryValue: number;
  belowReorder: string[];
  fixedAssets: Array<{ name: string; cat: string; cost: number; accum: number; date: string; rate: number }>;
  pnl: Array<{ label: string; cur: number; prev: number; level: number; sub?: boolean; total?: boolean; neg?: boolean }>;
  balanceSheet: {
    currentAssets: Pair[];
    nonCurrentAssets: Pair[];
    currentLiabilities: Pair[];
    nonCurrentLiabilities: Pair[];
    equity: Pair[];
  };
  cashFlow: Array<{ label: string; value: number; parts: Pair[] }>;
  salesMonthly: Array<{ jm: number; jmt: string; count: number; net: number; tax: number }>;
  topCustomers: Array<[string, number]>;
  flow: Record<string, unknown>;
  daily: Array<{ day: string; lines: number }>;
  statusCounts: { posted: number; draft: number };
}

export const sep = raw as unknown as SepidarBundle;

/** Rial → Toman (management pages render Toman). */
export const toman = (rial: number): number => Math.round(rial / 10);

/** Rial → million Toman (chart axes). */
export const millionToman = (rial: number): number => Math.round(rial / 10_000_000);

export const companyName = sep.meta.company.name;

export const fyLabel = sep.meta.fy.label;
export const prevLabel = sep.meta.prev.label;

/** Level-2 net balance in Toman. */
export const l2 = (key: string): number => toman(sep.l2[key] ?? 0);
/** Level-1 net balance in Toman. */
export const l1 = (key: string): number => toman(sep.l1[key] ?? 0);

/** Cash balance of one bank/cash detail line, in Toman. */
export const cashOf = (needle: string): number =>
  toman(sep.cash.accounts.find((a) => a.name.includes(needle))?.balance ?? 0);

export const faDigits = (s: string | number): string =>
  String(s).replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

export const faNum = (n: number): string => faDigits(n.toLocaleString("en-US"));
