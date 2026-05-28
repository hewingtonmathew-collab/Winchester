"use client";

import { cn } from "@/lib/utils";

interface GuardianCommandVisualProps {
  variant?: "full" | "compact" | "hero";
  trustScore?: number;
  kcsieScore?: number;
  activeNodes?: number;
  totalNodes?: number;
  alerts?: number;
  className?: string;
}

function CircularGauge({
  score,
  size = 120,
  colour = "#a8e8ff",
  label,
}: {
  score: number;
  size?: number;
  colour?: string;
  label: string;
}) {
  const r = (size / 2) * 0.72;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="-rotate-90"
          aria-hidden="true"
        >
          {/* Background track */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="transparent"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={3}
          />
          {/* Dashed inner ring */}
          <circle
            cx={cx}
            cy={cy}
            r={r * 0.85}
            fill="transparent"
            stroke={colour}
            strokeWidth={0.5}
            strokeOpacity={0.3}
            strokeDasharray="3 6"
            className="animate-spin-slow motion-reduce:animate-none"
          />
          {/* Score arc */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="transparent"
            stroke={colour}
            strokeWidth={4}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="metric-number font-bold text-on-surface leading-none"
            style={{ fontSize: size * 0.22 }}
          >
            {score}
          </span>
          <span
            className="font-semibold uppercase tracking-wider"
            style={{ fontSize: size * 0.08, color: colour }}
          >
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function GuardianCommandVisual({
  variant = "full",
  trustScore = 94,
  kcsieScore = 98,
  activeNodes = 14,
  totalNodes = 14,
  alerts = 2,
  className,
}: GuardianCommandVisualProps) {
  const isCompact = variant === "compact";
  const gaugeSize = isCompact ? 88 : 120;
  const alertNodes = alerts;

  return (
    <div
      className={cn(
        "glass-panel rounded-xl overflow-hidden relative",
        isCompact ? "p-4" : "p-6",
        className
      )}
      aria-label={`GuardianOS compliance dashboard preview — ${trustScore}% trust assurance, ${kcsieScore}% KCSIE alignment, ${activeNodes} of ${totalNodes} nodes active${alerts > 0 ? `, ${alerts} alerts requiring attention` : ""}`}
    >
      {/* HUD grid overlay */}
      <div
        className="absolute inset-0 bg-grid-hud bg-[size:40px_40px] pointer-events-none opacity-60"
        aria-hidden="true"
      />

      {/* Scanning line */}
      <div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-container/40 to-transparent pointer-events-none animate-scan motion-reduce:animate-none"
        aria-hidden="true"
        style={{ top: 0 }}
      />

      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary/5 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* Header bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse motion-reduce:animate-none shadow-glow-sm"
              aria-hidden="true"
            />
            <span className="eyebrow text-[10px]">Guardian OS</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded glass-panel border-primary/30 border">
            <span
              className="w-1 h-1 rounded-full bg-primary animate-pulse motion-reduce:animate-none"
              aria-hidden="true"
            />
            <span className="text-[9px] font-semibold uppercase tracking-widest text-primary">
              Secure Uplink Active
            </span>
          </div>
        </div>

        {/* Gauge row */}
        <div
          className={cn(
            "grid gap-4 mb-4",
            isCompact ? "grid-cols-2" : "grid-cols-3"
          )}
        >
          {/* Trust assurance */}
          <div className="glass-panel rounded-lg p-3 flex flex-col items-center gap-2">
            <span className="eyebrow text-[9px]">Trust Assurance</span>
            <CircularGauge
              score={trustScore}
              size={gaugeSize}
              colour="#a8e8ff"
              label="Stable"
            />
            <div className="text-[9px] text-primary font-semibold metric-number">
              +2.4% Δ
            </div>
          </div>

          {/* Active nodes */}
          {!isCompact && (
            <div className="glass-panel rounded-lg p-3 flex flex-col items-center gap-2">
              <span className="eyebrow text-[9px]">Node Status</span>
              <div
                className="grid gap-1 my-2"
                style={{
                  gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(totalNodes))}, 1fr)`,
                }}
                aria-hidden="true"
              >
                {Array.from({ length: totalNodes }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-3 h-3 rounded-sm",
                      i < totalNodes - alertNodes
                        ? "bg-rag-green/70"
                        : "bg-error/70 animate-pulse motion-reduce:animate-none"
                    )}
                  />
                ))}
              </div>
              <span className="text-[9px] text-on-surface-variant">
                {activeNodes}/{totalNodes} Active
              </span>
            </div>
          )}

          {/* KCSIE alignment */}
          <div className="glass-panel rounded-lg p-3 flex flex-col items-center gap-2">
            <span className="eyebrow text-[9px]">KCSIE Alignment</span>
            <CircularGauge
              score={kcsieScore}
              size={gaugeSize}
              colour="#3cd7ff"
              label="Aligned"
            />
            <div className="text-[9px] text-primary-tint font-semibold">
              COMPLIANCE LOCK
            </div>
          </div>
        </div>

        {/* Alert strip */}
        {alerts > 0 && (
          <div className="glass-panel-error rounded-lg p-3 mb-4 flex items-center gap-3">
            <div className="relative flex-shrink-0" aria-hidden="true">
              <div className="w-10 h-10 rounded-full border border-error/30 flex items-center justify-center">
                <span className="metric-number text-error font-bold text-lg">
                  {String(alerts).padStart(2, "0")}
                </span>
              </div>
              <div className="absolute inset-0 rounded-full border border-error/20 animate-ping motion-reduce:animate-none" />
            </div>
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-widest text-on-surface">
                Nodes requiring attention
              </p>
              <p className="text-[10px] text-error font-medium">
                Immediate review recommended
              </p>
            </div>
          </div>
        )}

        {/* Status footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-3 text-[8px] font-mono text-on-surface-variant">
            <span>SCAN: 0.12ms</span>
            <span>LATENCY: 14ms</span>
            <span>AUTO: ACTIVE</span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className="w-1 h-1 rounded-full bg-rag-green animate-pulse motion-reduce:animate-none"
              aria-hidden="true"
            />
            <span className="text-[8px] text-rag-green font-semibold uppercase tracking-wider">
              Operational
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
