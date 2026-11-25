/* Ledger vouchers mapped to the panel's Voucher shape.
   Source: ACC.Voucher + ACC.VoucherItem for fiscal year 1404. */
import type { Voucher, VoucherStatus, VoucherType } from "./data";
import accRaw from "../data/accounts.json";
import dlRaw from "../data/dl.json";
import voucherRaw from "../data/vouchers.json";

type AccRow = { id: number; code: string; title: string; parent: number | null; acctType: number };
type DlRow = { id: number; title: string; type: number };
type LineRow = { row: number; acct: number; dl: number | null; dr: number; cr: number; d: string };
type VRow = {
  id: number; num: number; dt: string; jdate: string; type: number; state: number;
  daily: number; refNo: number; descr: string; creator: number; lines: LineRow[];
};

const accounts = accRaw as unknown as AccRow[];
const dls = dlRaw as unknown as DlRow[];
const rows = voucherRaw as unknown as VRow[];

const accById = new Map<number, AccRow>();
for (const a of accounts) accById.set(a.id, a);

const pathOf = (id: number): string => {
  const parts: string[] = [];
  let cur = accById.get(id);
  let guard = 0;
  while (cur && guard < 10) {
    parts.unshift(String(cur.code).trim());
    cur = cur.parent != null ? accById.get(cur.parent) : undefined;
    guard += 1;
  }
  return parts.join("-");
};

const faDigits = (s: string | number): string =>
  String(s).replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

const dlById = new Map<number, string>();
for (const d of dls) dlById.set(d.id, d.title.trim());

const TYPE: Record<number, VoucherType> = {
  1: "عمومی",
  2: "سایر سیستم‌ها",
  3: "بستن حساب‌ها",
  4: "اختتامیه",
  5: "افتتاحیه",
  6: "تسعیر",
};

const COMPANY = "شرکت تدبیر صنعت پلاست";
const BRANCH = "اشتهارد — کارخانه";

/** 2,893 vouchers of fiscal year 1404, newest first. */
export const ledgerVouchers: Voucher[] = rows
  .map((v) => {
    const status: VoucherStatus = v.state === 2 ? "posted" : "pending";
    const lines = v.lines.map((l) => {
      const acc = accById.get(l.acct);
      return {
        code: pathOf(l.acct),
        account: acc ? acc.title.trim() : "—",
        debit: l.dr || 0,
        credit: l.cr || 0,
        costCenter: l.dl ? dlById.get(l.dl) : undefined,
      };
    });
    return {
      id: `SP-${v.id}`,
      number: faDigits(v.num),
      date: faDigits(v.jdate),
      description: (v.descr || "سند حسابداری").trim(),
      type: TYPE[v.type] ?? "عمومی",
      company: COMPANY,
      branch: BRANCH,
      status,
      source: `سپیدار / ${TYPE[v.type] ?? "عمومی"}`,
      lines,
      destinationNo: `دفتر کل / ${faDigits(v.num)}`,
      postedAt: status === "posted" ? faDigits(v.jdate) : undefined,
      createdBy: `کاربر ${faDigits(v.creator)}`,
      reference: v.refNo ? `#${faDigits(v.refNo)}` : undefined,
    } as Voucher;
  })
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
