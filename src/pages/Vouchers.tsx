import { useMemo, useState } from "react";
import {
  ReceiptText,
  Plus,
  Download,
  Search,
  Check,
  AlertTriangle,
  Clock,
  Send,
  ArrowLeftRight,
  Link2,
  ArrowLeft,
  Loader2,
  CalendarDays,
  CircleCheck,
  ShieldCheck,
  ExternalLink,
  FileText,
  Building2,
  RotateCcw,
  FilterX,
  Sparkles,
} from "lucide-react";
import { Badge, Drawer, Empty, Modal, Progress, Tabs, useToast, CheckBox, type Tone } from "../components/ui";
import {
  vouchers as seedVouchers,
  voucherStatusMeta,
  voucherTotal,
  accountMapping,
  companies,
  type Voucher,
  type VoucherStatus,
  type VoucherType,
} from "../lib/data";
import { faNum, money, shortNum, toFaDigits } from "../lib/format";

const statusOrder: VoucherStatus[] = ["posted", "pending", "error", "draft"];
const typeOrder: VoucherType[] = ["عمومی", "سایر سیستم‌ها", "افتتاحیه", "اختتامیه", "بستن حساب‌ها", "تسعیر", "فروش", "خرید", "دریافت", "پرداخت", "برگشت", "حقوق", "انبار", "سایر"];

const mappingMeta = {
  ok: { label: "نگاشت‌شده", tone: "success" as Tone },
  review: { label: "نیازمند بازبینی", tone: "warn" as Tone },
  missing: { label: "تعریف نشده", tone: "danger" as Tone },
};

