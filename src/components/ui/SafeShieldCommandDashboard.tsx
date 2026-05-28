"use client";

import { cn } from "@/lib/utils";
import CountUp from "@/components/ui/CountUp";

/* ─── Mini chart: radar triangle ─────────────────────────────── */
function RadarTriangle() {
  return (
    <svg viewBox="0 0 100 88" width="72" height="64" aria-hidden="true" style={{ overflow: "visible" }}>
      {/* Grid rings */}
      {[0.28, 0.55, 0.82].map((s, i) => (
        <polygon
          key={i}
          points={`50,${4 + (80 * (1 - s))},${10 + 84 * s},${88 - 10 + (80 * (1 - s)) * 0.5},${90 - 84 * s},${88 - 10 + (80 * (1 - s)) * 0.5}`}
          fill="none"
          stroke="rgba(0,212,255,0.08)"
          strokeWidth="0.6"
        />
      ))}
      {/* Score polygon */}
      <polygon
        points="50,22 68,62 32,62"
        fill="rgba(0,212,255,0.09)"
        stroke="rgba(0,212,255,0.55)"
        strokeWidth="0.8"
      />
      {/* Vertices */}
      {[[50, 22], [68, 62], [32, 62]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2" fill="rgba(0,212,255,0.8)" style={{ filter: "drop-shadow(0 0 3px rgba(0,212,255,0.9))" }} />
      ))}
    </svg>
  );
}

/* ─── Mini chart: waveform bars ──────────────────────────────── */
function WaveformChart({ width = 96, height = 28 }: { width?: number; height?: number }) {
  const bars = [3, 7, 5, 11, 4, 14, 6, 9, 12, 5, 8, 13, 6, 10, 7, 15, 5, 9, 11, 7, 4, 12, 8, 10, 14, 6, 9, 13, 5, 8];
  return (
    <svg viewBox={`0 0 ${bars.length * 3.2} ${height}`} width={width} height={height} aria-hidden="true" preserveAspectRatio="none">
      {bars.map((h, i) => (
        <rect
          key={i}
          x={i * 3.2}
          y={height - h}
          width={2.4}
          height={h}
          fill={`rgba(0,212,255,${0.22 + (h / 15) * 0.55})`}
          rx="0.4"
        />
      ))}
    </svg>
  );
}

