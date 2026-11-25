import { useSearchParams } from "react-router-dom";
import { Factory, ClipboardList, Gauge, Wrench, Plus } from "lucide-react";
import { Badge, Tabs, Progress, useToast } from "../components/ui";
import { AreaChart, HBarChart } from "../components/charts";
import { faNum, pct, shortNum } from "../lib/format";
import { productionOrders, quality, downtime, productionTrend } from "../lib/business";

export default function Production() {
  const [params, setParams] = useSearchParams();
  const tab = (params.get("tab") ?? "orders") as "orders" | "plan" | "qc" | "down";
  const setTab = (t: "orders" | "plan" | "qc" | "down") => setParams({ tab: t }, { replace: true });
  const toast = useToast();

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="ph-title"><h1>تولید</h1><Badge tone="muted" dot={false}>بدون داده تولید</Badge></div>
          <p>سفارش تولید، برنامه هفتگی، کنترل کیفیت و توقفات خط — سال ۱۴۰۴</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-sm btn-primary" onClick={() => toast("سفارش تولید", "فرم ثبت سفارش جدید باز شد.", "info")}><Plus size={13} /> سفارش تولید</button>
        </div>
      </div>

      <div className="kpi-grid">
        {[
          { label: "سفارش فعال", value: `${faNum(productionOrders.filter((o) => o.status !== "تکمیل").length)} سفارش`, hint: `${faNum(productionOrders.length)} سفارش ثبت‌شده`, c: "#2FE0BE", icon: ClipboardList },
          { label: "تولید امروز", value: "—", hint: "بدون داده تولید در سپیدار", c: "#7C8CFF", icon: Factory },
          { label: "نرخ کیفیت", value: "—", hint: "بدون داده کیفیت", c: "#7BE495", icon: Gauge },
          { label: "توقفات اسفند", value: "—", hint: "بدون داده توقف", c: "#F7B955", icon: Wrench },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="kpi card">
              <div className="kpi-top"><span className="kpi-label">{k.label}</span><span className="kpi-icon" style={{ color: k.c }}><Icon size={15} /></span></div>
              <div className="kpi-value">{k.value}</div>
              <div className="kpi-foot"><span className="small muted">{k.hint}</span></div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 14, marginTop: 14 }}>
        <div className="card">
          <div className="card-hd">
            <h3><Factory size={15} /> خط تولید</h3>
            <Tabs
              tabs={[
                { id: "orders", label: "سفارش‌ها", count: productionOrders.length },
                { id: "plan", label: "برنامه" },
                { id: "qc", label: "کیفیت" },
                { id: "down", label: "توقفات" },
              ]}
              active={tab}
              onChange={setTab}
            />
          </div>
          <div className="card-bd flush">
            {tab === "orders" && (
              <table className="table">
                <thead><tr><th>شماره</th><th>محصول</th><th>تعداد</th><th>پیشرفت</th><th>خط</th><th>تحویل</th><th>وضعیت</th></tr></thead>
                <tbody>
                  {productionOrders.map((o) => (
                    <tr key={o.no}>
                      <td className="t-num">{o.no}</td>
                      <td className="t-strong">{o.product}</td>
                      <td className="t-num">{faNum(o.qty)}</td>
                      <td style={{ width: 150 }}>
                        <div className="row" style={{ gap: 8 }}>
                          <Progress value={(o.done / o.qty) * 100} tone={o.status === "تأخیر" ? "danger" : "mint"} thin />
                          <span className="small">{pct((o.done / o.qty) * 100, 0)}</span>
                        </div>
                      </td>
                      <td className="t-muted">{o.line}</td>
                      <td className="t-muted">{o.due}</td>
                      <td><Badge tone={o.status === "تکمیل" ? "success" : o.status === "تأخیر" ? "danger" : "warn"}>{o.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === "plan" && (
              <div style={{ padding: 16 }}>
                <div className="mg-bar-row" style={{ marginBottom: 10 }}>
                  <span className="small muted">خروجی روزانه (عدد)</span>
                </div>
                <AreaChart
                  data={productionTrend.map((p) => ({ label: p.label, values: p.values }))}
                  series={[{ name: "تولید", color: "#2FE0BE", key: 0 }]}
                  height={190}
                  legend={false}
                />
                <div className="mg-plan">
                  {["خط ۱", "خط ۲", "خط ۳"].map((l, i) => (
                    <div key={l} className="mg-plan-row">
                      <span className="small">{l}</span>
                      <div className="mg-plan-track">
                        {[0, 1, 2, 3, 4, 5].map((d) => (
                          <span key={d} className="mg-plan-cell" style={{ background: (d + i) % 3 === 0 ? "rgba(47,224,190,.18)" : "rgba(124,140,255,.12)" }}>
                            {faNum(120 + d * 15 + i * 20)}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "qc" && (
              <table className="table">
                <thead><tr><th>محصول</th><th>بازرسی‌شده</th><th>نایق</th><th>نرخ کیفیت</th><th>علت اصلی</th></tr></thead>
                <tbody>
                  {quality.map((q) => (
                    <tr key={q.item}>
                      <td className="t-strong">{q.item}</td>
                      <td className="t-num">{faNum(q.inspected)}</td>
                      <td className="t-num">{faNum(q.defect)}</td>
                      <td className="t-num">{pct(q.rate, 1)}</td>
                      <td className="t-muted">{q.cause}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === "down" && (
              <div style={{ padding: 16 }}>
                <HBarChart data={downtime.map((d) => ({ label: d.reason, value: d.minutes, color: "#F7B955" }))} />
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card">
            <div className="card-hd"><h3><Gauge size={15} /> شاخص‌های خط</h3></div>
            <div className="card-bd">
              <div className="mg-mini-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <div className="mg-mini"><span className="small muted">بهره‌وری (OEE)</span><b>۷۸٫۴٪</b></div>
                <div className="mg-mini"><span className="small muted">توقفات برنامه‌ریزی‌نشده</span><b className="warn">۲۴۳ دقیقه</b></div>
                <div className="mg-mini"><span className="small muted">ضایعات</span><b>۱٫۸٪</b></div>
                <div className="mg-mini"><span className="small muted">تحویل به‌موقع</span><b className="up">۸۶٪</b></div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-hd"><h3><Wrench size={15} /> توقفات این هفته</h3></div>
            <div className="card-bd" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {downtime.slice(0, 4).map((d) => (
                <div key={d.reason} className="mg-oblig-row">
                  <span className="small grow">{d.reason}</span>
                  <span className="small muted">{d.line}</span>
                  <b className="small">{faNum(d.minutes)}′</b>
                </div>
              ))}
              <div className="small muted">ارزش تقریبی توقف: {shortNum(180_000_000)} تومان</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
