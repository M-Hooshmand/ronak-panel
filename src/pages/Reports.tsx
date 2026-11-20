import { useMemo, useState } from "react";
import {
  BarChart3,
  Download,
  Send,
  TrendingUp,
  TrendingDown,
  Wallet,
  Percent,
  FileCheck2,
  ChevronLeft,
  CalendarRange,
  ArrowUpRight,
  Landmark,
  Scale,
  Users,
  CircleCheck,
  TriangleAlert,
  Clock,
} from "lucide-react";
import { AreaChart, BarChart, Donut, GroupedBars, HBarChart, Sparkline, StackedBar } from "../components/charts";
import { Badge, Tabs, useToast } from "../components/ui";
import {
  salesTrend,
  balanceSheet,
  vouchersByStatus,
  agentPerformance,
  agents,
  voucherTotal,
} from "../lib/data";
import { vouchers } from "../lib/data";
import { faNum, pct, shortNum } from "../lib/format";

type ReportTab = "sales" | "balance" | "vouchers" | "agents";

const branchSales = [
  { label: "تهران — مرکز", value: 3_240, color: "#2FE0BE" },
  { label: "اصفهان", value: 1_860, color: "#7C8CFF" },
  { label: "مشهد", value: 1_120, color: "#F7B955" },
  { label: "شیراز", value: 640, color: "#7BE495" },
  { label: "بندرعباس", value: 380, color: "#C08CFF" },
];

const weeklyDocs = [
  { label: "هفته ۱", posted: 1042, pending: 186, error: 34, draft: 78 },
  { label: "هفته ۲", posted: 1128, pending: 204, error: 41, draft: 92 },
  { label: "هفته ۳", posted: 986, pending: 231, error: 38, draft: 104 },
  { label: "هفته ۴", posted: 1112, pending: 191, error: 33, draft: 74 },
];

const totalVouchers = vouchersByStatus.reduce((s, v) => s + v.value, 0);

