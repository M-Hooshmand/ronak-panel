import { useNavigate } from "react-router-dom";
import { Users, Fingerprint, CalendarClock, Timer, ChevronLeft, Wifi, AlertTriangle, Plus, Download, Sunrise } from "lucide-react";
import { Badge } from "../components/ui";
import { AreaChart, HBarChart } from "../components/charts";
import { faNum, pct } from "../lib/format";
import { employees, attendanceToday, monthSummary, departments, timeclock, hrAlerts, attendanceTrend, leaveBalances } from "../lib/hr";

const empName = (id: number) => employees.find((e) => e.id === id)?.name ?? "—";
const toneOf = (s: string) => (s === "حاضر" ? "success" : s === "تأخیر" ? "warn" : s === "مرخصی" ? "indigo" : s === "ماموریت" ? "mint" : "danger") as "success" | "warn" | "indigo" | "mint" | "danger";
const present = attendanceToday.filter((a) => a.status === "حاضر" || a.status === "تأخیر").length;
const off = attendanceToday.filter((a) => a.status === "مرخصی" || a.status === "ماموریت").length;
const totalOt = monthSummary.reduce((s, m) => s + m.overtime, 0);
const delaySum = monthSummary.reduce((s, m) => s + m.delay, 0);

export default function HRDashboard() {
  const navigate = useNavigate();
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="ph-title">
            <h1>منابع انسانی</h1>
            <Badge tone="mint" dot={false}>پرسنل، حضور، مرخصی، نامه‌ها</Badge>
          </div>
          <p>تصویر کامل سرمایه انسانی — آبان ۱۴۰۵ · دستگاه ساعت‌زنی متصل</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-sm" onClick={() => navigate("/hr/attendance")}>
            <Fingerprint size={13} /> ورود/خروج
          </button>
          <button className="btn btn-sm" onClick={() => navigate("/hr/letters")}>
            <Plus size={13} /> نامه جدید
          </button>
          <button className="btn btn-sm" onClick={() => navigate("/hr/employees")}>
            <Download size={13} /> خروجی پرسنل
          </button>
        </div>
      </div>

      <div className="kpi-grid">
        {[
          { label: "پرسنل فعال", value: "۶۷", hint: "۶ واحد سازمانی", icon: Users, tone: "mint" },
          { label: "حاضر امروز", value: faNum(present + 24), hint: `${faNum(off + 1)} مرخصی/ماموریت`, icon: Sunrise, tone: "indigo" },
          { label: "اضافه‌کاری آبان", value: `${faNum(Math.round(totalOt))} ساعت`, hint: "میانگین ۱۳٫۹ ساعت", icon: Timer, tone: "warn" },
          { label: "تأخیر ماه", value: `${faNum(delaySum)} دقیقه`, hint: "۲ نفر بیش از ۳۰ دقیقه", icon: CalendarClock, tone: "danger" },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="kpi card">
              <div className="kpi-top">
                <span className="kpi-label">{k.label}</span>
                <span className="kpi-icon" style={{ color: k.tone === "mint" ? "#2FE0BE" : k.tone === "indigo" ? "#7C8CFF" : k.tone === "warn" ? "#F7B955" : "#FF6B81" }}>
                  <Icon size={15} />
                </span>
              </div>
              <div className="kpi-value">{k.value}</div>
              <div className="kpi-foot"><span className="small muted">{k.hint}</span></div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: 14, marginTop: 14 }}>
        <div className="card">
          <div className="card-hd">
            <h3>
              <Fingerprint size={15} /> حضور و کارکرد امروز
              <span className="ch-sub">۱۴۰۵/۰۸/۲۹</span>
            </h3>
            <button className="btn btn-ghost btn-xs" onClick={() => navigate("/hr/attendance")}>
              ریز کارکرد <ChevronLeft size={12} />
            </button>
          </div>
          <div className="card-bd flush">
            <table className="table">
              <thead>
                <tr><th>پرسنل</th><th>ورود</th><th>خروج</th><th>کارکرد</th><th>اضافه‌کاری</th><th>وضعیت</th></tr>
              </thead>
              <tbody>
                {attendanceToday.map((a) => (
                  <tr key={a.empId} className="clickable" onClick={() => navigate("/hr/attendance")}>
                    <td className="t-strong">{empName(a.empId)}<div className="small muted">{employees.find((e) => e.id === a.empId)?.role}</div></td>
                    <td className="t-num">{a.in}</td>
                    <td className="t-num">{a.out}</td>
                    <td className="t-num">{a.worked}</td>
                    <td className="t-num">{a.overtime}</td>
                    <td><Badge tone={toneOf(a.status)}>{a.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card">
            <div className="card-hd">
              <h3><Wifi size={15} /> دستگاه ساعت‌زنی</h3>
              <Badge tone="success">{timeclock.connection}</Badge>
            </div>
            <div className="card-bd">
              <div className="mg-mini-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <div className="mg-mini"><span className="small muted">دستگاه</span><b>{timeclock.device}</b></div>
                <div className="mg-mini"><span className="small muted">رکورد امروز</span><b>{faNum(timeclock.recordsToday)}</b></div>
                <div className="mg-mini"><span className="small muted">آخرین همگام‌سازی</span><b>{timeclock.lastSync}</b></div>
                <div className="mg-mini"><span className="small muted">تردد ناقص</span><b className="warn">{faNum(timeclock.unmatched)}</b></div>
              </div>
              <button className="btn btn-sm btn-block" style={{ marginTop: 10 }} onClick={() => navigate("/hr/attendance")}>
                مشاهده ریز تردد
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-hd">
              <h3><AlertTriangle size={15} /> هشدارهای منابع انسانی</h3>
            </div>
            <div className="card-bd" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {hrAlerts.map((a) => (
                <button key={a.title} className={`mg-alert ${a.tone}`} onClick={() => navigate(a.href)} style={{ textAlign: "right" }}>
                  <span className="mg-alert-dot" />
                  <span className="grow"><b>{a.title}</b><span className="small muted">{a.body}</span></span>
                  <ChevronLeft size={13} className="muted" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr", gap: 14, marginTop: 14 }}>
        <div className="card">
          <div className="card-hd"><h3>ترکیب سازمان</h3><span className="ch-sub">نفر</span></div>
          <div className="card-bd">
            <HBarChart data={departments.map((d) => ({ label: d.name, value: d.headcount, color: d.color }))} />
          </div>
        </div>
        <div className="card">
          <div className="card-hd"><h3>حضور هفته</h3><span className="ch-sub">حاضر / غایب</span></div>
          <div className="card-bd" style={{ paddingTop: 6 }}>
            <AreaChart
              data={attendanceTrend.map((d) => ({ label: d.label, values: [d.values[0], d.values[1]] }))}
              series={[{ name: "حاضر", color: "#2FE0BE", key: 0 }, { name: "غایب/مرخصی", color: "#F7B955", key: 1 }]}
              height={172}
              yFormat={(n) => faNum(n)}
              legend={false}
            />
          </div>
        </div>
        <div className="card">
          <div className="card-hd"><h3>مانده مرخصی</h3><span className="ch-sub">روز</span></div>
          <div className="card-bd" style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {leaveBalances.slice(0, 5).map((l) => (
              <div key={l.empId} className="mg-oblig-row">
                <span className="small">{empName(l.empId)}</span>
                <span className="small muted">{faNum(l.used)} از {faNum(l.entitled)}</span>
                <b className="small">{faNum(l.remaining)}</b>
              </div>
            ))}
            <button className="btn btn-ghost btn-xs" onClick={() => navigate("/hr/leaves")}>
              همه مانده‌ها <ChevronLeft size={12} />
            </button>
          </div>
        </div>
      </div>

      <div className="mg-foot-note">
        <Fingerprint size={13} />
        ریز کارکرد از {timeclock.device} روی {timeclock.ip} خوانده می‌شود؛ مغایرت‌ها ({faNum(timeclock.unmatched)} مورد) در صف بررسی است.
        {' '}نرخ حضور امروز {pct((present / employees.length) * 100, 0)} است.
      </div>
    </div>
  );
}
