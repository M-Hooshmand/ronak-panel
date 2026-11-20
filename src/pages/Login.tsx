import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles, Check, Building2, Globe } from "lucide-react";
import { Brand, BrandMark } from "../components/Brand";
import { useToast } from "../components/ui";

export default function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);

  useEffect(() => {
    fetch("/api/session")
      .then((r) => { if (r.ok) navigate("/", { replace: true }); })
      .catch(() => {});
  }, [navigate]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password: pass }),
      });
      if (res.ok) {
        toast("خوش آمدید", "ورود موفق به پنل سازمانی روناک.", "success");
        navigate("/", { replace: true });
        return;
      }
      const data = await res.json().catch(() => ({}));
      toast("ورود ناموفق", data.error || "نام کاربری یا رمز عبور اشتباه است.", "error");
    } catch {
      if (import.meta.env.DEV) {
        toast("حالت توسعه", "سرور احراز هویت در دسترس نیست؛ ورود محلی فعال شد.", "info");
        navigate("/", { replace: true });
        return;
      }
      toast("خطا", "ارتباط با سرور برقرار نشد.", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login">
      <div className="login-brand">
        <div className="lb-glow" />
        <svg className="lb-rings" viewBox="0 0 600 600" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="lg1" x1="80" y1="520" x2="520" y2="80">
              <stop stopColor="#2FE0BE" stopOpacity=".55" />
              <stop offset="1" stopColor="#7C8CFF" stopOpacity=".35" />
            </linearGradient>
          </defs>
          {[120, 170, 220, 270].map((r, i) => (
            <circle key={r} cx="300" cy="300" r={r} stroke="url(#lg1)" strokeOpacity={0.28 - i * 0.05} strokeDasharray={i % 2 ? "3 8" : "0"} />
          ))}
          <circle cx="300" cy="300" r="70" stroke="url(#lg1)" strokeWidth="1.2" />
          <circle cx="300" cy="300" r="4" fill="#2FE0BE" />
          <circle cx="300" cy="80" r="3.5" fill="#7C8CFF" />
          <circle cx="471" cy="385" r="3" fill="#2FE0BE" />
          <circle cx="176" cy="461" r="2.5" fill="#7C8CFF" />
        </svg>

        <div className="lb-top">
          <Brand size={42} />
        </div>

        <div className="lb-body">
          <span className="lb-eyebrow"><Sparkles size={12} /> یکپارچه‌سازی داده‌های مالی</span>
          <h1>
            داده‌های مالی،
            <br />
            <span className="grad">شفاف و یکپارچه</span>
          </h1>
          <p className="lb-lead">
            روناک داده‌های نرم‌افزار حسابداری شما را به‌صورت امن استخراج، پاک‌سازی و اعتبارسنجی می‌کند و اسناد آماده را
            به‌صورت خودکار در نرم‌افزار مقصد ثبت می‌نماید.
          </p>

          <div className="lb-features">
            {[
              "اتصال امن TLS به دیتابیس بدون تغییر در نرم‌افزار",
              "کیفیت داده و نگاشت خودکار کدهای حساب",
              "ثبت اسناد حسابداری با شماره پیگیری در مقصد",
            ].map((f) => (
              <div className="lb-feature" key={f}>
                <span className="lf-check"><Check size={11} strokeWidth={3} /></span>
                {f}
              </div>
            ))}
          </div>

          <div className="lb-stats">
            <div><b>۱۴٫۲M</b><span>رکورد پردازش‌شده ماهانه</span></div>
            <div><b>۹۹٫۸٪</b><span>پایداری اتصال ایجنت</span></div>
            <div><b>۰٫۴s</b><span>میانگین زمان پاسخ</span></div>
          </div>
        </div>

        <div className="lb-foot">
          <span className="row"><ShieldCheck size={13} /> ISO 27001 · رمزنگاری سرتاسری</span>
          <span className="row"><Globe size={13} /> سرویس ابری داخلی</span>
        </div>
      </div>

      <div className="login-form-wrap">
        <div className="login-card">
          <div className="lf-head">
            <span className="lf-mark"><BrandMark size={40} /></span>
            <div>
              <h2>ورود به پنل سازمانی</h2>
              <p>برای ادامه، اطلاعات حساب کاربری خود را وارد کنید.</p>
            </div>
          </div>

          <div className="org-chip">
            <span className="co-avatar" style={{ width: 26, height: 26, fontSize: 10 }}>آ</span>
            <div className="grow">
              <b>شرکت پخش آرمان</b>
              <span>آخرین ورود: امروز ۱۰:۰۲ — تهران</span>
            </div>
            <Building2 size={14} className="muted" />
          </div>

          <form onSubmit={submit} className="login-form">
            <div className="field">
              <label>نام کاربری</label>
              <div className="input-icon">
                <Mail size={14} />
                <input
                  className="input"
                  type="text"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="username"
                  autoComplete="username"
                  required
                />
              </div>
            </div>
            <div className="field">
              <label>رمز عبور</label>
              <div className="input-icon">
                <Lock size={14} />
                <input
                  className="input"
                  type={show ? "text" : "password"}
                  dir="ltr"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button type="button" className="input-eye" onClick={() => setShow((v) => !v)} aria-label="نمایش رمز">
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="row-between">
              <label className="remember">
                <span className={`cb ${remember ? "on" : ""}`} onClick={(e) => { e.preventDefault(); setRemember((v) => !v); }}>
                  {remember && <Check size={11} strokeWidth={3} />}
                </span>
                مرا به خاطر بسپار
              </label>
              <button type="button" className="link-btn" onClick={() => toast("بازیابی رمز", "لینک بازیابی به ایمیل شما ارسال شد.", "info")}>
                فراموشی رمز عبور؟
              </button>
            </div>

            <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={busy}>
              {busy ? "در حال ورود…" : "ورود به پنل"} {!busy && <ArrowLeft size={15} />}
            </button>

            <div className="login-or"><span>یا</span></div>

            <button type="button" className="btn btn-block" onClick={() => toast("ورود یکپارچه", "اتصال به Microsoft Entra در این نسخه فعال نیست.", "info")}>
              <span className="ms-logo"><i /><i /><i /><i /></span>
              ورود با حساب سازمانی (SSO)
            </button>
          </form>

          <div className="lf-foot">
            <span>نسخه نمایشی — داده‌ها نمونه هستند</span>
            <span className="mono">v2.4.1</span>
          </div>
        </div>

        <div className="login-bottom">
          <span>© ۱۴۰۵ روناک — ویرا ابر آینده جهان</span>
          <span className="row" style={{ gap: 12 }}>
            <span>شرایط استفاده</span>
            <span>حریم خصوصی</span>
            <span>پشتیبانی</span>
          </span>
        </div>
      </div>
    </div>
  );
}
