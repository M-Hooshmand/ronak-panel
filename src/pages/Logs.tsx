import { Fragment, useMemo, useState } from "react";
import {
  Search,
  Info,
  AlertTriangle,
  CircleX,
  Download,
  RefreshCw,
  FilterX,
  Radio,
  ChevronDown,
  Terminal,
  Clock,
  Activity,
  Bug,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import { Badge, Empty, Switch, useToast, type Tone } from "../components/ui";
import { logs as seedLogs, type LogEntry, type LogLevel } from "../lib/data";
import { faNum, toFaDigits } from "../lib/format";

const levelMeta: Record<LogLevel, { label: string; tone: Tone; icon: typeof Info; color: string }> = {
  info: { label: "اطلاع", tone: "indigo", icon: Info, color: "#7C8CFF" },
  warn: { label: "هشدار", tone: "warn", icon: AlertTriangle, color: "#F7B955" },
  error: { label: "خطا", tone: "danger", icon: CircleX, color: "#FF6B81" },
};

const sourcesList = ["quality-engine", "voucher-service", "pipeline-runner", "agent-gateway", "connector", "mapping-engine", "auth", "reporting", "backup", "system"];

export default function Logs() {
  const toast = useToast();
  const [logs] = useState<LogEntry[]>(seedLogs);
  const [q, setQ] = useState("");
  const [level, setLevel] = useState<"all" | LogLevel>("all");
  const [source, setSource] = useState("all");
  const [range, setRange] = useState("۲۴ ساعت");
  const [live, setLive] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const counts = useMemo(
    () => ({
      info: logs.filter((l) => l.level === "info").length,
      warn: logs.filter((l) => l.level === "warn").length,
      error: logs.filter((l) => l.level === "error").length,
    }),
    [logs],
  );

  const filtered = useMemo(() => {
    return logs.filter((l) => {
      const hay = `${l.message} ${l.source} ${l.actor} ${l.id} ${l.ip}`;
      return (
        (!q || hay.includes(q)) &&
        (level === "all" || l.level === level) &&
        (source === "all" || l.source === source)
      );
    });
  }, [logs, q, level, source]);

  const clear = () => {
    setQ("");
    setLevel("all");
    setSource("all");
  };

  const hasFilter = q || level !== "all" || source !== "all";

  return (
    <>
      <div className="page-head">
        <div>
          <div className="ph-title">
            <h1>لاگ و رویدادها</h1>
            <Badge tone={live ? "success" : "muted"} dot={live}>{live ? "دریافت زنده" : "متوقف"}</Badge>
          </div>
          <p>ردیابی کامل عملیات ایجنت‌ها، جریان‌ها، کیفیت داده و ثبت اسناد</p>
        </div>
        <div className="page-actions">
          <div className="row" style={{ gap: 6 }}>
            <span className="small muted">جریان زنده</span>
            <Switch
              on={live}
              small
              onChange={(v) => {
                setLive(v);
                toast(v ? "دریافت زنده فعال شد" : "دریافت زنده متوقف شد", v ? "رویدادهای جدید به‌صورت لحظه‌ای نمایش داده می‌شوند." : undefined, "info");
              }}
              label="دریافت زنده"
            />
          </div>
          <button className="btn btn-sm" onClick={() => toast("خروجی لاگ", "فایل CSV با ۲۴ رویداد آماده دانلود شد.", "success")}>
            <Download size={13} /> خروجی
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => toast("لاگ‌ها تازه‌سازی شد", "۲۴ رویداد از سرور دریافت شد.", "info")}>
            <RefreshCw size={13} /> تازه‌سازی
          </button>
        </div>
      </div>

      <div className="mini-stats">
        <div className="mini-stat">
          <span className="ms-ic" style={{ color: "var(--indigo)" }}><Activity size={15} /></span>
          <div><div className="ms-k">رویدادهای ۲۴ ساعت</div><div className="ms-v">{faNum(1_284)} <small>رویداد</small></div></div>
        </div>
        <div className="mini-stat">
          <span className="ms-ic" style={{ color: "var(--warn)" }}><AlertTriangle size={15} /></span>
          <div><div className="ms-k">هشدارها</div><div className="ms-v">{faNum(counts.warn)} <small>در این نما</small></div></div>
        </div>
        <div className="mini-stat">
          <span className="ms-ic" style={{ color: "var(--danger)" }}><Bug size={15} /></span>
          <div><div className="ms-k">خطاها</div><div className="ms-v">{faNum(counts.error)} <small>نیازمند بررسی</small></div></div>
        </div>
        <div className="mini-stat">
          <span className="ms-ic" style={{ color: "var(--mint)" }}><Clock size={15} /></span>
          <div><div className="ms-k">میانگین زمان پاسخ API</div><div className="ms-v">{faNum(142)} <small>میلی‌ثانیه</small></div></div>
        </div>
      </div>

      <div className="card">
        <div className="filter-bar">
          <div className="search-mini" style={{ position: "relative", minWidth: 240 }}>
            <Search size={13} style={{ position: "absolute", insetInlineStart: 9, top: 8, color: "var(--muted-2)" }} />
            <input className="input" placeholder="جستجو در پیام، منبع، کاربر یا IP…" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 260 }} />
          </div>
          <div className="pill-tabs">
            <button className={`pill-tab ${level === "all" ? "on" : ""}`} onClick={() => setLevel("all")}>
              همه <span className="count">{toFaDigits(logs.length)}</span>
            </button>
            {(Object.keys(levelMeta) as LogLevel[]).map((l) => (
              <button key={l} className={`pill-tab ${level === l ? "on" : ""}`} onClick={() => setLevel(l)}>
                <span className={`dot ${l === "error" ? "danger" : l === "warn" ? "warn" : "off"}`} style={l === "info" ? { background: "var(--indigo)" } : undefined} />
                {levelMeta[l].label} <span className="count">{toFaDigits(counts[l])}</span>
              </button>
            ))}
          </div>
          <select className="select" value={source} onChange={(e) => setSource(e.target.value)} aria-label="منبع">
            <option value="all">همه منابع</option>
            {sourcesList.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="seg">
            {["۱ ساعت", "۲۴ ساعت", "۷ روز"].map((r) => (
              <button key={r} className={range === r ? "on" : ""} onClick={() => setRange(r)}>{r}</button>
            ))}
          </div>
          {hasFilter && (
            <button className="btn btn-ghost btn-xs" onClick={clear}>
              <FilterX size={12} /> پاک کردن
            </button>
          )}
          <span className="filter-label row"><Radio size={11} className={live ? "mint" : "muted"} /> {live ? "در حال دریافت" : "متوقف"}</span>
        </div>

        <div className="tbl-wrap logs-table">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 26 }}></th>
                <th>زمان</th>
                <th>سطح</th>
                <th>منبع</th>
                <th>پیام</th>
                <th>کاربر / عامل</th>
                <th>IP</th>
                <th>شناسه</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => {
                const m = levelMeta[l.level];
                const Icon = m.icon;
                const open = expanded === l.id;
                return (
                  <Fragment key={l.id}>
                    <tr className="clickable" onClick={() => setExpanded(open ? null : l.id)}>
                      <td>
                        <ChevronDown size={12} style={{ color: "var(--muted-2)", transform: open ? "rotate(180deg)" : "none", transition: "transform .15s" }} />
                      </td>
                      <td className="num t-muted" style={{ direction: "rtl" }}>{l.ts}</td>
                      <td>
                        <span className={`log-level ${l.level}`}>
                          <Icon size={11} /> {m.label}
                        </span>
                      </td>
                      <td><span className="mono chip no-dot" style={{ height: 21, fontSize: 10 }}>{l.source}</span></td>
                      <td style={{ whiteSpace: "normal", maxWidth: 480 }}>
                        <span style={{ color: l.level === "error" ? "#ffb3be" : l.level === "warn" ? "#ffd79a" : "var(--text-2)" }}>{l.message}</span>
                      </td>
                      <td className="mono t-muted">{l.actor}</td>
                      <td className="mono t-muted">{l.ip}</td>
                      <td className="mono t-muted small">{l.id}</td>
                    </tr>
                    {open && (
                      <tr className="log-detail-row">
                        <td colSpan={8}>
                          <div className="log-detail">
                            <div className="ld-grid">
                              <div><span>رویداد</span><b className="mono">{l.id}</b></div>
                              <div><span>سطح</span><b>{m.label}</b></div>
                              <div><span>منبع</span><b className="mono">{l.source}</b></div>
                              <div><span>زمان دقیق</span><b className="num">{l.ts}</b></div>
                              <div><span>عامل</span><b className="mono">{l.actor}</b></div>
                              <div><span>آدرس شبکه</span><b className="mono">{l.ip}</b></div>
                            </div>
                            <div className="code-block" style={{ marginTop: 10 }}>{`{
  "event_id": "${l.id}",
  "level": "${l.level}",
  "service": "${l.source}",
  "actor": "${l.actor}",
  "client_ip": "${l.ip}",
  "message": "${l.message}",
  "trace_id": "trc_${l.id.replace("L-", "9f")}a2c",
  "timestamp": "2026-11-20T${l.ts.slice(-8)}Z"
}`}</div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <Empty text="رویدادی با این فیلترها یافت نشد" />}
        </div>
        <div className="tbl-foot">
          <span>نمایش {toFaDigits(filtered.length)} رویداد از {toFaDigits(logs.length)} · نگهداری لاگ ۳۰ روز</span>
          <span className="row"><ShieldAlert size={12} className="muted" /> لاگ‌ها فقط‌خواندنی و تغییرناپذیر هستند</span>
        </div>
      </div>

      <div className="log-bottom">
        <div className="card">
          <div className="card-hd"><h3><Terminal size={15} /> توزیع منابع رویداد</h3></div>
          <div className="card-bd" style={{ paddingTop: 10 }}>
            {["pipeline-runner", "voucher-service", "quality-engine", "agent-gateway", "connector"].map((s, i) => {
              const val = [38, 26, 18, 12, 6][i];
              return (
                <div className="cat-row simple" key={s}>
                  <div className="cat-main">
                    <div className="row-between">
                      <span className="mono small">{s}</span>
                      <span className="small muted num">{faNum(val)}٪</span>
                    </div>
                    <div className="cat-bar"><span style={{ width: `${val * 2.2}%`, background: "var(--indigo)" }} /></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="card">
          <div className="card-hd"><h3><UserRound size={15} /> پرکارترین عامل‌ها</h3></div>
          <div className="card-bd" style={{ paddingTop: 10 }}>
            {[
              { n: "system", c: 642, t: "خودکار" },
              { n: "scheduler", c: 318, t: "زمان‌بند" },
              { n: "h.baghaei", c: 96, t: "کاربر" },
              { n: "s.kazemi", c: 74, t: "کاربر" },
            ].map((a) => (
              <div className="kv" key={a.n}>
                <span className="k row"><span className="avatar-sm" style={{ width: 22, height: 22, fontSize: 9, background: "rgba(255,255,255,.06)", color: "var(--text-2)" }}>{a.n.slice(0, 1).toUpperCase()}</span> {a.n}</span>
                <span className="v">{faNum(a.c)} <small className="muted-2">{a.t}</small></span>
              </div>
            ))}
            <div className="hl-box small" style={{ marginTop: 10 }}>
              اکثر خطاها از سرویس «connector» و مربوط به منبع قطع‌شده نیک‌رو است.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
