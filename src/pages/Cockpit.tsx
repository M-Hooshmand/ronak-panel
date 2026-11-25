import { useNavigate } from "react-router-dom";
import {
  Wallet,
  ReceiptText,
  Package,
  TrendingUp,
  AlertTriangle,
  ChevronLeft,
  Landmark,
  FileSpreadsheet,
  Users,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Clock3,
} from "lucide-react";
import { Badge } from "../components/ui";
import { AreaChart, Donut } from "../components/charts";
import { faNum, shortNum, pct } from "../lib/format";
import {
  cashAccounts,
  totalCash,
  clearedThisMonth,
  inCourse,
  bounced,
  cashTrend,
  cashComposition,
  checks,
  inventoryValue,
  belowReorder,
  pnl,
  payrollGross,
  employerInsurance,
  vatPayable,
  taxObligations,
  mgAlerts,
} from "../lib/management";
import { useToast } from "../components/ui";

const kpis = [
  {
    label: "موجودی نقد و بانک",
    value: totalCash,
    icon: Wallet,
    tone: "mint",
    delta: 4.2,
    hint: `${faNum(cashAccounts.length)} حساب متصل`,
  },
  {
    label: "چک وصول‌شده — اسفند",
    value: clearedThisMonth,
    icon: ReceiptText,
    tone: "indigo",
    delta: 12.6,
    hint: `${faNum(checks.filter((c) => c.status === "وصول‌شده").length)} چک وصول‌شده`,
  },
  {
    label: "چک در جریان",
    value: inCourse,
    icon: Clock3,
    tone: "warn",
    delta: 0,
    hint: `${faNum(checks.filter((c) => c.status === "در جریان").length)} چک در جریان`,
    flat: true,
  },
  {
    label: "ارزش موجودی انبار",
    value: inventoryValue,
    icon: Package,
    tone: "danger",
    delta: -3.1,
    hint: `${faNum(belowReorder.length)} قلم زیر حد سفارش`,
  },
];

const toneMap: Record<string, string> = {
  mint: "#2FE0BE",
  indigo: "#7C8CFF",
  warn: "#F7B955",
  danger: "#FF6B81",
};

