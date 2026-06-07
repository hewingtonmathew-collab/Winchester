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
  gradientId,
  glowId,
  label,
  sublabel,
}: {
  score: number;
  size?: number;
  colour?: string;
  gradientId: string;
  glowId: string;
  label: string;
  sublabel?: string;
}) {
  const r = (size / 2) * 0.72;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const cx = size / 2;
  const cy = size / 2;

  // Outer glow ring radius — just outside the arc
  const rOuter = r + 5;

  const rRing1 = r + 10;
  const rRing2 = r + 16;
  const ringCirc1 = 2 * Math.PI * rRing1;
  const ringCirc2 = 2 * Math.PI * rRing2;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Rotating outer rings — Stark HUD effect */}
        <svg
          width={size + 40}
          height={size + 40}
          className="absolute"
          style={{
            top: "-20px",
            left: "-20px",
            overflow: "visible",
            pointerEvents: "none",
          }}
          aria-hidden="true"
        >
          {/* Ring 1 — slow CW rotation with dashes */}
          <circle
            cx={(size + 40) / 2}
            cy={(size + 40) / 2}
            r={rRing1}
            fill="none"
            stroke={colour}
            strokeWidth={0.6}
            strokeOpacity={0.25}
            strokeDasharray={`${ringCirc1 * 0.12} ${ringCirc1 * 0.88}`}
            style={{ animation: "ring-cw 14s linear infinite", transformOrigin: "50% 50%" }}
          />
          {/* Ring 2 — faster CCW, different dash pattern */}
          <circle
            cx={(size + 40) / 2}
            cy={(size + 40) / 2}
            r={rRing2}
            fill="none"
            stroke={colour}
            strokeWidth={0.4}
            strokeOpacity={0.15}
            strokeDasharray={`${ringCirc2 * 0.06} ${ringCirc2 * 0.14} ${ringCirc2 * 0.04} ${ringCirc2 * 0.76}`}
            style={{ animation: "ring-ccw 20s linear infinite", transformOrigin: "50% 50%" }}
          />
          {/* Small dot at 12 o'clock on ring 1 */}
          <circle
            cx={(size + 40) / 2}
            cy={(size + 40) / 2 - rRing1}
            r={1.5}
            fill={colour}
            fillOpacity={0.5}
            style={{ animation: "ring-cw 14s linear infinite", transformOrigin: `${(size + 40) / 2}px ${(size + 40) / 2}px` }}
          />
        </svg>

        <svg
          width={size}
          height={size}
          className="-rotate-90"
          aria-hidden="true"
          style={{ overflow: "visible" }}
        >
          <defs>
            {/* Gradient for the score arc — sweeps around the circle */}
            <linearGradient
              id={gradientId}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={colour} stopOpacity="0.55" />
              <stop offset="60%" stopColor={colour} stopOpacity="1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.85" />
            </linearGradient>

            {/* Radial glow for the glow track behind the arc */}
            <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={colour} stopOpacity="0.18" />
              <stop offset="100%" stopColor={colour} stopOpacity="0" />
            </radialGradient>

            {/* Filter for soft outer glow on the arc */}
            <filter id={`${gradientId}-blur`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Glow field behind arc — very subtle radial wash */}
          <circle
            cx={cx}
            cy={cy}
            r={rOuter + 4}
            fill={`url(#${glowId})`}
          />

          {/* Outer glow ring — faint border ring just outside arc */}
          <circle
            cx={cx}
            cy={cy}
            r={rOuter}
            fill="transparent"
            stroke={colour}
            strokeWidth={0.5}
            strokeOpacity={0.12}
          />

          {/* Background track */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="transparent"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={3.5}
          />

          {/* Glow track gradient wash underneath — slightly thicker, blurred */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="transparent"
            stroke={colour}
            strokeWidth={6}
            strokeOpacity={0.08}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ filter: `blur(3px)` }}
          />

          {/* Score arc — gradient stroke via the linearGradient */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="transparent"
            stroke={`url(#${gradientId})`}
            strokeWidth={3.5}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            filter={`url(#${gradientId}-blur)`}
          />
        </svg>

        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span
            className="metric-number font-bold text-on-surface leading-none"
            style={{ fontSize: size * 0.22 }}
          >
            {score}
          </span>
          {sublabel && (
            <span
              className="font-medium tracking-wide"
              style={{
                fontSize: size * 0.085,
                color: colour,
                opacity: 0.8,
              }}
            >
              {sublabel}
            </span>
          )}
        </div>
      </div>

      {/* Label below gauge */}
      <span
        className="text-on-surface-variant font-medium tracking-wide"
        style={{ fontSize: size * 0.083 }}
      >
        {label}
      </span>
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
  // Stable per-render ID prefix (SSR-safe: no Math.random)
  const idPrefix = `gcv`;

  const isCompact = variant === "compact";
  const gaugeSize = isCompact ? 88 : 118;
  const alertNodes = alerts;

  // Node grid: 4×4 for full, 3×3 for compact
  const gridCols = isCompact ? 3 : 4;
  const nodeCount = gridCols * gridCols;
  const alertNodeCount = Math.min(alertNodes, nodeCount);

  return (
    <div
      className={cn(
        "glass-panel border-shimmer rounded-2xl overflow-hidden relative",
        isCompact ? "p-4" : "p-5",
        className
      )}
      style={{
        // Extra subtle white top highlight — 2px inner top line
        boxShadow: [
          "inset 0 2px 0 rgba(255,255,255,0.25)",
          "inset 1px 0 0 rgba(255,255,255,0.08)",
          "inset 0 -1px 0 rgba(0,0,0,0.55)",
          "0 4px 48px rgba(0,0,0,0.72)",
          "0 1px 0 rgba(0,0,0,0.6)",
        ].join(", "),
      }}
      aria-label={`GuardianOS compliance dashboard — ${trustScore}% trust assurance, ${kcsieScore}% KCSIE alignment, ${activeNodes} of ${totalNodes} nodes active${alerts > 0 ? `, ${alerts} alerts requiring attention` : ""}`}
    >
      {/* Decorative background orb — blurred blob, very low opacity */}
      <div
        className="absolute pointer-events-none"
        aria-hidden="true"
        style={{
          bottom: "-30%",
          right: "-15%",
          width: "55%",
          aspectRatio: "1",
          background:
            "radial-gradient(circle, rgba(168,232,255,0.10) 0%, rgba(60,215,255,0.05) 40%, transparent 70%)",
          filter: "blur(32px)",
        }}
      />

      {/* Very subtle dot grid — 2% opacity only */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.02,
        }}
      />

      <div className="relative z-10">
        {/* ── Header ─────────────────────────────── */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            {/* Soft pulse indicator */}
            <span
              className="relative flex-shrink-0"
              aria-hidden="true"
            >
              <span className="block w-2 h-2 rounded-full bg-rag-green shadow-[0_0_6px_rgba(74,222,128,0.7)]" />
              <span className="absolute inset-0 rounded-full bg-rag-green animate-ping motion-reduce:animate-none opacity-40" />
            </span>
            <span className="text-[11px] font-semibold text-on-surface tracking-[0.06em]">
              Guardian OS
            </span>
          </div>

          {/* Status pill — lighter, softer */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(255,255,255,0.055)",
              border: "0.5px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(12px)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse motion-reduce:animate-none"
              aria-hidden="true"
            />
            <span className="text-[9px] font-medium tracking-[0.08em] text-primary/80">
              Secure uplink active
            </span>
          </div>
        </div>

        {/* ── Gauge row ──────────────────────────── */}
        <div
          className={cn(
            "grid gap-3 mb-3",
            isCompact ? "grid-cols-2" : "grid-cols-3"
          )}
        >
          {/* Trust Assurance gauge panel */}
          <div
            className="rounded-xl p-3 flex flex-col items-center gap-2"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "0.5px solid rgba(255,255,255,0.10)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)",
            }}
          >
            <span className="text-[9px] font-medium tracking-[0.08em] text-on-surface-variant">
              Trust Assurance
            </span>
            <CircularGauge
              score={trustScore}
              size={gaugeSize}
              colour="#a8e8ff"
              gradientId={`${idPrefix}-trust-grad`}
              glowId={`${idPrefix}-trust-glow`}
              label="Trust"
              sublabel="Stable"
            />
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(74,222,128,0.08)",
                border: "0.5px solid rgba(74,222,128,0.22)",
              }}
            >
              <span className="text-[8px] font-semibold tracking-wide text-rag-green metric-number">
                +2.4%
              </span>
            </div>
          </div>

          {/* Node Status panel — full variant only */}
          {!isCompact && (
            <div
              className="rounded-xl p-3 flex flex-col items-center gap-2"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "0.5px solid rgba(255,255,255,0.10)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)",
              }}
            >
              <span className="text-[9px] font-medium tracking-[0.08em] text-on-surface-variant">
                Node Status
              </span>

              {/* Node grid — 4×4 circles */}
              <div
                className="grid gap-1.5 my-1"
                style={{
                  gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
                }}
                aria-hidden="true"
              >
                {Array.from({ length: nodeCount }).map((_, i) => {
                  const isAlert = i >= nodeCount - alertNodeCount;
                  return (
                    <div
                      key={i}
                      className={cn(
                        "rounded-full",
                        isAlert
                          ? "animate-pulse motion-reduce:animate-none"
                          : ""
                      )}
                      style={{
                        width: 8,
                        height: 8,
                        background: isAlert
                          ? "rgba(255,180,171,0.65)"
                          : "rgba(74,222,128,0.60)",
                        boxShadow: isAlert
                          ? "0 0 4px rgba(255,180,171,0.5)"
                          : "0 0 4px rgba(74,222,128,0.45)",
                      }}
                    />
                  );
                })}
              </div>

              <span className="text-[9px] font-medium text-on-surface-variant">
                {activeNodes} / {totalNodes} active
              </span>
            </div>
          )}

          {/* KCSIE Alignment gauge panel */}
          <div
            className="rounded-xl p-3 flex flex-col items-center gap-2"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "0.5px solid rgba(255,255,255,0.10)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)",
            }}
          >
            <span className="text-[9px] font-medium tracking-[0.08em] text-on-surface-variant">
              KCSIE Alignment
            </span>
            <CircularGauge
              score={kcsieScore}
              size={gaugeSize}
              colour="#3cd7ff"
              gradientId={`${idPrefix}-kcsie-grad`}
              glowId={`${idPrefix}-kcsie-glow`}
              label="Compliance"
              sublabel="Aligned"
            />
            <div className="badge badge-cyan text-[8px] py-0 px-2">
              Compliance lock
            </div>
          </div>
        </div>

        {/* ── Alert strip ────────────────────────── */}
        {alerts > 0 && (
          <div
            className="rounded-xl p-3 mb-3 flex items-center gap-3"
            style={{
              background:
                "linear-gradient(135deg, rgba(147,0,10,0.10) 0%, rgba(255,180,171,0.05) 100%)",
              border: "0.5px solid rgba(255,180,171,0.22)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.06), 0 0 16px rgba(255,180,171,0.06)",
            }}
          >
            {/* Alert count orb */}
            <div className="relative flex-shrink-0" aria-hidden="true">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(255,180,171,0.08)",
                  border: "0.5px solid rgba(255,180,171,0.30)",
                }}
              >
                <span className="metric-number text-error font-bold text-base leading-none">
                  {String(alerts).padStart(2, "0")}
                </span>
              </div>
              <div
                className="absolute inset-0 rounded-full border border-error/20 animate-ping motion-reduce:animate-none"
                style={{ animationDuration: "2.5s" }}
              />
            </div>

            <div className="flex flex-col gap-0.5">
              <p className="text-[10px] font-semibold text-on-surface tracking-[0.04em]">
                Nodes requiring attention
              </p>
              <p className="text-[9px] text-error/80 font-medium">
                Immediate review recommended
              </p>
            </div>
          </div>
        )}

        {/* ── Status footer ──────────────────────── */}
        <div
          className="flex items-center justify-between pt-2.5"
          style={{ borderTop: "0.5px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center gap-3 text-[8px] font-mono text-on-surface-variant/60 tracking-[0.06em]">
            <span>Scan 0.12 ms</span>
            <span>·</span>
            <span>Latency 14 ms</span>
            <span>·</span>
            <span>Auto</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full bg-rag-green animate-pulse motion-reduce:animate-none"
              style={{ boxShadow: "0 0 4px rgba(74,222,128,0.6)" }}
              aria-hidden="true"
            />
            <span className="text-[8px] font-medium tracking-[0.06em] text-rag-green/90">
              Operational
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
