import { useState } from "react";
import {
  Settings as SettingsIcon,
  Building2,
  ShieldCheck,
  ArrowLeftRight,
  Bell,
  Copy,
  Check,
  Plus,
  Trash2,
  KeyRound,
  Lock,
  Globe,
  Mail,
  Smartphone,
  Send,
  UserPlus,
  Save,
  Download,
  TriangleAlert,
  Fingerprint,
  RefreshCw,
  CircleCheck,
} from "lucide-react";
import { Badge, Modal, Switch, Tabs, useToast } from "../components/ui";
import { accountMapping, companies, roles, teamMembers } from "../lib/data";
import { faNum } from "../lib/format";

type TabId = "general" | "security" | "mapping" | "notify" | "users";

function SettingRow({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="setting-row">
      <div className="sr-text">
        <b>{title}</b>
        {sub && <span>{sub}</span>}
      </div>
      <div className="sr-ctrl">{children}</div>
    </div>
  );
}

const defaultIps = [
  { ip: "185.55.12.0/24", label: "دفتر مرکزی — تهران", added: "۱۴۰۴/۱۱/۰۲" },
  { ip: "10.20.4.0/24", label: "شبکه داخلی آرمان", added: "۱۴۰۴/۱۲/۱۴" },
  { ip: "10.31.0.0/24", label: "شبکه پارس‌فولاد", added: "۱۴۰۵/۰۲/۰۹" },
];