export default function Reports() {
  const toast = useToast();
  const [tab, setTab] = useState<ReportTab>("sales");
  const [range, setRange] = useState("۱۲ ماه");

  const salesTotal = useMemo(() => salesTrend.reduce((s, d) => s + d.value, 0), []);
  const avgSales = Math.round(salesTotal / salesTrend.length);
  const peak = salesTrend.reduce((a, b) => (b.value > a.value ? b : a), salesTrend[0]);

  const assets = balanceSheet.slice(0, 2).reduce((s, r) => s + r.assets, 0);
  const liabilities = balanceSheet.slice(2, 4).reduce((s, r) => s + r.liabilities, 0);
  const equity = balanceSheet.slice(4).reduce((s, r) => s + r.equity, 0);

  const postedRows = vouchers.filter((v) => v.status === "posted");
  const postedSum = postedRows.reduce((s, v) => s + voucherTotal(v), 0);

  return (
    <>
      <div className="page-head">
        <div>
          <div className="ph-title">
            <h1>گزارش‌ها</h1>
            <Badge tone="indigo" dot={false} icon={<CalendarRange size={10} />}>دوره آبان ۱۴۰۵</Badge>
          </div>
          <p>تحلیل روند فروش، ترازنامه، وضعیت اسناد و عملکرد ایجنت‌ها</p>
        </div>
        <div className="page-actions">
          <div className="seg">
            {["این ماه", "۳ ماه", "۱۲ ماه"].map((r) => (
              <button key={r} className={range === r ? "on" : ""} onClick={() => setRange(r)}>
                {r}
              </button>
            ))}
          </div>
          <button className="btn btn-sm" onClick={() => toast("گزارش ارسال شد", "فایل PDF برای مدیر مالی ایمیل شد.", "success")}>
            <Send size={13} /> ارسال
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => toast("خروجی PDF", "گزارش با نمودارها در حال تولید است.", "success")}>
            <Download size={13} /> خروجی PDF
          </button>
        </div>
      </div>

      <div className="mini-stats">
        <div className="mini-stat">
          <span className="ms-ic" style={{ color: "var(--mint)" }}><TrendingUp size={15} /></span>
          <div><div className="ms-k">فروش آبان (میلیون تومان)</div><div className="ms-v">{faNum(7_240)} <small>+۱۰٫۷٪</small></div></div>
        </div>
        <div className="mini-stat">
          <span className="ms-ic" style={{ color: "var(--indigo)" }}><Percent size={15} /></span>
          <div><div className="ms-k">حاشیه سود ناخالص</div><div className="ms-v">{pct(23.4)} <small>+۱٫۲ واحد</small></div></div>
        </div>
        <div className="mini-stat">
          <span className="ms-ic" style={{ color: "var(--warn)" }}><FileCheck2 size={15} /></span>
          <div><div className="ms-k">اسناد ثبت‌شده</div><div className="ms-v">{faNum(4_268)} <small>از {faNum(totalVouchers)}</small></div></div>
        </div>
        <div className="mini-stat">
          <span className="ms-ic" style={{ color: "var(--success)" }}><Wallet size={15} /></span>
          <div><div className="ms-k">مجموع مبلغ اسناد ثبت‌شده</div><div className="ms-v">{shortNum(postedSum)} <small>ریال</small></div></div>
        </div>
      </div>

      <div className="card">
        <Tabs
          tabs={[
            { id: "sales", label: "روند فروش" },
            { id: "balance", label: "ترازنامه" },
            { id: "vouchers", label: "اسناد به تفکیک وضعیت" },
            { id: "agents", label: "عملکرد ایجنت‌ها" },
          ]}
          active={tab}
          onChange={setTab}
        />

        {tab === "sales" && (
          <div className="report-body">
            <div className="report-grid">
              <div className="card inner sales-chart-card">
                <div className="card-hd">
                  <h3><BarChart3 size={15} /> فروش ماهانه <span className="ch-sub">میلیون تومان</span></h3>
                  <span className="delta up"><ArrowUpRight size={12} /> ۱۰٫۷٪ رشد</span>
                </div>
                <div className="card-bd" style={{ paddingTop: 10 }}>
                  <AreaChart
                    data={salesTrend.map((d) => ({ label: d.month, values: [d.value] }))}
                    series={[{ name: "فروش", color: "#2FE0BE", key: 0 }]}
                    height={300}
                    yFormat={(n) => faNum(n)}
                  />
                  <div className="sales-summary">
                    <div><span>بهترین ماه</span><b>آبان · {faNum(peak.value)}</b></div>
                    <div><span>کمترین ماه</span><b>فروردین · {faNum(4_120)}</b></div>
                    <div><span>میانگین رشد ماهانه</span><b className="mint">+۴٫۲٪</b></div>
                  </div>
                </div>
              </div>

              <div className="col" style={{ gap: 14 }}>
                <div className="card inner">
                  <div className="card-hd"><h3><TrendingUp size={15} /> شاخص‌های کلیدی</h3></div>
                  <div className="card-bd" style={{ paddingTop: 10 }}>
                    <div className="kv"><span className="k">مجموع فروش سال</span><span className="v">{shortNum(salesTotal)} <small className="muted">م.ت</small></span></div>
                    <div className="kv"><span className="k">میانگین ماهانه</span><span className="v">{faNum(avgSales)} <small className="muted">م.ت</small></span></div>
                    <div className="kv"><span className="k">بهترین ماه</span><span className="v">{peak.month} · {faNum(peak.value)}</span></div>
                    <div className="kv"><span className="k">رشد نسبت به سال گذشته</span><span className="v mint">+۱۸٫۴٪</span></div>
                    <div className="divider" />
                    <div className="small muted" style={{ marginBottom: 6 }}>روند ۶ ماه گذشته</div>
                    <Sparkline data={salesTrend.slice(-6).map((d) => d.value)} width={300} height={54} strokeWidth={2} />
                  </div>
                </div>
                <div className="card inner">
                  <div className="card-hd"><h3><Users size={15} /> فروش به تفکیک شعبه</h3></div>
                  <div className="card-bd" style={{ paddingTop: 12 }}>
                    <HBarChart data={branchSales} format={(n) => faNum(n)} suffix=" م.ت" />
                  </div>
                </div>
              </div>
            </div>

            <div className="card inner" style={{ marginTop: 14 }}>
              <div className="card-hd">
                <h3>ریز فروش ماهانه</h3>
                <span className="small muted-2">۱۲ ماه منتهی به آبان ۱۴۰۵</span>
              </div>
              <div className="tbl-wrap">
                <table className="table table-compact">
                  <thead>
                    <tr>
                      <th>ماه</th>
                      <th>فروش (میلیون تومان)</th>
                      <th>رکورد پردازش‌شده</th>
                      <th>تغییر</th>
                      <th>سهم از سال</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesTrend.map((d, i) => {
                      const prev = i > 0 ? salesTrend[i - 1].value : d.value;
                      const diff = ((d.value - prev) / prev) * 100;
                      return (
                        <tr key={d.month}>
                          <td className="t-strong">{d.month}</td>
                          <td className="t-num">{faNum(d.value)}</td>
                          <td className="t-num t-muted">{faNum(d.records)}</td>
                          <td>
                            <span className={`delta ${diff >= 0 ? "up" : "down"}`}>
                              {diff >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                              {faNum(Math.abs(diff), 1)}٪
                            </span>
                          </td>
                          <td>
                            <div className="row" style={{ gap: 8 }}>
                              <div className="progress thin" style={{ width: 90 }}>
                                <span style={{ width: `${(d.value / peak.value) * 100}%` }} />
                              </div>
                              <span className="small muted num">{pct((d.value / salesTotal) * 100)}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === "balance" && (
          <div className="report-body">
            <div className="report-grid">
              <div className="card inner">
                <div className="card-hd">
                  <h3><Scale size={15} /> ترکیب ترازنامه <span className="ch-sub">میلیون تومان</span></h3>
                  <Badge tone="success" dot={false}>تراز تأیید شد</Badge>
                </div>
                <div className="card-bd" style={{ paddingTop: 8 }}>
                  <GroupedBars
                    data={[
                      { label: "دارایی‌ها", values: [52_400, 31_800] },
                      { label: "بدهی‌ها", values: [24_600, 12_400] },
                      { label: "حقوق صاحبان سهام", values: [38_200, 9_000] },
                    ]}
                    series={[
                      { name: "جاری", color: "#2FE0BE" },
                      { name: "غیرجاری", color: "#7C8CFF" },
                    ]}
                    height={240}
                    format={(n) => faNum(n)}
                  />
                  <div className="bs-equation">
                    <div><span>دارایی‌ها</span><b>{faNum(assets)}</b></div>
                    <span className="eq-sign">=</span>
                    <div><span>بدهی‌ها</span><b>{faNum(liabilities)}</b></div>
                    <span className="eq-sign">+</span>
                    <div><span>سرمایه</span><b>{faNum(equity)}</b></div>
                  </div>
                  <div className="row" style={{ justifyContent: "center", marginTop: 8 }}>
                    <span className="badge badge-success no-dot"><CircleCheck size={11} /> {faNum(assets)} = {faNum(liabilities + equity)}</span>
                  </div>
                </div>
              </div>

              <div className="col" style={{ gap: 14 }}>
                <div className="card inner">
                  <div className="card-hd"><h3><Landmark size={15} /> خلاصه اقلام</h3></div>
                  <div className="card-bd" style={{ paddingTop: 10 }}>
                    <div className="kv"><span className="k">دارایی جاری</span><span className="v">{faNum(52_400)}</span></div>
                    <div className="kv"><span className="k">دارایی ثابت</span><span className="v">{faNum(31_800)}</span></div>
                    <div className="kv"><span className="k">بدهی جاری</span><span className="v">{faNum(24_600)}</span></div>
                    <div className="kv"><span className="k">بدهی بلندمدت</span><span className="v">{faNum(12_400)}</span></div>
                    <div className="kv"><span className="k">سرمایه</span><span className="v">{faNum(38_200)}</span></div>
                    <div className="kv"><span className="k">سود انباشته</span><span className="v">{faNum(9_000)}</span></div>
                  </div>
                </div>
                <div className="card inner">
                  <div className="card-hd"><h3><Percent size={15} /> نسبت‌های مالی</h3></div>
                  <div className="card-bd" style={{ paddingTop: 12 }}>
                    <HBarChart
                      data={[
                        { label: "نسبت جاری", value: 2.13, color: "#2FE0BE" },
                        { label: "نسبت آنی", value: 1.42, color: "#7C8CFF" },
                        { label: "بدهی به دارایی", value: 0.44, color: "#F7B955" },
                        { label: "بازده سرمایه", value: 0.19, color: "#7BE495" },
                      ]}
                      format={(n) => faNum(n, 2)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card inner" style={{ marginTop: 14 }}>
              <div className="card-hd"><h3>اقلام تفصیلی ترازنامه</h3><span className="small muted-2">مبالغ به میلیون تومان</span></div>
              <div className="tbl-wrap">
                <table className="table table-compact">
                  <thead>
                    <tr><th>گروه</th><th>دارایی</th><th>بدهی</th><th>سرمایه</th><th>سهم از تراز</th></tr>
                  </thead>
                  <tbody>
                    {balanceSheet.map((r) => {
                      const sum = r.assets + r.liabilities + r.equity;
                      return (
                        <tr key={r.label}>
                          <td className="t-strong">{r.label}</td>
                          <td className="t-num">{r.assets ? faNum(r.assets) : "—"}</td>
                          <td className="t-num">{r.liabilities ? faNum(r.liabilities) : "—"}</td>
                          <td className="t-num">{r.equity ? faNum(r.equity) : "—"}</td>
                          <td>
                            <div className="row" style={{ gap: 8 }}>
                              <div className="progress thin" style={{ width: 100 }}>
                                <span style={{ width: `${(sum / assets) * 100}%` }} />
                              </div>
                              <span className="small muted">{pct((sum / assets) * 100)}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === "vouchers" && (
          <div className="report-body">
            <div className="report-grid">
              <div className="card inner">
                <div className="card-hd"><h3>توزیع وضعیت اسناد</h3><span className="small muted-2">{faNum(totalVouchers)} سند</span></div>
                <div className="card-bd" style={{ display: "flex", alignItems: "center", gap: 22, paddingTop: 18 }}>
                  <Donut data={vouchersByStatus} size={186} thickness={19} center={pct((vouchersByStatus[0].value / totalVouchers) * 100)} centerSub="نرخ ثبت" />
                  <div className="grow">
                    {vouchersByStatus.map((s) => (
                      <div className="dl-row" key={s.label}>
                        <i style={{ background: s.color }} />
                        <span>{s.label}</span>
                        <b>{faNum(s.value)}</b>
                        <span className="muted-2">{pct((s.value / totalVouchers) * 100)}</span>
                      </div>
                    ))}
                    <div className="divider" />
                    <div className="kv"><span className="k">مبلغ کل اسناد ثبت‌شده</span><span className="v">{shortNum(postedSum)} ریال</span></div>
                    <div className="kv"><span className="k">میانگین مبلغ هر سند</span><span className="v">{shortNum(Math.round(postedSum / postedRows.length))} ریال</span></div>
                  </div>
                </div>
              </div>
              <div className="card inner">
                <div className="card-hd"><h3>روند هفتگی ثبت</h3><span className="small muted-2">آبان ۱۴۰۵</span></div>
                <div className="card-bd" style={{ paddingTop: 16 }}>
                  {weeklyDocs.map((w) => {
                    const total = w.posted + w.pending + w.error + w.draft;
                    return (
                      <div className="week-row" key={w.label}>
                        <div className="row-between small" style={{ marginBottom: 6 }}>
                          <span>{w.label}</span>
                          <span className="muted-2">{faNum(total)} سند</span>
                        </div>
                        <StackedBar
                          data={[
                            { value: w.posted, color: "#7BE495", label: "ثبت‌شده" },
                            { value: w.pending, color: "#F7B955", label: "در انتظار" },
                            { value: w.error, color: "#FF6B81", label: "خطا" },
                            { value: w.draft, color: "#8A9BB4", label: "پیش‌نویس" },
                          ]}
                          height={9}
                        />
                        <div className="week-legend">
                          <span className="mint">{pct((w.posted / total) * 100)}</span>
                          <span className="warn">{pct((w.pending / total) * 100)}</span>
                          <span className="danger">{pct((w.error / total) * 100)}</span>
                        </div>
                      </div>
                    );
                  })}
                  <div className="hl-box small" style={{ marginTop: 8 }}>
                    نرخ ثبت هفته چهارم به {pct(76.5)} رسیده است؛ ۳۸ سند خطادار نیاز به اصلاح نگاشت دارند.
                  </div>
                </div>
              </div>
            </div>

            <div className="card inner" style={{ marginTop: 14 }}>
              <div className="card-hd"><h3>اسناد ثبت‌شده به تفکیک شرکت</h3><span className="small muted-2">آبان ۱۴۰۵</span></div>
              <div className="card-bd">
                <HBarChart
                  data={[
                    { label: "شرکت پخش آرمان", value: 2_284, color: "#2FE0BE" },
                    { label: "گروه صنعتی پارس‌فولاد", value: 1_104, color: "#7C8CFF" },
                    { label: "داروسازی سلامت‌گستر", value: 612, color: "#F7B955" },
                    { label: "بازرگانی نیک‌رو", value: 268, color: "#7BE495" },
                  ]}
                  format={(n) => faNum(n)}
                  suffix=" سند"
                />
              </div>
            </div>
          </div>
        )}

        {tab === "agents" && (
          <div className="report-body">
            <div className="report-grid">
              <div className="card inner">
                <div className="card-hd"><h3>نرخ موفقیت ایجنت‌ها</h3><span className="small muted-2">درصد اجرای موفق</span></div>
                <div className="card-bd" style={{ paddingTop: 8 }}>
                  <BarChart
                    data={agentPerformance.map((a) => ({
                      label: a.name,
                      value: a.value,
                      color: a.value > 95 ? "#2FE0BE" : a.value > 70 ? "#F7B955" : "#FF6B81",
                      sub: `${faNum(a.records)} رکورد`,
                    }))}
                    height={230}
                    format={(n) => `${faNum(n, 1)}٪`}
                    labels
                  />
                </div>
              </div>
              <div className="col" style={{ gap: 14 }}>
                <div className="card inner">
                  <div className="card-hd"><h3><Clock size={15} /> زمان پاسخ ایجنت</h3></div>
                  <div className="card-bd" style={{ paddingTop: 10 }}>
                    <div className="kv"><span className="k">میانگین تأخیر ضربان</span><span className="v">۳۱ ثانیه</span></div>
                    <div className="kv"><span className="k">بدترین ایجنت</span><span className="v danger">NKR-05 · آفلاین</span></div>
                    <div className="kv"><span className="k">پایدارترین ایجنت</span><span className="v mint">PRS-04 · ۹۹٫۹٪</span></div>
                    <div className="kv"><span className="k">مجموع رکورد ۳۰ روز</span><span className="v">{shortNum(7_772_000)}</span></div>
                  </div>
                </div>
                <div className="card inner">
                  <div className="card-hd"><h3><TriangleAlert size={15} /> هشدارها</h3></div>
                  <div className="card-bd" style={{ paddingTop: 10 }}>
                    <div className="row" style={{ marginBottom: 8 }}><span className="dot danger" /><span className="small">NKR-05 از ۱۸ ساعت پیش آفلاین است</span></div>
                    <div className="row" style={{ marginBottom: 8 }}><span className="dot warn" /><span className="small">ARN-03 صف ارسال ۱۱۸ رکوردی دارد</span></div>
                    <div className="row"><span className="dot warn" /><span className="small">نسخه ۲٫۴٫۱ برای ۳ ایجنت آماده نصب است</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card inner" style={{ marginTop: 14 }}>
              <div className="card-hd"><h3>ریز عملکرد ایجنت‌ها</h3><span className="small muted-2">۳۰ روز گذشته</span></div>
              <div className="tbl-wrap">
                <table className="table table-compact">
                  <thead>
                    <tr><th>ایجنت</th><th>شرکت</th><th>نسخه</th><th>رکورد پردازش‌شده</th><th>نرخ موفقیت</th><th>وضعیت</th><th>روند</th></tr>
                  </thead>
                  <tbody>
                    {agents.map((a, i) => {
                      const perf = agentPerformance[i];
                      return (
                        <tr key={a.id}>
                          <td className="mono t-strong">{a.code}</td>
                          <td>{a.company.replace("شرکت ", "").replace("گروه صنعتی ", "")}</td>
                          <td className="mono">{a.version}</td>
                          <td className="t-num">{faNum(perf.records)}</td>
                          <td>
                            <span className={`delta ${perf.value > 95 ? "up" : perf.value > 70 ? "flat" : "down"}`}>{pct(perf.value)}</span>
                          </td>
                          <td>
                            <Badge tone={a.status === "online" ? "success" : a.status === "degraded" ? "warn" : "danger"}>
                              {a.status === "online" ? "آنلاین" : a.status === "degraded" ? "نیازمند بررسی" : "آفلاین"}
                            </Badge>
                          </td>
                          <td><Sparkline data={a.heartbeat} width={80} height={24} color={a.status === "offline" ? "#FF6B81" : "#2FE0BE"} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <div className="card-hd">
          <h3><FileCheck2 size={15} /> گزارش‌های آماده</h3>
          <button className="btn btn-ghost btn-xs" onClick={() => toast("کتابخانه گزارش‌ها", "۲۴ گزارش آماده در دسترس است.", "info")}>
            همه گزارش‌ها <ChevronLeft size={12} />
          </button>
        </div>
        <div className="report-links">
          {[
            { t: "تراز آزمایشی دوره آبان", s: "همه شرکت‌ها · ۱۴۰۵/۰۸/۳۰" },
            { t: "گزارش اسناد خطادار", s: "۱۴۶ سند · نیازمند اقدام" },
            { t: "صورت جریان نقدی", s: "تجمعی از ابتدای سال" },
            { t: "گزارش کیفیت داده هفتگی", s: "مقایسه با هفته گذشته" },
          ].map((r) => (
            <button className="report-link" key={r.t} onClick={() => toast("تولید گزارش", `${r.t} در حال آماده‌سازی است.`, "info")}>
              <span className="rl-ic"><FileCheck2 size={15} /></span>
              <span className="grow">
                <b>{r.t}</b>
                <span>{r.s}</span>
              </span>
              <Download size={14} className="muted" />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
