import { useMemo, useState } from "react";
import {
  ShieldCheck,
  RefreshCw,
  SlidersHorizontal,
  Copy,
  Hash,
  Scale,
  FileWarning,
  CalendarX,
  Search,
  Wrench,
  Check,
  EyeOff,
  ArrowUpRight,
  CircleAlert,
  Sparkles,
  TrendingDown,
  ListChecks,
  Plus,
  FileSearch,
} from "lucide-react";
import { Badge, Empty, Modal, Switch, useToast, type Tone } from "../components/ui";
import { Gauge } from "../components/charts";
import { qualityIssues, qualityRules, type QualityIssue, type IssueCategory, type Severity, type IssueStatus } from "../lib/data";
import { faNum, pct, toFaDigits } from "../lib/format";

const severityMeta: Record<Severity, { label: string; tone: Tone }> = {
  high: { label: "بحرانی", tone: "danger" },
  medium: { label: "متوسط", tone: "warn" },
  low: { label: "کم", tone: "muted" },
};

const statusMeta: Record<IssueStatus, { label: string; tone: Tone }> = {
  open: { label: "باز", tone: "danger" },
  fixed: { label: "اصلاح‌شده", tone: "success" },
  ignored: { label: "نادیده گرفته", tone: "muted" },
};

const categoryMeta: Record<IssueCategory, { icon: typeof Copy; color: string }> = {
  "رکورد تکراری": { icon: Copy, color: "#7C8CFF" },
  "کد حساب نامعتبر": { icon: Hash, color: "#FF6B81" },
  "مغایرت جمع": { icon: Scale, color: "#F7B955" },
  "فیلد خالی": { icon: FileWarning, color: "#2FE0BE" },
  "تاریخ نامعتبر": { icon: CalendarX, color: "#C08CFF" },
};

const sevOrder: Severity[] = ["high", "medium", "low"];

