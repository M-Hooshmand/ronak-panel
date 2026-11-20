import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Database,
  Cpu,
  Workflow,
  ShieldCheck,
  ReceiptText,
  BarChart3,
  ScrollText,
  Settings,
  Bell,
  Search,
  ChevronsUpDown,
  Check,
  CircleHelp,
  LogOut,
  UserRound,
  RefreshCw,
  LifeBuoy,
  Building2,
  Sparkles,
  Gauge,
  Wallet,
  Package,
  FileSpreadsheet,
  Users,
} from "lucide-react";
import { Brand } from "./Brand";
import { Avatar, useToast } from "./ui";
import { companies, vouchers, sources, pipelines } from "../lib/data";
import { toFaDigits } from "../lib/format";

const navGroups: Array<{
  label: string;
  items: Array<{ to: string; label: string; icon: typeof LayoutDashboard; badge?: string; badgeTone?: string }>;
}> = [
  {
    label: "مدیریت مالی",
    items: [
      { to: "/", label: "نمای مدیریتی", icon: Gauge },
      { to: "/treasury", label: "خزانه‌داری و چک‌ها", icon: Wallet },
      { to: "/inventory", label: "انبار و دارایی‌ها", icon: Package },
      { to: "/statements", label: "صورت‌های مالی", icon: FileSpreadsheet },
      { to: "/payroll", label: "حقوق، بیمه و مالیات", icon: Users },
    ],
  },
  {
    label: "داده و یکپارچه‌سازی",
    items: [
      { to: "/dashboard", label: "داشبورد یکپارچه‌سازی", icon: LayoutDashboard },
      { to: "/sources", label: "منابع داده", icon: Database },
      { to: "/agents", label: "ایجنت‌ها", icon: Cpu, badge: "۱", badgeTone: "neutral" },
      { to: "/pipelines", label: "جریان‌ها", icon: Workflow, badge: "۲" },
    ],
  },
  {
    label: "کیفیت و اسناد",
    items: [
      { to: "/quality", label: "کیفیت داده", icon: ShieldCheck, badge: "۹" },
      { to: "/vouchers", label: "اسناد حسابداری", icon: ReceiptText, badge: "۲" },
      { to: "/reports", label: "گزارش‌ها", icon: BarChart3 },
    ],
  },
  {
    label: "سیستم",
    items: [
      { to: "/logs", label: "لاگ و رویدادها", icon: ScrollText },
      { to: "/settings", label: "تنظیمات", icon: Settings },
    ],
  },
];

function useClickOutside<T extends HTMLElement>(onOutside: () => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onOutside]);
  return ref;
}

/* -------------------------------- Sidebar -------------------------------- */
function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sb-brand">
        <Brand size={38} />
      </div>
      <div className="sb-scroll">
        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="sb-group-label">{group.label}</div>
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink key={item.to} to={item.to} end={item.to === "/"} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                  <Icon size={17} strokeWidth={1.9} />
                  <span className="nav-label">{item.label}</span>
                  {item.badge && <span className={`nav-badge ${item.badgeTone ?? ""}`}>{item.badge}</span>}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>
      <div className="sb-foot">
        <div className="usage-card">
          <div className="usage-top">
            <span>مصرف رکورد این ماه</span>
            <span className="num">۷۲٪</span>
          </div>
          <div className="usage-bar">
            <span style={{ width: "72%" }} />
          </div>
          <div className="usage-note">۴٫۳ از ۶ میلیون رکورد · تمدید ۱۴۰۵/۰۹/۰۱</div>
        </div>
        <div className="sb-version">
          <span className="row">
            <i className="dot live" />
            پنل نسخه ۲٫۴٫۱
          </span>
          <span className="mono">build 8421</span>
        </div>
      </div>
    </aside>
  );
}

