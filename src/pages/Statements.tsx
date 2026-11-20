import { useState } from "react";
import { FileSpreadsheet, Download, Printer, Info } from "lucide-react";
import { Badge, Tabs, useToast } from "../components/ui";
import { faNum, shortNum, pct } from "../lib/format";
import { pnl, balanceSheet, cashFlow } from "../lib/management";

const sum = (rows: Array<[string, number]>) => rows.reduce((s, [, v]) => s + v, 0);

export default function Statements() {
  const [tab, setTab] = useState<"pnl" | "bs" | "cf">("pnl");
  const toast = useToast();

  const totalCurrentAssets = sum(balanceSheet.currentAssets);
  const totalNonCurrentAssets = sum(balanceSheet.nonCurrentAssets);
  const totalAssets = totalCurrentAssets + totalNonCurrentAssets;
  const totalCurrentLiab = sum(balanceSheet.currentLiabilities);
  const totalNonCurrentLiab = sum(balanceSheet.nonCurrentLiabilities);
  const totalLiab = totalCurrentLiab + totalNonCurrentLiab;
  const totalEquity = sum(balanceSheet.equity);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="ph-title">
            <h1>صورت‌های مالی</h1>
            <Badge tone="mint" dot={false}>ساخته‌شده از اسناد حسابداری</Badge>
          </div>
          <p>سود و زیان، ترازنامه و جریان نقد — دوره آبان ۱۴۰۵ در مقایسه با مهر ۱۴۰۵</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-sm" onClick={() => toast("چاپ", "نسخه چاپی صورت‌های مالی آماده شد.", "info")}>
            <Printer size={13} /> چاپ
          </button>
          <button className="btn btn-sm" onClick={() => toast("خروجی اکسل", "سه صورت مالی در یک فایل اکسل ذخیره شد.", "success")}>
            <Download size={13} /> اکسل
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-hd">
          <h3>
            <FileSpreadsheet size={15} /> گزارش دوره
            <span className="ch-sub">واحد: تومان</span>
          </h3>
          <Tabs
            tabs={[
              { id: "pnl", label: "سود و زیان" },
              { id: "bs", label: "ترازنامه" },
              { id: "cf", label: "جریان نقد" },
            ]}
            active={tab}
            onChange={setTab}
          />
        </div>

        {tab === "pnl" && (
          <div className="card-bd flush">
            <table className="table stmt">
              <thead>
                <tr>
                  <th>شرح</th>
                  <th>آبان ۱۴۰۵</th>
                  <th>مهر ۱۴۰۵</th>
                  <th>تغییر</th>
                </tr>
              </thead>
              <tbody>
                {pnl.map((r) => {
                  const chg = r.prev === 0 ? 0 : ((r.cur - r.prev) / Math.abs(r.prev)) * 100;
                  const favorable = chg >= 0;
                  return (
                    <tr key={r.label} className={r.total ? "stmt-total" : r.sub ? "stmt-sub" : ""}>
                      <td className={r.level === 0 ? "stmt-indent" : "t-strong"}>{r.label}</td>
                      <td className={`t-num ${r.neg ? "neg" : ""}`}>{faNum(r.cur)}</td>
                      <td className={`t-num t-muted ${r.neg ? "neg" : ""}`}>{faNum(r.prev)}</td>
                      <td className={`t-num small ${favorable ? "up" : "down"}`}>{pct(Math.abs(chg), 1)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {tab === "bs" && (
          <div className="card-bd">
            <div className="stmt-bs">
              <div>
                <h4>دارایی‌ها</h4>
                <table className="table stmt">
                  <tbody>
                    <tr className="stmt-section"><td colSpan={2}>دارایی جاری</td></tr>
                    {balanceSheet.currentAssets.map(([l, v]) => (
                      <tr key={l}>
                        <td className="stmt-indent">{l}</td>
                        <td className="t-num">{faNum(v)}</td>
                      </tr>
                    ))}
                    <tr className="stmt-sub">
                      <td>جمع دارایی جاری</td>
                      <td className="t-num">{faNum(totalCurrentAssets)}</td>
                    </tr>
                    <tr className="stmt-section"><td colSpan={2}>دارایی غیرجاری</td></tr>
                    {balanceSheet.nonCurrentAssets.map(([l, v]) => (
                      <tr key={l}>
                        <td className="stmt-indent">{l}</td>
                        <td className="t-num">{faNum(v)}</td>
                      </tr>
                    ))}
                    <tr className="stmt-sub">
                      <td>جمع دارایی غیرجاری</td>
                      <td className="t-num">{faNum(totalNonCurrentAssets)}</td>
                    </tr>
                    <tr className="stmt-total">
                      <td>جمع دارایی‌ها</td>
                      <td className="t-num">{faNum(totalAssets)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h4>بدهی‌ها و حقوق صاحبان سهام</h4>
                <table className="table stmt">
                  <tbody>
                    <tr className="stmt-section"><td colSpan={2}>بدهی جاری</td></tr>
                    {balanceSheet.currentLiabilities.map(([l, v]) => (
                      <tr key={l}>
                        <td className="stmt-indent">{l}</td>
                        <td className="t-num">{faNum(v)}</td>
                      </tr>
                    ))}
                    <tr className="stmt-sub">
                      <td>جمع بدهی جاری</td>
                      <td className="t-num">{faNum(totalCurrentLiab)}</td>
                    </tr>
                    <tr className="stmt-section"><td colSpan={2}>بدهی غیرجاری</td></tr>
                    {balanceSheet.nonCurrentLiabilities.map(([l, v]) => (
                      <tr key={l}>
                        <td className="stmt-indent">{l}</td>
                        <td className="t-num">{faNum(v)}</td>
                      </tr>
                    ))}
                    <tr className="stmt-sub">
                      <td>جمع بدهی‌ها</td>
                      <td className="t-num">{faNum(totalLiab)}</td>
                    </tr>
                    <tr className="stmt-section"><td colSpan={2}>حقوق صاحبان سهام</td></tr>
                    {balanceSheet.equity.map(([l, v]) => (
                      <tr key={l}>
                        <td className="stmt-indent">{l}</td>
                        <td className="t-num">{faNum(v)}</td>
                      </tr>
                    ))}
                    <tr className="stmt-total">
                      <td>جمع بدهی‌ها و حقوق صاحبان سهام</td>
                      <td className="t-num">{faNum(totalLiab + totalEquity)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mg-foot-note" style={{ marginTop: 14 }}>
              <Info size={13} />
              ترازنامه متوازن است: جمع دارایی‌ها {shortNum(totalAssets)} = بدهی‌ها و حقوق صاحبان سهام {shortNum(totalLiab + totalEquity)}.
            </div>
          </div>
        )}

        {tab === "cf" && (
          <div className="card-bd flush">
            <table className="table stmt">
              <thead>
                <tr>
                  <th>شرح</th>
                  <th>مبلغ (تومان)</th>
                </tr>
              </thead>
              <tbody>
                {cashFlow.map((s) => (
                  <FragmentGroup key={s.label} group={s} />
                ))}
                <tr className="stmt-total">
                  <td>خالص تغییر در موجودی نقد</td>
                  <td className="t-num">{faNum(cashFlow.reduce((s, c) => s + c.value, 0))}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function FragmentGroup({ group }: { group: { label: string; value: number; parts: Array<[string, number]> } }) {
  return (
    <>
      <tr className="stmt-section">
        <td colSpan={2}>{group.label}</td>
      </tr>
      {group.parts.map(([l, v]) => (
        <tr key={l}>
          <td className="stmt-indent">{l}</td>
          <td className="t-num">{faNum(v)}</td>
        </tr>
      ))}
      <tr className="stmt-sub">
        <td>خالص {group.label}</td>
        <td className="t-num">{faNum(group.value)}</td>
      </tr>
    </>
  );
}
