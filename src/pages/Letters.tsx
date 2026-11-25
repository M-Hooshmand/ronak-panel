import { useState } from "react";
import { FileText, Plus, Printer, Search, Stamp, Send, FileSignature } from "lucide-react";
import { Badge, Modal, useToast } from "../components/ui";
import { faNum } from "../lib/format";
import { BrandMark } from "../components/Brand";
import { employees, hrLetters, type HrLetter } from "../lib/hr";

const kinds: HrLetter["kind"][] = ["ابلاغ", "گواهی اشتغال", "اخطار", "تقدیر", "حکم", "بازگشت به کار"];

const templates: Record<string, string> = {
  ابلاغ: "بدین‌وسیله به اطلاع می‌رساند، جنابعالی از تاریخ ابلاغ به سمت مورد نظر منصوب می‌شوید. انتظار می‌رود با رعایت مقررات و همکاری مؤثر، وظایف محوله را به نحو احسن انجام دهید.",
  "گواهی اشتغال": "بدین‌وسیله گواهی می‌شود نامبرده در این شرکت مشغول به کار بوده و از این بابت بدهی یا تعهدی به شرکت ندارد. این گواهی بنا به درخواست ایشان و جهت ارائه به مراجع مربوطه صادر شده است.",
  اخطار: "با توجه به بررسی سوابق حضور و عملکرد، به دلیل عدم رعایت آیین‌نامه داخلی، این اخطار کتبی صادر می‌گردد. خواهشمند است از تاریخ ابلاغ، موارد را اصلاح و نتیجه را به واحد منابع انسانی اعلام نمایید.",
  تقدیر: "بدین‌وسیله از تلاش و عملکرد شایسته جنابعالی در انجام وظایف محوله و ارتقای بهره‌وری سازمان قدردانی می‌شود. امید است این روند در آینده نیز ادامه یابد.",
  حکم: "با توجه به مصوبه هیئت‌مدیره، حقوق و مزایای جنابعالی از تاریخ مقرر به شرح پیوست اصلاح و در فیش حقوقی اعمال می‌گردد.",
  "بازگشت به کار": "با توجه به پایان دوره مرخصی و تأیید پزشک معتمد، بازگشت جنابعالی به کار از تاریخ درج‌شده در این نامه بلامانع است.",
};

