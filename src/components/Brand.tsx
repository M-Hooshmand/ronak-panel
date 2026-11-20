import { useId } from "react";

export function BrandMark({ size = 34 }: { size?: number }) {
  const uid = useId().replace(/[:]/g, "");
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`bm-${uid}`} x1="7" y1="58" x2="57" y2="6" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2FE0BE" />
          <stop offset="1" stopColor="#7C8CFF" />
        </linearGradient>
        <radialGradient id={`bg-${uid}`} cx="50%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#152741" />
          <stop offset="100%" stopColor="#0A121F" />
        </radialGradient>
      </defs>
      <rect x="1" y="1" width="62" height="62" rx="17" fill={`url(#bg-${uid})`} stroke="rgba(255,255,255,.09)" />
      <circle
        cx="32"
        cy="32"
        r="20"
        stroke={`url(#bm-${uid})`}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray="88 38"
        opacity=".5"
        transform="rotate(-24 32 32)"
      />
      <circle cx="48.5" cy="16.5" r="2.2" fill="#2FE0BE" />
      <path
        d="M23 46V18h12c5.3 0 8.7 3 8.7 7.6 0 3.4-1.9 5.9-5 6.9L46 46h-6.8l-6.3-11h-3.4v11H23Zm6.4-16.1h5c2.3 0 3.7-1.2 3.7-3.2s-1.4-3.2-3.7-3.2h-5v6.4Z"
        fill={`url(#bm-${uid})`}
      />
    </svg>
  );
}

export function Brand({ size = 36, showSub = true }: { size?: number; showSub?: boolean }) {
  return (
    <div className="brand">
      <BrandMark size={size} />
      <div className="brand-text">
        <div className="brand-name">روناک</div>
        {showSub && <div className="brand-sub">RONAK · FINANCIAL DATA</div>}
      </div>
    </div>
  );
}