export default function Cockpit() {
  const navigate = useNavigate();
  const toast = useToast();

  const revenue = pnl.find((r) => r.label === "درآمد فروش")!.cur;
  const cogs = Math.abs(pnl.find((r) => r.label === "بهای تمام‌شده کالای فروش‌رفته")!.cur);
  const gross = pnl.find((r) => r.label === "سود ناخالص")!.cur;
  const net = pnl.find((r) => r.label === "سود خالص")!.cur;
  const opex = gross - net - Math.abs(pnl.find((r) => r.label === "مالیات بر درآمد (۲۵٪)")!.cur) + 45_000_000;

  const pnlBars = [
    { label: "درآمد فروش", value: revenue, color: "#2FE0BE" },
    { label: "بهای تمام‌شده", value: cogs, color: "#7C8CFF" },
    { label: "سود ناخالص", value: gross, color: "#7BE495" },
    { label: "هزینه‌های عملیاتی", value: opex, color: "#F7B955" },
    { label: "سود خالص", value: net, color: "#8BFFF0" },
  ];

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="ph-title">
            <h1>نمای مدیریتی</h1>
            <Badge tone="mint" dot={false}>
              تصویر کامل شرکت از داده حسابداری
            </Badge>
          </div>
          <p>
            نقدینگی، چک‌ها، انبار، دارایی‌ها، سود و زیان و تعهدات مالی — سال ۱۴۰۴
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-sm" onClick={() => toast("خروجی مدیریتی", "خلاصه مدیریتی در قالب PDF آماده شد.", "success")}>
            <Download size={13} /> خروجی مدیریتی
          </button>
          <button className="btn btn-sm" onClick={() => toast("به‌روزرسانی", "داده‌ها از آخرین سند همگام‌شده خوانده شد.", "info")}>
            <RefreshCw size={13} /> به‌روزرسانی
          </button>
        </div>
      </div>

      <div className="kpi-grid">
        {kpis.map((k) => {
          const Icon = k.icon;
          const up = k.delta >= 0;
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
                <span className={`delta ${k.flat ? "flat" : up ? "up" : "down"}`}>
                  {!k.flat && (up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />)}
                  {k.flat ? "بدون تغییر" : `${faNum(Math.abs(k.delta), 1)}٪`}
                </span>
                <span className="small muted">{k.hint}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.62fr 1fr", gap: 14, marginTop: 14 }}>
        <div className="card">
          <div className="card-hd">
            <h3>
              <TrendingUp size={15} /> جریان نقدینگی
              <span className="ch-sub">۳۰ روز گذشته · تومان</span>
            </h3>
            <div className="hd-actions">
              <Badge tone="mint" dot={false}>روند صعودی</Badge>
              <span className="chip small">امروز {shortNum(totalCash)}</span>
            </div>
          </div>
          <div className="card-bd" style={{ paddingTop: 10 }}>
            <AreaChart
              data={cashTrend}
              series={[{ name: "موجودی نقد", color: "#2FE0BE", key: 0 }]}
              height={232}
              yFormat={(n) => shortNum(n)}
              legend={false}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-hd">
            <h3>
              <Landmark size={15} /> ترکیب نقدینگی
              <span className="ch-sub">۵ حساب</span>
            </h3>
          </div>
          <div className="card-bd" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <Donut
              data={cashComposition}
              size={168}
              thickness={17}
              center={shortNum(totalCash)}
              centerSub="جمع نقدینگی"
            />
            <div className="donut-legend" style={{ width: "100%" }}>
              {cashAccounts.map((a) => (
                <div key={a.name} className="donut-leg-row">
                  <span className="small">{a.name}</span>
                  <b className="num small">{shortNum(a.balance)}</b>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 14, marginTop: 14 }}>
        <div className="card">
          <div className="card-hd">
            <h3>
              <ReceiptText size={15} /> چک‌های نزدیک سرسید
              <span className="ch-sub">۱۰ روز آینده</span>
            </h3>
            <button className="btn btn-ghost btn-xs" onClick={() => navigate("/treasury")}>
              خزانه‌داری <ChevronLeft size={12} />
            </button>
          </div>
          <div className="card-bd flush">
            <table className="table">
              <thead>
                <tr>
                  <th>طرف حساب</th>
                  <th>نوع</th>
                  <th>مبلغ</th>
                  <th>سرسید</th>
                  <th>وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { p: "بازرگانی نیک‌رو", d: "دریافتی", a: 420_000_000, due: "۱۴۰۵/۰۹/۰۳", s: "در جریان" },
                  { p: "تأمین‌کننده ورق", d: "پرداختی", a: 310_000_000, due: "۱۴۰۵/۰۹/۰۴", s: "سرسید" },
                  { p: "پخش آرمان", d: "دریافتی", a: 285_000_000, due: "۱۴۰۵/۰۹/۰۵", s: "در جریان" },
                  { p: "حمل و نقل شرق", d: "پرداختی", a: 145_000_000, due: "۱۴۰۵/۰۹/۰۷", s: "در جریان" },
                  { p: "اجاره انبار", d: "پرداختی", a: 220_000_000, due: "۱۴۰۵/۰۹/۱۰", s: "در جریان" },
                ].map((c) => (
                  <tr key={c.p + c.a}>
                    <td className="t-strong">{c.p}</td>
                    <td>
                      <span className={`chip small ${c.d === "دریافتی" ? "chip-mint" : ""}`}>{c.d}</span>
                    </td>
                    <td className="t-num">{faNum(c.a)}</td>
                    <td className="t-muted">{c.due}</td>
                    <td>
                      <Badge tone={c.s === "سرسید" ? "warn" : "muted"}>{c.s}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-hd">
            <h3>
              <AlertTriangle size={15} /> هشدارهای مدیریتی
              <span className="ch-sub">{faNum(mgAlerts.length)} مورد</span>
            </h3>
          </div>
          <div className="card-bd" style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {mgAlerts.map((a) => (
              <button
                key={a.title}
                className={`mg-alert ${a.tone}`}
                onClick={() => navigate(a.href)}
                style={{ textAlign: "right" }}
              >
                <span className="mg-alert-dot" />
                <span className="grow">
                  <b>{a.title}</b>
                  <span className="small muted">{a.body}</span>
                </span>
                <ChevronLeft size={13} className="muted" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
        <div className="card">
          <div className="card-hd">
            <h3>
              <FileSpreadsheet size={15} /> خلاصه سود و زیان
              <span className="ch-sub">سال ۱۴۰۴ · تومان</span>
            </h3>
            <button className="btn btn-ghost btn-xs" onClick={() => navigate("/statements")}>
              صورت‌های مالی <ChevronLeft size={12} />
            </button>
          </div>
          <div className="card-bd">
            <div className="mg-bars">
              {pnlBars.map((b) => (
                <div key={b.label} className="mg-bar-row">
                  <span className="small">{b.label}</span>
                  <div className="mg-bar-track">
                    <i style={{ width: `${(b.value / revenue) * 100}%`, background: b.color }} />
                  </div>
                  <b className="num small">{shortNum(b.value)}</b>
                </div>
              ))}
            </div>
            <div className="mg-net">
              <div>
                <span className="small muted">حاشیه سود خالص</span>
                <b>{pct((net / revenue) * 100, 1)}</b>
              </div>
              <div>
                <span className="small muted">رشد فروش</span>
                <b className="up">+{pct(((revenue - 8_920_000_000) / 8_920_000_000) * 100, 1)}</b>
              </div>
              <div>
                <span className="small muted">سود خالص</span>
                <b>{shortNum(net)}</b>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-hd">
            <h3>
              <Users size={15} /> حقوق، بیمه و مالیات
              <span className="ch-sub">تعهدات جاری</span>
            </h3>
            <button className="btn btn-ghost btn-xs" onClick={() => navigate("/hr/payroll")}>
              جزئیات <ChevronLeft size={12} />
            </button>
          </div>
          <div className="card-bd">
            <div className="mg-mini-grid">
              <div className="mg-mini">
                <span className="small muted">حقوق اسفند</span>
                <b>{shortNum(payrollGross)}</b>
              </div>
              <div className="mg-mini">
                <span className="small muted">بیمه سهم کارفرما</span>
                <b>{shortNum(employerInsurance)}</b>
              </div>
              <div className="mg-mini">
                <span className="small muted">ارزش افزوده</span>
                <b className="warn">{shortNum(vatPayable)}</b>
              </div>
            </div>
            <div className="mg-oblig">
              {taxObligations.slice(0, 3).map((t) => (
                <div key={t.label} className="mg-oblig-row">
                  <span className="small">{t.label}</span>
                  <span className="small muted">سرسید {t.due}</span>
                  <Badge tone={t.tone as "warn" | "success" | "muted"}>{t.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mg-foot-note">
        <AlertTriangle size={13} />
        همه اعداد از دیتابیس نرم‌افزار حسابداری استخراج، پاک‌سازی و در تاریخ ۱۴۰۴/۱۲/۲۹ همگام شده‌اند.
        {bounced > 0 && <span className="danger"> · {shortNum(bounced)} تومان چک برگشتی نیاز به پیگیری دارد.</span>}
      </div>
    </div>
  );
}
