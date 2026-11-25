import { useSearchParams } from "react-router-dom";
import { ShoppingBag, Users, ReceiptText, Wallet, Percent, Download, Plus } from "lucide-react";
import { Badge, Tabs, useToast } from "../components/ui";
import { faNum, shortNum } from "../lib/format";
import { customers, salesInvoices, aging, salesTotals } from "../lib/business";

export default function Sales() {
  const [params, setParams] = useSearchParams();
  const tab = (params.get("tab") ?? "cust") as "cust" | "inv" | "ar" | "com";
  const setTab = (t: "cust" | "inv" | "ar" | "com") => setParams({ tab: t }, { replace: true });
  const toast = useToast();
  const totalAR = aging.reduce((s, a) => s + a.amount, 0);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="ph-title"><h1>فروش و مشتریان</h1><Badge tone="mint" dot={false}>هدف ماه: ۸۵٪</Badge></div>
          <p>مشتریان، فاکتورها، وصول مطالبات و پورسانت تیم فروش — سال ۱۴۰۴</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-sm"><Download size={13} /> خروجی</button>
          <button className="btn btn-sm btn-primary" onClick={() => toast("فاکتور جدید", "فرم صدور فاکتور باز شد.", "info")}><Plus size={13} /> فاکتور جدید</button>
        </div>
      </div>

      <div className="kpi-grid">
        {[
          { label: "فروش اسفند ۱۴۰۴", value: salesTotals.esfand, icon: ShoppingBag, c: "#2FE0BE", hint: `${faNum(salesTotals.esfandCount)} فاکتور` },
          { label: "وصول‌شده", value: salesTotals.receipts, icon: Wallet, c: "#7BE495", hint: `${faNum(salesTotals.receiptCount)} فیش دریافت` },
          { label: "مطالبات باز", value: totalAR, icon: ReceiptText, c: "#F7B955", hint: `${faNum(customers.length)} مشتری` },
          { label: "میانگین هر فاکتور", value: Math.round(salesTotals.sales / salesTotals.invoices), icon: Percent, c: "#7C8CFF", hint: `${faNum(salesTotals.invoices)} فاکتور` },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="kpi card">
              <div className="kpi-top"><span className="kpi-label">{k.label}</span><span className="kpi-icon" style={{ color: k.c }}><Icon size={15} /></span></div>
              <div className="kpi-value">{shortNum(k.value)} <small>تومان</small></div>
              <div className="kpi-foot"><span className="small muted">{k.hint}</span></div>
            </div>
          );
        })}
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <div className="card-hd">
          <h3><ShoppingBag size={15} /> چرخه فروش</h3>
          <Tabs
            tabs={[
              { id: "cust", label: "مشتریان", count: customers.length },
              { id: "inv", label: "فاکتورها", count: salesInvoices.length },
              { id: "ar", label: "وصول مطالبات" },
            ]}
            active={tab}
            onChange={setTab}
          />
        </div>
        <div className="card-bd flush">
          {tab === "cust" && (
            <table className="table">
              <thead><tr><th>مشتری</th><th>شهر</th><th>مانده حساب</th><th>سقف اعتبار</th><th>آخرین خرید</th><th>کارشناس</th><th>وضعیت</th></tr></thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.name}>
                    <td className="t-strong">{c.name}</td>
                    <td className="t-muted">{c.city}</td>
                    <td className="t-num">{faNum(c.balance)}</td>
                    <td className="t-num t-muted">{faNum(c.credit)}</td>
                    <td className="t-muted">{c.last}</td>
                    <td className="t-muted">{c.rep}</td>
                    <td><Badge tone={c.status === "فعال" ? "success" : "muted"}>{c.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === "inv" && (
            <table className="table">
              <thead><tr><th>شماره فاکتور</th><th>مشتری</th><th>تاریخ</th><th>مبلغ</th><th>سرسید</th><th>وضعیت</th></tr></thead>
              <tbody>
                {salesInvoices.map((i) => (
                  <tr key={i.no}>
                    <td className="t-num">{i.no}</td>
                    <td className="t-strong">{i.customer}</td>
                    <td className="t-muted">{i.date}</td>
                    <td className="t-num">{faNum(i.amount)}</td>
                    <td className="t-muted">{i.due}</td>
                    <td><Badge tone={i.status === "ثبت‌شده" ? "success" : i.status === "سرسید" ? "warn" : "muted"}>{i.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === "ar" && (
            <div style={{ padding: 16 }}>
              <div className="mg-bars">
                {aging.map((a) => (
                  <div key={a.bucket} className="mg-bar-row">
                    <span className="small">{a.bucket}</span>
                    <div className="mg-bar-track"><i style={{ width: `${(a.amount / totalAR) * 100}%`, background: a.color }} /></div>
                    <b className="num small">{shortNum(a.amount)}</b>
                  </div>
                ))}
              </div>
              <table className="table" style={{ marginTop: 14 }}>
                <thead><tr><th>مشتری</th><th>مانده</th><th>سرسید</th><th>وضعیت</th></tr></thead>
                <tbody>
                  {customers.filter((c) => c.balance > 0).map((c) => (
                    <tr key={c.name}>
                      <td className="t-strong">{c.name}</td>
                      <td className="t-num">{faNum(c.balance)}</td>
                      <td className="t-muted">{c.last}</td>
                      <td><Badge tone={c.balance > 1_000_000_000 ? "warn" : "success"}>{c.balance > 1_000_000_000 ? "پیگیری" : "جاری"}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>

      <div className="mg-foot-note"><Users size={13} /> داده‌های فروش از فاکتورهای ثبت‌شده در نرم‌افزار حسابداری و ماژول فروش ایجنت خوانده می‌شود.</div>
    </div>
  );
}
