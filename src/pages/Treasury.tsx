import { useState } from "react";
import {
  Wallet,
  Landmark,
  ReceiptText,
  CircleAlert,
  Clock3,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Download,
  ChevronLeft,
} from "lucide-react";
import { Badge, Tabs, useToast, type Tone } from "../components/ui";
import { faNum, shortNum, pct } from "../lib/format";
import { cashAccounts, totalCash, checks, clearedThisMonth, inCourse, bounced, type CheckStatus } from "../lib/management";

const statusTone: Record<CheckStatus, Tone> = {
  "وصول‌شده": "success",
  "در جریان": "muted",
  "سرسید": "warn",
  "برگشتی": "danger",
};

const kpis = [
  { label: "جمع نقدینگی", value: totalCash, icon: Wallet, tone: "mint", hint: "۵ حساب متصل" },
  { label: "وصول‌شده — آبان", value: clearedThisMonth, icon: ReceiptText, tone: "indigo", hint: "۳ چک" },
  { label: "در جریان", value: inCourse, icon: Clock3, tone: "warn", hint: "۳ چک تا ۱۰ روز" },
  { label: "برگشتی", value: bounced, icon: CircleAlert, tone: "danger", hint: "۱ چک نیازمند پیگیری" },
];

const toneMap: Record<string, string> = {
  mint: "#2FE0BE",
  indigo: "#7C8CFF",
  warn: "#F7B955",
  danger: "#FF6B81",
};

export default function Treasury() {
  const [tab, setTab] = useState<"in" | "out">("in");
  const toast = useToast();
  const rows = checks.filter((c) => (tab === "in" ? c.dir === "دریافتی" : c.dir === "پرداختی"));

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="ph-title">
            <h1>خزانه‌داری و چک‌ها</h1>
            <Badge tone="mint" dot={false}>موجودی واقعی، نه دفتری</Badge>
          </div>
          <p>موجودی حساب‌ها، چک‌های دریافتی و پرداختی، وصول‌شده و سرسید — همه از دفتر کل و معین</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-sm" onClick={() => toast("خروجی", "فهرست چک‌ها در قالب اکسل آماده شد.", "success")}>
            <Download size={13} /> خروجی
          </button>
          <button className="btn btn-sm" onClick={() => toast("همگام‌سازی", "مانده حساب‌ها از نرم‌افزار حسابداری به‌روز شد.", "info")}>
            <RefreshCw size={13} /> همگام‌سازی
          </button>
        </div>
      </div>

      <div className="kpi-grid">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="kpi card" style={{ ["--kpi-glow" as string]: `${toneMap[k.tone]}22` }}>
              <div className="kpi-top">
                <span className="kpi-label">{k.label}</span>
                <span className="kpi-icon" style={{ color: toneMap[k.tone] }}>
                  <Icon size={15} />
                </span>
              </div>
              <div className="kpi-value">
                {shortNum(k.value)} <small>تومان</small>
              </div>
              <div className="kpi-foot">
                <span className="small muted">{k.hint}</span>
                <span className="small muted">{pct((k.value / totalCash) * 100, 0)} از نقد</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mg-accounts">
        {cashAccounts.map((a) => (
          <div key={a.name} className="mg-account">
            <div className="mg-acc-top">
              <span className="mg-acc-icon"><Landmark size={15} /></span>
              <Badge tone={a.kind === "بانک" ? "indigo" : "muted"} dot={false}>{a.kind}</Badge>
            </div>
            <div className="mg-acc-name">{a.name}</div>
            <div className="mg-acc-value">{faNum(a.balance)} <small>تومان</small></div>
            <div className="mg-acc-foot">
              <span className={a.change >= 0 ? "up" : "down"}>
                {a.change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {pct(Math.abs(a.change), 1)}
              </span>
              <span className="small muted">آخرین همگام‌سازی {a.last}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <div className="card-hd">
          <h3>
            <ReceiptText size={15} /> چک‌ها
            <span className="ch-sub">آبان ۱۴۰۵</span>
          </h3>
          <Tabs
            tabs={[
              { id: "in", label: "دریافتی", count: checks.filter((c) => c.dir === "دریافتی").length },
              { id: "out", label: "پرداختی", count: checks.filter((c) => c.dir === "پرداختی").length },
            ]}
            active={tab}
            onChange={setTab}
          />
        </div>
        <div className="card-bd flush">
          <table className="table">
            <thead>
              <tr>
                <th>شماره چک</th>
                <th>طرف حساب</th>
                <th>بانک</th>
                <th>مبلغ (تومان)</th>
                <th>سرسید</th>
                <th>زمان</th>
                <th>وضعیت</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="clickable" onClick={() => toast("جزئیات چک", `${c.party} — ${faNum(c.amount)} تومان`, "info")}>
                  <td className="t-num">{c.id}</td>
                  <td className="t-strong">{c.party}</td>
                  <td className="t-muted">{c.bank}</td>
                  <td className="t-num">{faNum(c.amount)}</td>
                  <td className="t-muted">{c.due}</td>
                  <td className="t-muted">
                    {c.days >= 0 ? `${faNum(c.days)} روز آینده` : `${faNum(Math.abs(c.days))} روز پیش`}
                  </td>
                  <td>
                    <Badge tone={statusTone[c.status]}>{c.status}</Badge>
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        toast("پیگیری ثبت شد", `برای چک ${c.id} یادآور تنظیم شد.`, "success");
                      }}
                    >
                      پیگیری <ChevronLeft size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mg-foot-note">
        <CircleAlert size={13} />
        مانده حساب‌ها با تاریخچه تراکنش‌های بانکی تطبیق داده شده است؛ مغایرت‌ها در «کیفیت داده» قابل بررسی است.
      </div>
    </div>
  );
}
