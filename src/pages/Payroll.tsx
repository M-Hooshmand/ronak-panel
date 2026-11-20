import { Users, HeartPulse, Landmark, Percent, Download, Calculator, CalendarClock } from "lucide-react";
import { Badge, useToast } from "../components/ui";
import { AreaChart } from "../components/charts";
import { faNum, shortNum, pct } from "../lib/format";
import {
  payrollRows,
  payrollTotals,
  payrollGross,
  employerInsurance,
  vatPayable,
  taxObligations,
  payrollTrend,
} from "../lib/management";

const toneMap: Record<string, string> = {
  mint: "#2FE0BE",
  indigo: "#7C8CFF",
  warn: "#F7B955",
  danger: "#FF6B81",
};

export default function Payroll() {
  const toast = useToast();
  const net = payrollGross - payrollTotals.ins - payrollTotals.tax;

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="ph-title">
            <h1>حقوق، بیمه و مالیات</h1>
            <Badge tone="mint" dot={false}>تعهدات قانونی در یک نگاه</Badge>
          </div>
          <p>حقوق و دستمزد، بیمه سهم کارگر و کارفرما، مالیات حقوق، ارزش افزوده و مالیات بر درآمد</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-sm" onClick={() => toast("فیش حقوقی", "فایل فیش‌های آبان آماده دانلود شد.", "success")}>
            <Download size={13} /> فیش‌ها
          </button>
          <button className="btn btn-sm" onClick={() => toast("محاسبه مجدد", "حقوق و بیمه بر پایه لیست پرسنل محاسبه شد.", "info")}>
            <Calculator size={13} /> محاسبه مجدد
          </button>
        </div>
      </div>

      <div className="kpi-grid">
        {[
          { label: "حقوق و مزایای آبان", value: payrollGross, icon: Users, tone: "mint", hint: `${faNum(payrollRows.length)} پرسنل` },
          { label: "بیمه سهم کارفرما", value: employerInsurance, icon: HeartPulse, tone: "indigo", hint: "۲۳٪ حقوق پایه" },
          { label: "مالیات حقوق", value: payrollTotals.tax, icon: Landmark, tone: "warn", hint: "پرداخت تا ۱۵ آذر" },
          { label: "ارزش افزوده پرداختنی", value: vatPayable, icon: Percent, tone: "danger", hint: "دوره مهر — سرسید ۱۵ آذر" },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="kpi card" style={{ ["--kpi-glow" as string]: `${toneMap[k.tone]}22` }}>
              <div className="kpi-top">
                <span className="kpi-label">{k.label}</span>
                <span className="kpi-icon" style={{ color: toneMap[k.tone] }}>
                  <Icon size={15} />
                </span>
              </div>
              <div className="kpi-value">{shortNum(k.value)} <small>تومان</small></div>
              <div className="kpi-foot">
                <span className="small muted">{k.hint}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 14, marginTop: 14 }}>
        <div className="card">
          <div className="card-hd">
            <h3>
              <Users size={15} /> لیست حقوق آبان ۱۴۰۵
              <span className="ch-sub">{faNum(payrollRows.length)} نفر</span>
            </h3>
            <span className="chip small">خالص پرداختی {shortNum(net)}</span>
          </div>
          <div className="card-bd flush">
            <table className="table">
              <thead>
                <tr>
                  <th>پرسنل</th>
                  <th>حقوق پایه</th>
                  <th>مزایا</th>
                  <th>بیمه (۷٪)</th>
                  <th>مالیات</th>
                  <th>خالص</th>
                </tr>
              </thead>
              <tbody>
                {payrollRows.map((r) => (
                  <tr key={r.name}>
                    <td className="t-strong">
                      {r.name}
                      <div className="small muted">{r.role}</div>
                    </td>
                    <td className="t-num">{faNum(r.base)}</td>
                    <td className="t-num t-muted">{faNum(r.ben)}</td>
                    <td className="t-num t-muted">{faNum(r.ins)}</td>
                    <td className="t-num t-muted">{faNum(r.tax)}</td>
                    <td className="t-num">{faNum(r.base + r.ben - r.ins - r.tax)}</td>
                  </tr>
                ))}
                <tr>
                  <td className="t-strong">جمع</td>
                  <td className="t-num t-strong">{faNum(payrollTotals.base)}</td>
                  <td className="t-num t-strong">{faNum(payrollTotals.ben)}</td>
                  <td className="t-num t-strong">{faNum(payrollTotals.ins)}</td>
                  <td className="t-num t-strong">{faNum(payrollTotals.tax)}</td>
                  <td className="t-num t-strong">{faNum(net)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-hd">
            <h3>
              <CalendarClock size={15} /> تعهدات مالیاتی
              <span className="ch-sub">تا پایان آذر</span>
            </h3>
          </div>
          <div className="card-bd" style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {taxObligations.map((t) => (
              <div key={t.label} className="mg-oblig-row" style={{ alignItems: "center" }}>
                <span className="grow">
                  <b className="small" style={{ display: "block" }}>{t.label}</b>
                  <span className="small muted">سرسید {t.due}</span>
                </span>
                <span className="t-num small">{shortNum(t.amount)}</span>
                <Badge tone={t.tone as "warn" | "success" | "muted"}>{t.status}</Badge>
              </div>
            ))}
            <div className="mg-net" style={{ marginTop: 2 }}>
              <div>
                <span className="small muted">جمع تعهدات پرداخت‌نشده</span>
                <b className="warn">
                  {shortNum(
                    taxObligations.filter((t) => t.status !== "پرداخت‌شده").reduce((s, t) => s + t.amount, 0),
                  )}
                </b>
              </div>
              <div>
                <span className="small muted">نسبت به فروش</span>
                <b>{pct((vatPayable / 9_660_000_000) * 100, 1)}</b>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <div className="card-hd">
          <h3>
            <HeartPulse size={15} /> روند حقوق و بیمه
            <span className="ch-sub">۵ ماه گذشته · تومان</span>
          </h3>
          <div className="hd-actions">
            <span className="chip small"><i className="dot" style={{ background: "#2FE0BE" }} /> حقوق</span>
            <span className="chip small"><i className="dot" style={{ background: "#7C8CFF" }} /> بیمه</span>
          </div>
        </div>
        <div className="card-bd" style={{ paddingTop: 8 }}>
          <AreaChart
            data={payrollTrend.map((p) => ({ label: p.label, values: p.values.map((v) => v * 1_000_000_000) }))}
            series={[
              { name: "حقوق و مزایا", color: "#2FE0BE", key: 0 },
              { name: "بیمه", color: "#7C8CFF", key: 1 },
            ]}
            height={220}
            yFormat={(n) => shortNum(n)}
            legend={false}
          />
        </div>
      </div>

      <div className="mg-foot-note">
        <Percent size={13} />
        مالیات بر درآمد ۲۵٪ سود قبل از مالیات و ارزش افزوده از اسناد فروش و خرید محاسبه شده است.
      </div>
    </div>
  );
}