/* -------------------------------- Topbar -------------------------------- */
function Topbar() {
  const navigate = useNavigate();
  const toast = useToast();
  const [company, setCompany] = useState(companies[0]);
  const [coOpen, setCoOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const coRef = useClickOutside<HTMLDivElement>(() => setCoOpen(false));
  const notifRef = useClickOutside<HTMLDivElement>(() => setNotifOpen(false));
  const userRef = useClickOutside<HTMLDivElement>(() => setUserOpen(false));
  const searchRef = useClickOutside<HTMLDivElement>(() => setSearchOpen(false));

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    const all = [
      ...sources.map((s) => ({ type: "منبع داده", label: s.name, sub: `${s.kind} · ${s.branch}`, to: "/sources", icon: Database })),
      ...pipelines.map((p) => ({ type: "جریان داده", label: p.name, sub: p.company, to: "/pipelines", icon: Workflow })),
      ...vouchers.slice(0, 6).map((v) => ({ type: "سند حسابداری", label: v.number, sub: v.description, to: "/vouchers", icon: ReceiptText })),
      ...companies.map((c) => ({ type: "شرکت", label: c.name, sub: c.industry, to: "/settings", icon: Building2 })),
    ];
    return all.filter((r) => r.label.includes(q) || r.sub.includes(q) || r.type.includes(q)).slice(0, 6);
  }, [query]);

  return (
    <header className="topbar">
      <div className="co-switch" ref={coRef}>
        <button className="co-btn" onClick={() => setCoOpen((v) => !v)} aria-expanded={coOpen}>
          <span className="co-avatar">{company.short.slice(0, 1)}</span>
          <span className="co-meta">
            <b>{company.name}</b>
            <span>
              {toFaDigits(company.branches)} شعبه · دوره آبان ۱۴۰۵
            </span>
          </span>
          <ChevronsUpDown size={14} style={{ color: "var(--muted)" }} />
        </button>
        {coOpen && (
          <div className="pop" style={{ minWidth: 268 }}>
            <div className="menu-head">زمینه سازمانی</div>
            {companies.map((c) => (
              <button
                key={c.id}
                className="co-option"
                onClick={() => {
                  setCompany(c);
                  setCoOpen(false);
                  toast("زمینه تغییر کرد", `اکنون در نمای ${c.name} هستید.`, "info");
                }}
              >
                <span className="co-avatar" style={{ width: 26, height: 26, fontSize: 10 }}>
                  {c.short.slice(0, 1)}
                </span>
                <span className="co-meta">
                  <b>{c.name}</b>
                  <span>{c.industry}</span>
                </span>
                {c.id === company.id && <Check size={14} className="check" />}
              </button>
            ))}
            <div className="menu-sep" />
            <button className="menu-item" onClick={() => { setCoOpen(false); navigate("/settings"); }}>
              <Building2 size={14} /> مدیریت سازمان و شعبه‌ها
            </button>
          </div>
        )}
      </div>

      <span className="topbar-divider" />

      <div className="search" ref={searchRef}>
        <Search size={14} className="search-icon" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSearchOpen(true);
          }}
          onFocus={() => setSearchOpen(true)}
          placeholder="جستجوی سند، منبع، جریان داده…"
          aria-label="جستجو"
        />
        <kbd>/</kbd>
        {searchOpen && query.trim() && (
          <div className="search-pop">
            {results.length === 0 ? (
              <div className="empty" style={{ padding: "18px 10px" }}>نتیجه‌ای پیدا نشد</div>
            ) : (
              <>
                <div className="sp-label">نتایج جستجو</div>
                {results.map((r, i) => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={`${r.label}-${i}`}
                      className="search-item"
                      onClick={() => {
                        navigate(r.to);
                        setSearchOpen(false);
                        setQuery("");
                      }}
                    >
                      <span className="si-icon">
                        <Icon size={14} />
                      </span>
                      <span className="grow">
                        <span>{r.label}</span>
                        <span className="si-sub" style={{ display: "block" }}>{r.sub}</span>
                      </span>
                      <span className="badge badge-muted no-dot">{r.type}</span>
                    </button>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>

      <div className="tb-actions">
        <button
          className="icon-btn"
          title="همگام‌سازی اکنون"
          onClick={() => toast("همگام‌سازی آغاز شد", "منابع متصل در صف همگام‌سازی قرار گرفتند.", "info")}
        >
          <RefreshCw size={16} />
        </button>
        <button className="icon-btn" title="راهنما" onClick={() => toast("مرکز راهنما", "مستندات روناک در دسترس است.", "info")}>
          <CircleHelp size={16} />
        </button>
        <div style={{ position: "relative" }} ref={notifRef}>
          <button className="icon-btn" onClick={() => setNotifOpen((v) => !v)} aria-label="اعلان‌ها" aria-expanded={notifOpen}>
            <Bell size={16} />
            <span className="dot" />
          </button>
          {notifOpen && (
            <div className="pop" style={{ width: 316, padding: 6 }}>
              <div className="row-between" style={{ padding: "6px 8px 8px" }}>
                <b style={{ fontSize: 12 }}>اعلان‌ها</b>
                <button className="btn btn-ghost btn-xs" onClick={() => toast("همه اعلان‌ها خوانده شد", undefined, "success")}>
                  خواندن همه
                </button>
              </div>
              <div className="notif">
                <span className="ni" style={{ background: "var(--danger-dim)", color: "var(--danger)" }}>
                  <ReceiptText size={14} />
                </span>
                <div>
                  <p>ثبت سند ۱۴۰۵-۰۸۲۸-۰۱۲ ناموفق بود — کد حساب مقصد یافت نشد.</p>
                  <span>۴۸ دقیقه پیش</span>
                </div>
              </div>
              <div className="notif">
                <span className="ni" style={{ background: "var(--warn-dim)", color: "var(--warn)" }}>
                  <Cpu size={14} />
                </span>
                <div>
                  <p>ضربان قلب ایجنت مشهد (RONAK-AG-03) با تأخیر دریافت می‌شود.</p>
                  <span>۳۲ دقیقه پیش</span>
                </div>
              </div>
              <div className="notif">
                <span className="ni" style={{ background: "var(--mint-dim)", color: "var(--mint)" }}>
                  <ShieldCheck size={14} />
                </span>
                <div>
                  <p>۲۹ رکورد تکراری به‌صورت خودکار حذف و گزارش آن ثبت شد.</p>
                  <span>۲ ساعت پیش</span>
                </div>
              </div>
              <div className="notif">
                <span className="ni" style={{ background: "var(--indigo-dim)", color: "var(--indigo)" }}>
                  <Sparkles size={14} />
                </span>
                <div>
                  <p>نسخه ۲٫۴٫۱ ایجنت برای ۳ سرور آماده نصب است.</p>
                  <span>دیروز</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <span className="topbar-divider" />
        <div style={{ position: "relative" }} ref={userRef}>
          <button className="user-btn" onClick={() => setUserOpen((v) => !v)} aria-expanded={userOpen}>
            <span className="avatar">م</span>
            <span className="user-meta">
              <b>مهدی رستمی</b>
              <span>مدیر سازمان</span>
            </span>
            <ChevronsUpDown size={13} style={{ color: "var(--muted)" }} />
          </button>
          {userOpen && (
            <div className="pop" style={{ minWidth: 230 }}>
              <div style={{ padding: "8px 9px 10px" }}>
                <div className="row" style={{ marginBottom: 2 }}>
                  <Avatar name="مهدی رستمی" color="#2FE0BE" size={28} />
                  <div>
                    <b style={{ fontSize: 12, display: "block" }}>مهدی رستمی</b>
                    <span className="small muted-2">m.rostami@arman.co</span>
                  </div>
                </div>
                <span className="badge badge-mint no-dot" style={{ marginTop: 6 }}>مدیر سازمان · آرمان</span>
              </div>
              <div className="menu-sep" />
              <button className="menu-item" onClick={() => { setUserOpen(false); navigate("/settings"); }}>
                <UserRound size={14} /> حساب کاربری
              </button>
              <button className="menu-item" onClick={() => { setUserOpen(false); navigate("/settings"); }}>
                <Settings size={14} /> تنظیمات سازمان
              </button>
              <button className="menu-item" onClick={() => { setUserOpen(false); toast("تیکت پشتیبانی", "درخواست شما با شماره #۴۸۲۱ ثبت شد.", "success"); }}>
                <LifeBuoy size={14} /> پشتیبانی
              </button>
              <div className="menu-sep" />
              <button
                className="menu-item"
                style={{ color: "var(--danger)" }}
                onClick={async () => {
                  setUserOpen(false);
                  try { await fetch("/api/logout", { method: "POST" }); } catch {}
                  navigate("/login", { replace: true });
                }}
              >
                <LogOut size={14} /> خروج از حساب
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* -------------------------------- Layout -------------------------------- */
export default function Layout() {
  const navigate = useNavigate();

  useEffect(() => {
    if (import.meta.env.DEV) return;
    let alive = true;
    fetch("/api/session")
      .then((r) => { if (!r.ok && alive) navigate("/login", { replace: true }); })
      .catch(() => {});
    return () => { alive = false; };
  }, [navigate]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        (document.activeElement as HTMLElement | null)?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Topbar />
        <main className="page">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
