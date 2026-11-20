import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Check, X, Info, AlertTriangle, ChevronRight, ChevronLeft, SearchX } from "lucide-react";
import { initials, toFaDigits } from "../lib/format";

/* ------------------------------- Toasts ------------------------------- */
type ToastTone = "success" | "error" | "info";
type ToastItem = { id: number; title: string; body?: string; tone: ToastTone };
type ToastApi = (title: string, body?: string, tone?: ToastTone) => void;

const ToastContext = createContext<ToastApi>(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const seq = useRef(1);

  const push = useCallback<ToastApi>((title, body, tone = "success") => {
    const id = seq.current++;
    setItems((prev) => [...prev.slice(-2), { id, title, body, tone }]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="toast-stack" role="status" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={`toast ${t.tone}`}>
            <span className="ti">
              {t.tone === "success" ? <Check size={14} /> : t.tone === "error" ? <AlertTriangle size={14} /> : <Info size={14} />}
            </span>
            <div className="grow">
              <b>{t.title}</b>
              {t.body && <span className="small muted">{t.body}</span>}
            </div>
            <button
              className="close-btn"
              style={{ width: 22, height: 22 }}
              onClick={() => setItems((prev) => prev.filter((x) => x.id !== t.id))}
              aria-label="بستن"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/* -------------------------------- Badge -------------------------------- */
export type Tone = "mint" | "success" | "warn" | "danger" | "indigo" | "muted";

export function Badge({
  tone = "muted",
  children,
  icon,
  dot = true,
  className = "",
}: {
  tone?: Tone;
  children: ReactNode;
  icon?: ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span className={`badge badge-${tone} ${dot ? "" : "no-dot"} ${className}`}>
      {icon}
      {children}
    </span>
  );
}

/* ------------------------------- Avatar -------------------------------- */
export function Avatar({ name, color, size = 24 }: { name: string; color?: string; size?: number }) {
  return (
    <span
      className="avatar-sm"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        background: color
          ? `linear-gradient(150deg, ${color}, ${color}88)`
          : "linear-gradient(150deg,#7c8cff,#4d5fd8)",
        color: "#05101f",
        fontWeight: 700,
      }}
      title={name}
    >
      {initials(name)}
    </span>
  );
}

/* -------------------------------- Modal -------------------------------- */
export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 560,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: width }} role="dialog" aria-modal="true">
        <div className="modal-hd">
          <div>
            <h3>{title}</h3>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button className="close-btn" onClick={onClose} aria-label="بستن">
            <X size={16} />
          </button>
        </div>
        <div className="modal-bd">{children}</div>
        {footer && <div className="modal-ft">{footer}</div>}
      </div>
    </div>
  );
}

/* -------------------------------- Drawer ------------------------------- */
export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 480,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="drawer-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside className="drawer" style={{ width }} role="dialog" aria-modal="true">
        <div className="drawer-hd">
          <div className="grow">
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>{title}</h3>
            {subtitle && <p className="small muted" style={{ marginTop: 3 }}>{subtitle}</p>}
          </div>
          <button className="close-btn" onClick={onClose} aria-label="بستن">
            <X size={16} />
          </button>
        </div>
        <div className="drawer-bd">{children}</div>
        {footer && <div className="drawer-ft">{footer}</div>}
      </aside>
    </div>
  );
}

/* -------------------------------- Switch ------------------------------- */
export function Switch({
  on,
  onChange,
  small,
  label,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  small?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label ?? "تغییر وضعیت"}
      className={`switch ${small ? "sm" : ""} ${on ? "on" : ""}`}
      onClick={() => onChange(!on)}
    />
  );
}

/* ------------------------------- Progress ------------------------------ */
export function Progress({ value, tone = "mint", thin }: { value: number; tone?: "mint" | "warn" | "danger"; thin?: boolean }) {
  return (
    <div className={`progress ${tone} ${thin ? "thin" : ""}`}>
      <span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

/* -------------------------------- Tabs --------------------------------- */
export function Tabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: Array<{ id: T; label: string; count?: number }>;
  active: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          className={`tab ${active === t.id ? "on" : ""}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
          {typeof t.count === "number" && <span className="count">{toFaDigits(t.count)}</span>}
        </button>
      ))}
    </div>
  );
}

/* -------------------------------- Pager -------------------------------- */
export function Pager({ page, pages, onPage }: { page: number; pages: number; onPage: (p: number) => void }) {
  const list = useMemo(() => {
    const out: number[] = [];
    for (let p = 1; p <= Math.min(pages, 5); p++) out.push(p);
    return out;
  }, [pages]);

  return (
    <div className="pager">
      <button onClick={() => onPage(Math.max(1, page - 1))} disabled={page === 1} aria-label="قبلی">
        <ChevronRight size={13} />
      </button>
      {list.map((p) => (
        <button key={p} className={p === page ? "on" : ""} onClick={() => onPage(p)}>
          {toFaDigits(p)}
        </button>
      ))}
      {pages > 5 && <span className="muted-2">…</span>}
      <button onClick={() => onPage(Math.min(pages, page + 1))} disabled={page === pages} aria-label="بعدی">
        <ChevronLeft size={13} />
      </button>
    </div>
  );
}

/* ------------------------------ Empty state ---------------------------- */
export function Empty({ text = "موردی برای نمایش وجود ندارد" }: { text?: string }) {
  return (
    <div className="empty">
      <SearchX size={22} />
      {text}
    </div>
  );
}

/* -------------------------------- Check -------------------------------- */
export function CheckBox({ on }: { on: boolean }) {
  return <span className={`cb ${on ? "on" : ""}`}>{on && <Check size={11} strokeWidth={3} />}</span>;
}
