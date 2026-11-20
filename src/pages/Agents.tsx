import { useMemo, useState } from "react";
import {
  Cpu,
  Plus,
  RefreshCw,
  Download,
  Copy,
  Check,
  Server,
  Clock,
  KeyRound,
  Activity,
  Wifi,
  WifiOff,
  LayoutGrid,
  List,
  Terminal,
  ShieldCheck,
  Loader2,
  ChevronLeft,
  Boxes,
} from "lucide-react";
import { Badge, Drawer, Modal, Progress, useToast, Empty } from "../components/ui";
import { Sparkline } from "../components/charts";
import { agents as seedAgents, agentVersions, type Agent, type AgentStatus } from "../lib/data";
import { faNum, toFaDigits } from "../lib/format";

const statusMeta: Record<AgentStatus, { label: string; tone: "success" | "warn" | "danger" }> = {
  online: { label: "آنلاین", tone: "success" },
  degraded: { label: "نیازمند بررسی", tone: "warn" },
  offline: { label: "آفلاین", tone: "danger" },
};

export default function Agents() {
  const toast = useToast();
  const [list, setList] = useState<Agent[]>(seedAgents);
  const [view, setView] = useState<"cards" | "table">("cards");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [installOpen, setInstallOpen] = useState(false);
  const [os, setOs] = useState<"linux" | "windows">("linux");
  const [updating, setUpdating] = useState<Record<string, number>>({});
  const [copied, setCopied] = useState(false);

  const selected = list.find((a) => a.id === selectedId) ?? null;

  const stats = useMemo(() => {
    const online = list.filter((a) => a.status === "online").length;
    const degraded = list.filter((a) => a.status === "degraded").length;
    const offline = list.filter((a) => a.status === "offline").length;
    const outdated = list.filter((a) => a.version !== a.latestVersion).length;
    return { online, degraded, offline, outdated };
  }, [list]);

  const startUpdate = (id: string) => {
    if (updating[id] !== undefined) return;
    setUpdating((u) => ({ ...u, [id]: 8 }));
    const timer = window.setInterval(() => {
      setUpdating((u) => {
        const next = Math.min(100, (u[id] ?? 0) + 11 + Math.round(Math.random() * 9));
        if (next >= 100) {
          window.clearInterval(timer);
          setList((prev) => prev.map((a) => (a.id === id ? { ...a, version: a.latestVersion, status: a.status === "offline" ? "offline" : "online" } : a)));
          toast("به‌روزرسانی کامل شد", `ایجنت ${id} اکنون روی نسخه ${agentVersions[0].version} است.`, "success");
          window.setTimeout(() => setUpdating((u) => {
            const copy = { ...u };
            delete copy[id];
            return copy;
          }), 900);
        }
        return { ...u, [id]: next };
      });
    }, 320);
  };

  const copyToken = (token: string) => {
    navigator.clipboard?.writeText(token).catch(() => {});
    toast("توکن کپی شد", "این توکن را در فایل پیکربندی ایجنت قرار دهید.", "success");
  };

  const installCmd = os === "linux"
    ? "curl -fsSL https://get.ronak.ir/agent | sudo bash -s -- \\\n  --token rnk_inst_7f3a2c91d4b8 \\\n  --server mcp.ronak.ir:8443"
    : "Invoke-WebRequest https://get.ronak.ir/agent.ps1 -OutFile agent.ps1\n.\\agent.ps1 -Token rnk_inst_7f3a2c91d4b8 -Server mcp.ronak.ir:8443";

  const avgHeartbeat = selected ? Math.round(selected.heartbeat.reduce((s, v) => s + v, 0) / selected.heartbeat.length) : 0;

  return (
    <>
      <div className="page-head">
        <div>
          <div className="ph-title">
            <h1>ایجنت‌ها</h1>
            <Badge tone="success">{toFaDigits(stats.online)} آنلاین</Badge>
          </div>
          <p>ایجنت‌های نصب‌شده روی سرور مشتریان؛ پل امن بین دیتابیس حسابداری و روناک</p>
        </div>
        <div className="page-actions">
          <div className="seg">
            <button className={view === "cards" ? "on" : ""} onClick={() => setView("cards")} title="نمای کارت">
              <LayoutGrid size={13} />
            </button>
            <button className={view === "table" ? "on" : ""} onClick={() => setView("table")} title="نمای جدول">
              <List size={13} />
            </button>
          </div>
          <button className="btn btn-sm" onClick={() => toast("ضربان‌ها به‌روز شد", "آخرین وضعیت ۶ ایجنت دریافت شد.", "info")}>
            <RefreshCw size={13} /> به‌روزرسانی وضعیت
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setInstallOpen(true)}>
            <Plus size={14} /> افزودن ایجنت
          </button>
        </div>
      </div>

      <div className="mini-stats">
        <div className="mini-stat">
          <span className="ms-ic" style={{ color: "var(--mint)" }}><Wifi size={15} /></span>
          <div><div className="ms-k">آنلاین</div><div className="ms-v">{faNum(stats.online)} <small>ایجنت</small></div></div>
        </div>
        <div className="mini-stat">
          <span className="ms-ic" style={{ color: "var(--warn)" }}><Activity size={15} /></span>
          <div><div className="ms-k">نیازمند بررسی</div><div className="ms-v">{faNum(stats.degraded)} <small>تأخیر ضربان</small></div></div>
        </div>
        <div className="mini-stat">
          <span className="ms-ic" style={{ color: "var(--danger)" }}><WifiOff size={15} /></span>
          <div><div className="ms-k">آفلاین</div><div className="ms-v">{faNum(stats.offline)} <small>نیازمند اقدام</small></div></div>
        </div>
        <div className="mini-stat">
          <span className="ms-ic" style={{ color: "var(--indigo)" }}><Download size={15} /></span>
          <div><div className="ms-k">به‌روزرسانی موجود</div><div className="ms-v">{faNum(stats.outdated)} <small>از {faNum(list.length)}</small></div></div>
        </div>
      </div>

      {view === "cards" ? (
        <div className="agent-grid">
          {list.map((a) => {
            const meta = statusMeta[a.status];
            const outdated = a.version !== a.latestVersion;
            const pct = updating[a.id];
            return (
              <div className="card agent-card" key={a.id}>
                <div className="agent-hd">
                  <div className="row">
                    <span className="agent-ic">
                      <Server size={16} />
                    </span>
                    <div>
                      <div className="agent-code mono">{a.code}</div>
                      <div className="agent-host">{a.host}</div>
                    </div>
                  </div>
                  <Badge tone={meta.tone}>{meta.label}</Badge>
                </div>
                <div className="agent-body">
                  <div className="agent-co">
                    <b>{a.company}</b>
                    <span>{a.branch}</span>
                  </div>
                  <div className="agent-spark">
                    <div className="as-top">
                      <span>ضربان ۲۰ دقیقه اخیر</span>
                      <span className={a.status === "offline" ? "danger" : "mint"}>
                        {a.status === "offline" ? "بدون سیگنال" : "پایدار"}
                      </span>
                    </div>
                    <Sparkline
                      data={a.heartbeat}
                      width={300}
                      height={42}
                      color={a.status === "offline" ? "#FF6B81" : a.status === "degraded" ? "#F7B955" : "#2FE0BE"}
                    />
                  </div>
                  <div className="agent-metrics">
                    <div><span>نسخه</span><b className="mono">v{a.version}</b></div>
                    <div><span>IP</span><b className="mono">{a.ip}</b></div>
                    <div><span>آخرین ضربان</span><b>{a.lastHeartbeat}</b></div>
                    <div><span>صف ارسال</span><b className={a.queue > 50 ? "danger" : ""}>{faNum(a.queue)}</b></div>
                  </div>
                  {pct !== undefined && (
                    <div style={{ marginTop: 10 }}>
                      <div className="row-between small" style={{ marginBottom: 5 }}>
                        <span className="muted">در حال به‌روزرسانی به v{a.latestVersion}</span>
                        <span className="mint num">{faNum(pct)}٪</span>
                      </div>
                      <Progress value={pct} />
                    </div>
                  )}
                </div>
                <div className="agent-ft">
                  <button className="btn btn-sm" onClick={() => setSelectedId(a.id)}>
                    جزئیات ایجنت <ChevronLeft size={12} />
                  </button>
                  {outdated ? (
                    <button className="btn btn-sm btn-indigo" disabled={pct !== undefined} onClick={() => startUpdate(a.id)}>
                      {pct !== undefined ? <Loader2 size={12} className="spin" /> : <Download size={12} />}
                      به‌روزرسانی
                    </button>
                  ) : (
                    <span className="chip small"><Check size={11} style={{ color: "var(--mint)" }} /> به‌روز</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card">
          <div className="card-hd">
            <h3><Cpu size={15} /> فهرست ایجنت‌ها</h3>
            <span className="small muted-2">{faNum(list.length)} ایجنت نصب‌شده</span>
          </div>
          <div className="tbl-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>ایجنت</th>
                  <th>شرکت / شعبه</th>
                  <th>نسخه</th>
                  <th>IP</th>
                  <th>وضعیت</th>
                  <th>آخرین ضربان</th>
                  <th>صف</th>
                  <th>به‌روزرسانی</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {list.map((a) => {
                  const meta = statusMeta[a.status];
                  const outdated = a.version !== a.latestVersion;
                  return (
                    <tr key={a.id} className="clickable" onClick={() => setSelectedId(a.id)}>
                      <td>
                        <div className="t-strong mono">{a.code}</div>
                        <div className="t-sub">{a.host}</div>
                      </td>
                      <td>
                        <div>{a.company}</div>
                        <div className="t-sub">{a.branch}</div>
                      </td>
                      <td className="mono">{a.version}</td>
                      <td className="mono t-muted">{a.ip}</td>
                      <td><Badge tone={meta.tone}>{meta.label}</Badge></td>
                      <td className="t-muted">{a.lastHeartbeat}</td>
                      <td className="t-num">{faNum(a.queue)}</td>
                      <td>
                        {outdated ? <Badge tone="indigo" dot={false}>v{a.latestVersion} موجود</Badge> : <span className="muted small">به‌روز</span>}
                      </td>
                      <td>
                        {outdated && (
                          <button className="btn btn-xs btn-indigo" onClick={(e) => { e.stopPropagation(); startUpdate(a.id); }} disabled={updating[a.id] !== undefined}>
                            <Download size={11} /> به‌روزرسانی
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="tbl-foot">
            <span>میانگین تأخیر ضربان همه ایجنت‌ها: ۳۱ ثانیه</span>
            <span className="row"><span className="dot live" /> نظارت زنده فعال</span>
          </div>
        </div>
      )}

      {view === "cards" && list.length === 0 && <Empty text="هیچ ایجنتی نصب نشده است" />}

      {/* ---------------------------- detail drawer ---------------------------- */}
      <Drawer
        open={!!selected}
        onClose={() => setSelectedId(null)}
        title={selected?.code ?? ""}
        subtitle={selected ? `${selected.company} — ${selected.branch}` : ""}
        width={500}
        footer={
          selected && (
            <>
              <button
                className="btn btn-sm"
                onClick={() => {
                  copyToken(selected.token);
                }}
              >
                <KeyRound size={13} /> چرخش توکن
              </button>
              <div className="row" style={{ marginInlineStart: "auto" }}>
                <button className="btn btn-sm btn-ghost" onClick={() => setSelectedId(null)}>بستن</button>
                {selected.version !== selected.latestVersion ? (
                  <button className="btn btn-sm btn-indigo" onClick={() => startUpdate(selected.id)} disabled={updating[selected.id] !== undefined}>
                    {updating[selected.id] !== undefined ? <Loader2 size={13} className="spin" /> : <Download size={13} />}
                    به‌روزرسانی به v{selected.latestVersion}
                  </button>
                ) : (
                  <button className="btn btn-sm btn-primary" onClick={() => { setSelectedId(null); toast("ایجنت همگام شد", "پیکربندی جدید برای ایجنت ارسال شد.", "success"); }}>
                    <RefreshCw size={13} /> همگام‌سازی پیکربندی
                  </button>
                )}
              </div>
            </>
          )
        }
      >
        {selected && (
          <>
            <div className="row" style={{ marginBottom: 14 }}>
              <Badge tone={statusMeta[selected.status].tone}>{statusMeta[selected.status].label}</Badge>
              <span className="chip"><Clock size={12} /> آخرین ضربان {selected.lastHeartbeat}</span>
              <span className="chip mono">{selected.id}</span>
            </div>

            <div className="drawer-section">
              <div className="row-between" style={{ marginBottom: 8 }}>
                <h3 className="section-title" style={{ margin: 0 }}>ضربان قلب ایجنت</h3>
                <span className="small muted-2">۶۰ دقیقه گذشته</span>
              </div>
              <div className="hb-box">
                <Sparkline
                  data={selected.heartbeat}
                  width={440}
                  height={86}
                  strokeWidth={2}
                  color={selected.status === "offline" ? "#FF6B81" : selected.status === "degraded" ? "#F7B955" : "#2FE0BE"}
                />
                <div className="hb-stats">
                  <div><span>میانگین فاصله</span><b>{faNum(avgHeartbeat)}s</b></div>
                  <div><span>آخرین پاسخ</span><b>{selected.lastHeartbeat}</b></div>
                  <div><span>پایداری ۲۴ ساعت</span><b>{selected.status === "offline" ? "۴۱٪" : selected.status === "degraded" ? "۸۲٪" : "۹۹٫۸٪"}</b></div>
                </div>
              </div>
            </div>

            <div className="drawer-section">
              <h3 className="section-title">مصرف منابع</h3>
              <div className="res-row">
                <div className="row-between small"><span className="muted">CPU</span><span className="num">{faNum(selected.cpu)}٪</span></div>
                <Progress value={selected.cpu} tone={selected.cpu > 70 ? "danger" : selected.cpu > 50 ? "warn" : "mint"} />
              </div>
              <div className="res-row">
                <div className="row-between small"><span className="muted">حافظه</span><span className="num">{faNum(selected.memory)}٪</span></div>
                <Progress value={selected.memory} tone={selected.memory > 80 ? "danger" : "mint"} />
              </div>
              <div className="res-row">
                <div className="row-between small"><span className="muted">صف ارسال</span><span className="num">{faNum(selected.queue)} رکورد</span></div>
                <Progress value={Math.min(100, (selected.queue / 400) * 100)} tone={selected.queue > 100 ? "warn" : "mint"} />
              </div>
            </div>

            <div className="drawer-section">
              <h3 className="section-title">مشخصات نصب</h3>
              <div className="kv"><span className="k">میزبان</span><span className="v mono">{selected.host}</span></div>
              <div className="kv"><span className="k">سیستم‌عامل</span><span className="v">{selected.os}</span></div>
              <div className="kv"><span className="k">آدرس IP</span><span className="v mono">{selected.ip}</span></div>
              <div className="kv"><span className="k">نسخه ایجنت</span><span className="v mono">v{selected.version} <span className="muted-2">/ آخرین v{selected.latestVersion}</span></span></div>
              <div className="kv"><span className="k">تاریخ نصب</span><span className="v">{selected.installedAt}</span></div>
              <div className="kv"><span className="k">حالت اتصال</span><span className="v row" style={{ justifyContent: "flex-end" }}><ShieldCheck size={12} style={{ color: "var(--mint)" }} /> TLS 1.3 — outbound</span></div>
            </div>

            <div className="drawer-section">
              <h3 className="section-title">توکن دسترسی</h3>
              <div className="token-row">
                <code className="mono">{selected.token}</code>
                <button className="icon-btn" style={{ width: 28, height: 28 }} onClick={() => copyToken(selected.token)} title="کپی">
                  <Copy size={13} />
                </button>
              </div>
              <div className="small muted" style={{ marginTop: 6 }}>توکن هر ۹۰ روز به‌صورت خودکار چرخش می‌یابد. آخرین چرخش: ۱۴۰۵/۰۸/۱۲</div>
            </div>

            <div className="drawer-section">
              <h3 className="section-title">بسته نصب</h3>
              <button className="download-chip" onClick={() => toast("دانلود آغاز شد", `بسته نصبی ${selected.code} (۲۴٫۶ مگابایت) در حال دانلود است.`, "success")}>
                <span className="dc-ic"><Download size={15} /></span>
                <span className="grow">
                  <b>ronak-agent-{selected.latestVersion}-{selected.os.toLowerCase().includes("windows") ? "win-x64" : "linux-x64"}.tar.gz</b>
                  <span>۲۴٫۶ مگابایت · SHA-256 تأیید شد</span>
                </span>
                <span className="dc-go"><Download size={14} /></span>
              </button>
              <div className="code-block" style={{ marginTop: 8 }}>{`# به‌روزرسانی دستی روی سرور
sudo ronak-agent update --version ${selected.latestVersion}`}</div>
            </div>

            <div className="drawer-section">
              <h3 className="section-title">تاریخچه نسخه‌ها</h3>
              {agentVersions.slice(0, 3).map((v) => (
                <div className="ver-row" key={v.version}>
                  <span className={`dot ${v.version === selected.version ? "live" : "off"}`} />
                  <div className="grow">
                    <div className="row-between">
                      <b className="mono">v{v.version}</b>
                      <span className="small muted-2">{v.date}</span>
                    </div>
                    <div className="small muted">{v.notes}</div>
                  </div>
                  <span className="small muted-2 mono">{v.size}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </Drawer>

      {/* ---------------------------- install modal ---------------------------- */}
      <Modal
        open={installOpen}
        onClose={() => setInstallOpen(false)}
        title="افزودن ایجنت جدید"
        subtitle="نصب روی سرور مشتری در کمتر از ۲ دقیقه"
        width={600}
        footer={
          <>
            <span className="small muted-2">پورت خروجی ۸۴۴۳ باید باز باشد</span>
            <div className="row">
              <button className="btn btn-sm btn-ghost" onClick={() => setInstallOpen(false)}>بستن</button>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => {
                  const token = `rnk_inst_${Math.random().toString(16).slice(2, 14)}`;
                  navigator.clipboard?.writeText(token).catch(() => {});
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1800);
                  toast("توکن نصب ایجاد شد", "توکن یک‌بارمصرف تا ۳۰ دقیقه معتبر است.", "success");
                }}
              >
                {copied ? <Check size={13} /> : <KeyRound size={13} />} {copied ? "کپی شد" : "ایجاد توکن نصب"}
              </button>
            </div>
          </>
        }
      >
        <div className="row" style={{ marginBottom: 14 }}>
          <div className="seg">
            <button className={os === "linux" ? "on" : ""} onClick={() => setOs("linux")}>Linux</button>
            <button className={os === "windows" ? "on" : ""} onClick={() => setOs("windows")}>Windows</button>
          </div>
          <span className="chip"><Terminal size={12} /> نصب از طریق ترمینال</span>
          <span className="chip"><Boxes size={12} /> Docker نیز پشتیبانی می‌شود</span>
        </div>
        <div className="code-block">{installCmd}</div>
        <div className="row-between" style={{ marginTop: 8 }}>
          <span className="small muted-2">اجرای دستور، ایجنت را به‌صورت سرویس سیستمی ثبت می‌کند.</span>
          <button className="btn btn-xs" onClick={() => { navigator.clipboard?.writeText(installCmd).catch(() => {}); toast("دستور کپی شد", undefined, "success"); }}>
            <Copy size={11} /> کپی دستور
          </button>
        </div>
        <div className="divider" />
        <div className="install-steps">
          <div><span className="is-n">۱</span><div><b>توکن نصب بسازید</b><p>توکن یک‌بارمصرف با اعتبار ۳۰ دقیقه.</p></div></div>
          <div><span className="is-n">۲</span><div><b>دستور را روی سرور اجرا کنید</b><p>دسترسی خروجی به mcp.ronak.ir:8443 لازم است.</p></div></div>
          <div><span className="is-n">۳</span><div><b>منبع داده را متصل کنید</b><p>پس از ثبت ایجنت، دیتابیس حسابداری را معرفی کنید.</p></div></div>
        </div>
        <div className="hl-box" style={{ marginTop: 14, display: "flex", gap: 9, alignItems: "flex-start" }}>
          <ShieldCheck size={15} style={{ color: "var(--mint)", flex: "none", marginTop: 2 }} />
          <span className="small">ایجنت فقط داده را از داخل شبکه مشتری بیرون می‌فرستد؛ هیچ اتصال ورودی به شبکه شما باز نمی‌شود.</span>
        </div>
        <div className="small muted-2 mono" style={{ marginTop: 10 }}>
          avg install size 24.6 MB · sha256 9f2c…d81a · {toFaDigits("v2.4.1")}
        </div>
      </Modal>
    </>
  );
}