/* ─── Mini ring gauge ─────────────────────────────────────────── */
function MiniRingGauge({ percent, colour = "#3cd7ff", size = 52 }: { percent: number; colour?: string; size?: number }) {
  const r = (size / 2) * 0.74;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }} aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={2.8} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={colour}
        strokeWidth={2.8}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${colour})` }}
      />
    </svg>
  );
}

/* ─── Panel wrapper ───────────────────────────────────────────── */
function Panel({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn("flex flex-col gap-2.5 p-3 rounded-xl relative overflow-hidden", className)}
      style={{
        background: "rgba(255,255,255,0.028)",
        border: "0.5px solid rgba(255,255,255,0.09)",
        borderTop: "0.5px solid rgba(255,255,255,0.18)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)",
      }}
    >
      {/* Panel top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.35) 30%, rgba(0,212,255,0.35) 70%, transparent)" }}
        aria-hidden="true"
      />
      {/* Header */}
      <div className="flex items-center gap-1.5">
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: "rgba(0,212,255,0.9)", boxShadow: "0 0 5px rgba(0,212,255,0.8)" }}
          aria-hidden="true"
        />
        <span className="text-[8.5px] font-bold tracking-[0.18em] uppercase" style={{ color: "rgba(168,232,255,0.65)" }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

/* ─── Central orb ────────────────────────────────────────────── */
function CentralOrb({ size = 210 }: { size?: number }) {
  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
      <svg
        width={size + 60}
        height={size + 60}
        className="absolute"
        style={{ top: "-30px", left: "-30px", overflow: "visible", pointerEvents: "none" }}
        aria-hidden="true"
      >
        {/* Ambient glow field */}
        <defs>
          <radialGradient id="cmd-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,212,255,0.22)" />
            <stop offset="55%" stopColor="rgba(0,212,255,0.07)" />
            <stop offset="100%" stopColor="rgba(0,212,255,0)" />
          </radialGradient>
        </defs>
        <circle cx={(size + 60) / 2} cy={(size + 60) / 2} r={(size + 60) / 2 * 0.92} fill="url(#cmd-glow)" />

        {/* Outermost slow ring */}
        <circle
          cx={(size + 60) / 2} cy={(size + 60) / 2}
          r={size * 0.48}
          fill="none" stroke="rgba(0,212,255,0.14)" strokeWidth={0.6}
          strokeDasharray="3 9"
          style={{ animation: "ring-cw 28s linear infinite", transformOrigin: "50% 50%" }}
        />
        {/* Second ring */}
        <circle
          cx={(size + 60) / 2} cy={(size + 60) / 2}
          r={size * 0.42}
          fill="none" stroke="rgba(0,212,255,0.22)" strokeWidth={0.5}
          strokeDasharray="8 16"
          style={{ animation: "ring-ccw 20s linear infinite", transformOrigin: "50% 50%" }}
        />
        {/* Third ring — faster */}
        <circle
          cx={(size + 60) / 2} cy={(size + 60) / 2}
          r={size * 0.35}
          fill="none" stroke="rgba(168,232,255,0.30)" strokeWidth={0.6}
          strokeDasharray="5 10"
          style={{ animation: "ring-cw 12s linear infinite", transformOrigin: "50% 50%" }}
        />
        {/* Fourth ring — tightest */}
        <circle
          cx={(size + 60) / 2} cy={(size + 60) / 2}
          r={size * 0.28}
          fill="none" stroke="rgba(0,212,255,0.40)" strokeWidth={0.7}
          strokeDasharray="2 5"
          style={{ animation: "ring-ccw 8s linear infinite", transformOrigin: "50% 50%" }}
        />

        {/* Cardinal tick marks at 0°, 90°, 180°, 270° */}
        {[0, 90, 180, 270].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const baseR = size * 0.35;
          const x1 = (size + 60) / 2 + Math.cos(rad) * (baseR - 6);
          const y1 = (size + 60) / 2 + Math.sin(rad) * (baseR - 6);
          const x2 = (size + 60) / 2 + Math.cos(rad) * (baseR + 6);
          const y2 = (size + 60) / 2 + Math.sin(rad) * (baseR + 6);
          return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(0,212,255,0.55)" strokeWidth="1" />;
        })}

        {/* 45° dots */}
        {[45, 135, 225, 315].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const r = size * 0.42;
          const x = (size + 60) / 2 + Math.cos(rad) * r;
          const y = (size + 60) / 2 + Math.sin(rad) * r;
          return <circle key={deg} cx={x} cy={y} r="1.5" fill="rgba(0,212,255,0.5)" />;
        })}
      </svg>

      {/* Inner filled circle */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 0.52,
          height: size * 0.52,
          background: "radial-gradient(circle at 40% 30%, rgba(0,40,70,0.95) 0%, rgba(0,18,35,0.98) 100%)",
          border: "1px solid rgba(0,212,255,0.45)",
          boxShadow: "0 0 24px rgba(0,212,255,0.35), inset 0 0 20px rgba(0,212,255,0.08)",
        }}
      />

      {/* Shield SVG */}
      <div
        className="absolute"
        style={{ filter: "drop-shadow(0 0 14px rgba(0,212,255,0.65)) drop-shadow(0 0 4px rgba(168,232,255,0.5))" }}
      >
        <svg width={32} height={37} viewBox="0 0 32 37" fill="none" aria-label="SafeShield">
          <path
            d="M16 1L2 6.5v10c0 9.5 6 18.5 14 21.5 8-3 14-12 14-21.5v-10L16 1z"
            fill="rgba(0,30,55,0.9)"
            stroke="rgba(0,212,255,0.9)"
            strokeWidth="1.2"
          />
          <path
            d="M16 7L7 11v7c0 6 4 11.5 9 13.5 5-2 9-7.5 9-13.5v-7L16 7z"
            fill="rgba(0,212,255,0.14)"
            stroke="rgba(168,232,255,0.5)"
            strokeWidth="0.8"
          />
          {/* Check mark */}
          <path d="M10 19l4 4 8-8" stroke="rgba(168,232,255,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>

      {/* Text labels — below shield */}
      <div className="absolute flex flex-col items-center" style={{ top: "62%" }}>
        <span
          className="text-[9px] font-black tracking-[0.22em] uppercase"
          style={{ color: "rgba(230,245,255,0.95)", textShadow: "0 0 10px rgba(0,212,255,0.5)" }}
        >
          SafeShield
        </span>
        <span
          className="text-[6.5px] font-semibold tracking-[0.35em] uppercase"
          style={{ color: "rgba(0,212,255,0.65)" }}
        >
          COMMAND
        </span>
      </div>
    </div>
  );
}

/* ─── Main Dashboard ──────────────────────────────────────────── */
export default function SafeShieldCommandDashboard({ className }: { className?: string }) {
  return (
    <div
      className={cn("relative rounded-2xl overflow-hidden w-full", className)}
      style={{
        background: "rgba(5,8,18,0.80)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderTop: "1px solid rgba(255,255,255,0.22)",
        backdropFilter: "blur(28px) saturate(1.6)",
        WebkitBackdropFilter: "blur(28px) saturate(1.6)",
        boxShadow:
          "inset 0 2px 0 rgba(255,255,255,0.08), 0 32px 100px rgba(0,0,0,0.75), 0 0 0 0.5px rgba(255,255,255,0.04)",
      }}
    >
      {/* Inner dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,212,255,0.016) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.016) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* ── Main 3-column grid ── */}
      <div className="relative z-10 p-3 grid grid-cols-[1fr_auto_1fr] gap-3 items-center">

        {/* ══ LEFT PANELS ══ */}
        <div className="flex flex-col gap-2.5">

          {/* Risk Radar */}
          <Panel title="Risk Radar">
            <p className="text-[7.5px] tracking-[0.14em] uppercase" style={{ color: "rgba(168,232,255,0.38)" }}>Live Risk Score</p>
            <div className="flex items-end gap-2">
              <div className="flex items-baseline gap-1">
                <CountUp end={18} className="text-[26px] font-black leading-none metric-number text-on-surface" />
                <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>/100</span>
              </div>
              <span className="text-[9px] font-bold tracking-wide mb-0.5 text-primary">LOW</span>
              <div className="ml-auto -mb-1">
                <RadarTriangle />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
              {[
                { label: "Critical", val: 0, col: "rgba(255,100,80,0.9)" },
                { label: "High", val: 2, col: "rgba(251,191,36,0.9)" },
                { label: "Medium", val: 5, col: "rgba(251,191,36,0.7)" },
                { label: "Low", val: 32, col: "rgba(0,212,255,0.9)" },
              ].map(({ label, val, col }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: col, boxShadow: `0 0 4px ${col}` }} aria-hidden="true" />
                  <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.45)" }}>{label}</span>
                  <span className="text-[8px] font-bold text-on-surface metric-number ml-auto">{val}</span>
                </div>
              ))}
            </div>
            <p className="text-[7px] tracking-[0.14em] uppercase" style={{ color: "rgba(255,255,255,0.25)" }}>Last 24 Hours</p>
          </Panel>

          {/* Evidence Stream */}
          <Panel title="Evidence Stream">
            <div className="flex items-center gap-2">
              <span className="text-[7.5px] tracking-[0.1em] uppercase" style={{ color: "rgba(168,232,255,0.38)" }}>Real-Time Ingestion</span>
              <span className="text-[7px] font-bold" style={{ color: "rgba(74,222,128,0.9)" }}>● LIVE</span>
            </div>
            <div className="flex flex-col gap-1">
              {[
                { label: "Emails", val: "2,342", delta: "−2.1%", up: false },
                { label: "Messages", val: "1,216", delta: "−3.4%", up: false },
                { label: "Uploads", val: "532", delta: "+1.7%", up: true },
                { label: "Web Activity", val: "3,421", delta: "+0.6%", up: true },
                { label: "Alerts", val: "7", delta: "+12.5%", up: true },
              ].map(({ label, val, delta, up }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-[8px] flex-1" style={{ color: "rgba(255,255,255,0.45)" }}>{label}</span>
                  <span className="text-[8px] font-semibold text-on-surface metric-number">{val}</span>
                  <span
                    className="text-[7.5px] font-bold metric-number w-11 text-right"
                    style={{ color: up ? "rgba(74,222,128,0.85)" : "rgba(255,100,80,0.85)" }}
                  >{delta}</span>
                </div>
              ))}
            </div>
            <div className="h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[7.5px]" style={{ color: "rgba(255,255,255,0.35)" }}>Total Events</span>
                <span className="text-[11px] font-bold text-on-surface metric-number">8,016</span>
                <span className="text-[7.5px] font-bold" style={{ color: "rgba(255,100,80,0.85)" }}>−1.9%</span>
              </div>
              <WaveformChart width={80} height={22} />
            </div>
          </Panel>

          {/* AI Governance */}
          <Panel title="AI Governance">
            <div className="flex items-start gap-2">
              <div className="flex flex-col gap-2.5 flex-1">
                {[
                  { label: "Model Integrity", end: 98.6 },
                  { label: "Bias Detection", end: 0.8 },
                  { label: "Policy Alignment", end: 97.1 },
                ].map(({ label, end }) => (
                  <div key={label}>
                    <p className="text-[7.5px] mb-0.5" style={{ color: "rgba(255,255,255,0.38)" }}>{label}</p>
                    <CountUp end={end} decimals={1} suffix="%" className="text-[14px] font-black text-on-surface metric-number leading-none" />
                  </div>
                ))}
              </div>
              {/* AI triangle */}
              <svg viewBox="0 0 80 76" width="72" height="68" aria-hidden="true" style={{ flexShrink: 0 }}>
                <defs>
                  <linearGradient id="tri-fill" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(168,232,255,0.55)" />
                    <stop offset="100%" stopColor="rgba(0,212,255,0.18)" />
                  </linearGradient>
                </defs>
                {/* Outer grid triangle */}
                <polygon points="40,3 77,70 3,70" fill="none" stroke="rgba(0,212,255,0.12)" strokeWidth="0.6" />
                <polygon points="40,18 65,63 15,63" fill="none" stroke="rgba(0,212,255,0.08)" strokeWidth="0.5" />
                {/* Score triangle */}
                <polygon points="40,12 68,66 12,66" fill="url(#tri-fill)" stroke="rgba(0,212,255,0.6)" strokeWidth="0.8" />
                <polygon points="40,28 60,60 20,60" fill="rgba(0,18,32,0.8)" stroke="rgba(168,232,255,0.18)" strokeWidth="0.5" />
                {/* Vertices */}
                {[[40, 12], [68, 66], [12, 66]].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="2" fill="rgba(0,212,255,0.85)" />
                ))}
                <text x="40" y="9" textAnchor="middle" fontSize="4.5" fill="rgba(168,232,255,0.5)" fontFamily="monospace">Fairness</text>
                <text x="6" y="74" textAnchor="middle" fontSize="4" fill="rgba(168,232,255,0.5)" fontFamily="monospace">Accountability</text>
                <text x="74" y="74" textAnchor="middle" fontSize="4" fill="rgba(168,232,255,0.5)" fontFamily="monospace">Safety</text>
              </svg>
            </div>
          </Panel>
        </div>

        {/* ══ CENTRAL ORB ══ */}
        <div className="flex flex-col items-center justify-center px-2">
          <CentralOrb size={200} />
        </div>

        {/* ══ RIGHT PANELS ══ */}
        <div className="flex flex-col gap-2.5">

          {/* Compliance Readiness */}
          <Panel title="Compliance Readiness">
            <div className="flex items-start gap-2">
              <div className="flex flex-col gap-0.5">
                <p className="text-[7.5px] tracking-[0.12em] uppercase" style={{ color: "rgba(168,232,255,0.38)" }}>Overall Readiness</p>
                <CountUp end={92} suffix="%" className="text-[26px] font-black text-on-surface metric-number leading-none" />
                <span className="text-[9px] font-bold" style={{ color: "rgba(74,222,128,0.9)" }}>STRONG</span>
                <p className="text-[7px] mt-0.5" style={{ color: "rgba(255,255,255,0.28)" }}>Last Audit: 2 days ago</p>
              </div>
              <div className="ml-auto mt-0.5">
                <MiniRingGauge percent={92} colour="#4ade80" size={52} />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              {[
                { name: "GDPR", status: "Compliant" },
                { name: "UK DPA 2018", status: "Compliant" },
                { name: "NIS 2", status: "Compliant" },
                { name: "ISO 27001", status: "Aligned" },
                { name: "Data Retention", status: "Compliant" },
              ].map(({ name, status }) => (
                <div key={name} className="flex items-center justify-between">
                  <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.42)" }}>{name}</span>
                  <span className="text-[7.5px] font-semibold" style={{ color: "rgba(0,212,255,0.85)" }}>{status}</span>
                </div>
              ))}
            </div>
          </Panel>

          {/* Action Tracker */}
          <Panel title="Action Tracker">
            <div className="flex items-start gap-3">
              <div>
                <CountUp end={23} className="text-[32px] font-black text-on-surface metric-number leading-none" />
                <p className="text-[8px] mt-0.5" style={{ color: "rgba(255,255,255,0.38)" }}>Open</p>
              </div>
              <div className="flex flex-col gap-1 flex-1 mt-1">
                {[
                  { label: "Critical", val: 2, col: "rgba(255,100,80,0.9)" },
                  { label: "High", val: 6, col: "rgba(251,191,36,0.9)" },
                  { label: "Medium", val: 10, col: "rgba(168,232,255,0.8)" },
                  { label: "Low", val: 5, col: "rgba(74,222,128,0.8)" },
                ].map(({ label, val, col }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full shrink-0" style={{ background: col }} aria-hidden="true" />
                    <span className="text-[8px] flex-1" style={{ color: "rgba(255,255,255,0.42)" }}>{label}</span>
                    <span className="text-[8px] font-bold text-on-surface metric-number">{val}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="flex items-center justify-between">
              <span className="text-[7.5px]" style={{ color: "rgba(255,255,255,0.35)" }}>Due This Week</span>
              <CountUp end={7} className="text-[18px] font-black text-on-surface metric-number leading-none" />
            </div>
          </Panel>

          {/* Filtering & Monitoring */}
          <Panel title="Filtering & Monitoring">
            <p className="text-[7.5px] tracking-[0.12em] uppercase -mt-0.5" style={{ color: "rgba(168,232,255,0.38)" }}>
              Threats Blocked (24h)
            </p>
            <div className="flex items-end gap-2">
              <CountUp end={1247} className="text-[22px] font-black text-on-surface metric-number leading-none" />
              <span className="text-[8px] font-bold mb-0.5" style={{ color: "rgba(255,100,80,0.85)" }}>−15.5%</span>
            </div>
            <WaveformChart width={120} height={26} />
            <div className="h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="flex items-center justify-between">
              <span className="text-[7.5px]" style={{ color: "rgba(255,255,255,0.35)" }}>Policies Active</span>
              <CountUp end={42} className="text-[18px] font-black text-on-surface metric-number leading-none" />
            </div>
          </Panel>
        </div>
      </div>

      {/* ── Accessibility bar ── */}
      <div
        className="relative z-10 mx-3 mb-3 p-3 rounded-xl"
        style={{
          background: "rgba(255,255,255,0.022)",
          border: "0.5px solid rgba(255,255,255,0.08)",
          borderTop: "0.5px solid rgba(255,255,255,0.15)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        <div className="flex items-center gap-1.5 mb-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(0,212,255,0.9)", boxShadow: "0 0 5px rgba(0,212,255,0.8)" }} aria-hidden="true" />
          <span className="text-[8.5px] font-bold tracking-[0.18em] uppercase" style={{ color: "rgba(168,232,255,0.65)" }}>Accessibility</span>
        </div>
        <div className="flex items-center gap-6 sm:gap-10">
          {[
            { icon: "⬡", label: "WCAG 2.2", val: "AA", sub: "Compliant" },
            { icon: "◈", label: "Language Support", val: "12", sub: "Languages" },
            { icon: "⬥", label: "Assistive Mode", val: "Enabled", sub: "" },
          ].map(({ icon, label, val, sub }) => (
            <div key={label} className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: "rgba(0,212,255,0.07)",
                  border: "0.5px solid rgba(0,212,255,0.22)",
                }}
                aria-hidden="true"
              >
                <span className="text-[10px]" style={{ color: "rgba(0,212,255,0.7)" }}>{icon}</span>
              </div>
              <div>
                <p className="text-[7.5px]" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</p>
                <p className="text-[12px] font-black text-on-surface metric-number leading-tight">{val}</p>
                {sub && <p className="text-[7.5px]" style={{ color: "rgba(0,212,255,0.65)" }}>{sub}</p>}
              </div>
            </div>
          ))}

          {/* Right: live status readout */}
          <div className="ml-auto flex items-center gap-4">
            <div className="hidden sm:flex flex-col gap-1">
              {[
                { label: "SYS", val: "ACTIVE" },
                { label: "ENC", val: "AES-256" },
                { label: "NET", val: "SECURE" },
              ].map(({ label, val }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-[7px] font-mono font-bold tracking-[0.14em] w-6" style={{ color: "rgba(255,255,255,0.3)" }}>{label}</span>
                  <span className="text-[7px] font-mono font-bold tracking-[0.08em]" style={{ color: "rgba(0,212,255,0.65)" }}>{val}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse motion-reduce:animate-none"
                style={{ background: "rgba(74,222,128,0.9)", boxShadow: "0 0 5px rgba(74,222,128,0.7)" }}
                aria-hidden="true"
              />
              <span className="text-[8px] font-semibold" style={{ color: "rgba(74,222,128,0.8)" }}>Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom glow line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.2) 25%, rgba(0,212,255,0.2) 75%, transparent)" }}
        aria-hidden="true"
      />
    </div>
  );
}