export default function Settings() {
  const toast = useToast();
  const [tab, setTab] = useState<TabId>("general");
  const [persianDigits, setPersianDigits] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [twoFa, setTwoFa] = useState(true);
  const [sso, setSso] = useState(false);
  const [rotate, setRotate] = useState("۹۰ روز");
  const [lastRotation, setLastRotation] = useState("۱۴۰۵/۰۸/۱۲");
  const [ips, setIps] = useState(defaultIps);
  const [newIp, setNewIp] = useState("");
  const [copied, setCopied] = useState(false);
  const [members, setMembers] = useState(teamMembers);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invite, setInvite] = useState({ email: "", role: "تحلیلگر داده" });
  const [notif, setNotif] = useState<Record<string, boolean>>({
    voucherError: true,
    agentDelay: true,
    qualityHigh: true,
    weekly: true,
    pipelineDone: false,
    loginNew: true,
    email: true,
    bale: true,
    sms: false,
  });
  const [org, setOrg] = useState({
    name: "شرکت پخش آرمان",
    legal: "شرکت پخش آرمان (سهامی خاص)",
    code: "۱۰۱۰۲۴۵۶۷۸۹",
    fiscal: "۱۴۰۵",
    currency: "ریال",
    tz: "Asia/Tehran (UTC+03:30)",
  });

  const toggleNotif = (k: string, label: string) => {
    setNotif((n) => ({ ...n, [k]: !n[k] }));
    toast(notif[k] ? "اعلان غیرفعال شد" : "اعلان فعال شد", label, "info");
  };

  const copyFingerprint = () => {
    navigator.clipboard?.writeText("9F:2C:41:AB:77:0E:D3:5A:81:6B:44:1F:C2:90:DD:3E").catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
    toast("اثر انگشت کپی شد", "برای مقایسه با گواهی ایجنت استفاده کنید.", "success");
  };

  return (
    <>
      <div className="page-head">
        <div>
          <div className="ph-title">
            <h1>تنظیمات</h1>
            <Badge tone="muted" dot={false}>سازمان: آرمان</Badge>
          </div>
          <p>پیکربندی سازمان، امنیت اتصال، نگاشت حساب‌ها، اعلان‌ها و دسترسی کاربران</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-sm" onClick={() => toast("پشتیبان‌گیری پیکربندی", "فایل JSON تنظیمات آماده دانلود شد.", "success")}>
            <Download size={13} /> پشتیبان پیکربندی
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => toast("تنظیمات ذخیره شد", "تغییرات برای همه کاربران سازمان اعمال شد.", "success")}>
            <Save size={13} /> ذخیره تغییرات
          </button>
        </div>
      </div>

      <div className="card">
        <Tabs
          tabs={[
            { id: "general", label: "عمومی" },
            { id: "security", label: "اتصال و امنیت" },
            { id: "mapping", label: "نگاشت حساب‌ها" },
            { id: "notify", label: "اعلان‌ها" },
            { id: "users", label: "کاربران و نقش‌ها" },
          ]}
          active={tab}
          onChange={setTab}
        />

        {tab === "general" && (
          <div className="settings-body">
            <div className="settings-main">
              <section className="setting-section">
                <div className="ss-head">
                  <span className="ss-ic"><Building2 size={15} /></span>
                  <div><b>اطلاعات سازمان</b><span>این اطلاعات در سربرگ اسناد و گزارش‌ها استفاده می‌شود.</span></div>
                </div>
                <div className="form-grid">
                  <div className="field"><label>نام سازمان</label><input className="input" value={org.name} onChange={(e) => setOrg({ ...org, name: e.target.value })} /></div>
                  <div className="field"><label>نام حقوقی</label><input className="input" value={org.legal} onChange={(e) => setOrg({ ...org, legal: e.target.value })} /></div>
                  <div className="field"><label>شناسه ملی</label><input className="input mono" value={org.code} onChange={(e) => setOrg({ ...org, code: e.target.value })} /></div>
                  <div className="field"><label>دوره مالی جاری</label>
                    <select className="select" value={org.fiscal} onChange={(e) => setOrg({ ...org, fiscal: e.target.value })}>
                      <option value="۱۴۰۵">۱۴۰۵</option>
                      <option value="۱۴۰۴">۱۴۰۴</option>
                    </select>
                  </div>
                  <div className="field"><label>واحد پول</label>
                    <select className="select" value={org.currency} onChange={(e) => setOrg({ ...org, currency: e.target.value })}>
                      <option value="ریال">ریال (IRR)</option>
                      <option value="تومان">تومان (IRT)</option>
                    </select>
                  </div>
                  <div className="field"><label>منطقه زمانی</label><input className="input" value={org.tz} onChange={(e) => setOrg({ ...org, tz: e.target.value })} /></div>
                </div>
              </section>

              <section className="setting-section">
                <div className="ss-head">
                  <span className="ss-ic"><Globe size={15} /></span>
                  <div><b>نمایش و منطقه</b><span>قالب نمایش اعداد، تاریخ و زبان پنل.</span></div>
                </div>
                <SettingRow title="ارقام فارسی" sub="نمایش همه اعداد با ارقام فارسی و جداکننده هزارگان">
                  <Switch on={persianDigits} onChange={setPersianDigits} label="ارقام فارسی" />
                </SettingRow>
                <SettingRow title="تقویم شمسی" sub="همه تاریخ‌ها به‌صورت جلالی نمایش داده می‌شوند">
                  <Switch on onChange={() => toast("تقویم شمسی", "تقویم پنل همیشه شمسی است.", "info")} label="تقویم شمسی" />
                </SettingRow>
                <SettingRow title="به‌روزرسانی خودکار صفحه" sub="دریافت وضعیت جدید جریان‌ها هر ۳۰ ثانیه">
                  <Switch on={autoRefresh} onChange={setAutoRefresh} label="به‌روزرسانی خودکار" />
                </SettingRow>
              </section>

              <section className="setting-section">
                <div className="ss-head">
                  <span className="ss-ic"><Lock size={15} /></span>
                  <div><b>دسترسی سازمانی</b><span>شعبه‌ها و شرکت‌های متصل به این پنل.</span></div>
                </div>
                <div className="branch-list">
                  {companies.map((c) => (
                    <div className="branch-row" key={c.id}>
                      <span className="co-avatar" style={{ width: 30, height: 30, fontSize: 11 }}>{c.short.slice(0, 1)}</span>
                      <div className="grow">
                        <b>{c.name}</b>
                        <span>{c.industry} · {c.branches} شعبه</span>
                      </div>
                      <Badge tone="success" dot={false}>فعال</Badge>
                      <span className="chip small">{c.plan}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="settings-side">
              <div className="card soft-card">
                <div className="card-hd"><h3>وضعیت سازمان</h3></div>
                <div className="card-bd">
                  <div className="kv"><span className="k">پلن</span><span className="v">سازمانی</span></div>
                  <div className="kv"><span className="k">اعتبار تا</span><span className="v">۱۴۰۶/۰۲/۱۸</span></div>
                  <div className="kv"><span className="k">رکورد ماه</span><span className="v">۴٫۳ / ۶ میلیون</span></div>
                  <div className="kv"><span className="k">ایجنت‌ها</span><span className="v">{faNum(6)}</span></div>
                  <div className="kv"><span className="k">کاربران</span><span className="v">{faNum(8)}</span></div>
                  <div className="divider" />
                  <button className="btn btn-sm btn-block" onClick={() => toast("مدیریت اشتراک", "برای تغییر پلن با پشتیبانی تماس بگیرید.", "info")}>
                    مدیریت اشتراک
                  </button>
                </div>
              </div>
              <div className="warn-box small">
                <div className="row" style={{ gap: 6, marginBottom: 5 }}><TriangleAlert size={14} className="warn" /><b>نسخه آزمایشی</b></div>
                این محیط پیش‌نمایش محلی است و به هیچ سرویس بیرونی متصل نیست. داده‌ها نمونه هستند.
              </div>
            </aside>
          </div>
        )}

        {tab === "security" && (
          <div className="settings-body">
            <div className="settings-main">
              <section className="setting-section">
                <div className="ss-head">
                  <span className="ss-ic"><Fingerprint size={15} /></span>
                  <div><b>اتصال امن TLS</b><span>اثر انگشت گواهی برای احراز هویت متقابل ایجنت و پنل.</span></div>
                </div>
                <div className="fingerprint">
                  <code className="mono">9F:2C:41:AB:77:0E:D3:5A:81:6B:44:1F:C2:90:DD:3E</code>
                  <button className="btn btn-xs" onClick={copyFingerprint}>
                    {copied ? <Check size={11} /> : <Copy size={11} />} {copied ? "کپی شد" : "کپی"}
                  </button>
                </div>
                <div className="kv small" style={{ marginTop: 8 }}><span className="k">پروتکل</span><span className="v">TLS 1.3 · AES-256-GCM · X25519</span></div>
                <div className="kv small"><span className="k">صدور گواهی</span><span className="v">۱۴۰۵/۰۲/۱۸ — اعتبار ۱۲ ماه</span></div>
                <div className="kv small"><span className="k">آخرین اتصال موفق</span><span className="v">{faNum(4)} دقیقه پیش</span></div>
              </section>

              <section className="setting-section">
                <div className="ss-head">
                  <span className="ss-ic"><KeyRound size={15} /></span>
                  <div><b>چرخش توکن ایجنت</b><span>بازه تمدید خودکار توکن‌های دسترسی.</span></div>
                </div>
                <SettingRow title="بازه چرخش" sub="توکن‌ها پس از این بازه باطل و بازتولید می‌شوند">
                  <div className="seg">
                    {["۳۰ روز", "۶۰ روز", "۹۰ روز"].map((r) => (
                      <button key={r} className={rotate === r ? "on" : ""} onClick={() => { setRotate(r); toast("بازه چرخش تغییر کرد", `توکن‌ها هر ${r} تمدید می‌شوند.`, "info"); }}>{r}</button>
                    ))}
                  </div>
                </SettingRow>
                <SettingRow title="آخرین چرخش" sub="شامل ۶ ایجنت فعال و ۲ توکن API">
                  <div className="row">
                    <span className="small muted">{lastRotation}</span>
                    <button className="btn btn-sm" onClick={() => { setLastRotation("همین حالا"); toast("توکن‌ها چرخش یافتند", "توکن جدید برای همه ایجنت‌ها صادر شد.", "success"); }}>
                      <RefreshCw size={12} /> چرخش فوری
                    </button>
                  </div>
                </SettingRow>
                <SettingRow title="ورود دومرحله‌ای" sub="تأیید با کد یک‌بارمصرف روی اپلیکیشن احراز هویت">
                  <Switch on={twoFa} onChange={setTwoFa} label="ورود دومرحله‌ای" />
                </SettingRow>
                <SettingRow title="ورود یکپارچه (SSO)" sub="اتصال به Google Workspace یا Microsoft Entra">
                  <Switch on={sso} onChange={setSso} label="SSO" />
                </SettingRow>
              </section>

              <section className="setting-section">
                <div className="ss-head">
                  <span className="ss-ic"><ShieldCheck size={15} /></span>
                  <div><b>فهرست مجاز IP</b><span>دسترسی به API و پنل فقط از این محدوده‌ها مجاز است.</span></div>
                </div>
                <div className="ip-add">
                  <input className="input mono" placeholder="مثلاً 192.168.1.0/24" value={newIp} onChange={(e) => setNewIp(e.target.value)} />
                  <button
                    className="btn btn-sm btn-primary"
                    disabled={!newIp.trim()}
                    onClick={() => {
                      setIps((prev) => [...prev, { ip: newIp.trim(), label: "افزوده‌شده دستی", added: "امروز" }]);
                      setNewIp("");
                      toast("محدوده IP افزوده شد", "دسترسی از این محدوده مجاز شد.", "success");
                    }}
                  >
                    <Plus size={13} /> افزودن
                  </button>
                </div>
                <div className="ip-list">
                  {ips.map((row) => (
                    <div className="ip-row" key={row.ip}>
                      <span className="ip-dot" />
                      <span className="mono">{row.ip}</span>
                      <span className="small muted grow">{row.label}</span>
                      <span className="small muted-2">{row.added}</span>
                      <button className="icon-btn" style={{ width: 26, height: 26 }} onClick={() => { setIps((p) => p.filter((x) => x.ip !== row.ip)); toast("محدوده حذف شد", row.ip, "info"); }} aria-label="حذف">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="settings-side">
              <div className="card soft-card">
                <div className="card-hd"><h3>وضعیت امنیتی</h3></div>
                <div className="card-bd">
                  <div className="sec-score">
                    <span className="ss-ring"><ShieldCheck size={18} /></span>
                    <div><b>۹۴ از ۱۰۰</b><span>سطح حفاظت بالا</span></div>
                  </div>
                  <div className="kv"><span className="k">TLS 1.3</span><span className="v mint">فعال</span></div>
                  <div className="kv"><span className="k">دومرحله‌ای</span><span className="v mint">فعال</span></div>
                  <div className="kv"><span className="k">SSO</span><span className="v muted">غیرفعال</span></div>
                  <div className="kv"><span className="k">IP allowlist</span><span className="v">{faNum(ips.length)} محدوده</span></div>
                </div>
              </div>
              <div className="hl-box small">
                <div className="row" style={{ gap: 6, marginBottom: 5 }}><CircleCheck size={14} className="mint" /><b>توصیه</b></div>
                فعال‌سازی SSO سطح امنیت را به ۹۸ می‌رساند و مدیریت دسترسی را ساده‌تر می‌کند.
              </div>
            </aside>
          </div>
        )}

        {tab === "mapping" && (
          <div className="settings-body single">
            <div className="mapping-head">
              <div>
                <h3>نگاشت حساب‌های منبع به مقصد</h3>
                <p>کدهای حساب استخراج‌شده از نرم‌افزار مشتری به کدهای حساب سپیدار نگاشت می‌شوند.</p>
              </div>
              <div className="row">
                <select className="select" defaultValue="سپیدار" style={{ width: "auto" }}>
                  <option>سپیدار سیستم</option>
                  <option>هلو</option>
                  <option>پارسیان</option>
                </select>
                <button className="btn btn-sm btn-primary" onClick={() => toast("نگاشت جدید", "فرم افزودن نگاشت در صفحه اسناد در دسترس است.", "info")}>
                  <Plus size={13} /> نگاشت جدید
                </button>
              </div>
            </div>
            <div className="tbl-wrap">
              <table className="table">
                <thead>
                  <tr><th>کد منبع</th><th>نام حساب منبع</th><th></th><th>کد مقصد</th><th>نام حساب مقصد</th><th>اطمینان</th><th>وضعیت</th><th></th></tr>
                </thead>
                <tbody>
                  {accountMapping.map((m) => (
                    <tr key={`${m.srcCode}-${m.dstCode}`}>
                      <td className="mono t-strong">{m.srcCode}</td>
                      <td>{m.srcName}</td>
                      <td><ArrowLeftRight size={13} style={{ color: "var(--muted-2)" }} /></td>
                      <td className={`mono ${m.status === "missing" ? "danger" : ""}`}>{m.dstCode}</td>
                      <td className={m.status === "missing" ? "danger" : ""}>{m.dstName}</td>
                      <td>
                        <div className="row" style={{ gap: 7 }}>
                          <div className="progress thin" style={{ width: 90 }}>
                            <span style={{ width: `${m.confidence}%`, background: m.confidence > 94 ? "var(--mint)" : m.confidence > 0 ? "var(--warn)" : "var(--danger)" }} />
                          </div>
                          <span className="small num">{faNum(m.confidence)}٪</span>
                        </div>
                      </td>
                      <td>
                        <Badge tone={m.status === "ok" ? "success" : m.status === "review" ? "warn" : "danger"}>
                          {m.status === "ok" ? "معتبر" : m.status === "review" ? "بازبینی" : "تعریف‌نشده"}
                        </Badge>
                      </td>
                      <td><button className="btn btn-xs" onClick={() => toast("ویرایش نگاشت", `${m.srcName} → ${m.dstName}`, "info")}>ویرایش</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-foot">
              <span>{faNum(accountMapping.filter((m) => m.status === "ok").length)} نگاشت فعال · منبع: {org.name}</span>
              <span className="row"><CircleCheck size={12} className="mint" /> تراز اعتبارسنجی: همه اسناد نگاشت‌شده</span>
            </div>
          </div>
        )}

        {tab === "notify" && (
          <div className="settings-body">
            <div className="settings-main">
              <section className="setting-section">
                <div className="ss-head">
                  <span className="ss-ic"><Bell size={15} /></span>
                  <div><b>رویدادهای اعلان</b><span>انتخاب کنید چه رویدادهایی اطلاع‌رسانی شوند.</span></div>
                </div>
                {[
                  { k: "voucherError", t: "خطا در ثبت سند", s: "وقتی ثبت سند در نرم‌افزار مقصد ناموفق باشد" },
                  { k: "agentDelay", t: "تأخیر ضربان ایجنت", s: "بیش از ۵ دقیقه بدون ضربان قلب" },
                  { k: "qualityHigh", t: "موارد کیفیت بحرانی", s: "شناسایی مغایرت جمع یا کد حساب نامعتبر" },
                  { k: "pipelineDone", t: "پایان اجرای جریان", s: "پس از هر اجرای موفق یا ناموفق" },
                  { k: "weekly", t: "گزارش هفتگی", s: "خلاصه عملکرد هر شنبه ساعت ۰۸:۰۰" },
                  { k: "loginNew", t: "ورود از دستگاه جدید", s: "ورود موفق از IP یا مرورگر ناشناس" },
                ].map((n) => (
                  <SettingRow key={n.k} title={n.t} sub={n.s}>
                    <Switch on={!!notif[n.k]} onChange={() => toggleNotif(n.k, n.t)} label={n.t} />
                  </SettingRow>
                ))}
              </section>

              <section className="setting-section">
                <div className="ss-head">
                  <span className="ss-ic"><Send size={15} /></span>
                  <div><b>کانال‌های اطلاع‌رسانی</b><span>پیام‌ها از طریق کانال‌های فعال ارسال می‌شوند.</span></div>
                </div>
                <div className="channel-grid">
                  {[
                    { k: "email", icon: Mail, t: "ایمیل", s: "h.baghaei@arman.co", color: "#7C8CFF" },
                    { k: "bale", icon: Send, t: "بله", s: "@arman_finance", color: "#2FE0BE" },
                    { k: "sms", icon: Smartphone, t: "پیامک", s: "۰۹۱۲••••۴۵۳", color: "#F7B955" },
                  ].map((c) => {
                    const Icon = c.icon;
                    return (
                      <div className={`channel-card ${notif[c.k] ? "on" : ""}`} key={c.k}>
                        <span className="cc-ic" style={{ color: c.color, background: `${c.color}14`, borderColor: `${c.color}2e` }}><Icon size={15} /></span>
                        <div className="grow">
                          <b>{c.t}</b>
                          <span>{c.s}</span>
                        </div>
                        <Switch on={!!notif[c.k]} small onChange={() => toggleNotif(c.k, `کانال ${c.t}`)} label={c.t} />
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>

            <aside className="settings-side">
              <div className="card soft-card">
                <div className="card-hd"><h3>گیرندگان اعلان</h3></div>
                <div className="card-bd">
                  {members.slice(0, 4).map((m) => (
                    <div className="row" key={m.email} style={{ marginBottom: 9 }}>
                      <span className="avatar-sm" style={{ width: 26, height: 26, background: `${m.color}22`, color: m.color }}>{m.initials}</span>
                      <div className="grow">
                        <div style={{ fontSize: 12 }}>{m.name}</div>
                        <div className="small muted-2">{m.email}</div>
                      </div>
                      <span className="dot live" />
                    </div>
                  ))}
                  <div className="divider" />
                  <div className="small muted">اعلان‌های بحرانی برای همه مدیران ارسال می‌شود.</div>
                </div>
              </div>
              <div className="hl-box small">
                <b style={{ display: "block", marginBottom: 4 }}>ساعات سکوت</b>
                اعلان‌های غیربحرانی بین ۲۲:۰۰ تا ۰۷:۰۰ ارسال نمی‌شوند.
              </div>
            </aside>
          </div>
        )}

        {tab === "users" && (
          <div className="settings-body single">
            <div className="mapping-head">
              <div>
                <h3>کاربران و نقش‌ها</h3>
                <p>{faNum(members.length)} کاربر فعال · {faNum(roles.length)} نقش تعریف‌شده</p>
              </div>
              <button className="btn btn-sm btn-primary" onClick={() => setInviteOpen(true)}>
                <UserPlus size={13} /> دعوت کاربر
              </button>
            </div>
            <div className="roles-grid">
              {roles.map((r) => (
                <div className="role-card" key={r.name}>
                  <span className="role-dot" style={{ background: r.color }} />
                  <div className="grow">
                    <b>{r.name}</b>
                    <span>{r.perms}</span>
                  </div>
                  <span className="chip small">{faNum(r.members)} کاربر</span>
                </div>
              ))}
            </div>
            <div className="tbl-wrap">
              <table className="table">
                <thead>
                  <tr><th>کاربر</th><th>ایمیل</th><th>نقش</th><th>آخرین فعالیت</th><th>وضعیت</th><th></th></tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <tr key={m.email}>
                      <td>
                        <div className="row">
                          <span className="avatar-sm" style={{ background: `${m.color}22`, color: m.color }}>{m.initials}</span>
                          <span className="t-strong">{m.name}</span>
                        </div>
                      </td>
                      <td className="mono t-muted">{m.email}</td>
                      <td>
                        <select
                          className="select"
                          style={{ height: 26, fontSize: 11, width: "auto" }}
                          value={m.role}
                          onChange={(e) => {
                            setMembers((prev) => prev.map((x) => (x.email === m.email ? { ...x, role: e.target.value } : x)));
                            toast("نقش تغییر کرد", `${m.name} اکنون ${e.target.value} است.`, "success");
                          }}
                          aria-label={`نقش ${m.name}`}
                        >
                          {roles.map((r) => <option key={r.name} value={r.name}>{r.name}</option>)}
                          <option value="حسابدار">حسابدار</option>
                        </select>
                      </td>
                      <td className="t-muted small">{m.last}</td>
                      <td>{m.last === "آنلاین" ? <Badge tone="success">آنلاین</Badge> : <Badge tone="muted">فعال</Badge>}</td>
                      <td>
                        <button className="icon-btn" style={{ width: 26, height: 26 }} onClick={() => toast("مدیریت کاربر", m.name, "info")} aria-label="مدیریت">
                          <SettingsIcon size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-foot">
              <span>آخرین ورود ناموفق: ۱۴۰۵/۰۸/۲۸ — ۱۴:۰۲ از IP 91.99.••.۲۱</span>
              <span className="row"><ShieldCheck size={12} className="mint" /> نقش‌ها بر اساس اصل حداقل دسترسی</span>
            </div>
          </div>
        )}
      </div>

      <Modal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="دعوت کاربر جدید"
        subtitle="دسترسی به پنل روناک با نقش مشخص"
        width={460}
        footer={
          <>
            <span className="small muted-2">دعوت‌نامه تا ۷۲ ساعت معتبر است</span>
            <div className="row">
              <button className="btn btn-sm btn-ghost" onClick={() => setInviteOpen(false)}>انصراف</button>
              <button
                className="btn btn-sm btn-primary"
                disabled={!invite.email.includes("@")}
                onClick={() => {
                  setMembers((prev) => [...prev, { name: invite.email.split("@")[0], email: invite.email, role: invite.role, last: "دعوت‌شده", initials: invite.email.slice(0, 1), color: "#7C8CFF" }]);
                  setInviteOpen(false);
                  setInvite({ email: "", role: "تحلیلگر داده" });
                  toast("دعوت‌نامه ارسال شد", "کاربر جدید پس از تأیید ایمیل می‌تواند وارد شود.", "success");
                }}
              >
                <Send size={13} /> ارسال دعوت
              </button>
            </div>
          </>
        }
      >
        <div className="form-grid">
          <div className="field" style={{ gridColumn: "span 2" }}><label>ایمیل کاربر</label><input className="input mono" placeholder="name@company.co" value={invite.email} onChange={(e) => setInvite({ ...invite, email: e.target.value })} /></div>
          <div className="field" style={{ gridColumn: "span 2" }}><label>نقش</label>
            <select className="select" value={invite.role} onChange={(e) => setInvite({ ...invite, role: e.target.value })}>
              {roles.map((r) => <option key={r.name} value={r.name}>{r.name} — {r.perms}</option>)}
            </select>
          </div>
        </div>
        <div className="hl-box small" style={{ marginTop: 14, display: "flex", gap: 8 }}>
          <ShieldCheck size={15} className="mint" style={{ flex: "none" }} />
          کاربر دعوت‌شده فقط به بخش‌های مجاز نقش خود دسترسی خواهد داشت.
        </div>
      </Modal>
    </>
  );
}