export default function Letters() {
  const [rows, setRows] = useState<HrLetter[]>(hrLetters);
  const emptyLetter: HrLetter = { id: "", no: "—", date: "—", kind: "ابلاغ", empId: 0, subject: "—", size: "A4", status: "پیش‌نویس" };
  const [sel, setSel] = useState<HrLetter>(hrLetters[0] ?? emptyLetter);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [form, setForm] = useState({ kind: "ابلاغ" as HrLetter["kind"], empId: 1, subject: "", size: "A4" as "A4" | "A5" });
  const toast = useToast();
  const emp = employees.find((e) => e.id === sel.empId);

  const printLetter = () => {
    const st = document.createElement("style");
    st.textContent = sel.size === "A5" ? "@page{size:148mm 210mm;margin:0}" : "@page{size:A4;margin:0}";
    document.head.appendChild(st);
    window.print();
    window.setTimeout(() => st.remove(), 1500);
  };

  const create = () => {
    const n: HrLetter = {
      id: `L-${600 + rows.length}`,
      no: `۱۴۰۵/${300 + rows.length}`,
      date: "۱۴۰۴/۱۲/۲۹",
      kind: form.kind,
      empId: form.empId,
      subject: form.subject || `نامه ${form.kind}`,
      size: form.size,
      status: "پیش‌نویس",
    };
    setRows([n, ...rows]);
    setSel(n);
    setOpen(false);
    setForm({ kind: "ابلاغ", empId: 1, subject: "", size: "A4" });
    toast("نامه ایجاد شد", `${n.no} در وضعیت پیش‌نویس ثبت شد.`, "success");
  };

  const filtered = rows.filter((r) => q === "" || `${r.subject} ${r.no} ${employees.find((e) => e.id === r.empId)?.name}`.includes(q));

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="ph-title">
            <h1>نامه‌ها و مکاتبات</h1>
            <Badge tone="mint" dot={false}>قالب A4 و A5 · آماده چاپ</Badge>
          </div>
          <p>ابلاغ، حکم، گواهی اشتغال، اخطار و تقدیر — با شماره و تاریخ و سربرگ رسمی</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-sm" onClick={printLetter}><Printer size={13} /> چاپ نامه انتخابی</button>
          <button className="btn btn-sm btn-primary" onClick={() => setOpen(true)}><Plus size={13} /> نامه جدید</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 14 }}>
        <div className="card">
          <div className="card-hd">
            <h3><FileText size={15} /> فهرست نامه‌ها <span className="ch-sub">{faNum(rows.length)} سند</span></h3>
            <div className="input-icon" style={{ width: 220 }}>
              <Search size={13} />
              <input className="input input-sm" placeholder="جستجو…" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
          </div>
          <div className="card-bd flush">
            <table className="table">
              <thead><tr><th>شماره</th><th>نوع</th><th>گیرنده</th><th>اندازه</th><th>وضعیت</th></tr></thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="clickable" onClick={() => setSel(r)} style={sel.id === r.id ? { background: "rgba(47,224,190,.06)" } : undefined}>
                    <td className="t-num">{r.no}<div className="small muted">{r.date}</div></td>
                    <td><span className="chip small">{r.kind}</span></td>
                    <td className="t-strong">{employees.find((e) => e.id === r.empId)?.name}</td>
                    <td><Badge tone={r.size === "A4" ? "indigo" : "mint"} dot={false}>{r.size}</Badge></td>
                    <td><Badge tone={r.status === "ثبت‌شده" ? "success" : r.status === "ارسال‌شده" ? "mint" : "warn"}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card-bd" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="small muted" style={{ marginBottom: 8 }}>قالب‌های آماده</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {kinds.map((k) => (
                <button key={k} className="chip small" style={{ cursor: "pointer" }} onClick={() => { setForm({ ...form, kind: k, subject: `نامه ${k}` }); setOpen(true); }}>
                  <FileSignature size={11} /> {k}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-hd">
            <h3><Stamp size={15} /> پیش‌نمایش چاپ</h3>
            <div className="row" style={{ gap: 6 }}>
              <span className="chip small">{sel.size}</span>
              <button className="btn btn-ghost btn-xs" onClick={printLetter}><Printer size={12} /> چاپ</button>
            </div>
          </div>
          <div className="card-bd" style={{ overflow: "hidden" }}>
            <div className="letter-wrap">
              <div className={`letter-sheet ${sel.size === "A4" ? "a4" : "a5"}`}>
                <div className="ls-head">
                  <div className="ls-brand">
                    <BrandMark size={34} />
                    <div>
                      <b>شرکت پخش آرمان</b>
                      <span>سیستم یکپارچه مدیریت روناک</span>
                    </div>
                  </div>
                  <div className="ls-meta">
                    <div>شماره: {sel.no}</div>
                    <div>تاریخ: {sel.date}</div>
                    <div>پیوست: —</div>
                  </div>
                </div>
                <div className="ls-title">{sel.kind === "گواهی اشتغال" ? "گواهی اشتغال به کار" : `نامه ${sel.kind}`}</div>
                <div className="ls-to">جناب آقای / سرکار خانم <b>{emp?.name ?? "—"}</b><br /><span>{emp ? `${emp.role} — واحد ${emp.dept}` : "بدون پرونده پرسنلی"}</span></div>
                <p className="ls-body">{templates[sel.kind]}</p>
                <p className="ls-body">موضوع: {sel.subject}</p>
                <div className="ls-sign">
                  <div>با احترام</div>
                  <div className="ls-sign-box">مدیر منابع انسانی</div>
                </div>
                <div className="ls-foot">
                  تهران، خیابان ولیعصر، پلاک ۱۲ — تلفن: ۰۲۱-۵۶۱۳۸۴۶۱ — www.arman.co
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="نامه جدید"
        subtitle="قالب، گیرنده و اندازه کاغذ را انتخاب کنید"
        footer={
          <div className="row" style={{ gap: 8 }}>
            <button className="btn btn-sm" onClick={() => setOpen(false)}>انصراف</button>
            <button className="btn btn-sm btn-primary" onClick={create}><Send size={13} /> ثبت پیش‌نویس</button>
          </div>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="field">
            <label>نوع نامه</label>
            <select className="input" value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as HrLetter["kind"], subject: `نامه ${e.target.value}` })}>
              {kinds.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <div className="field">
            <label>گیرنده</label>
            <select className="input" value={form.empId} onChange={(e) => setForm({ ...form, empId: Number(e.target.value) })}>
              {employees.map((e) => <option key={e.id} value={e.id}>{e.name} — {e.role}</option>)}
            </select>
          </div>
          <div className="field">
            <label>موضوع</label>
            <input className="input" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="مثلاً گواهی اشتغال جهت ارائه به بانک" />
          </div>
          <div className="field">
            <label>اندازه کاغذ</label>
            <div className="row" style={{ gap: 8 }}>
              {(["A4", "A5"] as const).map((s) => (
                <button key={s} className={`btn btn-sm ${form.size === s ? "btn-primary" : ""}`} onClick={() => setForm({ ...form, size: s })}>{s}</button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
