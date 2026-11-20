import { useMemo, useState } from "react";
import {
  Database,
  Plus,
  Search,
  RefreshCw,
  MoreHorizontal,
  Plug,
  Check,
  Server,
  HardDrive,
  Table2,
  Layers,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Link2,
  Clock,
} from "lucide-react";
import { Badge, Empty, Modal, Pager, Switch, useToast } from "../components/ui";
import { sources as seedSources, sourceMeta, companies, branches, type DataSource, type SourceKind } from "../lib/data";
import { faNum, toFaDigits } from "../lib/format";

const kindOrder: SourceKind[] = ["SQL Server", "PostgreSQL", "Oracle", "MySQL"];

const connMeta = {
  connected: { tone: "success" as const, label: "متصل" },
  warning: { tone: "warn" as const, label: "نیازمند بررسی" },
  disconnected: { tone: "danger" as const, label: "قطع" },
};

export default function Sources() {
  const toast = useToast();
  const [rows, setRows] = useState<DataSource[]>(seedSources);
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("all");
  const [company, setCompany] = useState("all");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [testing, setTesting] = useState<string | null>(null);

  /* wizard state */
  const [step, setStep] = useState(1);
  const [dbKind, setDbKind] = useState<SourceKind | null>(null);
  const [form, setForm] = useState({
    name: "",
    host: "",
    port: "1433",
    database: "",
    user: "ronak_reader",
    pass: "",
    company: companies[0].name,
    branch: branches[companies[0].id][0],
    ssl: true,
  });
  const [testStage, setTestStage] = useState<"idle" | "testing" | "ok" | "fail">("idle");
  const [testStep, setTestStep] = useState(0);

  const filtered = useMemo(() => {
    return rows.filter((s) => {
      const hay = `${s.name} ${s.host} ${s.database} ${s.company} ${s.branch}`;
      return (
        (!q || hay.includes(q)) &&
        (kind === "all" || s.kind === kind) &&
        (company === "all" || s.company === company) &&
        (status === "all" || s.status === status)
      );
    });
  }, [rows, q, kind, company, status]);

  const stats = useMemo(() => {
    const totalRows = rows.reduce((s, r) => s + r.rows, 0);
    const totalSize = rows.reduce((s, r) => s + r.sizeMb, 0);
    return {
      connected: rows.filter((r) => r.status === "connected").length,
      rows: totalRows,
      size: totalSize,
      tables: rows.reduce((s, r) => s + r.tables, 0),
    };
  }, [rows]);

  const closeWizard = () => {
    setOpen(false);
    setStep(1);
    setDbKind(null);
    setTestStage("idle");
    setTestStep(0);
  };

  const pickKind = (k: SourceKind) => {
    setDbKind(k);
    setForm((f) => ({ ...f, port: sourceMeta[k].port }));
  };

  const runTest = () => {
    setTestStage("testing");
    setTestStep(0);
    [650, 1250, 1850, 2350].forEach((ms, i) => {
      window.setTimeout(() => setTestStep(i + 1), ms);
    });
    window.setTimeout(() => setTestStage("ok"), 2750);
  };

  const save = () => {
    if (!dbKind) return;
    const newRow: DataSource = {
      id: `SRC-${60 + rows.length}`,
      name: form.name || `منبع ${dbKind} جدید`,
      kind: dbKind,
      host: `${form.host || "10.0.0.1"}:${form.port}`,
      database: form.database || "demo_db",
      company: form.company,
      branch: form.branch,
      status: "connected",
      lastSync: "هم‌اکنون",
      sizeMb: 0,
      tables: 0,
      rows: 0,
    };
    setRows((r) => [newRow, ...r]);
    toast("منبع داده افزوده شد", `${newRow.name} با موفقیت به فهرست منابع اضافه شد.`, "success");
    closeWizard();
  };

  const testRow = (s: DataSource) => {
    setTesting(s.id);
    window.setTimeout(() => {
      setTesting(null);
      toast(
        s.status === "disconnected" ? "اتصال برقرار نشد" : "اتصال سالم است",
        s.status === "disconnected"
          ? `${s.host} پاسخ نداد؛ راه‌اندازی سرویس دیتابیس را بررسی کنید.`
          : `تست TLS و احراز هویت ${s.database} در ۱۴۲ میلی‌ثانیه موفق بود.`,
        s.status === "disconnected" ? "error" : "success",
      );
    }, 1100);
  };

  const currentCompany = companies.find((c) => c.name === form.company);

  return (
    <>
      <div className="page-head">
        <div>
          <div className="ph-title">
            <h1>منابع داده</h1>
            <Badge tone="indigo" dot={false}>{toFaDigits(rows.length)} منبع</Badge>
          </div>
          <p>اتصال امن به دیتابیس نرم‌افزارهای حسابداری مشتریان از طریق ایجنت محلی</p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-sm"
            onClick={() => {
              setTesting("all");
              window.setTimeout(() => {
                setTesting(null);
                toast("تست اتصال انجام شد", "۵ منبع سالم، ۲ نیازمند بررسی و ۱ منبع قطع است.", "info");
              }, 1200);
            }}
          >
            <RefreshCw size={13} className={testing === "all" ? "spin" : ""} /> تست همه اتصال‌ها
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setOpen(true)}>
            <Plus size={14} /> افزودن منبع
          </button>
        </div>
      </div>

      <div className="mini-stats">
        <div className="mini-stat">
          <span className="ms-ic" style={{ color: "var(--mint)" }}><Plug size={15} /></span>
          <div>
            <div className="ms-k">اتصال فعال</div>
            <div className="ms-v">{faNum(stats.connected)} <small>از {faNum(rows.length)}</small></div>
          </div>
        </div>
        <div className="mini-stat">
          <span className="ms-ic" style={{ color: "var(--indigo)" }}><Layers size={15} /></span>
          <div>
            <div className="ms-k">کل رکوردهای قابل استخراج</div>
            <div className="ms-v">{faNum(stats.rows)}</div>
          </div>
        </div>
        <div className="mini-stat">
          <span className="ms-ic" style={{ color: "var(--warn)" }}><HardDrive size={15} /></span>
          <div>
            <div className="ms-k">حجم داده منابع</div>
            <div className="ms-v">{faNum(stats.size / 1024, 1)} <small>گیگابایت</small></div>
          </div>
        </div>
        <div className="mini-stat">
          <span className="ms-ic" style={{ color: "var(--success)" }}><Table2 size={15} /></span>
          <div>
            <div className="ms-k">جداول شناسایی‌شده</div>
            <div className="ms-v">{faNum(stats.tables)}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-hd">
          <h3>
            <Database size={15} /> فهرست منابع
            <span className="ch-sub">{faNum(filtered.length)} نتیجه</span>
          </h3>
          <div className="hd-actions">
            <button className="btn btn-ghost btn-xs" onClick={() => toast("راهنمای اتصال", "برای هر دیتابیس، کاربر فقط‌خواندنی با دسترسی به اسکیما لازم است.", "info")}>
              <Link2 size={12} /> راهنمای اتصال
            </button>
          </div>
        </div>
        <div className="tbl-toolbar">
          <div className="search-mini" style={{ position: "relative", minWidth: 220 }}>
            <Search size={13} style={{ position: "absolute", insetInlineStart: 9, top: 8, color: "var(--muted-2)" }} />
            <input className="input" style={{ paddingInlineStart: 30, height: 30, fontSize: 11.5 }} placeholder="جستجوی نام، سرور یا دیتابیس…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <select className="select" value={kind} onChange={(e) => setKind(e.target.value)} aria-label="نوع دیتابیس">
            <option value="all">همه انواع</option>
            {kindOrder.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
          <select className="select" value={company} onChange={(e) => setCompany(e.target.value)} aria-label="شرکت">
            <option value="all">همه شرکت‌ها</option>
            {companies.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          <select className="select" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="وضعیت">
            <option value="all">همه وضعیت‌ها</option>
            <option value="connected">متصل</option>
            <option value="warning">نیازمند بررسی</option>
            <option value="disconnected">قطع</option>
          </select>
          <span className="filter-label">آخرین به‌روزرسانی: همین حالا</span>
        </div>
        <div className="tbl-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>منبع</th>
                <th>نوع</th>
                <th>سرور</th>
                <th>دیتابیس</th>
                <th>شرکت / شعبه</th>
                <th>وضعیت اتصال</th>
                <th>آخرین همگام‌سازی</th>
                <th className="col-size">حجم</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const meta = connMeta[s.status];
                const km = sourceMeta[s.kind];
                return (
                  <tr key={s.id}>
                    <td>
                      <div className="row">
                        <span className="db-chip" style={{ color: km.color, background: `${km.color}14`, borderColor: `${km.color}30` }}>
                          {km.abbr}
                        </span>
                        <div>
                          <div className="t-strong">{s.name}</div>
                          <div className="t-sub mono">{s.id} · {s.rows ? `${faNum(s.tables)} جدول` : "در انتظار اسکن"}</div>
                        </div>
                      </div>
                    </td>
                    <td>{s.kind}</td>
                    <td className="mono t-muted">{s.host}</td>
                    <td className="mono t-muted">{s.database}</td>
                    <td>
                      <div>{s.company.replace("شرکت ", "").replace("گروه صنعتی ", "")}</div>
                      <div className="t-sub">{s.branch}</div>
                    </td>
                    <td>
                      <Badge tone={meta.tone}>{meta.label}</Badge>
                    </td>
                    <td className="t-muted">{s.lastSync}</td>
                    <td className="t-num col-size">{s.sizeMb ? `${faNum(s.sizeMb / 1024, 1)} GB` : "—"}</td>
                    <td>
                      <div className="row" style={{ gap: 4, justifyContent: "flex-end" }}>
                        <button className="icon-btn" style={{ width: 26, height: 26 }} title="تست اتصال" onClick={() => testRow(s)}>
                          {testing === s.id ? <Loader2 size={13} className="spin" /> : <Plug size={13} />}
                        </button>
                        <button
                          className="icon-btn"
                          style={{ width: 26, height: 26 }}
                          title="همگام‌سازی"
                          onClick={() => toast("همگام‌سازی در صف قرار گرفت", `${s.name} در اجرای بعدی همگام می‌شود.`, "info")}
                        >
                          <RefreshCw size={13} />
                        </button>
                        <button className="icon-btn" style={{ width: 26, height: 26 }} title="بیشتر" onClick={() => toast("جزئیات منبع", `${s.name} — ${faNum(s.tables)} جدول، ${faNum(s.rows)} رکورد`, "info")}>
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <Empty text="منبعی با این فیلترها یافت نشد" />}
        </div>
        <div className="tbl-foot">
          <span>نمایش {toFaDigits(filtered.length)} از {toFaDigits(rows.length)} منبع</span>
          <Pager page={page} pages={1} onPage={setPage} />
        </div>
      </div>

      <Modal
        open={open}
        onClose={closeWizard}
        title="افزودن منبع داده"
        subtitle="اتصال امن و فقط‌خواندنی به دیتابیس نرم‌افزار حسابداری"
        width={620}
        footer={
          <>
            <div className="row">
              {step > 1 && (
                <button className="btn btn-sm" onClick={() => setStep((s) => s - 1)}>
                  <ArrowRight size={13} /> مرحله قبل
                </button>
              )}
              <span className="small muted-2">مرحله {toFaDigits(step)} از ۴</span>
            </div>
            <div className="row">
              <button className="btn btn-sm btn-ghost" onClick={closeWizard}>انصراف</button>
              {step === 1 && (
                <button className="btn btn-primary btn-sm" disabled={!dbKind} onClick={() => setStep(2)}>
                  ادامه <ArrowLeft size={13} />
                </button>
              )}
              {step === 2 && (
                <button className="btn btn-primary btn-sm" disabled={!form.host || !form.database} onClick={() => { setStep(3); setTestStage("idle"); }}>
                  تست اتصال <ArrowLeft size={13} />
                </button>
              )}
              {step === 3 && (
                <button className="btn btn-primary btn-sm" disabled={testStage !== "ok"} onClick={() => setStep(4)}>
                  ادامه <ArrowLeft size={13} />
                </button>
              )}
              {step === 4 && (
                <button className="btn btn-primary btn-sm" onClick={save}>
                  <Check size={13} /> ذخیره منبع
                </button>
              )}
            </div>
          </>
        }
      >
        <div className="steps">
          {["نوع دیتابیس", "اطلاعات اتصال", "تست اتصال", "ذخیره"].map((label, i) => {
            const n = i + 1;
            return (
              <div key={label} style={{ display: "contents" }}>
                <div className={`step ${step === n ? "on" : ""} ${step > n ? "done" : ""}`}>
                  <span className="sn">{step > n ? <Check size={11} /> : toFaDigits(n)}</span>
                  <span className="st-label">{label}</span>
                </div>
                {n < 4 && <div className={`step-line ${step > n ? "done" : ""}`} />}
              </div>
            );
          })}
        </div>

        {step === 1 && (
          <div>
            <p className="small muted" style={{ marginBottom: 12 }}>
              نوع دیتابیس نرم‌افزار حسابداری خود را انتخاب کنید. درایور مناسب به‌صورت خودکار روی ایجنت نصب می‌شود.
            </p>
            <div className="kind-grid">
              {kindOrder.map((k) => {
                const m = sourceMeta[k];
                const on = dbKind === k;
                return (
                  <button key={k} className={`kind-card ${on ? "on" : ""}`} onClick={() => pickKind(k)}>
                    <span className="kc-badge" style={{ color: m.color, background: `${m.color}16`, borderColor: `${m.color}35` }}>{m.abbr}</span>
                    <span className="kc-name">{k}</span>
                    <span className="kc-sub">{m.vendor}</span>
                    <span className="kc-port mono">port {m.port}</span>
                    {on && <span className="kc-check"><Check size={11} /></span>}
                  </button>
                );
              })}
            </div>
            <div className="warn-box small" style={{ marginTop: 14, display: "flex", gap: 8 }}>
              <ShieldCheck size={15} style={{ flex: "none", color: "var(--warn)", marginTop: 2 }} />
              <span>
                دسترسی پیشنهادی فقط‌خواندنی است. روناک برای ثبت سند، از یک کاربر مجزا با دسترسی محدود به جدول اسناد استفاده می‌کند.
              </span>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-grid">
            <div className="field" style={{ gridColumn: "span 2" }}>
              <label>نام نمایشی منبع</label>
              <input className="input" placeholder="مثلاً حسابداری مرکزی آرمان" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="field" style={{ gridColumn: "span 2" }}>
              <label>آدرس سرور / IP</label>
              <input className="input mono" placeholder="10.20.4.11" value={form.host} onChange={(e) => setForm({ ...form, host: e.target.value })} />
            </div>
            <div className="field">
              <label>پورت</label>
              <input className="input mono" value={form.port} onChange={(e) => setForm({ ...form, port: e.target.value })} />
            </div>
            <div className="field">
              <label>نام دیتابیس</label>
              <input className="input mono" placeholder="AccountingDB" value={form.database} onChange={(e) => setForm({ ...form, database: e.target.value })} />
            </div>
            <div className="field">
              <label>نام کاربری</label>
              <input className="input mono" value={form.user} onChange={(e) => setForm({ ...form, user: e.target.value })} />
            </div>
            <div className="field">
              <label>رمز عبور</label>
              <input className="input mono" type="password" placeholder="••••••••••" value={form.pass} onChange={(e) => setForm({ ...form, pass: e.target.value })} />
            </div>
            <div className="field">
              <label>شرکت</label>
              <select
                className="select"
                value={form.company}
                onChange={(e) => {
                  const c = companies.find((x) => x.name === e.target.value)!;
                  setForm({ ...form, company: c.name, branch: branches[c.id][0] });
                }}
              >
                {companies.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label>شعبه</label>
              <select className="select" value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })}>
                {(currentCompany ? branches[currentCompany.id] : []).map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="field" style={{ gridColumn: "span 2" }}>
              <div className="row-between" style={{ border: "1px solid var(--border)", borderRadius: 9, padding: "8px 11px" }}>
                <div>
                  <div style={{ fontSize: 12 }}>اتصال رمزنگاری‌شده TLS</div>
                  <div className="small muted-2">گواهی سرور در اولین اتصال ثبت و در ادامه اعتبارسنجی می‌شود.</div>
                </div>
                <Switch on={form.ssl} onChange={(v) => setForm({ ...form, ssl: v })} label="TLS" />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="test-box">
              <div className="test-head">
                <div className="row">
                  <span className={`test-orb ${testStage}`}>
                    {testStage === "ok" ? <Check size={16} /> : testStage === "testing" ? <Loader2 size={16} className="spin" /> : <Plug size={16} />}
                  </span>
                  <div>
                    <b style={{ fontSize: 12.5 }}>
                      {testStage === "idle" && "آماده تست اتصال"}
                      {testStage === "testing" && "در حال برقراری اتصال…"}
                      {testStage === "ok" && "اتصال با موفقیت برقرار شد"}
                    </b>
                    <div className="small muted-2 mono">
                      {dbKind} · {form.host || "10.20.4.11"}:{form.port} · {form.database || "AccountingDB"}
                    </div>
                  </div>
                </div>
                {testStage === "idle" && (
                  <button className="btn btn-sm btn-indigo" onClick={runTest}>
                    <Plug size={13} /> شروع تست
                  </button>
                )}
                {testStage === "ok" && (
                  <Badge tone="success">۱۴۲ میلی‌ثانیه</Badge>
                )}
              </div>

              {testStage !== "idle" && (
                <div style={{ marginTop: 12 }}>
                  <div className="test-steps">
                    {["حل نام میزبان", "دست‌دهی TLS 1.3", "احراز هویت کاربر", "دسترسی به اسکیما", "شمارش جداول"].map((s, i) => {
                      const done = testStage === "ok" ? true : testStep > i;
                      const current = testStage === "testing" && testStep === i;
                      return (
                        <div key={s} className={`test-step ${done ? "done" : ""} ${current ? "current" : ""}`}>
                          {done ? <Check size={11} /> : current ? <Loader2 size={11} className="spin" /> : <span className="ts-dot" />}
                          {s}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {testStage === "ok" && (
                <div className="test-result">
                  <div className="tr-item"><span>نسخه سرور</span><b className="mono">15.0.4322</b></div>
                  <div className="tr-item"><span>جداول قابل خواندن</span><b>{faNum(186)}</b></div>
                  <div className="tr-item"><span>زمان پاسخ</span><b>۱۴۲ ms</b></div>
                  <div className="tr-item"><span>گواهی TLS</span><b className="mono">SHA-256 …۹f۲c</b></div>
                </div>
              )}
            </div>
            <div className="small muted" style={{ marginTop: 12, lineHeight: 1.9 }}>
              تست اتصال از طریق ایجنت محلی و تونل TLS انجام می‌شود؛ رمز عبور هرگز در پنل ذخیره نمی‌شود و فقط روی ایجنت مشتری نگهداری می‌گردد.
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="hl-box" style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Server size={16} style={{ color: "var(--mint)", marginTop: 2 }} />
              <div>
                <b style={{ fontSize: 12.5 }}>منبع آماده ذخیره است</b>
                <div className="small muted" style={{ marginTop: 3 }}>
                  ایجنت مربوطه به‌صورت خودکار پیکربندی و اولین همگام‌سازی در صف قرار می‌گیرد.
                </div>
              </div>
            </div>
            <div className="review-list">
              <div className="kv"><span className="k">نوع دیتابیس</span><span className="v">{dbKind}</span></div>
              <div className="kv"><span className="k">نام منبع</span><span className="v">{form.name || "منبع جدید"}</span></div>
              <div className="kv"><span className="k">اتصال</span><span className="v mono">{form.host || "10.0.0.1"}:{form.port}</span></div>
              <div className="kv"><span className="k">دیتابیس</span><span className="v mono">{form.database || "AccountingDB"}</span></div>
              <div className="kv"><span className="k">شرکت / شعبه</span><span className="v">{form.company} — {form.branch}</span></div>
              <div className="kv"><span className="k">امنیت</span><span className="v">{form.ssl ? "TLS 1.3 فعال" : "بدون TLS"}</span></div>
              <div className="kv"><span className="k">حالت دسترسی</span><span className="v">فقط‌خواندنی + کاربر ثبت سند</span></div>
            </div>
            <div className="warn-box small" style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <Clock size={14} style={{ flex: "none", marginTop: 2, color: "var(--warn)" }} />
              اولین همگام‌سازی ممکن است بسته به حجم داده تا ۲۰ دقیقه طول بکشد. تا آن زمان وضعیت «در حال آماده‌سازی» نمایش داده می‌شود.
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
