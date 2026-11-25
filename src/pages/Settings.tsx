import { useState } from "react";
import { Building2, Database, Users2, ListTree } from "lucide-react";
import { Badge, Tabs } from "../components/ui";
import { faNum } from "../lib/format";
import { companies, accountMapping, roles, teamMembers } from "../lib/data";
import { sep } from "../lib/sepidar";

type TabId = "general" | "mapping" | "users";

export default function Settings() {
  const [tab, setTab] = useState<TabId>("general");
  const company = companies[0];
  const meta = sep.meta;

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow">سیستم</div>
          <h1>تنظیمات و نگاشت</h1>
          <p>اطلاعات شرکت، منبع داده سپیدار و نگاشت حساب‌های استخراج‌شده</p>
        </div>
      </div>

      <div className="card">
        <Tabs
          tabs={[
            { id: "general", label: "شرکت و منبع داده" },
            { id: "mapping", label: "نگاشت حساب‌ها", count: accountMapping.length },
            { id: "users", label: "کاربران", count: teamMembers.length },
          ]}
          active={tab}
          onChange={(id) => setTab(id as TabId)}
        />

        {tab === "general" && (
          <div className="settings-body">
            <div className="settings-main">
              <section className="setting-section">
                <div className="ss-head">
                  <span className="ss-ic"><Building2 size={15} /></span>
                  <div><b>اطلاعات شرکت</b><span>مطابق فیلدهای ثبت‌شده در دیتابیس سپیدار.</span></div>
                </div>
                <div className="kv"><span className="k">نام شرکت</span><span className="v">{meta.company.name}</span></div>
                <div className="kv"><span className="k">شناسه اقتصادی / ملی</span><span className="v mono">{meta.company.economicCode}</span></div>
                <div className="kv"><span className="k">کد پستی</span><span className="v mono">{meta.company.postalCode}</span></div>
                <div className="kv"><span className="k">آدرس</span><span className="v">{meta.company.address}</span></div>
                <div className="kv"><span className="k">سال مالی</span><span className="v">{meta.fy.label} — {meta.fy.start} تا {meta.fy.end}</span></div>
                <div className="kv"><span className="k">واحد پول</span><span className="v">ریال</span></div>
                <div className="kv"><span className="k">شعبه</span><span className="v">{company?.short} — {company?.branches} شعبه</span></div>
              </section>

              <section className="setting-section">
                <div className="ss-head">
                  <span className="ss-ic"><Database size={15} /></span>
                  <div><b>منبع داده</b><span>این پنل فقط از خروجی همین دیتابیس ساخته شده است.</span></div>
                </div>
                <div className="kv"><span className="k">نرم‌افزار</span><span className="v">سپیدار سیستم نسخه ۶٫۱٫۹</span></div>
                <div className="kv"><span className="k">دیتابیس</span><span className="v mono">Sepidar01 — SQL Server 2008 (Compatibility 100)</span></div>
                <div className="kv"><span className="k">تاریخ نسخه پشتیبان</span><span className="v">۱۴۰۵/۰۸/۲۳ — ساعت ۱۴:۲۷</span></div>
                <div className="kv"><span className="k">حجم فایل پشتیبان</span><span className="v">۸۷ مگابایت</span></div>
                <div className="kv"><span className="k">تعداد جدول دارای داده</span><span className="v">{faNum(414)}</span></div>
                <div className="kv"><span className="k">اسناد سال {meta.fy.label}</span><span className="v">{faNum(meta.counts.vouchers)} سند — {faNum(meta.counts.lines)} ردیف</span></div>
                <div className="kv"><span className="k">حساب‌ها / طرف حساب‌ها</span><span className="v">{faNum(meta.counts.accounts)} / {faNum(meta.counts.parties)}</span></div>
                <div className="kv"><span className="k">فاکتور فروش / خرید</span><span className="v">{faNum(meta.counts.invoices)} / {faNum(227)}</span></div>
              </section>
            </div>

            <aside className="settings-side">
              <div className="card soft-card">
                <div className="card-hd"><h3>وضعیت استخراج</h3></div>
                <div className="card-bd">
                  <div className="kv"><span className="k">حالت</span><span className="v"><Badge tone="success">کامل</Badge></span></div>
                  <div className="kv"><span className="k">سال‌های بارگذاری‌شده</span><span className="v">{meta.fy.label} و {meta.prev.label}</span></div>
                  <div className="kv"><span className="k">اسناد</span><span className="v">{faNum(meta.counts.vouchers)}</span></div>
                  <div className="kv"><span className="k">چک‌ها</span><span className="v">{faNum(meta.counts.checks)}</span></div>
                  <div className="kv"><span className="k">اقلام انبار</span><span className="v">{faNum(meta.counts.items)}</span></div>
                </div>
              </div>
              <div className="warn-box small">
                <div className="row" style={{ gap: 6, marginBottom: 5 }}><ListTree size={14} className="warn" /><b>صحت‌سنجی</b></div>
                هر عدد این پنل مستقیماً از جداول سپیدار خوانده شده است؛ اسناد اختتامیه و بستن حساب‌ها فقط در محاسبه سود و ترازنامه کنار گذاشته می‌شوند.
              </div>
            </aside>
          </div>
        )}

        {tab === "mapping" && (
          <div className="settings-body">
            <div className="settings-main">
              <section className="setting-section">
                <div className="ss-head">
                  <span className="ss-ic"><ListTree size={15} /></span>
                  <div><b>نگاشت حساب‌های کلیدی</b><span>کد حساب سپیدار و مسیر کامل آن در درخت حساب‌ها.</span></div>
                </div>
                <div className="table-wrap">
                  <table className="table">
                    <thead>
                      <tr><th>کد حساب</th><th>عنوان حساب</th><th>مسیر درخت</th><th>اطمینان</th></tr>
                    </thead>
                    <tbody>
                      {accountMapping.map((m) => (
                        <tr key={m.srcCode + m.dstCode}>
                          <td className="mono">{m.srcCode}</td>
                          <td className="t-strong">{m.srcName}</td>
                          <td className="mono t-muted">{m.dstCode}</td>
                          <td><Badge tone="success">{m.confidence}٪</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>
        )}

        {tab === "users" && (
          <div className="settings-body">
            <div className="settings-main">
              <section className="setting-section">
                <div className="ss-head">
                  <span className="ss-ic"><Users2 size={15} /></span>
                  <div><b>کاربران سپیدار</b><span>کاربران ثبت‌شده در جدول User دیتابیس.</span></div>
                </div>
                <div className="table-wrap">
                  <table className="table">
                    <thead><tr><th>نام</th><th>نام کاربری</th><th>نقش در پنل</th></tr></thead>
                    <tbody>
                      {teamMembers.map((m) => (
                        <tr key={m.email}>
                          <td className="t-strong">{m.name}</td>
                          <td className="mono">{m.email}</td>
                          <td className="t-muted">{m.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
              <section className="setting-section">
                <div className="ss-head">
                  <span className="ss-ic"><Users2 size={15} /></span>
                  <div><b>نقش‌ها</b><span>سطوح دسترسی تعریف‌شده در پنل.</span></div>
                </div>
                <div className="kv-list">
                  {roles.map((r) => (
                    <div className="kv" key={r.name}>
                      <span className="k">{r.name}</span>
                      <span className="v">{faNum(r.members)} کاربر — {faNum(Array.isArray(r.perms) ? r.perms.length : 0)} دسترسی</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
