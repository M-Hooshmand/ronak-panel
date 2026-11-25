import { useState } from "react";
import { Fingerprint, Wifi, RefreshCw, Upload, Download, Clock3, TriangleAlert, Settings2, Check } from "lucide-react";
import { Badge, Tabs, useToast } from "../components/ui";
import { faNum } from "../lib/format";
import { employees, attendanceToday, monthSummary, timeclock, type AttStatus } from "../lib/hr";

const emp = (id: number) => employees.find((e) => e.id === id);
const tone = (s: AttStatus) => (s === "حاضر" ? "success" : s === "تأخیر" ? "warn" : s === "مرخصی" ? "indigo" : s === "ماموریت" ? "mint" : "danger") as "success" | "warn" | "indigo" | "mint" | "danger";

export default function Attendance() {
  const [tab, setTab] = useState<"today" | "month">("today");
  const toast = useToast();
  const ot = monthSummary.reduce((s, m) => s + m.overtime, 0);
  const delay = monthSummary.reduce((s, m) => s + m.delay, 0);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="ph-title">
            <h1>حضور و کارکرد</h1>
            <Badge tone={timeclock.connection === "متصل" ? "success" : "danger"}>{timeclock.device} · {timeclock.connection}</Badge>
          </div>
          <p>ریز ساعت ورود و خروج، کارکرد مؤثر، اضافه‌کاری، تأخیر و مرخصی — دریافت‌شده از دستگاه ساعت‌زنی</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-sm" onClick={() => toast("همگام‌سازی", "۸۴ رکورد جدید از دستگاه خوانده شد.", "success")}>
            <RefreshCw size={13} /> همگام‌سازی
          </button>
          <button className="btn btn-sm" onClick={() => toast("ورود دستی", "فرم ثبت تردد دستی باز شد.", "info")}>
            <Upload size={13} /> ثبت دستی
          </button>
          <button className="btn btn-sm" onClick={() => toast("خروجی اکسل", "ریز کارکرد اسفند آماده دانلود شد.", "success")}>
            <Download size={13} /> خروجی
          </button>
        </div>
      </div>

      <div className="kpi-grid">
        {[
          { label: "حاضر امروز", value: `${faNum(attendanceToday.filter((a) => a.status === "حاضر" || a.status === "تأخیر").length)} نفر`, hint: "بدون داده حضور", icon: Fingerprint, c: "#2FE0BE" },
          { label: "اضافه‌کاری اسفند", value: `${faNum(Math.round(ot))} ساعت`, hint: "جمع کل پرسنل", icon: Clock3, c: "#7C8CFF" },
          { label: "تأخیر اسفند", value: `${faNum(delay)} دقیقه`, hint: "بدون داده حضور", icon: TriangleAlert, c: "#F7B955" },
          { label: "تردد ناقص", value: `${faNum(timeclock.unmatched)} رکورد`, hint: "بدون ثبت خروج", icon: Wifi, c: "#FF6B81" },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="kpi card">
              <div className="kpi-top"><span className="kpi-label">{k.label}</span><span className="kpi-icon" style={{ color: k.c }}><Icon size={15} /></span></div>
              <div className="kpi-value">{k.value}</div>
              <div className="kpi-foot"><span className="small muted">{k.hint}</span></div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 14, marginTop: 14 }}>
        <div className="card">
          <div className="card-hd">
            <h3><Fingerprint size={15} /> {tab === "today" ? "ریز تردد امروز" : "خلاصه کارکرد اسفند"}</h3>
            <Tabs tabs={[{ id: "today", label: "امروز" }, { id: "month", label: "خلاصه ماه" }]} active={tab} onChange={setTab} />
          </div>
          <div className="card-bd flush">
            {tab === "today" ? (
              <table className="table">
                <thead><tr><th>پرسنل</th><th>ورود</th><th>خروج</th><th>کارکرد مؤثر</th><th>اضافه‌کاری</th><th>تأخیر</th><th>مرخصی</th><th>وضعیت</th></tr></thead>
                <tbody>
                  {attendanceToday.map((a) => (
                    <tr key={a.empId}>
                      <td className="t-strong">{emp(a.empId)?.name}<div className="small muted">{emp(a.empId)?.role}</div></td>
                      <td className="t-num">{a.in}</td>
                      <td className="t-num">{a.out}</td>
                      <td className="t-num">{a.worked}</td>
                      <td className="t-num">{a.overtime}</td>
                      <td className={`t-num ${a.delay > 10 ? "warn" : ""}`}>{a.delay ? `${faNum(a.delay)} دقیقه` : "—"}</td>
                      <td className="t-muted small">{a.leave}</td>
                      <td><Badge tone={tone(a.status)}>{a.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="table">
                <thead><tr><th>پرسنل</th><th>روز کارکرد</th><th>اضافه‌کاری</th><th>تأخیر</th><th>مرخصی</th><th>ماموریت</th></tr></thead>
                <tbody>
                  {monthSummary.map((m) => (
                    <tr key={m.empId}>
                      <td className="t-strong">{emp(m.empId)?.name}<div className="small muted">{emp(m.empId)?.dept}</div></td>
                      <td className="t-num">{faNum(m.days)}</td>
                      <td className="t-num">{faNum(m.overtime, 1)} ساعت</td>
                      <td className={`t-num ${m.delay > 20 ? "warn" : ""}`}>{faNum(m.delay)} دقیقه</td>
                      <td className="t-num">{faNum(m.leave)} روز</td>
                      <td className="t-num">{faNum(m.mission)} روز</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card">
            <div className="card-hd"><h3><Wifi size={15} /> اتصال دستگاه</h3><Badge tone="success">آنلاین</Badge></div>
            <div className="card-bd" style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {[
                ["دستگاه", timeclock.device],
                ["آی‌پی", timeclock.ip],
                ["پل ارتباطی", timeclock.bridge],
                ["آخرین همگام‌سازی", timeclock.lastSync],
                ["رکورد امروز", `${faNum(timeclock.recordsToday)} رکورد`],
              ].map(([k, v]) => (
                <div key={k} className="row-between">
                  <span className="small muted">{k}</span>
                  <span className="small" style={{ direction: k === "آی‌پی" ? "ltr" : undefined }}>{v}</span>
                </div>
              ))}
              <button className="btn btn-sm btn-block" onClick={() => toast("تنظیمات دستگاه", "تنظیمات اتصال دستگاه ساعت‌زنی باز شد.", "info")}>
                <Settings2 size={13} /> تنظیمات اتصال
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-hd"><h3><Check size={15} /> قواعد محاسبه کارکرد</h3></div>
            <div className="card-bd" style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {[
                "شیفت پیش‌فرض: ۰۸:۰۰ تا ۱۶:۳۰ (۸ ساعت مؤثر)",
                "تأخیر از ۰۸:۰۵ به بعد محاسبه می‌شود",
                "اضافه‌کاری از ۱۶:۳۰ با ضریب ۱٫۴",
                "تعطیلات رسمی با ضریب ۱٫۶",
                "مرخصی ساعتی از مانده روزانه کسر می‌شود",
                "گردکردن کارکرد: نزدیک‌ترین ۵ دقیقه",
              ].map((r) => (
                <div key={r} className="small" style={{ display: "flex", gap: 8 }}>
                  <span className="mint">•</span>{r}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mg-foot-note">
        <Upload size={13} />
        رکوردهای خام دستگاه در جدول `hr_punch` ذخیره می‌شوند و پس از تطبیق با شیفت و تقویم، به «کارکرد روزانه» تبدیل می‌شوند.
      </div>
    </div>
  );
}
