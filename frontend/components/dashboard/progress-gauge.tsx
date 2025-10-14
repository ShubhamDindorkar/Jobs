"use client";
export function ProgressGauge({ percent }: { percent: number }) {
  const p = Math.max(0, Math.min(100, percent));
  const angle = (p / 100) * 180; // semicircle
  return (
    <div className="relative w-48 h-24">
      <svg viewBox="0 0 100 50" className="w-full h-full">
        <defs>
          <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(0,255,136,0.4)" />
            <stop offset="100%" stopColor="rgba(0,255,136,0.9)" />
          </linearGradient>
        </defs>
        <path d="M5,50 A45,45 0 0 1 95,50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
        <path
          d={`M5,50 A45,45 0 ${angle > 90 ? 1 : 0} 1 ${5 + 90 * Math.sin((Math.min(180, angle) * Math.PI) / 180)},${50 - 45 * Math.cos((Math.min(180, angle) * Math.PI) / 180)}`}
          fill="none"
          stroke="url(#g)"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-semibold text-foreground">{p}%</span>
      </div>
    </div>
  );
}


