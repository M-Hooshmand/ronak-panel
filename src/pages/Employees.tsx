import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Search, Plus, ChevronLeft, FileText, BadgeCheck, Phone, IdCard, CalendarDays, Wallet } from "lucide-react";
import { Badge, Drawer, useToast } from "../components/ui";
import { faNum, shortNum } from "../lib/format";
import { employees, departments, monthSummary, type Dept } from "../lib/hr";

export default function Employees() {
  const [q, setQ] = useState("");
  const [dept, setDept] = useState<Dept | "همه">("همه");
  const [openId, setOpenId] = useState<number | null>(null);
  const toast = useToast();
  const navigate = useNavigate();

  const rows = useMemo(
    () =>
      employees.filter(
        (e) =>
          (dept === "همه" || e.dept === dept) &&
          (q.trim() === "" || `${e.name} ${e.role} ${e.code}`.includes(q.trim())),
      ),
    [q, dept],
  );
  const sel = employees.find((e) => e.id === openId) ?? null;
  const ms = monthSummary.find((m) => m.empId === openId);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="ph-title">
            <h1>پرسنل</h1>
            <Badge tone="mint" dot={false}>{faNum(employees.length)} پرونده فعال</Badge>
          </div>
          <p>پرونده پرسنلی، قرارداد، سابقه کارکرد و مکاتبات هر نفر</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-sm btn-primary" onClick={() => toast("پرسنل جدید", "فرم استخدام باز شد؛ اطلاعات هویتی و قرارداد را تکمیل کنید.", "info")}>
            <Plus size={13} /> استخدام جدید
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-hd">
          <h3><Users size={15} /> فهرست پرسنل</h3>
          <div className="hd-actions">
            <div className="input-icon" style={{ width: 230 }}>
              <Search size={13} />
              <input className="input input-sm" placeholder="جستجوی نام یا کد پرسنلی…" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <select className="input input-sm" style={{ width: 150 }} value={dept} onChange={(e) => setDept(e.target.value as Dept | "همه")}>
              <option value="همه">همه واحدها</option>
              {departments.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
            </select>
          </div>
        </div>
        <div className="card-bd flush">
          <table className="table">
            <thead>
              <tr><th>کد</th><th>پرسنل</th><th>واحد</th><th>نوع قرارداد</th><th>شروع همکاری</th><th>حقوق پایه</th><th>وضعیت</th><th /></tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e.id} className="clickable" onClick={() => setOpenId(e.id)}>
                  <td className="t-num t-muted">{e.code}</td>
                  <td className="t-strong">{e.name}<div className="small muted">{e.role}</div></td>
                  <td>{e.dept}</td>
                  <td className="t-muted">{e.contract}</td>
                  <td className="t-muted">{e.join}</td>
                  <td className="t-num">{faNum(e.base)}</td>
                  <td><Badge tone={e.status === "فعال" ? "success" : e.status === "مرخصی" ? "indigo" : "warn"}>{e.status}</Badge></td>
                  <td><button className="btn btn-ghost btn-xs">پرونده <ChevronLeft size={12} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Drawer
        open={!!sel}
        onClose={() => setOpenId(null)}
        width={520}
        title={sel ? `${sel.name} — ${sel.role}` : ""}
        subtitle={sel ? `${sel.code} · ${sel.dept} · ${sel.contract}` : ""}
        footer={
          sel && (
            <div className="row" style={{ gap: 8, width: "100%" }}>
              <button className="btn btn-sm" onClick={() => navigate("/hr/letters")}><FileText size={13} /> صدور نامه</button>
              <button className="btn btn-sm" onClick={() => navigate("/hr/attendance")}><CalendarDays size={13} /> ریز کارکرد</button>
              <button className="btn btn-sm btn-primary" onClick={() => toast("ذخیره شد", "تغییرات پرونده ثبت شد.", "success")}><BadgeCheck size={13} /> ذخیره</button>
            </div>
          )
        }
      >
        {sel && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="mg-mini-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div className="mg-mini"><span className="small muted"><Phone size={11} /> موبایل</span><b dir="ltr" style={{ textAlign: "right" }}>{sel.mobile}</b></div>
              <div className="mg-mini"><span className="small muted"><IdCard size={11} /> کد ملی</span><b>{sel.nid}</b></div>
              <div className="mg-mini"><span className="small muted"><Wallet size={11} /> حقوق پایه</span><b>{shortNum(sel.base)} تومان</b></div>
              <div className="mg-mini"><span className="small muted"><CalendarDays size={11} /> پایان قرارداد</span><b>{sel.contractEnd}</b></div>
            </div>

            <div className="card" style={{ background: "rgba(255,255,255,.02)" }}>
              <div className="card-hd"><h3>ریز کارکرد اسفند</h3></div>
              <div className="card-bd">
                <div className="mg-bars">
                  {[
                    { label: "روز کارکرد", value: ms?.days ?? 0, max: 22, color: "#2FE0BE", text: `${faNum(ms?.days ?? 0)} روز` },
                    { label: "اضافه‌کاری", value: ms?.overtime ?? 0, max: 40, color: "#7C8CFF", text: `${faNum(ms?.overtime ?? 0, 1)} ساعت` },
                    { label: "تأخیر", value: ms?.delay ?? 0, max: 60, color: "#F7B955", text: `${faNum(ms?.delay ?? 0)} دقیقه` },
                    { label: "مرخصی", value: ms?.leave ?? 0, max: 20, color: "#FF6B81", text: `${faNum(ms?.leave ?? 0)} روز` },
                  ].map((b) => (
                    <div key={b.label} className="mg-bar-row">
                      <span className="small">{b.label}</span>
                      <div className="mg-bar-track"><i style={{ width: `${Math.min(100, (b.value / b.max) * 100)}%`, background: b.color }} /></div>
                      <b className="num small">{b.text}</b>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="small muted" style={{ marginBottom: 6 }}>مدارک پرونده</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["شناسنامه", "کارت ملی", "قرارداد", "مدرک تحصیلی", "گواهی عدم سوءپیشینه"].map((d) => (
                  <span key={d} className="chip small">{d}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
