import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  FileCheck2,
  Cpu,
  ShieldCheck,
  CalendarDays,
  Download,
  Play,
  ChevronLeft,
  TriangleAlert,
  CircleCheck,
  RefreshCw,
  FileText,
  UserRound,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { AreaChart, Donut, Sparkline, StackedBar } from "../components/charts";
import { Badge, useToast, type Tone } from "../components/ui";
import { salesTotals } from "../lib/business";
import { recordTrend, vouchers, vouchersByStatus, qualityIssues, pipelines, activities, voucherTotal, voucherStatusMeta } from "../lib/data";
import { faNum, money, shortNum, today, toFaDigits } from "../lib/format";

const kpis = [
  {
    label: "ردیف‌های دفتر کل",
    value: salesTotals.lines,
    unit: "ردیف",
    delta: 9.2,
    tone: "mint",
    icon: Activity,
    spark: [142, 156, 139, 171, 164, 129, 96, 183, 194, 202, 188, 215, 226, 238],
  },
  {
    label: "اسناد ثبت‌شده",
    value: salesTotals.vouchers,
    unit: "سند",
    delta: 100,
    tone: "indigo",
    icon: FileCheck2,
    spark: [820, 910, 870, 980, 1040, 730, 510, 1090, 1150, 1180, 1120, 1210, 1230, 1248],
  },
  {
    label: "ایجنت‌های فعال",
    value: 5,
    unit: "از ۶ ایجنت",
    delta: -1,
    deltaText: "۱ ایجنت آفلاین",
    tone: "warn",
    icon: Cpu,
    spark: [6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    label: "امتیاز کیفیت داده",
    value: 87.6,
    unit: "از ۱۰۰",
    delta: 2.4,
    tone: "success",
    icon: ShieldCheck,
    spark: [81, 82, 83, 82, 84, 85, 84, 85, 86, 86, 87, 87, 87.2, 87.6],
  },
] as const;

const toneMap: Record<string, string> = {
  mint: "var(--mint)",
  indigo: "var(--indigo)",
  warn: "var(--warn)",
  success: "var(--success)",
};

const activityIcon = {
  check: CircleCheck,
  alert: TriangleAlert,
  sync: RefreshCw,
  file: FileText,
  user: UserRound,
  shield: ShieldAlert,
};

export default function Dashboard() {
  const navigate = useNavigate();
  const toast = useToast();
  const [range, setRange] = useState("امروز");

  const recent = useMemo(() => vouchers.slice(0, 6), []);
  const openIssues = qualityIssues.filter((q) => q.status === "open");
  const posted = vouchersByStatus[0].value;
  const totalVouchers = vouchersByStatus.reduce((s, v) => s + v.value, 0);

  return (
    <>
      <div className="page-head">
        <div>
          <div className="ph-title">
            <h1>داشبورد</h1>
            <Badge tone="mint" dot={false} icon={<Zap size={10} />}>زنده</Badge>
          </div>
          <p>
            نمای کلی پردازش داده و ثبت اسناد — {today.label}
          </p>
        </div>
        <div className="page-actions">
          <span className="chip">
            <CalendarDays size={13} /> دوره مالی سال ۱۴۰۴
          </span>
          <div className="seg">
            {["امروز", "۷ روز", "۳۰ روز"].map((r) => (
              <button key={r} className={range === r ? "on" : ""} onClick={() => setRange(r)}>
                {r}
              </button>
            ))}
          </div>
          <button className="btn btn-sm" onClick={() => toast("خروجی آماده شد", "گزارش داشبورد به‌صورت Excel در صف دانلود قرار گرفت.", "success")}>
            <Download size={13} /> خروجی
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => { toast("اجرای همه جریان‌ها آغاز شد", "۶ جریان در صف اجرا قرار گرفتند.", "info"); navigate("/pipelines"); }}>
            <Play size={13} /> اجرای همه
          </button>
        </div>
      </div>

      <div className="kpi-grid">
        {kpis.map((k) => {
          const Icon = k.icon;
          const up = k.delta >= 0;
          return (
            <div className="card kpi" key={k.label} style={{ ["--kpi-glow" as string]: `${toneMap[k.tone]}22` }}>
              <div className="kpi-top">
                <span className="kpi-label">{k.label}</span>
                <span className="kpi-icon" style={{ color: toneMap[k.tone] }}>
                  <Icon size={14} />
                </span>
              </div>
              <div className="kpi-value">
                {k.value % 1 === 0 ? faNum(k.value) : faNum(k.value, 1)}
                <small>{k.unit}</small>
              </div>
              <div className="kpi-foot">
                <span className={`delta ${"deltaText" in k ? "flat" : up ? "up" : "down"}`}>
                  {!("deltaText" in k) && (up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />)}
                  {"deltaText" in k ? k.deltaText : `${faNum(Math.abs(k.delta), 1)}٪ نسبت به دیروز`}
                </span>
                <span className="kpi-spark">
                  <Sparkline data={[...k.spark]} color={toneMap[k.tone]} width={88} height={30} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dash-row dash-row-main">
        <div className="card">
          <div className="card-hd">
            <h3>
              <Activity size={15} /> حجم پردازش روزانه
              <span className="ch-sub">۱۴ روز گذشته · رکورد</span>
            </h3>
            <div className="hd-actions">
              <span className="chip small"><i className="dot live" style={{ background: "#2FE0BE" }} /> ۹۷٫۳٪ معتبر</span>
              <span className="chip small">میانگین {shortNum(178_400)}</span>
              <span className="chip small">اوج {shortNum(Math.max(...recordTrend.map((r) => r.processed)))}</span>
            </div>
          </div>
          <div className="card-bd" style={{ paddingTop: 12 }}>
            <AreaChart
              data={recordTrend.map((d) => ({ label: d.day, values: [d.processed] }))}
              series={[{ name: "رکورد پردازش‌شده", color: "#2FE0BE", key: 0 }]}
              height={300}
              yFormat={(n) => shortNum(n)}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-hd">
            <h3>
              <FileCheck2 size={15} /> اسناد به تفکیک وضعیت
              <span className="ch-sub">سال ۱۴۰۴</span>
            </h3>
            <button className="btn btn-ghost btn-xs" onClick={() => navigate("/vouchers")}>
              مشاهده <ChevronLeft size={12} />
            </button>
          </div>
          <div className="card-bd" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <Donut
              data={vouchersByStatus}
              size={160}
              thickness={16}
              center={faNum(totalVouchers)}
              centerSub="کل اسناد"
            />
            <div className="donut-legend">
              {vouchersByStatus.map((s) => (
                <div className="dl-row" key={s.label}>
                  <i style={{ background: s.color }} />
                  <span>{s.label}</span>
                  <b>{faNum(s.value)}</b>
                  <span className="muted-2">{faNum((s.value / totalVouchers) * 100, 1)}٪</span>
                </div>
              ))}
            </div>
            <div className="hl-box" style={{ width: "100%", marginTop: 10 }}>
              <div className="kv">
                <span className="k">نرخ ثبت موفق</span>
                <span className="v" style={{ color: "var(--mint)" }}>{faNum((posted / totalVouchers) * 100, 1)}٪</span>
              </div>
              <div style={{ marginTop: 7 }}>
                <StackedBar data={vouchersByStatus.map((s) => ({ value: s.value, color: s.color, label: s.label }))} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card pipeline-strip">
        <div className="card-hd">
          <h3>
            <Zap size={15} /> وضعیت جریان‌های داده
            <span className="ch-sub">۵ جریان فعال · ۱ متوقف</span>
          </h3>
          <button className="btn btn-ghost btn-xs" onClick={() => navigate("/pipelines")}>
            مدیریت جریان‌ها <ChevronLeft size={12} />
          </button>
        </div>
        <div className="ps-grid">
          {pipelines.slice(0, 5).map((p) => {
            const warn = p.stages.some((s) => s.state === "warn" || s.state === "error");
            return (
              <button key={p.id} className="ps-item" onClick={() => navigate("/pipelines")}>
                <div className="ps-top">
                  <span className={`dot ${p.active ? (warn ? "warn" : "live") : "off"}`} />
                  <span className="ps-name">{p.name}</span>
                  <span className="ps-pct num">{p.active ? `${faNum(p.records > 0 ? 100 : 0)}٪` : "—"}</span>
                </div>
                <div className="ps-stages">
                  {p.stages.map((s) => (
                    <span key={s.key} className={`ps-seg ${s.state}`} title={s.label} />
                  ))}
                </div>
                <div className="ps-foot">
                  <span>{p.schedule}</span>
                  <span className="num">{shortNum(p.records)} رکورد</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="dash-row dash-row-2">
        <div className="card">
          <div className="card-hd">
            <h3>
              <RefreshCw size={15} /> فعالیت‌های اخیر
            </h3>
            <button className="btn btn-ghost btn-xs" onClick={() => navigate("/logs")}>
              همه رویدادها <ChevronLeft size={12} />
            </button>
          </div>
          <div className="card-bd" style={{ padding: "6px 10px 10px" }}>
            <div className="activity-list">
              {activities.map((a) => {
                const Icon = activityIcon[a.icon];
                return (
                  <div className="act-item" key={a.id}>
                    <span className={`act-ic tone-${a.tone}`}>
                      <Icon size={13} />
                    </span>
                    <div className="grow">
                      <div className="act-title">{a.title}</div>
                      <div className="act-sub">{a.sub}</div>
                    </div>
                    <span className="act-time">{a.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-hd">
            <h3>
              <TriangleAlert size={15} /> کیفیت داده — موارد باز
              <span className="ch-sub">{faNum(openIssues.length)} مورد</span>
            </h3>
            <button className="btn btn-ghost btn-xs" onClick={() => navigate("/quality")}>
              بررسی <ChevronLeft size={12} />
            </button>
          </div>
          <div className="card-bd" style={{ padding: "8px 12px 12px" }}>
            {openIssues.slice(0, 4).map((q) => (
              <div className="qmini" key={q.id}>
                <span className={`sev-bar ${q.severity}`} />
                <div className="grow">
                  <div className="qmini-title">{q.title}</div>
                  <div className="qmini-sub">
                    {q.category} · {q.company}
                  </div>
                </div>
                <div className="qmini-count num">{faNum(q.records)}</div>
              </div>
            ))}
            <div className="qmini-footer">
              <span className="row">
                <span className="dot danger" /> ۳ مورد بحرانی نیازمند اقدام
              </span>
              <button className="btn btn-xs btn-primary" onClick={() => navigate("/quality")}>
                رسیدگی
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-hd">
          <h3>
            <FileText size={15} /> آخرین اسناد حسابداری
            <span className="ch-sub">ثبت‌شده در نرم‌افزار مقصد</span>
          </h3>
          <div className="hd-actions">
            <span className="badge badge-mint no-dot">امروز {faNum(12)} سند ثبت شد</span>
            <button className="btn btn-sm" onClick={() => navigate("/vouchers")}>
              همه اسناد <ChevronLeft size={12} />
            </button>
          </div>
        </div>
        <div className="tbl-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>شماره سند</th>
                <th>تاریخ</th>
                <th>شرح</th>
                <th>شرکت / شعبه</th>
                <th>مبلغ (ریال)</th>
                <th>منبع</th>
                <th>وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((v) => {
                const meta = voucherStatusMeta[v.status];
                return (
                  <tr key={v.id} className="clickable" onClick={() => navigate("/vouchers")}>
                    <td>
                      <span className="t-strong mono">{v.number}</span>
                    </td>
                    <td className="num t-muted">{v.date}</td>
                    <td>
                      <span className="t-strong">{v.description}</span>
                    </td>
                    <td>
                      <div>{v.company.replace("شرکت ", "")}</div>
                      <div className="t-sub">{v.branch}</div>
                    </td>
                    <td className="t-num">{money(voucherTotal(v))}</td>
                    <td className="t-muted">{v.source}</td>
                    <td>
                      <Badge tone={meta.tone as Tone}>{meta.label}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="card-foot">
          <span>
            نمایش {toFaDigits(6)} سند از {faNum(salesTotals.vouchers)} سند دوره — {faNum(salesTotals.lines)} ردیف تفصیلی
          </span>
          <span className="row">
            <span className="dot live" /> به‌روزرسانی خودکار هر ۳۰ ثانیه
          </span>
        </div>
      </div>
    </>
  );
}