export default function Vouchers() {
  const toast = useToast();
  const [rows, setRows] = useState<Voucher[]>(seedVouchers);
  const [tab, setTab] = useState<"list" | "map">("list");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [company, setCompany] = useState("all");
  const [type, setType] = useState("all");
  const [period, setPeriod] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [postState, setPostState] = useState<"idle" | "running" | "done">("idle");
  const [postPct, setPostPct] = useState(0);
  const [postStep, setPostStep] = useState(0);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkSel, setBulkSel] = useState<string[]>([]);
  const [bulkRun, setBulkRun] = useState(false);
  const [mapRows, setMapRows] = useState(accountMapping);
  const [mapOpen, setMapOpen] = useState(false);
  const [newMap, setNewMap] = useState({ src: "", srcName: "", dst: "", dstName: "" });

  const selected = rows.find((v) => v.id === selectedId) ?? null;

  const filtered = useMemo(() => {
    return rows.filter((v) => {
      const hay = `${v.number} ${v.description} ${v.source} ${v.company} ${v.reference ?? ""}`;
      return (
        (!q || hay.includes(q)) &&
        (status === "all" || v.status === status) &&
        (company === "all" || v.company === company) &&
        (type === "all" || v.type === type) &&
        (period === "all" || (period === "today" ? v.date === "۱۴۰۴/۱۲/۲۹" : v.date >= "۱۴۰۵/۰۸/۲۳"))
      );
    });
  }, [rows, q, status, company, type, period]);

  const closeDrawer = () => {
    setSelectedId(null);
    setPostState("idle");
    setPostPct(0);
    setPostStep(0);
  };

  const postVoucher = (v: Voucher) => {
    if (postState !== "idle") return;
    setPostState("running");
    setPostPct(0);
    setPostStep(0);
    const steps = [22, 46, 74, 100];
    steps.forEach((p, i) => {
      window.setTimeout(() => {
        setPostPct(p);
        setPostStep(i + 1);
        if (p === 100) {
          const destNo = `سپیدار / ${toFaDigits(842150 + Math.floor(Math.random() * 200))}`;
          setRows((prev) =>
            prev.map((row) =>
              row.id === v.id
                ? { ...row, status: "posted", destinationNo: destNo, postedAt: "همین حالا", error: undefined }
                : row,
            ),
          );
          setPostState("done");
          toast("سند با موفقیت ثبت شد", `${v.number} در سپیدار ثبت و شماره ${destNo} دریافت کرد.`, "success");
        }
      }, (i + 1) * 620);
    });
  };

  const fixAndPost = (v: Voucher) => {
    setRows((prev) => prev.map((row) => (row.id === v.id ? { ...row, error: undefined } : row)));
    setPostState("idle");
    toast("خطا برطرف شد", "نگاشت حساب اصلاح شد؛ اکنون می‌توانید سند را ثبت کنید.", "success");
  };

  const bulkCandidates = rows.filter((v) => v.status === "pending" || v.status === "error");

  const runBulk = () => {
    if (bulkSel.length === 0) return;
    setBulkRun(true);
    window.setTimeout(() => {
      setRows((prev) =>
        prev.map((row) =>
          bulkSel.includes(row.id)
            ? { ...row, status: "posted", destinationNo: `سپیدار / ${toFaDigits(842400 + Math.floor(Math.random() * 90))}`, postedAt: "همین حالا" }
            : row,
        ),
      );
      setBulkRun(false);
      setBulkOpen(false);
      setBulkSel([]);
      toast("ثبت دسته‌ای کامل شد", `${faNum(bulkSel.length)} سند در نرم‌افزار مقصد ثبت شد.`, "success");
    }, 1800);
  };

  const totalDebit = selected ? selected.lines.reduce((s, l) => s + l.debit, 0) : 0;
  const totalCredit = selected ? selected.lines.reduce((s, l) => s + l.credit, 0) : 0;
  const balanced = totalDebit === totalCredit;

  const clearFilters = () => {
    setQ("");
    setStatus("all");
    setCompany("all");
    setType("all");
    setPeriod("all");
  };

  const hasFilter = q || status !== "all" || company !== "all" || type !== "all" || period !== "all";

  const totalDocs = rows.length;
  const postedDocs = rows.filter((v) => v.status === "posted").length;
  const pendingDocs = rows.filter((v) => v.status === "pending").length;
  const errorDocs = rows.filter((v) => v.status === "error").length;
  const postedPct = totalDocs ? Math.round((postedDocs / totalDocs) * 1000) / 10 : 0;

  return (
    <>
      <div className="page-head">
        <div>
          <div className="ph-title">
            <h1>اسناد حسابداری</h1>
            <Badge tone="mint" dot={false}>ثبت خودکار در نرم‌افزار مقصد</Badge>
          </div>
          <p>بازبینی، نگاشت و ثبت اسناد تولیدشده از داده‌های مشتری در سپیدار / هلو</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-sm" onClick={() => toast("خروجی اکسل", "فهرست اسناد با ۱۴ ستون آماده دانلود شد.", "success")}>
            <Download size={13} /> خروجی
          </button>
          <button className="btn btn-sm" onClick={() => { setBulkOpen(true); setBulkSel(rows.filter((v) => v.status === "pending").map((v) => v.id)); }}>
            <Send size={13} /> ثبت دسته‌ای
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => toast("سند دستی", "فرم ساخت سند در نسخه بعدی فعال می‌شود.", "info")}>
            <Plus size={14} /> سند جدید
          </button>
        </div>
      </div>

      <div className="mini-stats">
        <div className="mini-stat">
          <span className="ms-ic" style={{ color: "var(--indigo)" }}><ReceiptText size={15} /></span>
          <div><div className="ms-k">اسناد دوره ۱۴۰۴</div><div className="ms-v">{faNum(totalDocs)} <small>سند</small></div></div>
        </div>
        <div className="mini-stat">
          <span className="ms-ic" style={{ color: "var(--success)" }}><CircleCheck size={15} /></span>
          <div><div className="ms-k">ثبت‌شده</div><div className="ms-v">{faNum(postedDocs)} <small>{faNum(postedPct)}٪</small></div></div>
        </div>
        <div className="mini-stat">
          <span className="ms-ic" style={{ color: "var(--warn)" }}><Clock size={15} /></span>
          <div><div className="ms-k">در انتظار ثبت</div><div className="ms-v">{faNum(pendingDocs)} <small>سند</small></div></div>
        </div>
        <div className="mini-stat">
          <span className="ms-ic" style={{ color: "var(--danger)" }}><AlertTriangle size={15} /></span>
          <div><div className="ms-k">خطا در ثبت</div><div className="ms-v">{faNum(errorDocs)} <small>نیازمند بررسی</small></div></div>
        </div>
      </div>

      <div className="card">
        <Tabs
          tabs={[
            { id: "list", label: "فهرست اسناد", count: rows.length },
            { id: "map", label: "نگاشت حساب‌ها", count: mapRows.length },
          ]}
          active={tab}
          onChange={(id) => setTab(id)}
        />

        {tab === "list" ? (
          <>
            <div className="filter-bar">
              <div className="search-mini" style={{ position: "relative" }}>
                <Search size={13} style={{ position: "absolute", insetInlineStart: 9, top: 8, color: "var(--muted-2)" }} />
                <input className="input" placeholder="شماره سند، شرح یا مرجع…" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 210 }} />
              </div>
              <select className="select" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="وضعیت">
                <option value="all">همه وضعیت‌ها</option>
                {statusOrder.map((s) => (
                  <option key={s} value={s}>{voucherStatusMeta[s].label} ({rows.filter((v) => v.status === s).length})</option>
                ))}
              </select>
              <select className="select" value={period} onChange={(e) => setPeriod(e.target.value)} aria-label="تاریخ">
                <option value="all">کل دوره ۱۴۰۴</option>
                <option value="today">اسفند ۱۴۰۴</option>
                <option value="week">۷ روز آخر سال</option>
              </select>
              <select className="select" value={company} onChange={(e) => setCompany(e.target.value)} aria-label="شرکت">
                <option value="all">همه شرکت‌ها</option>
                {companies.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
              <select className="select" value={type} onChange={(e) => setType(e.target.value)} aria-label="نوع سند">
                <option value="all">همه انواع سند</option>
                {typeOrder.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {hasFilter ? (
                <button className="btn btn-ghost btn-xs" onClick={clearFilters}>
                  <FilterX size={12} /> پاک کردن
                </button>
              ) : (
                <span className="filter-label row"><CalendarDays size={11} /> دوره مالی: ۰۱/۰۱ تا ۱۲/۲۹ سال ۱۴۰۴</span>
              )}
            </div>

            <div className="tbl-wrap" style={{ maxHeight: 560 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>شماره سند</th>
                    <th>تاریخ</th>
                    <th>شرح</th>
                    <th>نوع</th>
                    <th>بدهکار (ریال)</th>
                    <th>بستانکار (ریال)</th>
                    <th>وضعیت</th>
                    <th>منبع</th>
                    <th className="col-company">شرکت</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((v) => {
                    const meta = voucherStatusMeta[v.status];
                    const debit = v.lines.reduce((s, l) => s + l.debit, 0);
                    const credit = v.lines.reduce((s, l) => s + l.credit, 0);
                    return (
                      <tr key={v.id} className={`clickable ${selectedId === v.id ? "row-active" : ""}`} onClick={() => { setSelectedId(v.id); setPostState("idle"); }}>
                        <td>
                          <span className="t-strong mono">{v.number}</span>
                          <div className="t-sub">{v.reference}</div>
                        </td>
                        <td className="num t-muted">{v.date}</td>
                        <td>
                          <div className="t-strong" style={{ maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis" }}>{v.description}</div>
                          <div className="t-sub">{v.branch}</div>
                        </td>
                        <td><span className="chip small">{v.type}</span></td>
                        <td className="t-num">{money(debit)}</td>
                        <td className="t-num">{money(credit)}</td>
                        <td><Badge tone={meta.tone as Tone}>{meta.label}</Badge></td>
                        <td className="t-muted">{v.source.replace("پایپلاین ", "")}</td>
                        <td className="t-muted col-company">{v.company.replace("شرکت ", "").replace("گروه صنعتی ", "")}</td>
                        <td>
                          <button className="icon-btn" style={{ width: 24, height: 24 }} onClick={(e) => { e.stopPropagation(); setSelectedId(v.id); setPostState("idle"); }} aria-label="جزئیات سند">
                            <ArrowLeft size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && <Empty text="سندی با این فیلترها یافت نشد" />}
            </div>
            <div className="tbl-foot">
              <span>
                نمایش {toFaDigits(filtered.length)} سند · مجموع مبلغ {shortNum(filtered.reduce((s, v) => s + voucherTotal(v), 0))} ریال
              </span>
              <span className="row">
                <span className="dot live" /> {faNum(2)} سند در صف ثبت
                <span className="muted-2">|</span>
                پالایش خودکار هر ۵ دقیقه
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="filter-bar">
              <div className="hl-box" style={{ display: "flex", gap: 9, alignItems: "center", flex: 1 }}>
                <Link2 size={15} style={{ color: "var(--mint)", flex: "none" }} />
                <span className="small">
                  کدهای حساب منبع به کدهای حساب نرم‌افزار مقصد (سپیدار — شرکت پخش آرمان) نگاشت می‌شوند. موارد با اطمینان کمتر از ۹۵٪ نیازمند بازبینی دستی هستند.
                </span>
              </div>
              <button className="btn btn-sm btn-primary" onClick={() => setMapOpen(true)}>
                <Plus size={13} /> افزودن نگاشت
              </button>
            </div>
            <div className="tbl-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>کد حساب منبع</th>
                    <th>نام حساب منبع</th>
                    <th style={{ width: 40 }}></th>
                    <th>کد حساب مقصد</th>
                    <th>نام حساب مقصد</th>
                    <th>اطمینان نگاشت</th>
                    <th>وضعیت</th>
                    <th>اقدام</th>
                  </tr>
                </thead>
                <tbody>
                  {mapRows.map((m) => {
                    const meta = mappingMeta[m.status as keyof typeof mappingMeta];
                    return (
                      <tr key={`${m.srcCode}-${m.dstCode}`}>
                        <td className="mono t-strong">{m.srcCode}</td>
                        <td>{m.srcName}</td>
                        <td><ArrowLeftRight size={13} style={{ color: "var(--muted-2)" }} /></td>
                        <td className={`mono ${m.status === "missing" ? "danger" : "t-strong"}`}>{m.dstCode}</td>
                        <td className={m.status === "missing" ? "danger" : ""}>{m.dstName}</td>
                        <td>
                          <div className="row" style={{ gap: 7, minWidth: 130 }}>
                            <div className="progress thin" style={{ flex: 1 }}>
                              <span style={{ width: `${m.confidence}%`, background: m.confidence > 94 ? "var(--mint)" : m.confidence > 0 ? "var(--warn)" : "var(--danger)" }} />
                            </div>
                            <span className="small num">{faNum(m.confidence)}٪</span>
                          </div>
                        </td>
                        <td><Badge tone={meta.tone}>{meta.label}</Badge></td>
                        <td>
                          <button
                            className="btn btn-xs"
                            onClick={() => toast(m.status === "missing" ? "تعریف نگاشت" : "ویرایش نگاشت", `${m.srcName} → ${m.dstName}`, "info")}
                          >
                            {m.status === "missing" ? "تعریف" : "ویرایش"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="card-foot">
              <span>{faNum(mapRows.filter((m) => m.status === "ok").length)} نگاشت معتبر · {faNum(mapRows.filter((m) => m.status === "review").length)} نیازمند بازبینی · {faNum(mapRows.filter((m) => m.status === "missing").length)} تعریف‌نشده</span>
              <span className="row"><ShieldCheck size={12} className="mint" /> آخرین همگام‌سازی نگاشت: امروز ۰۳:۱۲</span>
            </div>
          </>
        )}
      </div>

      {/* ------------------------- voucher drawer ------------------------- */}
      <Drawer
        open={!!selected}
        onClose={closeDrawer}
        title={
          <span className="row" style={{ gap: 8 }}>
            <span className="mono" style={{ fontSize: 13.5 }}>{selected?.number}</span>
            {selected && <Badge tone={voucherStatusMeta[selected.status].tone as Tone}>{voucherStatusMeta[selected.status].label}</Badge>}
          </span>
        }
        subtitle={selected ? `${selected.type} · ${selected.date} · ${selected.branch}` : ""}
        width={580}
        footer={
          selected && (
            <>
              <span className={`row small ${balanced ? "mint" : "danger"}`}>
                {balanced ? <Check size={13} /> : <AlertTriangle size={13} />}
                {balanced ? "سند متوازن است" : "سند تراز نیست"}
              </span>
              <div className="row" style={{ marginInlineStart: "auto" }}>
                <button className="btn btn-sm btn-ghost" onClick={closeDrawer}>بستن</button>
                {selected.status === "posted" ? (
                  <button className="btn btn-sm" onClick={() => toast("مشاهده در مقصد", `سند ${selected.destinationNo} در سپیدار باز می‌شود.`, "info")}>
                    <ExternalLink size={13} /> مشاهده در مقصد
                  </button>
                ) : selected.error && postState === "idle" ? (
                  <button className="btn btn-sm btn-danger" onClick={() => fixAndPost(selected)}>
                    <RotateCcw size={13} /> رفع خطا و آماده‌سازی
                  </button>
                ) : (
                  <button className="btn btn-sm btn-primary" onClick={() => postVoucher(selected)} disabled={postState !== "idle"}>
                    {postState === "running" ? <Loader2 size={13} className="spin" /> : postState === "done" ? <Check size={13} /> : <Send size={13} />}
                    {postState === "running" ? "در حال ثبت…" : postState === "done" ? "سند ثبت شد" : "ثبت سند در نرم‌افزار مقصد"}
                  </button>
                )}
              </div>
            </>
          )
        }
      >
        {selected && (
          <>
            <div className="v-summary">
              <span><Building2 size={12} /> {selected.company}</span>
              <span><FileText size={12} /> {selected.source}</span>
              <span><CalendarDays size={12} /> {selected.date}</span>
            </div>

            <div className="v-amount">
              <div>
                <span>مبلغ سند (ریال)</span>
                <b>{money(voucherTotal(selected))}</b>
              </div>
              <div className="va-side">
                <span>شناسه داخلی</span>
                <b className="mono">{selected.id}</b>
              </div>
            </div>

            {selected.error && (
              <div className="danger-box" style={{ marginBottom: 14, display: "flex", gap: 9 }}>
                <AlertTriangle size={15} style={{ color: "var(--danger)", flex: "none", marginTop: 2 }} />
                <div>
                  <b style={{ fontSize: 12, display: "block" }}>خطا در ثبت سند</b>
                  <span className="small" style={{ color: "var(--text-2)" }}>{selected.error}</span>
                </div>
              </div>
            )}

            <div className="drawer-section">
              <div className="row-between" style={{ marginBottom: 8 }}>
                <h3 className="section-title" style={{ margin: 0 }}>سطرهای سند</h3>
                <span className="chip small"><ArrowLeftRight size={11} /> {toFaDigits(selected.lines.length)} سطر</span>
              </div>
              <div className="v-lines">
                <table className="table table-compact">
                  <thead>
                    <tr>
                      <th>کد حساب</th>
                      <th>نام حساب</th>
                      <th>مرکز هزینه</th>
                      <th>بدهکار</th>
                      <th>بستانکار</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.lines.map((l, i) => (
                      <tr key={i}>
                        <td className="mono t-strong">{l.code}</td>
                        <td style={{ whiteSpace: "normal" }}>{l.account}</td>
                        <td className="t-muted small">{l.costCenter ?? "—"}</td>
                        <td className="t-num">{l.debit ? money(l.debit) : "—"}</td>
                        <td className="t-num">{l.credit ? money(l.credit) : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} style={{ color: "var(--muted)", fontSize: 11 }}>جمع کل</td>
                      <td className="t-num" style={{ color: "var(--mint)" }}>{money(totalDebit)}</td>
                      <td className="t-num" style={{ color: "var(--mint)" }}>{money(totalCredit)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div className="balance-line">
                <span className={`row ${balanced ? "mint" : "danger"}`}>
                  {balanced ? <CircleCheck size={13} /> : <AlertTriangle size={13} />}
                  {balanced ? "بدهکار و بستانکار برابر است" : "اختفای تراز"}
                </span>
                <span className="small muted-2">تفاوت: {money(Math.abs(totalDebit - totalCredit))} ریال</span>
              </div>
            </div>

            <div className="drawer-section">
              <h3 className="section-title">اطلاعات ثبت</h3>
              <div className="kv"><span className="k">مرجع سند</span><span className="v mono">{selected.reference ?? "—"}</span></div>
              <div className="kv"><span className="k">سازنده</span><span className="v">{selected.createdBy}</span></div>
              <div className="kv"><span className="k">جریان تولیدکننده</span><span className="v">{selected.source}</span></div>
              <div className="kv"><span className="k">شماره سند مقصد</span><span className="v mono">{selected.destinationNo ?? "—"}</span></div>
              <div className="kv"><span className="k">زمان ثبت</span><span className="v">{selected.postedAt ?? "ثبت نشده"}</span></div>
            </div>

            <div className="drawer-section">
              <h3 className="section-title">ثبت در نرم‌افزار مقصد</h3>
              {postState === "idle" && !selected.error && selected.status !== "posted" && (
                <div className="write-box">
                  <div className="row" style={{ gap: 9 }}>
                    <span className="write-ic"><Send size={15} /></span>
                    <div>
                      <b style={{ fontSize: 12 }}>آماده ثبت در سپیدار سیستم</b>
                      <div className="small muted">اتصال از طریق وب‌سرویس امن ایجنت برقرار می‌شود.</div>
                    </div>
                  </div>
                  <div className="write-meta">
                    <span>مقصد</span><b>سپیدار — شرکت پخش آرمان</b>
                    <span>دوره</span><b>سال ۱۴۰۴</b>
                    <span>وضعیت نگاشت</span><b className="mint">همه حساب‌ها معتبر</b>
                  </div>
                </div>
              )}

              {postState === "running" && (
                <div className="write-box running">
                  <div className="row-between" style={{ marginBottom: 9 }}>
                    <b style={{ fontSize: 12 }}>در حال ثبت سند…</b>
                    <span className="mint num">{faNum(postPct)}٪</span>
                  </div>
                  <Progress value={postPct} />
                  <div className="write-steps">
                    {["اتصال امن به سپیدار", "اعتبارسنجی کدهای حساب", "ثبت سطرهای سند", "دریافت شماره سند"].map((s, i) => (
                      <div key={s} className={`ws ${postStep > i ? "done" : postStep === i ? "current" : ""}`}>
                        {postStep > i ? <Check size={11} /> : postStep === i ? <Loader2 size={11} className="spin" /> : <span className="ts-dot" />}
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {postState === "done" && (
                <div className="success-box">
                  <span className="sb-ic"><Check size={18} /></span>
                  <div>
                    <b>سند با موفقیت در سپیدار ثبت شد</b>
                    <div className="small muted">شماره سند مقصد: <span className="mono">{selected.destinationNo}</span></div>
                    <div className="small muted-2">این سند اکنون در دفتر کل مقصد قابل مشاهده است.</div>
                  </div>
                </div>
              )}

              {selected.status === "posted" && postState === "idle" && (
                <div className="success-box">
                  <span className="sb-ic"><CircleCheck size={18} /></span>
                  <div>
                    <b>این سند قبلاً ثبت شده است</b>
                    <div className="small muted">شماره سند مقصد: <span className="mono">{selected.destinationNo}</span> · {selected.postedAt}</div>
                    <div className="small muted-2">برای بازبینی، سند را در نرم‌افزار مقصد باز کنید.</div>
                  </div>
                </div>
              )}

              {selected.error && postState === "idle" && (
                <div className="warn-box small">
                  ابتدا خطای نگاشت را برطرف کنید تا دکمه ثبت فعال شود. روناک پیشنهاد می‌کند کد حساب ۱۰۹۹۹ به «حساب‌های متفرقه» نگاشت شود.
                </div>
              )}
            </div>

            <div className="drawer-section">
              <h3 className="section-title">تاریخچه این سند</h3>
              <div className="timeline">
                <div className="tl-item done">
                  <span className="tl-dot" />
                  <div><b>استخراج از منبع</b><span>امروز ۰۳:۱۵ — {selected.source}</span></div>
                </div>
                <div className="tl-item done">
                  <span className="tl-dot" />
                  <div><b>پاک‌سازی و نگاشت حساب</b><span>امروز ۰۳:۱۸ — ۴ سطر نگاشت شد</span></div>
                </div>
                <div className="tl-item done">
                  <span className="tl-dot" />
                  <div><b>اعتبارسنجی</b><span>امروز ۰۳:۲۰ — تراز و کدها تأیید شد</span></div>
                </div>
                <div className={`tl-item ${selected.status === "posted" ? "done" : selected.status === "error" ? "error" : "pending"}`}>
                  <span className="tl-dot" />
                  <div>
                    <b>{selected.status === "posted" ? "ثبت در مقصد" : selected.status === "error" ? "خطا در ثبت" : "در انتظار ثبت در مقصد"}</b>
                    <span>{selected.postedAt ?? (selected.error ? "امروز ۰۳:۲۴ — نیازمند اصلاح نگاشت" : "در صف ثبت")}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Drawer>

      {/* --------------------------- bulk modal --------------------------- */}
      <Modal
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        title="ثبت دسته‌ای اسناد"
        subtitle="اسناد در انتظار و دارای خطا را یک‌جا در نرم‌افزار مقصد ثبت کنید"
        width={560}
        footer={
          <>
            <span className="small muted-2">{faNum(bulkSel.length)} سند انتخاب شده</span>
            <div className="row">
              <button className="btn btn-sm btn-ghost" onClick={() => setBulkOpen(false)} disabled={bulkRun}>انصراف</button>
              <button className="btn btn-sm btn-primary" onClick={runBulk} disabled={bulkSel.length === 0 || bulkRun}>
                {bulkRun ? <Loader2 size={13} className="spin" /> : <Send size={13} />}
                {bulkRun ? "در حال ثبت…" : `ثبت ${faNum(bulkSel.length)} سند`}
              </button>
            </div>
          </>
        }
      >
        <div className="row-between" style={{ marginBottom: 10 }}>
          <span className="small muted">فقط اسناد «در انتظار» و «خطا» قابل انتخاب هستند.</span>
          <button
            className="btn btn-sm btn-ghost btn-xs"
            onClick={() => setBulkSel(bulkSel.length === bulkCandidates.length ? [] : bulkCandidates.map((v) => v.id))}
          >
            {bulkSel.length === bulkCandidates.length ? "لغو انتخاب همه" : "انتخاب همه"}
          </button>
        </div>
        <div className="bulk-list">
          {bulkCandidates.map((v) => {
            const on = bulkSel.includes(v.id);
            return (
              <button
                key={v.id}
                className={`bulk-item ${on ? "on" : ""}`}
                onClick={() => setBulkSel((prev) => (on ? prev.filter((x) => x !== v.id) : [...prev, v.id]))}
              >
                <CheckBox on={on} />
                <div className="grow">
                  <div className="row-between">
                    <b className="mono" style={{ fontSize: 11.5 }}>{v.number}</b>
                    <Badge tone={voucherStatusMeta[v.status].tone as Tone}>{voucherStatusMeta[v.status].label}</Badge>
                  </div>
                  <div className="small muted">{v.description}</div>
                  <div className="small muted-2">{v.company} · {money(voucherTotal(v))} ریال</div>
                </div>
              </button>
            );
          })}
          {bulkCandidates.length === 0 && <Empty text="سند قابل ثبتی در صف نیست" />}
        </div>
        <div className="hl-box small" style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <ShieldCheck size={15} style={{ color: "var(--mint)", flex: "none" }} />
          ثبت دسته‌ای ابتدا تراز و اعتبار کدهای حساب هر سند را بررسی می‌کند؛ اسناد ناتراز ثبت نخواهند شد.
        </div>
      </Modal>

      {/* --------------------------- mapping modal --------------------------- */}
      <Modal
        open={mapOpen}
        onClose={() => setMapOpen(false)}
        title="افزودن نگاشت حساب"
        subtitle="اتصال کد حساب منبع به کد حساب مقصد"
        width={500}
        footer={
          <>
            <span className="small muted-2">پس از ذخیره، اسناد جدید از این نگاشت استفاده می‌کنند.</span>
            <div className="row">
              <button className="btn btn-sm btn-ghost" onClick={() => setMapOpen(false)}>انصراف</button>
              <button
                className="btn btn-sm btn-primary"
                disabled={!newMap.src || !newMap.dst}
                onClick={() => {
                  setMapRows((prev) => [
                    ...prev,
                    { srcCode: toFaDigits(newMap.src), srcName: newMap.srcName || "حساب منبع", dstCode: toFaDigits(newMap.dst), dstName: newMap.dstName || "حساب مقصد", confidence: 100, status: "ok" },
                  ]);
                  setMapOpen(false);
                  setNewMap({ src: "", srcName: "", dst: "", dstName: "" });
                  toast("نگاشت حساب ذخیره شد", "اسناد جدید از این نگاشت استفاده خواهند کرد.", "success");
                }}
              >
                <Check size={13} /> ذخیره نگاشت
              </button>
            </div>
          </>
        }
      >
        <div className="form-grid">
          <div className="field"><label>کد حساب منبع</label><input className="input mono" placeholder="۱۰۹۹۹" value={newMap.src} onChange={(e) => setNewMap({ ...newMap, src: e.target.value })} /></div>
          <div className="field"><label>کد حساب مقصد</label><input className="input mono" placeholder="۱۲۰۹" value={newMap.dst} onChange={(e) => setNewMap({ ...newMap, dst: e.target.value })} /></div>
          <div className="field"><label>نام حساب منبع</label><input className="input" placeholder="حساب‌های متفرقه" value={newMap.srcName} onChange={(e) => setNewMap({ ...newMap, srcName: e.target.value })} /></div>
          <div className="field"><label>نام حساب مقصد</label><input className="input" placeholder="سایر حساب‌های دریافتنی" value={newMap.dstName} onChange={(e) => setNewMap({ ...newMap, dstName: e.target.value })} /></div>
        </div>
        <div className="hl-box small" style={{ marginTop: 14, display: "flex", gap: 8 }}>
          <Sparkles size={15} style={{ color: "var(--mint)", flex: "none" }} />
          روناک می‌تواند بر اساس نام و ماهیت حساب، نگاشت پیشنهادی بسازد. در صورت نیاز از دکمه «پیشنهاد خودکار» استفاده کنید.
        </div>
      </Modal>
    </>
  );
}
