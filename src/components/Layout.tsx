import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Database,
  ReceiptText,
  BarChart3,
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
  Gauge,
  Wallet,
  Package,
  FileSpreadsheet,
  Users,
  ShoppingBag,
  Truck,
  ShoppingCart,
  PackageCheck,
  ChevronDown,
} from "lucide-react";
import { Brand } from "./Brand";
import { Avatar, useToast } from "./ui";
import { companies, vouchers, sources } from "../lib/data";
import { toFaDigits } from "../lib/format";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; badge?: string; badgeTone?: string };
type NavGroup = { id: string; label: string; icon: typeof LayoutDashboard; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    id: "finance",
    label: "مدیریت مالی",
    icon: Gauge,
    items: [
      { to: "/", label: "نمای مدیریتی", icon: Gauge },
      { to: "/vouchers", label: "اسناد حسابداری", icon: ReceiptText },
      { to: "/statements", label: "صورت‌های مالی", icon: FileSpreadsheet },
      { to: "/treasury", label: "خزانه‌داری و چک‌ها", icon: Wallet },
      { to: "/inventory", label: "انبار و دارایی‌ها", icon: Package },
      { to: "/payroll", label: "حقوق و دستمزد", icon: Wallet },
      { to: "/reports", label: "گزارش‌ها", icon: BarChart3 },
    ],
  },
  {
    id: "sales",
    label: "فروش",
    icon: ShoppingBag,
    items: [
      { to: "/sales?tab=cust", label: "مشتریان", icon: Users },
      { to: "/sales?tab=inv", label: "فاکتورها", icon: ReceiptText },
      { to: "/sales?tab=ar", label: "وصول مطالبات", icon: Wallet },
    ],
  },
  {
    id: "procurement",
    label: "خرید و تأمین",
    icon: Truck,
    items: [
      { to: "/procurement?tab=sup", label: "تأمین‌کنندگان", icon: Truck },
      { to: "/procurement?tab=po", label: "سفارش خرید", icon: ShoppingCart },
      { to: "/procurement?tab=grn", label: "پرداخت‌ها", icon: PackageCheck },
    ],
  },
  {
    id: "data",
    label: "تنظیمات",
    icon: Database,
    items: [
      { to: "/settings", label: "شرکت و نگاشت حساب‌ها", icon: Settings },
    ],
  },
];

function samePath(to: string, pathname: string) {
  const p = to.split("?")[0];
  return p === "/" ? pathname === "/" : pathname === p || pathname.startsWith(p + "/");
}

function matches(to: string, pathname: string, search: string) {
  const [p, q] = to.split("?");
  const pathOk = pathname === p;
  const searchOk = !q || search === `?${q}`;
  return pathOk && searchOk;
}

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
  const loc = useLocation();
  const activeGroup = navGroups.find((g) => g.items.some((i) => samePath(i.to, loc.pathname)));
  const exact = activeGroup?.items.find((i) => matches(i.to, loc.pathname, loc.search));
  const activeTo = exact?.to ?? activeGroup?.items.find((i) => samePath(i.to, loc.pathname))?.to;
  const [open, setOpen] = useState<Record<string, boolean>>(() => ({ [activeGroup?.id ?? "finance"]: true }));

  useEffect(() => {
    if (activeGroup) setOpen((o) => (o[activeGroup.id] ? o : { ...o, [activeGroup.id]: true }));
  }, [activeGroup?.id]);

  return (
    <aside className="sidebar">
      <div className="sb-brand">
        <Brand size={38} />
      </div>
      <div className="sb-scroll">
        {navGroups.map((group) => {
          const isOpen = !!open[group.id];
          const GroupIcon = group.icon;
          const groupActive = group.id === activeGroup?.id;
          return (
            <div key={group.id} className="sb-group">
              <button
                className={`sb-group-btn ${isOpen ? "open" : ""} ${groupActive ? "active" : ""}`}
                onClick={() => setOpen((o) => ({ ...o, [group.id]: !o[group.id] }))}
              >
                <GroupIcon size={14} strokeWidth={1.9} />
                <span>{group.label}</span>
                <ChevronDown size={12} className="chev" />
              </button>
              {isOpen && (
                <div className="sb-items">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = item.to === activeTo;
                    return (
                      <NavLink key={item.to} to={item.to} className={() => `nav-item ${active ? "active" : ""}`}>
                        <Icon size={16} strokeWidth={1.9} />
                        <span className="nav-label">{item.label}</span>
                        {item.badge && <span className={`nav-badge ${item.badgeTone ?? ""}`}>{item.badge}</span>}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
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
      ...sources.map((s) => ({ type: "منبع داده", label: s.name, sub: `${s.kind} · ${s.branch}`, to: "/settings", icon: Database })),
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
              {toFaDigits(company.branches)} شعبه · دوره سال ۱۴۰۴
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
                <span className="ni" style={{ background: "var(--mint-dim)", color: "var(--mint)" }}>
                  <ReceiptText size={14} />
                </span>
                <div>
                  <p>سند ۲۸۸۲ — شناسایی حقوق و دستمزد اسفند ۱۴۰۴ ثبت شد.</p>
                  <span>۱۴۰۴/۱۲/۲۹</span>
                </div>
              </div>
              <div className="notif">
                <span className="ni" style={{ background: "var(--indigo-dim)", color: "var(--indigo)" }}>
                  <BarChart3 size={14} />
                </span>
                <div>
                  <p>سند اختتامیه ۱۴۰۴ (شماره ۲۸۹۳) و بستن حساب‌های سود و زیان ثبت شده است.</p>
                  <span>۱۴۰۴/۱۲/۳۰</span>
                </div>
              </div>
              <div className="notif">
                <span className="ni" style={{ background: "var(--warn-dim)", color: "var(--warn)" }}>
                  <Wallet size={14} />
                </span>
                <div>
                  <p>۹۱ چک دریافتی در جریان به مبلغ ۱۴٬۰۳۹ میلیون تومان.</p>
                  <span>پایان سال ۱۴۰۴</span>
                </div>
              </div>
              <div className="notif">
                <span className="ni" style={{ background: "var(--warn-dim)", color: "var(--warn)" }}>
                  <Package size={14} />
                </span>
                <div>
                  <p>۵ قلم کالا زیر حد سفارش است — موجودی انبار ۱۲٫۷ میلیارد تومان.</p>
                  <span>پایان سال ۱۴۰۴</span>
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
              <b>سرپرست</b>
              <span>مدیر سیستم</span>
            </span>
            <ChevronsUpDown size={13} style={{ color: "var(--muted)" }} />
          </button>
          {userOpen && (
            <div className="pop" style={{ minWidth: 230 }}>
              <div style={{ padding: "8px 9px 10px" }}>
                <div className="row" style={{ marginBottom: 2 }}>
                  <Avatar name="سرپرست" color="#2FE0BE" size={28} />
                  <div>
                    <b style={{ fontSize: 12, display: "block" }}>سرپرست</b>
                    <span className="small muted-2">admin — تدبیر صنعت پلاست</span>
                  </div>
                </div>
                <span className="badge badge-mint no-dot" style={{ marginTop: 6 }}>مدیر سیستم · تدبیر صنعت پلاست</span>
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
