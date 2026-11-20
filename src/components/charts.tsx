import { useId, useMemo, useRef, useState, type ReactNode } from "react";
import { clamp, faNum } from "../lib/format";

/* --------------------------- path smoothing --------------------------- */
type Pt = [number, number];

function smoothPath(points: Pt[], tension = 0.18): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M${points[0][0]},${points[0][1]}`;
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) * tension;
    const c1y = p1[1] + (p2[1] - p0[1]) * tension;
    const c2x = p2[0] - (p3[0] - p1[0]) * tension;
    const c2y = p2[1] - (p3[1] - p1[1]) * tension;
    d += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
  }
  return d;
}

/* ------------------------------- AreaChart ----------------------------- */
type AreaSeries = { name: string; color: string; key: number };
export type AreaPoint = { label: string; values: number[] };

export function AreaChart({
  data,
  series,
  height = 220,
  yFormat = (n: number) => faNum(n),
  ticks = 4,
  legend = true,
  rightPad = 0,
}: {
  data: AreaPoint[];
  series: AreaSeries[];
  height?: number;
  yFormat?: (n: number) => string;
  ticks?: number;
  legend?: boolean;
  rightPad?: number;
}) {
  const uid = useId().replace(/[:]/g, "");
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const W = 1000;
  const H = 320;
  const top = 18;
  const bottom = 292;
  const left = 0;
  const plotW = W - left - rightPad;

  const maxVal = useMemo(() => {
    let m = 0;
    data.forEach((d) => d.values.forEach((v) => (m = Math.max(m, v))));
    return m === 0 ? 1 : m * 1.08;
  }, [data]);

  const xOf = (i: number) => left + (data.length <= 1 ? 0 : (i / (data.length - 1)) * plotW);
  const yOf = (v: number) => bottom - (v / maxVal) * (bottom - top);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current?.querySelector("svg");
    if (!el || data.length === 0) return;
    const r = el.getBoundingClientRect();
    const ratio = clamp((e.clientX - r.left) / r.width, 0, 1);
    setHover(Math.round(ratio * (data.length - 1)));
  };

  const hx = hover !== null ? xOf(hover) : 0;

  return (
    <div className="chart">
      {legend && (
        <div className="chart-legend">
          {series.map((s) => (
            <span key={s.key} className="cl-item">
              <i style={{ background: s.color }} />
              {s.name}
            </span>
          ))}
        </div>
      )}
      <div className="chart-plot has-y" ref={wrapRef} style={{ height }} onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" width="100%" height="100%" role="img">
          <defs>
            {series.map((s) => (
              <linearGradient key={s.key} id={`ag-${uid}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity="0.28" />
                <stop offset="70%" stopColor={s.color} stopOpacity="0.04" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>
          {Array.from({ length: ticks + 1 }, (_, i) => {
            const y = top + ((bottom - top) / ticks) * i;
            return (
              <line
                key={i}
                x1={0}
                x2={W - rightPad}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.065)"
                strokeWidth="1"
                strokeDasharray={i === ticks ? "0" : "4 7"}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
          {series.map((s) => {
            const pts: Pt[] = data.map((d, i) => [xOf(i), yOf(d.values[s.key] ?? 0)]);
            const line = smoothPath(pts);
            const area = `${line} L${xOf(data.length - 1)},${bottom} L${xOf(0)},${bottom} Z`;
            return (
              <g key={s.key}>
                <path d={area} fill={`url(#ag-${uid}-${s.key})`} />
                <path
                  d={line}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2.2"
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            );
          })}
          {hover !== null && (
            <>
              <line
                x1={hx}
                x2={hx}
                y1={top - 6}
                y2={bottom}
                stroke="rgba(255,255,255,0.24)"
                strokeWidth="1"
                strokeDasharray="3 4"
                vectorEffect="non-scaling-stroke"
              />
              {series.map((s) => (
                <circle
                  key={s.key}
                  cx={hx}
                  cy={yOf(data[hover].values[s.key] ?? 0)}
                  r="4"
                  fill="#0A111C"
                  stroke={s.color}
                  strokeWidth="2.4"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </>
          )}
        </svg>
        <div className="chart-y">
          <span>{yFormat(maxVal)}</span>
          <span>{yFormat(maxVal / 2)}</span>
          <span>۰</span>
        </div>
        {hover !== null && data[hover] && (
          <div
            className="chart-tip"
            style={{ left: `calc(56px + (100% - 56px) * ${hover / Math.max(1, data.length - 1)})` }}
          >
            <div className="ct-label">{data[hover].label}</div>
            {series.map((s) => (
              <div className="ct-row" key={s.key}>
                <i style={{ background: s.color }} />
                <span>{s.name}</span>
                <b>{yFormat(data[hover].values[s.key] ?? 0)}</b>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="chart-x">
        {data.map((d, i) => (
          <span key={`${d.label}-${i}`} className={hover === i ? "on" : ""}>
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------- Sparkline ----------------------------- */
export function Sparkline({
  data,
  color = "#2FE0BE",
  width = 96,
  height = 30,
  fill = true,
  strokeWidth = 1.6,
}: {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  strokeWidth?: number;
}) {
  const uid = useId().replace(/[:]/g, "");
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pad = 4;
  const pts: Pt[] = data.map((v, i) => [
    (i / Math.max(1, data.length - 1)) * width,
    height - pad - ((v - min) / range) * (height - pad * 2),
  ]);
  const line = smoothPath(pts, 0.14);
  const area = `${line} L${width},${height} L0,${height} Z`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className="spark" aria-hidden="true">
      <defs>
        <linearGradient id={`sp-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#sp-${uid})`} />}
      <path d={line} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

/* -------------------------------- BarChart ----------------------------- */
export type BarDatum = { label: string; value: number; color?: string; sub?: string };

export function BarChart({
  data,
  height = 240,
  format = (n: number) => faNum(n),
  color = "#2FE0BE",
  labels = true,
  extra,
}: {
  data: BarDatum[];
  height?: number;
  format?: (n: number) => string;
  color?: string;
  labels?: boolean;
  extra?: ReactNode;
}) {
  const uid = useId().replace(/[:]/g, "");
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value), 1) * 1.12;
  const W = 1000;
  const H = 300;
  const gap = 1000 / data.length;
  const bw = Math.min(gap * 0.52, 78);

  return (
    <div className="chart">
      <div className="chart-plot" style={{ height }}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" width="100%" height="100%" role="img">
          <defs>
            <linearGradient id={`bar-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.95" />
              <stop offset="100%" stopColor={color} stopOpacity="0.32" />
            </linearGradient>
          </defs>
          {[0, 0.25, 0.5, 0.75, 1].map((r, i) => (
            <line
              key={i}
              x1="0"
              x2={W}
              y1={H - 20 - r * 256}
              y2={H - 20 - r * 256}
              stroke="rgba(255,255,255,0.06)"
              strokeDasharray="4 7"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {data.map((d, i) => {
            const h = (d.value / max) * 256;
            const x = i * gap + (gap - bw) / 2;
            return (
              <g key={d.label + i}>
                <rect
                  x={x}
                  y={H - 20 - h}
                  width={bw}
                  height={h}
                  rx={6}
                  fill={d.color ?? `url(#bar-${uid})`}
                  opacity={hover === null || hover === i ? 1 : 0.45}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  style={{ transition: "opacity .15s" }}
                />
              </g>
            );
          })}
        </svg>
        {hover !== null && data[hover] && (
          <div className="chart-tip static" style={{ left: `${((hover + 0.5) / data.length) * 100}%`, bottom: "auto", top: 4 }}>
            <div className="ct-label">{data[hover].label}</div>
            <div className="ct-row">
              <i style={{ background: data[hover].color ?? color }} />
              <b>{format(data[hover].value)}</b>
            </div>
            {data[hover].sub && <div className="ct-sub">{data[hover].sub}</div>}
          </div>
        )}
      </div>
      {labels && (
        <div className="chart-x" style={{ display: "grid", gridTemplateColumns: `repeat(${data.length}, 1fr)` }}>
          {data.map((d) => (
            <span key={d.label}>{d.label}</span>
          ))}
        </div>
      )}
      {extra}
    </div>
  );
}

/* ------------------------------ GroupedBars ---------------------------- */
export function GroupedBars({
  data,
  series,
  height = 250,
  format = (n: number) => faNum(n),
}: {
  data: Array<{ label: string; values: number[] }>;
  series: Array<{ name: string; color: string }>;
  height?: number;
  format?: (n: number) => string;
}) {
  const max = Math.max(...data.flatMap((d) => d.values), 1) * 1.12;
  const W = 1000;
  const H = 300;
  const groupW = W / data.length;
  const barW = Math.min(groupW / (series.length + 1), 44);
  return (
    <div className="chart">
      <div className="chart-legend">
        {series.map((s) => (
          <span key={s.name} className="cl-item">
            <i style={{ background: s.color }} />
            {s.name}
          </span>
        ))}
      </div>
      <div className="chart-plot" style={{ height }}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" width="100%" height="100%" role="img">
          {[0, 0.5, 1].map((r, i) => (
            <line
              key={i}
              x1="0"
              x2={W}
              y1={H - 24 - r * 250}
              y2={H - 24 - r * 250}
              stroke="rgba(255,255,255,0.06)"
              strokeDasharray="4 7"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {data.map((d, gi) =>
            d.values.map((v, si) => {
              const totalW = barW * series.length + 6 * (series.length - 1);
              const x = gi * groupW + (groupW - totalW) / 2 + si * (barW + 6);
              const h = (v / max) * 250;
              return (
                <rect
                  key={`${gi}-${si}`}
                  x={x}
                  y={H - 24 - h}
                  width={barW}
                  height={h}
                  rx={4}
                  fill={series[si].color}
                  opacity={0.9}
                >
                  <title>{`${d.label} — ${series[si].name}: ${format(v)}`}</title>
                </rect>
              );
            }),
          )}
        </svg>
      </div>
      <div className="chart-x" style={{ display: "grid", gridTemplateColumns: `repeat(${data.length}, 1fr)` }}>
        {data.map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------- Donut -------------------------------- */
export function Donut({
  data,
  size = 168,
  thickness = 18,
  center,
  centerSub,
}: {
  data: Array<{ label: string; value: number; color: string }>;
  size?: number;
  thickness?: number;
  center?: string;
  centerSub?: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div className="donut-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="نمودار حلقه‌ای">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.055)" strokeWidth={thickness} />
        {data.map((d, i) => {
          const frac = d.value / total;
          const dash = Math.max(0, frac * c - 3);
          const offset = -acc * c;
          acc += frac;
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={thickness}
              strokeDasharray={`${dash} ${c - dash}`}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              style={{ filter: `drop-shadow(0 0 6px ${d.color}44)` }}
            >
              <title>{`${d.label}: ${faNum(d.value)}`}</title>
            </circle>
          );
        })}
      </svg>
      {center && (
        <div className="donut-center">
          <b>{center}</b>
          {centerSub && <span>{centerSub}</span>}
        </div>
      )}
    </div>
  );
}

/* --------------------------------- Gauge ------------------------------- */
export function Gauge({ value, size = 200 }: { value: number; size?: number }) {
  const uid = useId().replace(/[:]/g, "");
  const r = 78;
  const cx = 100;
  const cy = 100;
  const len = Math.PI * r;
  const v = clamp(value, 0, 100);
  return (
    <div className="gauge-wrap" style={{ width: size, height: size * 0.64 }}>
      <svg viewBox="0 0 200 128" width={size} height={size * 0.64} role="img" aria-label={`امتیاز کیفیت داده ${faNum(v)}`}>
        <defs>
          <linearGradient id={`gg-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF9F6B" />
            <stop offset="42%" stopColor="#F7B955" />
            <stop offset="100%" stopColor="#2FE0BE" />
          </linearGradient>
        </defs>
        <path d={`M${cx - r},${cy} A${r},${r} 0 0 1 ${cx + r},${cy}`} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="14" strokeLinecap="round" />
        <path
          d={`M${cx - r},${cy} A${r},${r} 0 0 1 ${cx + r},${cy}`}
          fill="none"
          stroke={`url(#gg-${uid})`}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${(v / 100) * len} ${len}`}
          style={{ filter: "drop-shadow(0 0 8px rgba(47,224,190,.25))" }}
        />
        {Array.from({ length: 11 }, (_, i) => {
          const a = Math.PI - (i / 10) * Math.PI;
          const x1 = cx + Math.cos(a) * (r + 12);
          const y1 = cy - Math.sin(a) * (r + 12);
          const x2 = cx + Math.cos(a) * (r + 16);
          const y2 = cy - Math.sin(a) * (r + 16);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.14)" strokeWidth="1" />;
        })}
      </svg>
      <div className="gauge-value">
        <b>{faNum(v, 1)}</b>
        <span>از ۱۰۰</span>
      </div>
      <div className="gauge-scale">
        <span>۰</span>
        <span>۱۰۰</span>
      </div>
    </div>
  );
}

/* ------------------------------ HBarChart ------------------------------ */
export function HBarChart({
  data,
  format = (n: number) => faNum(n),
  color = "#7C8CFF",
  suffix,
}: {
  data: Array<{ label: string; value: number; sub?: string; color?: string }>;
  format?: (n: number) => string;
  color?: string;
  suffix?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="hbars">
      {data.map((d) => (
        <div className="hbar-row" key={d.label}>
          <div className="hbar-top">
            <span className="hbar-label">{d.label}</span>
            <span className="hbar-val">
              {format(d.value)}
              {suffix}
            </span>
          </div>
          <div className="hbar-track">
            <span style={{ width: `${(d.value / max) * 100}%`, background: d.color ?? color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------ StackedBar ----------------------------- */
export function StackedBar({ data, height = 10 }: { data: Array<{ value: number; color: string; label?: string }>; height?: number }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  return (
    <div className="stacked" style={{ height }}>
      {data.map((d, i) => (
        <span
          key={i}
          title={d.label ? `${d.label}: ${faNum(d.value)}` : undefined}
          style={{ width: `${(d.value / total) * 100}%`, background: d.color }}
        />
      ))}
    </div>
  );
}