export default function Quality() {
  const toast = useToast();
  const [issues, setIssues] = useState<QualityIssue[]>(qualityIssues);
  const [rules, setRules] = useState(qualityRules);
  const [score, setScore] = useState(87.6);
  const [q, setQ] = useState("");
  const [sev, setSev] = useState<"all" | Severity>("all");
  const [cat, setCat] = useState("all");
  const [status, setStatus] = useState("open");
  const [fixing, setFixing] = useState<QualityIssue | null>(null);
  const [scanning, setScanning] = useState(false);
  const [fixRun, setFixRun] = useState<"idle" | "running" | "done">("idle");

  const openIssues = issues.filter((i) => i.status === "open");

  const catStats = useMemo(() => {
    return (Object.keys(categoryMeta) as IssueCategory[]).map((c) => {
      const items = issues.filter((i) => i.category === c);
      const open = items.filter((i) => i.status === "open");
      return {
        category: c,
        count: open.reduce((s, i) => s + i.records, 0),
        cases: open.length,
        total: items.length,
        color: categoryMeta[c].color,
      };
    });
  }, [issues]);

  const maxCat = Math.max(...catStats.map((c) => c.count), 1);

  const filtered = useMemo(() => {
    return issues.filter((i) => {
      const hay = `${i.id} ${i.title} ${i.detail} ${i.company} ${i.pipeline}`;
      return (
        (!q || hay.includes(q)) &&
        (sev === "all" || i.severity === sev) &&
        (cat === "all" || i.category === cat) &&
        (status === "all" || i.status === status)
      );
    });
  }, [issues, q, sev, cat, status]);

  const runScan = () => {
    setScanning(true);
    window.setTimeout(() => {
      setScanning(false);
      toast("اسکن کیفیت کامل شد", "۳۵٬۲۴۰ رکورد بررسی شد؛ ۳ مورد جدید شناسایی شد.", "success");
      setScore((s) => Math.min(100, s + 0.2));
    }, 1700);
  };

  const applyFix = () => {
    if (!fixing) return;
    setFixRun("running");
    window.setTimeout(() => {
      setIssues((prev) => prev.map((i) => (i.id === fixing.id ? { ...i, status: "fixed" } : i)));
      setScore((s) => Math.min(100, s + 0.4));
      setFixRun("done");
      window.setTimeout(() => {
        setFixing(null);
        setFixRun("idle");
        toast("مشکل اصلاح شد", `${fixing.id} با موفقیت برطرف شد و امتیاز کیفیت به‌روزرسانی گردید.`, "success");
      }, 900);
    }, 1300);
  };

  const ignoreIssue = () => {
    if (!fixing) return;
    setIssues((prev) => prev.map((i) => (i.id === fixing.id ? { ...i, status: "ignored" } : i)));
    setFixing(null);
    toast("مورد نادیده گرفته شد", "این مورد از شمارش موارد باز خارج شد.", "info");
  };

  return (
    <>
      <div className="page-head">
        <div>
          <div className="ph-title">
            <h1>کیفیت داده</h1>
            <Badge tone="warn" dot={false}>{toFaDigits(openIssues.length)} مورد باز</Badge>
          </div>
          <p>پایش پیوسته صحت، یکپارچگی و کامل بودن داده‌های مالی پیش از ثبت سند</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-sm" onClick={() => toast("قواعد کیفیت", "۸ قاعده فعال روی همه جریان‌ها اعمال می‌شود.", "info")}>
            <SlidersHorizontal size={13} /> مدیریت قواعد
          </button>
          <button className="btn btn-primary btn-sm" onClick={runScan} disabled={scanning}>
            <RefreshCw size={13} className={scanning ? "spin" : ""} /> {scanning ? "در حال اسکن…" : "اسکن مجدد"}
          </button>
        </div>
      </div>

      <div className="quality-top">
        <div className="card score-card">
          <div className="card-hd">
            <h3><ShieldCheck size={15} /> امتیاز کیفیت داده</h3>
            <Badge tone="success" dot={false} icon={<ArrowUpRight size={10} />}>۲٫۴+</Badge>
          </div>
          <div className="card-bd" style={{ paddingTop: 8 }}>
            <Gauge value={score} size={224} />
            <div className="score-caption">
              <b>وضعیت: خوب</b>
              <span>۲٫۴ امتیاز بهتر از هفته گذشته</span>
            </div>
            <div className="score-stats">
              <div><span>رکورد معتبر</span><b>{pct(97.3)}</b></div>
              <div><span>موارد رفع‌شده (این هفته)</span><b className="mint">{faNum(42)}</b></div>
              <div><span>میانگین زمان رفع</span><b>۲٫۴ ساعت</b></div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-hd">
            <h3><ListChecks size={15} /> دسته‌بندی مشکلات</h3>
            <span className="small muted-2">بر اساس رکوردهای تحت تأثیر</span>
          </div>
          <div className="card-bd" style={{ padding: "8px 14px 14px" }}>
            {catStats.map((c) => {
              const Icon = categoryMeta[c.category].icon;
              return (
                <button className="cat-row" key={c.category} onClick={() => { setCat(c.category); setStatus("open"); }}>
                  <span className="cat-ic" style={{ color: c.color, background: `${c.color}14`, borderColor: `${c.color}2e` }}>
                    <Icon size={14} />
                  </span>
                  <div className="cat-main">
                    <div className="row-between">
                      <span className="cat-name">{c.category}</span>
                      <span className="cat-count num">{faNum(c.count)} <small>رکورد</small></span>
                    </div>
                    <div className="cat-bar">
                      <span style={{ width: `${(c.count / maxCat) * 100}%`, background: c.color }} />
                    </div>
                    <div className="cat-sub">
                      <span>{faNum(c.cases)} مورد باز از {faNum(c.total)} مورد</span>
                      <span className="row" style={{ gap: 3, color: c.count > 100 ? "var(--danger)" : "var(--muted-2)" }}>
                        <TrendingDown size={10} /> {c.category === "رکورد تکراری" ? "۱۲٪ کاهش" : c.category === "فیلد خالی" ? "۴٪ افزایش" : "بدون تغییر"}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
            <div className="hl-box" style={{ marginTop: 12, display: "flex", gap: 9, alignItems: "center" }}>
              <Sparkles size={15} style={{ color: "var(--mint)", flex: "none" }} />
              <div className="small">
                <b style={{ display: "block", fontSize: 11.5 }}>پیشنهاد روناک</b>
                ۳۱۲ رکورد با «فیلد خالی» بیشترین تأثیر را دارند؛ می‌توانید قاعده پیش‌فرض را فعال کنید.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <div className="card-hd">
          <h3>
            <CircleAlert size={15} /> فهرست موارد کیفیت
            <span className="ch-sub">{faNum(filtered.length)} مورد</span>
          </h3>
          <div className="hd-actions">
            <span className="chip small"><FileSearch size={11} /> آخرین اسکن: ۱۲:۰۴</span>
          </div>
        </div>
        <div className="filter-bar">
          <div className="search-mini" style={{ position: "relative" }}>
            <Search size={13} style={{ position: "absolute", insetInlineStart: 9, top: 8, color: "var(--muted-2)" }} />
            <input className="input" placeholder="جستجوی شرح یا شناسه…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="pill-tabs">
            <button className={`pill-tab ${sev === "all" ? "on" : ""}`} onClick={() => setSev("all")}>
              همه شدت‌ها <span className="count">{toFaDigits(issues.length)}</span>
            </button>
            {sevOrder.map((s) => (
              <button key={s} className={`pill-tab ${sev === s ? "on" : ""}`} onClick={() => setSev(s)}>
                <span className={`dot ${s === "high" ? "danger" : s === "medium" ? "warn" : "off"}`} />
                {severityMeta[s].label} <span className="count">{toFaDigits(issues.filter((i) => i.severity === s).length)}</span>
              </button>
            ))}
          </div>
          <select className="select" value={cat} onChange={(e) => setCat(e.target.value)} aria-label="دسته">
            <option value="all">همه دسته‌ها</option>
            {Object.keys(categoryMeta).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="select" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="وضعیت">
            <option value="open">موارد باز</option>
            <option value="fixed">اصلاح‌شده</option>
            <option value="ignored">نادیده گرفته</option>
            <option value="all">همه</option>
          </select>
        </div>
        <div className="tbl-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>شناسه</th>
                <th>دسته</th>
                <th>شرح مشکل</th>
                <th>منبع</th>
                <th>رکورد</th>
                <th>شدت</th>
                <th className="col-time">زمان شناسایی</th>
                <th>وضعیت</th>
                <th>اقدام</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => {
                const sm = severityMeta[i.severity];
                const st = statusMeta[i.status];
                return (
                  <tr key={i.id}>
                    <td className="mono t-muted">{i.id}</td>
                    <td>
                      <span className="row" style={{ gap: 5 }}>
                        <span className="dot" style={{ background: categoryMeta[i.category].color }} />
                        {i.category}
                      </span>
                    </td>
                    <td>
                      <div className="t-strong" style={{ maxWidth: 330, overflow: "hidden", textOverflow: "ellipsis" }}>{i.title}</div>
                      <div className="t-sub" style={{ maxWidth: 330, overflow: "hidden", textOverflow: "ellipsis" }}>{i.detail}</div>
                    </td>
                    <td>
                      <div>{i.company.replace("شرکت ", "").replace("گروه صنعتی ", "")}</div>
                      <div className="t-sub">{i.pipeline}</div>
                    </td>
                    <td className="t-num">{faNum(i.records)}</td>
                    <td><Badge tone={sm.tone}>{sm.label}</Badge></td>
                    <td className="num t-muted small col-time">{i.detectedAt}</td>
                    <td><Badge tone={st.tone}>{st.label}</Badge></td>
                    <td>
                      {i.status === "open" ? (
                        <button className="btn btn-xs" onClick={() => { setFixing(i); setFixRun("idle"); }}>
                          <Wrench size={11} /> اصلاح
                        </button>
                      ) : (
                        <span className="small muted-2 row" style={{ gap: 3 }}><Check size={11} /> رسیدگی شد</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <Empty text="موردی با این فیلترها یافت نشد" />}
        </div>
        <div className="card-foot">
          <span>نمایش {toFaDigits(filtered.length)} از {toFaDigits(issues.length)} مورد</span>
          <span>امتیاز کیفیت با اصلاح هر مورد به‌روزرسانی می‌شود</span>
        </div>
      </div>

      <div className="section-title" style={{ marginTop: 20 }}>
        <h3 className="row"><ShieldCheck size={15} /> قواعد کیفیت داده</h3>
        <div className="row">
          <span className="small muted-2">{faNum(rules.filter((r) => r.active).length)} قاعده فعال از {faNum(rules.length)}</span>
          <button className="btn btn-xs" onClick={() => toast("قاعده جدید", "فرم ساخت قاعده در نسخه بعدی فعال می‌شود.", "info")}>
            <Plus size={11} /> قاعده جدید
          </button>
        </div>
      </div>
      <div className="rules-grid">
        {rules.map((r) => (
          <div className={`card rule-card ${r.active ? "" : "off"}`} key={r.id}>
            <div className="rule-hd">
              <div className="row">
                <span className={`dot ${r.active ? "live" : "off"}`} />
                <b>{r.name}</b>
              </div>
              <Switch on={r.active} onChange={(v) => {
                setRules((prev) => prev.map((x) => (x.id === r.id ? { ...x, active: v } : x)));
                toast(v ? "قاعده فعال شد" : "قاعده غیرفعال شد", r.name, v ? "success" : "info");
              }} small label={r.name} />
            </div>
            <div className="rule-body">
              <div className="rule-cat">
                <span className="small muted-2">{r.category}</span>
                <Badge tone={severityMeta[r.severity].tone}>{severityMeta[r.severity].label}</Badge>
              </div>
              <code className="rule-expr">{r.expression}</code>
              <div className="rule-foot">
                <span className="row"><CircleAlert size={11} /> {faNum(r.hits)} نقض در ۳۰ روز</span>
                <span className="mono muted-2">{r.id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={!!fixing}
        onClose={() => setFixing(null)}
        title={`اصلاح مورد ${fixing?.id ?? ""}`}
        subtitle={fixing?.category}
        width={560}
        footer={
          <>
            <button className="btn btn-sm btn-ghost" onClick={ignoreIssue} disabled={fixRun !== "idle"}>
              <EyeOff size={13} /> نادیده گرفتن
            </button>
            <div className="row">
              <button className="btn btn-sm" onClick={() => setFixing(null)} disabled={fixRun === "running"}>انصراف</button>
              <button className="btn btn-sm btn-primary" onClick={applyFix} disabled={fixRun !== "idle"}>
                {fixRun === "done" ? <Check size={13} /> : <Wrench size={13} />}
                {fixRun === "running" ? "در حال اصلاح…" : fixRun === "done" ? "اصلاح شد" : "اصلاح خودکار"}
              </button>
            </div>
          </>
        }
      >
        {fixing && (
          <>
            <div className="fix-title">{fixing.title}</div>
            <p className="small muted" style={{ marginTop: 4, lineHeight: 1.9 }}>{fixing.detail}</p>
            <div className="review-list" style={{ marginTop: 12 }}>
              <div className="kv"><span className="k">شرکت</span><span className="v">{fixing.company}</span></div>
              <div className="kv"><span className="k">جریان مرتبط</span><span className="v">{fixing.pipeline}</span></div>
              <div className="kv"><span className="k">تعداد رکورد</span><span className="v">{faNum(fixing.records)}</span></div>
              <div className="kv"><span className="k">شدت</span><span className="v">{severityMeta[fixing.severity].label}</span></div>
              <div className="kv"><span className="k">زمان شناسایی</span><span className="v">{fixing.detectedAt}</span></div>
            </div>
            <div className="hl-box" style={{ marginTop: 12 }}>
              <b style={{ fontSize: 11.5, display: "block", marginBottom: 6 }}>اقدام پیشنهادی روناک</b>
              <ul className="fix-steps">
                <li>نرمال‌سازی رکوردهای متناظر و حذف تکرارها بر اساس کلید یکتا</li>
                <li>به‌روزرسانی نگاشت حساب با کد معتبر در نرم‌افزار مقصد</li>
                <li>اجرای مجدد اعتبارسنجی روی دسته اصلاح‌شده</li>
              </ul>
            </div>
            {fixRun === "running" && (
              <div style={{ marginTop: 14 }}>
                <div className="row-between small" style={{ marginBottom: 6 }}>
                  <span className="muted">در حال اجرای اصلاح…</span>
                  <span className="mint">در حال به‌روزرسانی</span>
                </div>
                <div className="progress"><span style={{ width: "72%", transition: "width .9s" }} /></div>
              </div>
            )}
            {fixRun === "done" && (
              <div className="hl-box row" style={{ marginTop: 14, gap: 8 }}>
                <Check size={15} style={{ color: "var(--mint)" }} />
                <span className="small">مورد اصلاح شد؛ امتیاز کیفیت به {faNum(score + 0.4, 1)} افزایش یافت.</span>
              </div>
            )}
          </>
        )}
      </Modal>
    </>
  );
}
