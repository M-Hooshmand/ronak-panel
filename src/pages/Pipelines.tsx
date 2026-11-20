import { useMemo, useRef, useState } from "react";
import {
  Workflow,
  Play,
  Plus,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  Settings2,
  Database,
  ArrowLeft,
  Timer,
  Rows3,
  Loader2,
  GitBranch,
  CircleDot,
  Sparkles,
} from "lucide-react";
import { Badge, Empty, Modal, Switch, useToast, type Tone } from "../components/ui";
import { Progress } from "../components/ui";
import { pipelines as seedPipelines, sources, stageLabels, type Pipeline, type PipelineRun, type RunStatus } from "../lib/data";
import { faNum, shortNum, toFaDigits } from "../lib/format";

const runMeta: Record<RunStatus, { label: string; tone: Tone }> = {
  success: { label: "موفق", tone: "success" },
  failed: { label: "ناموفق", tone: "danger" },
  running: { label: "در حال اجرا", tone: "warn" },
};

export default function Pipelines() {
  const toast = useToast();
  const [list, setList] = useState<Pipeline[]>(seedPipelines);
  const [running, setRunning] = useState<Record<string, number>>({});
  const [history, setHistory] = useState<Array<PipelineRun & { pipeline: string; pipelineId: string }>>(() => {
    const out: Array<PipelineRun & { pipeline: string; pipelineId: string }> = [];
    for (let i = 0; i < 4; i++) {
      for (const p of seedPipelines) {
        const r = p.runs[i];
        if (r) out.push({ ...r, id: `${p.id}-${r.id}`, pipeline: p.name, pipelineId: p.id });
      }
    }
    return out;
  });
  const [historyFilter, setHistoryFilter] = useState("all");
  const [historyStatus, setHistoryStatus] = useState("all");
  const [newOpen, setNewOpen] = useState(false);
  const [form, setForm] = useState({ name: "", source: sources[0].name, schedule: "هر روز ۰۴:۰۰" });
  const timers = useRef<number[]>([]);

  const stats = useMemo(
    () => ({
      active: list.filter((p) => p.active).length,
      records: list.reduce((s, p) => s + p.records, 0),
      errors: list.reduce((s, p) => s + p.errors, 0),
      avg: "۲:۵۴",
    }),
    [list],
  );

  const filteredHistory = useMemo(() => {
    return history.filter(
      (r) => (historyFilter === "all" || r.pipelineId === historyFilter) && (historyStatus === "all" || r.status === historyStatus),
    );
  }, [history, historyFilter, historyStatus]);

  const toggle = (id: string, value: boolean) => {
    setList((prev) => prev.map((p) => (p.id === id ? { ...p, active: value } : p)));
    const p = list.find((x) => x.id === id);
    toast(value ? "جریان فعال شد" : "جریان غیرفعال شد", `${p?.name} ${value ? "در زمان‌بندی بعدی اجرا می‌شود." : "تا فعال‌سازی دستی اجرا نخواهد شد."}`, value ? "success" : "info");
  };

  const runPipeline = (p: Pipeline) => {
    if (!p.active) {
      toast("جریان غیرفعال است", "برای اجرا ابتدا جریان را فعال کنید.", "error");
      return;
    }
    if (running[p.id] !== undefined) return;
    setRunning((r) => ({ ...r, [p.id]: 0 }));
    toast("اجرای جریان آغاز شد", `${p.name} — مرحله استخراج در حال اجراست.`, "info");

    for (let i = 1; i <= 5; i++) {
      const t = window.setTimeout(() => {
        setRunning((r) => ({ ...r, [p.id]: i }));
        if (i === 5) {
          const rec: PipelineRun & { pipeline: string; pipelineId: string } = {
            id: `${p.id}-MANUAL-${Date.now()}`,
            pipeline: p.name,
            pipelineId: p.id,
            startedAt: "همین حالا",
            duration: "۴:۰۸",
            records: p.records + 128,
            status: "success",
          };
          setHistory((h) => [rec, ...h]);
          setList((prev) => prev.map((x) => (x.id === p.id ? { ...x, lastRun: "همین حالا", records: x.records + 128 } : x)));
          window.setTimeout(() => {
            setRunning((r) => {
              const copy = { ...r };
              delete copy[p.id];
              return copy;
            });
            toast("اجرای جریان کامل شد", `${p.name} — ${faNum(p.records + 128)} رکورد با موفقیت پردازش شد.`, "success");
          }, 800);
        }
      }, i * 750);
      timers.current.push(t);
    }
  };

  const addPipeline = () => {
    const source = sources.find((s) => s.name === form.source);
    const np: Pipeline = {
      id: `PL-${110 + list.length}`,
      name: form.name || "جریان جدید",
      company: source?.company ?? "شرکت پخش آرمان",
      source: form.source,
      target: "سپیدار — دفتر مرکزی",
      schedule: form.schedule,
      active: true,
      stages: stageLabels.map((label, i) => ({ key: `s${i}`, label, state: "idle" })),
      lastRun: "—",
      nextRun: "طبق زمان‌بندی",
      records: 0,
      errors: 0,
      duration: "—",
      runs: [],
    };
    setList((prev) => [np, ...prev]);
    setNewOpen(false);
    setForm({ name: "", source: sources[0].name, schedule: "هر روز ۰۴:۰۰" });
    toast("جریان داده ایجاد شد", `${np.name} با موفقیت ساخته شد.`, "success");
  };

  return (
    <>
      <div className="page-head">
        <div>
          <div className="ph-title">
            <h1>جریان‌های داده</h1>
            <Badge tone="mint">{toFaDigits(stats.active)} فعال</Badge>
          </div>
          <p>استخراج، پاک‌سازی، نگاشت و بارگذاری داده از منابع به نرم‌افزار مقصد</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-sm" onClick={() => toast("زمان‌بندی بازبینی شد", "همه جریان‌ها طبق برنامه در صف اجرا هستند.", "info")}>
            <Clock size={13} /> زمان‌بندی‌ها
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setNewOpen(true)}>
            <Plus size={14} /> جریان جدید
          </button>
        </div>
      </div>

      <div className="mini-stats">
        <div className="mini-stat">
          <span className="ms-ic" style={{ color: "var(--mint)" }}><GitBranch size={15} /></span>
          <div><div className="ms-k">جریان فعال</div><div className="ms-v">{faNum(stats.active)} <small>از {faNum(list.length)}</small></div></div>
        </div>
        <div className="mini-stat">
          <span className="ms-ic" style={{ color: "var(--indigo)" }}><Rows3 size={15} /></span>
          <div><div className="ms-k">رکورد پردازش امروز</div><div className="ms-v">{shortNum(stats.records)}</div></div>
        </div>
        <div className="mini-stat">
          <span className="ms-ic" style={{ color: "var(--danger)" }}><AlertTriangle size={15} /></span>
          <div><div className="ms-k">رکورد رد‌شده</div><div className="ms-v">{faNum(stats.errors)} <small>در ۲۴ ساعت</small></div></div>
        </div>
        <div className="mini-stat">
          <span className="ms-ic" style={{ color: "var(--warn)" }}><Timer size={15} /></span>
          <div><div className="ms-k">میانگین زمان اجرا</div><div className="ms-v">{stats.avg} <small>دقیقه</small></div></div>
        </div>
      </div>

      <div className="pipe-list">
        {list.map((p) => {
          const currentStage = running[p.id];
          const isRunning = currentStage !== undefined;
          return (
            <div className={`card pipe-card ${isRunning ? "running" : ""} ${!p.active ? "paused" : ""}`} key={p.id}>
              <div className="pipe-main">
                <div className="pipe-title">
                  <span className={`pipe-orb ${isRunning ? "run" : ""}`}>
                    {isRunning ? <Loader2 size={15} className="spin" /> : <Workflow size={15} />}
                  </span>
                  <div className="grow">
                    <div className="row" style={{ gap: 8 }}>
                      <b className="pipe-name">{p.name}</b>
                      {!p.active && <Badge tone="muted" dot={false}>غیرفعال</Badge>}
                      {p.errors > 0 && p.active && <Badge tone="warn" dot={false}>{faNum(p.errors)} خطا</Badge>}
                      {isRunning && <Badge tone="mint" dot={false} icon={<Loader2 size={9} className="spin" />}>در حال اجرا</Badge>}
                    </div>
                    <div className="pipe-sub">
                      <span><Database size={11} /> {p.source}</span>
                      <ArrowLeft size={10} />
                      <span>{p.target}</span>
                      <span className="pipe-dot">·</span>
                      <span>{p.company}</span>
                    </div>
                  </div>
                  <div className="pipe-meta">
                    <span className="row"><Clock size={11} /> {p.schedule}</span>
                    <span className="row">آخرین اجرا: <b>{p.lastRun}</b></span>
                  </div>
                  <div className="pipe-controls">
                    <Switch on={p.active} onChange={(v) => toggle(p.id, v)} small label={p.name} />
                    <button className="btn btn-xs btn-primary" disabled={!p.active || isRunning} onClick={() => runPipeline(p)}>
                      {isRunning ? <Loader2 size={11} className="spin" /> : <Play size={11} />} اجرا
                    </button>
                    <button className="icon-btn" style={{ width: 26, height: 26 }} title="تنظیمات جریان" onClick={() => toast("تنظیمات جریان", `${p.name} — ${p.stages.length} مرحله، زمان‌بندی ${p.schedule}`, "info")}>
                      <Settings2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="stage-flow">
                  {p.stages.map((s, i) => {
                    const activeStage = isRunning && currentStage === i;
                    const doneStage = isRunning ? currentStage! > i : s.state === "ok";
                    return (
                      <div className="stage-wrap" key={s.key}>
                        <div className={`stage-chip ${activeStage ? "active" : ""} ${doneStage ? "done" : ""} ${s.state === "warn" ? "warn" : ""} ${s.state === "error" ? "error" : ""}`}>
                          <span className="stage-no">{doneStage ? <CheckCircle2 size={11} /> : toFaDigits(i + 1)}</span>
                          <span>{s.label}</span>
                          {s.state === "warn" && !isRunning && <AlertTriangle size={10} className="warn" />}
                          {s.state === "error" && !isRunning && <XCircle size={10} className="danger" />}
                        </div>
                        {i < p.stages.length - 1 && <ChevronLeft size={11} className="stage-arrow" />}
                      </div>
                    );
                  })}
                  <div className="stage-stats">
                    <span><b className="num">{isRunning ? faNum(p.records) : shortNum(p.records)}</b> رکورد</span>
                    <span><b className="num">{p.duration}</b> دقیقه</span>
                    <span><b className="num">{p.errors}</b> خطا</span>
                  </div>
                </div>

                {isRunning && (
                  <div className="pipe-progress">
                    <Progress value={(currentStage! / 5) * 100} />
                    <span>در حال {p.stages[Math.min(4, currentStage!)]?.label ?? "پایان"}…</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <div className="card-hd">
          <h3>
            <RefreshCw size={15} /> تاریخچه اجرا
            <span className="ch-sub">{faNum(filteredHistory.length)} اجرا</span>
          </h3>
          <div className="hd-actions">
            <select className="select" style={{ height: 28, fontSize: 11, width: "auto" }} value={historyFilter} onChange={(e) => setHistoryFilter(e.target.value)} aria-label="جریان">
              <option value="all">همه جریان‌ها</option>
              {list.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <select className="select" style={{ height: 28, fontSize: 11, width: "auto" }} value={historyStatus} onChange={(e) => setHistoryStatus(e.target.value)} aria-label="وضعیت">
              <option value="all">همه وضعیت‌ها</option>
              <option value="success">موفق</option>
              <option value="failed">ناموفق</option>
            </select>
          </div>
        </div>
        <div className="tbl-wrap" style={{ maxHeight: 340 }}>
          <table className="table">
            <thead>
              <tr>
                <th>شناسه اجرا</th>
                <th>جریان</th>
                <th>شروع</th>
                <th>مدت</th>
                <th>رکورد پردازش‌شده</th>
                <th>وضعیت</th>
                <th>جزئیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.slice(0, 18).map((r) => {
                const meta = runMeta[r.status];
                return (
                  <tr key={r.id}>
                    <td className="mono t-muted">{r.id.replace(/RUN-/, "RUN-")}</td>
                    <td className="t-strong">{r.pipeline}</td>
                    <td className="num t-muted">{r.startedAt}</td>
                    <td className="num">{r.duration}</td>
                    <td className="t-num">{faNum(r.records)}</td>
                    <td><Badge tone={meta.tone}>{meta.label}</Badge></td>
                    <td>
                      <button className="btn btn-ghost btn-xs" onClick={() => toast("جزئیات اجرا", `${r.id} — ${faNum(r.records)} رکورد، مدت ${r.duration}`, "info")}>
                        مشاهده
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredHistory.length === 0 && <Empty text="اجرایی با این فیلترها ثبت نشده است" />}
        </div>
        <div className="card-foot">
          <span>نگهداری تاریخچه اجرا: ۹۰ روز</span>
          <span className="row"><CircleDot size={11} className="mint" /> اجراهای دستی با برچسب MANUAL مشخص می‌شوند</span>
        </div>
      </div>

      <Modal
        open={newOpen}
        onClose={() => setNewOpen(false)}
        title="جریان داده جدید"
        subtitle="اتصال یک منبع به نرم‌افزار مقصد با مراحل استاندارد"
        width={540}
        footer={
          <>
            <span className="small muted-2">مراحل پیش‌فرض به‌صورت خودکار ساخته می‌شوند</span>
            <div className="row">
              <button className="btn btn-sm btn-ghost" onClick={() => setNewOpen(false)}>انصراف</button>
              <button className="btn btn-sm btn-primary" disabled={!form.name} onClick={addPipeline}>
                <Sparkles size={13} /> ساخت جریان
              </button>
            </div>
          </>
        }
      >
        <div className="form-grid">
          <div className="field" style={{ gridColumn: "span 2" }}>
            <label>نام جریان</label>
            <input className="input" placeholder="مثلاً اسناد فروش روزانه" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="field" style={{ gridColumn: "span 2" }}>
            <label>منبع داده</label>
            <select className="select" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
              {sources.map((s) => <option key={s.id} value={s.name}>{s.name} — {s.kind}</option>)}
            </select>
          </div>
          <div className="field">
            <label>نرم‌افزار مقصد</label>
            <select className="select" defaultValue="سپیدار">
              <option>سپیدار سیستم</option>
              <option>هلو</option>
              <option>پارسیان</option>
            </select>
          </div>
          <div className="field">
            <label>زمان‌بندی</label>
            <select className="select" value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })}>
              <option>هر روز ۰۴:۰۰</option>
              <option>هر ۶ ساعت</option>
              <option>هر ۱۲ ساعت</option>
              <option>هفتگی — شنبه ۰۳:۰۰</option>
            </select>
          </div>
        </div>
        <div className="hl-box" style={{ marginTop: 14 }}>
          <div className="small strong" style={{ marginBottom: 6 }}>مراحل این جریان</div>
          <div className="row" style={{ flexWrap: "wrap", gap: 5 }}>
            {stageLabels.map((s, i) => (
              <span key={s} className="chip small">
                {toFaDigits(i + 1)}. {s}
              </span>
            ))}
          </div>
          <div className="small muted" style={{ marginTop: 8 }}>
            پس از ساخت، می‌توانید قواعد کیفیت داده و نگاشت حساب‌ها را برای این جریان تعیین کنید.
          </div>
        </div>
      </Modal>
    </>
  );
}
