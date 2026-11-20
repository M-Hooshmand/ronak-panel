import { useState } from "react";
import {
  Package,
  PackageSearch,
  Boxes,
  Building2,
  Download,
  ShoppingCart,
  ChevronLeft,
  TrendingDown,
} from "lucide-react";
import { Badge, Tabs, useToast } from "../components/ui";
import { faNum, shortNum, pct } from "../lib/format";
import { inventory, inventoryValue, belowReorder, fixedAssets, assetsCost, assetsBook } from "../lib/management";

const toneMap: Record<string, string> = {
  mint: "#2FE0BE",
  indigo: "#7C8CFF",
  warn: "#F7B955",
  danger: "#FF6B81",
};

function stockStatus(qty: number, reorder: number) {
  if (qty < reorder * 0.5) return { label: "بحرانی", tone: "danger" as const };
  if (qty < reorder) return { label: "کم", tone: "warn" as const };
  return { label: "نرمال", tone: "success" as const };
}

export default function Inventory() {
  const [tab, setTab] = useState<"stock" | "assets">("stock");
  const toast = useToast();
  const turnover = Math.round(inventory.reduce((s, i) => s + i.turnover, 0) / inventory.length);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="ph-title">
            <h1>انبار و دارایی‌ها</h1>
            <Badge tone="mint" dot={false}>چه داریم، چه لازم داریم</Badge>
          </div>
          <p>موجودی واقعی کالا، ارزش ریالی انبار، اقلام نیازمند خرید و دارایی‌های ثابت با استهلاک</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-sm" onClick={() => toast("خروجی انبار", "کارت موجودی و ارزش انبار آماده دانلود شد.", "success")}>
            <Download size={13} /> خروجی
          </button>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => toast("درخواست خرید", `${faNum(belowReorder.length)} قلم کالا برای سفارش پیش‌نویس شد.`, "success")}
          >
            <ShoppingCart size={13} /> پیش‌نویس خرید
          </button>
        </div>
      </div>

      <div className="kpi-grid">
        {[
          { label: "ارزش موجودی انبار", value: inventoryValue, icon: Boxes, tone: "mint", hint: `${faNum(inventory.length)} قلم کالا` },
          { label: "زیر حد سفارش", value: belowReorder.length, icon: PackageSearch, tone: "danger", hint: "نیازمند خرید", raw: true },
          { label: "میانگین گردش انبار", value: turnover, icon: Package, tone: "indigo", hint: "بار در سال", raw: true },
          { label: "ارزش دفتری دارایی‌ها", value: assetsBook, icon: Building2, tone: "warn", hint: `${faNum(fixedAssets.length)} دارایی ثبت‌شده` },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="kpi card" style={{ ["--kpi-glow" as string]: `${toneMap[k.tone]}22` }}>
              <div className="kpi-top">
                <span className="kpi-label">{k.label}</span>
                <span className="kpi-icon" style={{ color: toneMap[k.tone] }}>
                  <Icon size={15} />
                </span>
              </div>
              <div className="kpi-value">
                {k.raw ? faNum(k.value) : shortNum(k.value)} {!k.raw && <small>تومان</small>}
              </div>
              <div className="kpi-foot">
                <span className="small muted">{k.hint}</span>
                {k.label === "زیر حد سفارش" && <Badge tone="danger" dot={false}>اقدام لازم</Badge>}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.85fr 1fr", gap: 14, marginTop: 14 }}>
        <div className="card">
          <div className="card-hd">
            <h3>
              <Boxes size={15} /> {tab === "stock" ? "موجودی کالا" : "دارایی‌های ثابت"}
            </h3>
            <Tabs
              tabs={[
                { id: "stock", label: "انبار", count: inventory.length },
                { id: "assets", label: "دارایی ثابت", count: fixedAssets.length },
              ]}
              active={tab}
              onChange={setTab}
            />
          </div>
          <div className="card-bd flush">
            {tab === "stock" ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>کد</th>
                    <th>کالا</th>
                    <th>موجودی</th>
                    <th>حد سفارش</th>
                    <th>فی (تومان)</th>
                    <th>ارزش</th>
                    <th>وضعیت</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((i) => {
                    const st = stockStatus(i.qty, i.reorder);
                    const p = Math.min(100, (i.qty / i.reorder) * 100);
                    return (
                      <tr key={i.sku}>
                        <td className="t-num t-muted">{i.sku}</td>
                        <td className="t-strong">{i.name}</td>
                        <td className="t-num">
                          {faNum(i.qty)} <span className="small muted">{i.unit}</span>
                        </td>
                        <td className="t-num t-muted">{faNum(i.reorder)}</td>
                        <td className="t-num">{faNum(i.price)}</td>
                        <td className="t-num">{shortNum(i.qty * i.price)}</td>
                        <td>
                          <div className="mg-stock">
                            <div className="mg-stock-track">
                              <i style={{ width: `${p}%`, background: p < 50 ? "#FF6B81" : p < 100 ? "#F7B955" : "#2FE0BE" }} />
                            </div>
                            <Badge tone={st.tone}>{st.label}</Badge>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>دارایی</th>
                    <th>دسته</th>
                    <th>بهای تمام‌شده</th>
                    <th>استهلاک انباشته</th>
                    <th>ارزش دفتری</th>
                    <th>نرخ سالانه</th>
                  </tr>
                </thead>
                <tbody>
                  {fixedAssets.map((a) => (
                    <tr key={a.name}>
                      <td className="t-strong">
                        {a.name}
                        <div className="small muted">خرید {a.date}</div>
                      </td>
                      <td className="t-muted">{a.cat}</td>
                      <td className="t-num">{shortNum(a.cost)}</td>
                      <td className="t-num t-muted">{shortNum(a.accum)}</td>
                      <td className="t-num">{shortNum(a.cost - a.accum)}</td>
                      <td className="t-muted">{pct(a.rate, 0)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="t-strong">جمع</td>
                    <td />
                    <td className="t-num t-strong">{shortNum(assetsCost)}</td>
                    <td className="t-num t-strong">{shortNum(assetsCost - assetsBook)}</td>
                    <td className="t-num t-strong">{shortNum(assetsBook)}</td>
                    <td />
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-hd">
            <h3>
              <ShoppingCart size={15} /> پیشنهاد خرید
              <span className="ch-sub">بر اساس مصرف ۹۰ روز</span>
            </h3>
          </div>
          <div className="card-bd" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {belowReorder.map((i) => {
              const need = Math.max(i.reorder - i.qty, Math.round(i.reorder * 0.4));
              return (
                <div key={i.sku} className="mg-buy">
                  <div className="grow">
                    <b>{i.name}</b>
                    <span className="small muted">
                      موجودی {faNum(i.qty)} {i.unit} · حد {faNum(i.reorder)}
                    </span>
                  </div>
                  <div className="mg-buy-qty">
                    <span className="small muted">سفارش</span>
                    <b>{faNum(need)}</b>
                  </div>
                </div>
              );
            })}
            <button
              className="btn btn-sm"
              style={{ marginTop: 4 }}
              onClick={() => toast("پیش‌نویس خرید", "درخواست خرید برای تأیید مدیر آماده شد.", "success")}
            >
              ساخت درخواست خرید <ChevronLeft size={12} />
            </button>
            <div className="mg-foot-note" style={{ marginTop: 6, padding: 0, border: 0, background: "none" }}>
              <TrendingDown size={13} />
              مصرف ورق گالوانیزه ۲۸٪ بیشتر از میانگین سه‌ماهه است.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
