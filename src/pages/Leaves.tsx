import { useState } from "react";
import { CalendarClock, Check, X, Plus, Plane, Hourglass, ClipboardCheck } from "lucide-react";
import { Badge, Tabs, useToast } from "../components/ui";
import { faNum } from "../lib/format";
import { employees, leaves, leaveBalances } from "../lib/hr";

const emp = (id: number) => employees.find((e) => e.id === id);

export default function Leaves() {
  const [tab, setTab] = useState<"req" | "bal">("req");
  const toast = useToast();
  const pending = leaves.filter((l) => l.status === "در انتظار").length;

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="ph-title">
            <h1>مرخصی و ماموریت</h1>
            <Badge tone={pending ? "warn" : "mint"}>{faNum(pending)} در انتظار تأیید</Badge>
          </div>
          <p>درخواست روزانه و ساعتی، ماموریت، مانده استحقاقی و گردش تأیید</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-sm btn-primary" onClick={() => toast("درخواست جدید", "فرم ثبت مرخصی/ماموریت باز شد.", "info")}>
            <Plus size={13} /> درخواست جدید
          </button>
        </div>
      </div>

      <div className="kpi-grid">
        {[
          { label: "در انتظار تأیید", value: `${faNum(pending)} درخواست`, icon: Hourglass, c: "#F7B955" },
          { label: "مرخصی استفاده‌شده — آبان", value: `${faNum(leaves.filter((l) => l.status === "تأییدشده" && l.kind !== "ماموریت").length + 18)} روز`, icon: CalendarClock, c: "#7C8CFF" },
          { label: "ماموریت فعال", value: `${faNum(leaves.filter((l) => l.kind === "ماموریت" && l.status === "تأییدشده").length)} مورد`, icon: Plane, c: "#2FE0BE" },
          { label: "مانده استحقاقی کل", value: `${faNum(leaveBalances.reduce((s, l) => s + l.remaining, 0))} روز`, icon: ClipboardCheck, c: "#7BE495" },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="kpi card">
              <div className="kpi-top"><span className="kpi-label">{k.label}</span><span className="kpi-icon" style={{ color: k.c }}><Icon size={15} /></span></div>
              <div className="kpi-value">{k.value}</div>
            </div>
          );
        })}
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <div className="card-hd">
          <h3><CalendarClock size={15} /> {tab === "req" ? "درخواست‌ها" : "مانده مرخصی"}</h3>
          <Tabs tabs={[{ id: "req", label: "درخواست‌ها", count: leaves.length }, { id: "bal", label: "مانده‌ها", count: leaveBalances.length }]} active={tab} onChange={setTab} />
        </div>
        <div className="card-bd flush">
          {tab === "req" ? (
            <table className="table">
              <thead><tr><th>شماره</th><th>پرسنل</th><th>نوع</th><th>از</th><th>تا</th><th>مدت</th><th>علت</th><th>وضعیت</th><th /></tr></thead>
              <tbody>
                {leaves.map((l) => (
                  <tr key={l.id}>
                    <td className="t-num t-muted">{l.id}</td>
                    <td className="t-strong">{emp(l.empId)?.name}<div className="small muted">{emp(l.empId)?.dept}</div></td>
                    <td><span className={`chip small ${l.kind === "ساعتی" ? "chip-mint" : ""}`}>{l.kind}</span></td>
                    <td className="t-muted">{l.from}</td>
                    <td className="t-muted">{l.to}</td>
                    <td className="t-num">{l.amount}</td>
                    <td className="t-muted small">{l.reason}</td>
                    <td><Badge tone={l.status === "تأییدشده" ? "success" : l.status === "در انتظار" ? "warn" : "danger"}>{l.status}</Badge></td>
                    <td>
                      {l.status === "در انتظار" ? (
                        <div className="row" style={{ gap: 4 }}>
                          <button className="icon-btn" aria-label="تأیید" onClick={() => toast("تأیید شد", `${l.id} تأیید و به کارکرد منتقل شد.`, "success")}><Check size={13} /></button>
                          <button className="icon-btn" aria-label="رد" onClick={() => toast("رد شد", `${l.id} رد شد.`, "error")}><X size={13} /></button>
                        </div>
                      ) : (
                        <span className="small muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="table">
              <thead><tr><th>پرسنل</th><th>استحقاقی سالانه</th><th>استفاده‌شده</th><th>مانده</th><th>نسبت مصرف</th></tr></thead>
              <tbody>
                {leaveBalances.map((b) => {
                  const used = Math.round((b.used / b.entitled) * 100);
                  return (
                    <tr key={b.empId}>
                      <td className="t-strong">{emp(b.empId)?.name}<div className="small muted">{emp(b.empId)?.role}</div></td>
                      <td className="t-num">{faNum(b.entitled)} روز</td>
                      <td className="t-num">{faNum(b.used)} روز</td>
                      <td className="t-num">{faNum(b.remaining)} روز</td>
                      <td>
                        <div className="mg-stock">
                          <div className="mg-stock-track" style={{ width: 90 }}>
                            <i style={{ width: `${used}%`, background: used > 80 ? "#FF6B81" : used > 60 ? "#F7B955" : "#2FE0BE" }} />
                          </div>
                          <span className="small muted">{faNum(used)}٪</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
