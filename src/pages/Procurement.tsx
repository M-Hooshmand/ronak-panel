import { useSearchParams } from "react-router-dom";
import { Truck, ClipboardList, ShoppingCart, PackageCheck, Star, Plus } from "lucide-react";
import { Badge, Tabs, useToast } from "../components/ui";
import { faNum, shortNum, pct } from "../lib/format";
import { suppliers, purchaseRequests, purchaseOrders, receipts } from "../lib/business";

export default function Procurement() {
  const [params, setParams] = useSearchParams();
  const tab = (params.get("tab") ?? "sup") as "sup" | "req" | "po" | "grn";
  const setTab = (t: "sup" | "req" | "po" | "grn") => setParams({ tab: t }, { replace: true });
  const toast = useToast();
  const payable = suppliers.reduce((s, x) => s + x.balance, 0);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="ph-title"><h1>تأمین و خرید</h1><Badge tone="muted" dot={false}>داده سپیدار — سال ۱۴۰۴</Badge></div>
          <p>تأمین‌کنندگان، درخواست خرید، سفارش خرید و رسید انبار — سال ۱۴۰۴</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-sm btn-primary" onClick={() => toast("درخواست خرید", "فرم درخواست خرید باز شد.", "info")}><Plus size={13} /> درخواست خرید</button>
        </div>
      </div>

      <div className="kpi-grid">
        {[
          { label: "خرید از تأمین‌کنندگان", value: payable, icon: Truck, c: "#F7B955", hint: `${faNum(suppliers.length)} تأمین‌کننده` },
          { label: "درخواست در انتظار", value: faNum(purchaseRequests.filter((r) => r.status === "در انتظار تأیید").length), icon: ClipboardList, c: "#7C8CFF", hint: "تأیید مدیر مالی/عامل", raw: true },
          { label: "سفارش باز", value: faNum(purchaseOrders.filter((o) => o.status !== "دریافت‌شده").length), icon: ShoppingCart, c: "#2FE0BE", hint: `${faNum(purchaseOrders.length)} سفارش خرید ثبت‌شده`, raw: true },
          { label: "رسید انبار", value: faNum(receipts.length), icon: PackageCheck, c: "#7BE495", hint: "پرداخت‌های ثبت‌شده سال ۱۴۰۴", raw: true },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="kpi card">
              <div className="kpi-top"><span className="kpi-label">{k.label}</span><span className="kpi-icon" style={{ color: k.c }}><Icon size={15} /></span></div>
              <div className="kpi-value">{k.raw ? k.value : shortNum(k.value as number)} {!k.raw && <small>تومان</small>}</div>
              <div className="kpi-foot"><span className="small muted">{k.hint}</span></div>
            </div>
          );
        })}
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <div className="card-hd">
          <h3><Truck size={15} /> زنجیره تأمین</h3>
          <Tabs
            tabs={[
              { id: "sup", label: "تأمین‌کنندگان", count: suppliers.length },
              { id: "po", label: "سفارش خرید", count: purchaseOrders.length },
              { id: "grn", label: "رسید کالا", count: receipts.length },
            ]}
            active={tab}
            onChange={setTab}
          />
        </div>
        <div className="card-bd flush">
          {tab === "sup" && (
            <table className="table">
              <thead><tr><th>تأمین‌کننده</th><th>دسته</th><th>امتیاز</th><th>تحویل به‌موقع</th><th>مانده بدهی</th><th>وضعیت</th></tr></thead>
              <tbody>
                {suppliers.map((s) => (
                  <tr key={s.name}>
                    <td className="t-strong">{s.name}</td>
                    <td className="t-muted">{s.category}</td>
                    <td>
                      <span className="row" style={{ gap: 4 }}>
                        <Star size={11} className="warn" /> <b className="t-num">{pct(s.rating, 1)}</b>
                      </span>
                    </td>
                    <td className="t-num">{pct(s.onTime, 0)}</td>
                    <td className="t-num">{s.balance ? faNum(s.balance) : "—"}</td>
                    <td><Badge tone={s.status === "فعال" ? "success" : "warn"}>{s.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}


          {tab === "po" && (
            <table className="table">
              <thead><tr><th>شماره</th><th>تأمین‌کننده</th><th>تاریخ</th><th>مبلغ</th><th>تحویل</th><th>وضعیت</th></tr></thead>
              <tbody>
                {purchaseOrders.map((p) => (
                  <tr key={p.no}>
                    <td className="t-num">{p.no}</td>
                    <td className="t-strong">{p.supplier}</td>
                    <td className="t-muted">{p.date}</td>
                    <td className="t-num">{faNum(p.amount)}</td>
                    <td className="t-muted">{p.delivery}</td>
                    <td><Badge tone={p.status === "دریافت‌شده" ? "success" : p.status === "تأخیر" ? "danger" : "warn"}>{p.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === "grn" && (
            <table className="table">
              <thead><tr><th>شماره رسید</th><th>سفارش</th><th>تأمین‌کننده</th><th>تاریخ</th><th>اقلام</th><th>وضعیت</th></tr></thead>
              <tbody>
                {receipts.map((g) => (
                  <tr key={g.no}>
                    <td className="t-num">{g.no}</td>
                    <td className="t-num t-muted">{g.po}</td>
                    <td className="t-strong">{g.supplier}</td>
                    <td className="t-muted">{g.date}</td>
                    <td className="t-num">{faNum(g.items)}</td>
                    <td><Badge tone={g.status === "انبار شده" ? "success" : "warn"}>{g.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="mg-foot-note"><PackageCheck size={13} /> رسید کالا پس از کنترل کیفی به انبار منتقل و سند خرید آن خودکار در حسابداری ثبت می‌شود.</div>
    </div>
  );
}
