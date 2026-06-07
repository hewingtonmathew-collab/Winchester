"use client";

import { cn } from "@/lib/utils";
import CountUp from "@/components/ui/CountUp";

/* ─────────────────────────────────────────────────────────────
   RADAR TRIANGLE  (72×64)
───────────────────────────────────────────────────────────── */
function RadarTriangle() {
  /* Three concentric equilateral triangles as grid rings,
     then a filled score triangle, then glowing vertex circles. */
  const cx = 50;
  const cyTop = 4;
  // Full-size outer triangle points (top, bottom-right, bottom-left)
  function triPoints(scale: number): string {
    const top: [number, number] = [cx, cyTop + (84 * (1 - scale))];
    const br: [number, number] = [cx + 84 * scale * 0.5, cyTop + 84 * scale * 0.866 + (84 * (1 - scale))];
    const bl: [number, number] = [cx - 84 * scale * 0.5, cyTop + 84 * scale * 0.866 + (84 * (1 - scale))];
    return `${top[0]},${top[1]} ${br[0]},${br[1]} ${bl[0]},${bl[1]}`;
  }
  const gridScales: [number, number, number] = [1.0, 0.67, 0.33];
  const gridOpacities: [number, number, number] = [0.10, 0.07, 0.04];
  // Score triangle at ~80% fill
  const scoreScale = 0.80;
  const scorePts = triPoints(scoreScale);
  const fullPts = triPoints(1.0);
  // Vertex positions for glow dots (score triangle)
  function verts(scale: number): [number, number][] {
    return [
      [cx, cyTop + (84 * (1 - scale))],
      [cx + 84 * scale * 0.5, cyTop + 84 * scale * 0.866 + (84 * (1 - scale))],
      [cx - 84 * scale * 0.5, cyTop + 84 * scale * 0.866 + (84 * (1 - scale))],
    ] as [number, number][];
  }
  const scoreVerts = verts(scoreScale);

  return (
    <svg viewBox="0 0 100 88" width="72" height="64" aria-hidden="true" style={{ overflow: "visible" }}>
      <defs>
        <filter id="vert-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="rgba(0,212,255,0.9)" />
        </filter>
      </defs>
      {/* Grid ring triangles */}
      {gridScales.map((s, i) => (
        <polygon
          key={i}
          points={triPoints(s)}
          fill="none"
          stroke={`rgba(0,212,255,${gridOpacities[i]})`}
          strokeWidth="0.7"
        />
      ))}
      {/* Axis lines from center to each outer vertex */}
      {verts(1.0).map(([x, y], i) => (
        <line
          key={i}
          x1={cx}
          y1={cyTop + 84 * 0.289}
          x2={x}
          y2={y}
          stroke="rgba(0,212,255,0.04)"
          strokeWidth="0.5"
        />
      ))}
      {/* Filled score triangle */}
      <polygon
        points={scorePts}
        fill="rgba(0,212,255,0.12)"
        stroke="rgba(0,212,255,0.90)"
        strokeWidth="0.9"
      />
      {/* Outer reference triangle */}
      <polygon points={fullPts} fill="none" stroke="rgba(0,212,255,0.09)" strokeWidth="0.5" />
      {/* Glowing vertex circles */}
      {scoreVerts.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="2.5"
          fill="rgba(0,212,255,0.9)"
          filter="url(#vert-glow)"
        />
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   WAVEFORM CHART  (30 bars)
───────────────────────────────────────────────────────────── */
function WaveformChart({ width = 96, height = 28 }: { width?: number; height?: number }) {
  const bars = [3, 7, 5, 11, 4, 14, 6, 9, 12, 5, 8, 13, 6, 10, 7, 15, 5, 9, 11, 7, 4, 12, 8, 10, 14, 6, 9, 13, 5, 8];
  const barW = 2.4;
  const gap = 0.8;
  const step = barW + gap;
  return (
    <svg
      viewBox={`0 0 ${bars.length * step} ${height}`}
      width={width}
      height={height}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      {bars.map((h, i) => (
        <rect
          key={i}
          x={i * step}
          y={height - h}
          width={barW}
          height={h}
          fill={`rgba(0,212,255,${0.20 + (h / 15) * 0.65})`}
          rx="0.4"
          style={h > 10 ? { filter: "drop-shadow(0 0 2px rgba(0,212,255,0.6))" } : undefined}
        />
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   MINI RING GAUGE
───────────────────────────────────────────────────────────── */
function MiniRingGauge({
  percent,
  colour = "#3cd7ff",
  size = 52,
}: {
  percent: number;
  colour?: string;
  size?: number;
}) {
  const r = (size / 2) * 0.74;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }} aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={3.5} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={colour}
        strokeWidth={3.5}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${colour})` }}
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   AI GOVERNANCE TRIANGLE  (80×76)
───────────────────────────────────────────────────────────── */
function AIGovTriangle() {
  return (
    <svg viewBox="0 0 80 76" width="80" height="76" aria-hidden="true" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="ai-tri-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(168,232,255,0.55)" />
          <stop offset="100%" stopColor="rgba(0,212,255,0.20)" />
        </linearGradient>
        <filter id="ai-vert-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="rgba(0,212,255,0.85)" />
        </filter>
      </defs>
      {/* Outer grid ring */}
      <polygon points="40,3 77,70 3,70" fill="none" stroke="rgba(0,212,255,0.12)" strokeWidth="0.7" />
      {/* Inner grid ring */}
      <polygon points="40,18 65,63 15,63" fill="none" stroke="rgba(0,212,255,0.08)" strokeWidth="0.6" />
      {/* Filled score triangle */}
      <polygon points="40,10 70,67 10,67" fill="url(#ai-tri-fill)" stroke="rgba(0,212,255,0.60)" strokeWidth="0.9" />
      {/* Hollow center cutout */}
      <polygon points="40,26 62,61 18,61" fill="rgba(0,18,32,0.78)" stroke="rgba(168,232,255,0.14)" strokeWidth="0.5" />
      {/* Glowing vertices */}
      {([[40, 10], [70, 67], [10, 67]] as [number, number][]).map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill="rgba(0,212,255,0.88)" filter="url(#ai-vert-glow)" />
      ))}
      {/* Labels */}
      <text x="40" y="8.5" textAnchor="middle" fontSize="4.5" fill="rgba(168,232,255,0.52)" fontFamily="monospace">Fairness</text>
      <text x="5"  y="74"  textAnchor="middle" fontSize="4"   fill="rgba(168,232,255,0.52)" fontFamily="monospace">Accountability</text>
      <text x="75" y="74"  textAnchor="middle" fontSize="4"   fill="rgba(168,232,255,0.52)" fontFamily="monospace">Safety</text>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   CINEMATIC GLASS PANEL
───────────────────────────────────────────────────────────── */
function Panel({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("flex flex-col gap-2.5 p-3 relative overflow-hidden", className)}
      style={{
        borderRadius: "20px",
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(0,6,20,0.75) 100%)",
        borderTop: "1px solid rgba(255,255,255,0.30)",
        borderLeft: "1px solid rgba(255,255,255,0.18)",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        boxShadow:
          "inset 0 2px 0 rgba(255,255,255,0.12), inset 0 0 40px rgba(0,20,60,0.4), 0 10px 50px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.04)",
      }}
    >
      {/* Top specular line */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(0,212,255,0.5) 30%, rgba(200,240,255,0.7) 50%, rgba(0,212,255,0.5) 70%, transparent)",
        }}
        aria-hidden="true"
      />
      {/* Inner specular sweep / grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 40%)",
          borderRadius: "20px",
        }}
        aria-hidden="true"
      />
      {/* Header */}
      <div className="relative flex items-center gap-1.5">
        {/* Hexagonal icon box */}
        <div
          style={{
            width: 12,
            height: 12,
            background: "rgba(0,212,255,0.12)",
            border: "1px solid rgba(0,212,255,0.35)",
            borderRadius: "3px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "rgba(0,212,255,0.9)",
              boxShadow: "0 0 4px rgba(0,212,255,0.8)",
            }}
          />
        </div>
        <span
          className="text-[8.5px] font-bold tracking-[0.20em] uppercase"
          style={{ color: "rgba(168,232,255,0.75)" }}
        >
          {title}
        </span>
      </div>
      <div className="relative flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   CONNECTOR ZONE  (glowing lines + endpoint dots)
───────────────────────────────────────────────────────────── */
function ConnectorZone({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  return (
    <div className="h-full flex flex-col justify-around py-6" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center w-full" style={{ gap: 0 }}>
          {/* Panel-side dot (dimmer, smaller) */}
          {!isLeft && (
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "rgba(0,212,255,0.75)",
                boxShadow: "0 0 6px rgba(0,212,255,0.55), 0 0 12px rgba(0,212,255,0.3)",
                flexShrink: 0,
              }}
            />
          )}
          {/* Glowing line */}
          <div
            style={{
              flex: 1,
              height: "1.5px",
              background: isLeft
                ? "linear-gradient(to right, rgba(0,212,255,0.55), rgba(0,212,255,0.12))"
                : "linear-gradient(to left, rgba(0,212,255,0.55), rgba(0,212,255,0.12))",
              boxShadow:
                "0 0 6px rgba(0,212,255,0.4), 0 0 12px rgba(0,212,255,0.2)",
            }}
          />
          {/* Orb-side dot (brighter, larger) */}
          {isLeft && (
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "rgba(0,212,255,0.92)",
                boxShadow: "0 0 6px rgba(0,212,255,0.7), 0 0 12px rgba(0,212,255,0.4)",
                flexShrink: 0,
              }}
            />
          )}
          {/* Right side: panel-side = smaller dot on the right edge */}
          {isLeft && (
            <div
              style={{
                width: 3,
                height: 3,
                borderRadius: "50%",
                background: "rgba(0,212,255,0.45)",
                flexShrink: 0,
                marginLeft: 0,
                /* sits at panel edge — we offset it from parent */
              }}
            />
          )}
          {!isLeft && (
            <div
              style={{
                width: 3,
                height: 3,
                borderRadius: "50%",
                background: "rgba(0,212,255,0.45)",
                flexShrink: 0,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   CENTRAL ORB  (size = 240)
───────────────────────────────────────────────────────────── */
function CentralOrb({ size = 240 }: { size?: number }) {
  const half = size / 2;
  // SVG canvas is size+80 to give room for outer rings
  const canvas = size + 80;
  const cxy = canvas / 2;

  const rings: { r: number; dash: string; anim: string; dur: string; sw: number }[] = [
    { r: size * 0.46, dash: "3 10",  anim: "ring-cw",  dur: "32s", sw: 0.55 },
    { r: size * 0.39, dash: "8 18",  anim: "ring-ccw", dur: "22s", sw: 0.50 },
    { r: size * 0.33, dash: "5 10",  anim: "ring-cw",  dur: "14s", sw: 0.60 },
    { r: size * 0.27, dash: "2 6",   anim: "ring-ccw", dur: "9s",  sw: 0.65 },
    { r: size * 0.22, dash: "1 4",   anim: "ring-cw",  dur: "6s",  sw: 0.55 },
  ];

  return (
    <div
      className="relative flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size }}
    >
      {/* Ambient glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: size * 1.4,
          height: size * 1.4,
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          background:
            "radial-gradient(circle, rgba(0,212,255,0.20) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* SVG rings layer */}
      <svg
        width={canvas}
        height={canvas}
        className="absolute pointer-events-none"
        style={{ top: -40, left: -40, overflow: "visible" }}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="orb-ambient" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(0,212,255,0.18)" />
            <stop offset="60%"  stopColor="rgba(0,212,255,0.06)" />
            <stop offset="100%" stopColor="rgba(0,212,255,0)" />
          </radialGradient>
        </defs>

        {/* Rings */}
        {rings.map((rg, i) => (
          <circle
            key={i}
            cx={cxy}
            cy={cxy}
            r={rg.r}
            fill="none"
            stroke={i % 2 === 0 ? "rgba(0,212,255,0.22)" : "rgba(168,232,255,0.28)"}
            strokeWidth={rg.sw}
            strokeDasharray={rg.dash}
            style={{
              animation: `${rg.anim} ${rg.dur} linear infinite`,
              transformOrigin: `${cxy}px ${cxy}px`,
            }}
          />
        ))}

        {/* Cardinal ticks at 0°/90°/180°/270° */}
        {[0, 90, 180, 270].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const baseR = size * 0.33;
          const x1 = cxy + Math.cos(rad) * (baseR - 7);
          const y1 = cxy + Math.sin(rad) * (baseR - 7);
          const x2 = cxy + Math.cos(rad) * (baseR + 7);
          const y2 = cxy + Math.sin(rad) * (baseR + 7);
          return (
            <line
              key={deg}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="rgba(0,212,255,0.70)"
              strokeWidth="1.2"
            />
          );
        })}

        {/* Diagonal dots at 45°/135°/225°/315° */}
        {[45, 135, 225, 315].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const dr = size * 0.39;
          const x = cxy + Math.cos(rad) * dr;
          const y = cxy + Math.sin(rad) * dr;
          return (
            <circle
              key={deg}
              cx={x} cy={y}
              r="1.8"
              fill="rgba(0,212,255,0.60)"
            />
          );
        })}
      </svg>

      {/* Inner circle */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 0.50,
          height: size * 0.50,
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          background:
            "radial-gradient(circle at 38% 32%, rgba(0,50,90,0.95), rgba(0,15,35,0.98))",
          border: "1.5px solid rgba(0,212,255,0.55)",
          boxShadow:
            "0 0 40px rgba(0,212,255,0.40), inset 0 0 30px rgba(0,212,255,0.10)",
        }}
      />

      {/* Shield SVG — 40px wide */}
      <div
        className="absolute"
        style={{
          filter:
            "drop-shadow(0 0 14px rgba(0,212,255,0.65)) drop-shadow(0 0 4px rgba(168,232,255,0.5))",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, calc(-50% - ${half * 0.12}px))`,
        }}
      >
        <svg width={40} height={46} viewBox="0 0 40 46" fill="none" aria-label="SafeShield">
          <path
            d="M20 1L2 8v13c0 11.5 7.5 22.5 18 26 10.5-3.5 18-14.5 18-26V8L20 1z"
            fill="rgba(0,20,45,0.9)"
            stroke="rgba(0,212,255,0.95)"
            strokeWidth="1.5"
          />
          <path
            d="M20 9L9 14v9c0 7.5 5 15 11 17.5 6-2.5 11-10 11-17.5v-9L20 9z"
            fill="rgba(0,212,255,0.16)"
          />
          {/* Checkmark */}
          <path
            d="M12 23l5.5 5.5L28 18"
            stroke="rgba(200,240,255,0.9)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>

      {/* SafeShield / COMMAND text */}
      <div
        className="absolute flex flex-col items-center"
        style={{ top: `calc(50% + ${half * 0.22}px)` }}
      >
        <span
          className="text-[10px] font-black tracking-[0.18em] uppercase"
          style={{
            color: "rgba(240,250,255,0.98)",
            textShadow: "0 0 12px rgba(0,212,255,0.6)",
          }}
        >
          SafeShield
        </span>
        <span
          className="text-[7px] font-bold tracking-[0.4em] uppercase"
          style={{ color: "rgba(0,212,255,0.7)" }}
        >
          COMMAND
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN DASHBOARD
───────────────────────────────────────────────────────────── */
export default function SafeShieldCommandDashboard({ className }: { className?: string }) {
  return (
    <div
      className={cn("relative overflow-hidden w-full", className)}
      style={{
        borderRadius: "24px",
        background:
          "linear-gradient(145deg, rgba(0,10,28,0.96) 0%, rgba(0,5,16,0.99) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderTop: "1px solid rgba(255,255,255,0.28)",
        backdropFilter: "blur(40px) saturate(2.0)",
        WebkitBackdropFilter: "blur(40px) saturate(2.0)",
        boxShadow:
          "inset 0 2px 0 rgba(255,255,255,0.08), inset 0 0 120px rgba(0,30,80,0.20), 0 50px 150px rgba(0,0,0,0.85), 0 0 0 0.5px rgba(255,255,255,0.04)",
      }}
    >
      {/* Background: fine dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,212,255,0.018) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Background: central ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(0,100,200,0.07), transparent 70%)",
        }}
      />
      {/* Background: top sweep */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(0,212,255,0.06), transparent 60%)",
        }}
      />

      {/* ── Main 5-column connector grid ── */}
      <div
        className="relative z-10 p-4 sm:p-5"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 40px auto 40px 1fr",
          gap: "0",
          alignItems: "stretch",
        }}
      >
        {/* ══ LEFT PANELS ══ */}
        <div className="flex flex-col gap-2.5 py-1">

          {/* RISK RADAR */}
          <Panel title="Risk Radar">
            <p
              className="text-[7.5px] tracking-[0.14em] uppercase"
              style={{ color: "rgba(168,232,255,0.40)" }}
            >
              Live Risk Score
            </p>
            <div className="flex items-end gap-2">
              <div className="flex items-baseline gap-1">
                <CountUp
                  end={18}
                  className="text-[28px] font-black metric-number text-on-surface leading-none"
                />
                <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.30)" }}>
                  /100
                </span>
              </div>
              <span
                className="text-[9px] font-bold tracking-wide mb-0.5"
                style={{ color: "rgba(74,222,128,0.9)" }}
              >
                LOW
              </span>
              <div className="ml-auto -mb-1">
                <RadarTriangle />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
              {(
                [
                  { label: "Critical", val: 0,  col: "rgba(255,90,70,0.9)" },
                  { label: "High",     val: 2,  col: "rgba(251,191,36,0.9)" },
                  { label: "Medium",   val: 5,  col: "rgba(251,191,36,0.7)" },
                  { label: "Low",      val: 32, col: "rgba(0,212,255,0.9)" },
                ] as { label: string; val: number; col: string }[]
              ).map(({ label, val, col }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: col, boxShadow: `0 0 4px ${col}` }}
                    aria-hidden="true"
                  />
                  <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {label}
                  </span>
                  <span className="text-[8px] font-bold text-on-surface metric-number ml-auto">
                    {val}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[7px] tracking-[0.14em] uppercase" style={{ color: "rgba(255,255,255,0.25)" }}>
              Last 24 Hours
            </p>
          </Panel>

          {/* EVIDENCE STREAM */}
          <Panel title="Evidence Stream">
            <div className="flex items-center gap-2">
              <span
                className="text-[7.5px] tracking-[0.10em] uppercase"
                style={{ color: "rgba(168,232,255,0.40)" }}
              >
                Real-time Ingestion
              </span>
              <span className="text-[7px] font-bold" style={{ color: "rgba(74,222,128,0.9)" }}>
                ● LIVE
              </span>
            </div>
            <div className="flex gap-2">
              <div className="flex flex-col gap-1 flex-1">
                {(
                  [
                    { label: "Emails",       val: "2,342", delta: "+2.1%", up: true  },
                    { label: "Messages",     val: "1,216", delta: "+3.4%", up: true  },
                    { label: "Uploads",      val: "532",   delta: "+1.7%", up: true  },
                    { label: "Web Activity", val: "3,421", delta: "+0.8%", up: true  },
                    { label: "Alerts",       val: "7",     delta: "+12.5%",up: true  },
                  ] as { label: string; val: string; delta: string; up: boolean }[]
                ).map(({ label, val, delta, up }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="text-[8px] flex-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                      {label}
                    </span>
                    <span className="text-[8px] font-semibold text-on-surface metric-number">
                      {val}
                    </span>
                    <span
                      className="text-[7.5px] font-bold metric-number w-11 text-right"
                      style={{ color: up ? "rgba(74,222,128,0.85)" : "rgba(255,90,70,0.85)" }}
                    >
                      {delta}
                    </span>
                  </div>
                ))}
              </div>
              <WaveformChart width={36} height={60} />
            </div>
            <div className="h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[7.5px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Total Events
                </span>
                <span className="text-[11px] font-bold text-on-surface metric-number">8,018</span>
                <span className="text-[7.5px] font-bold" style={{ color: "rgba(74,222,128,0.85)" }}>
                  +1.8%
                </span>
              </div>
            </div>
          </Panel>

          {/* AI GOVERNANCE */}
          <Panel title="AI Governance">
            <div className="flex items-start gap-2">
              <div className="flex flex-col gap-2.5 flex-1">
                {(
                  [
                    { label: "Model Integrity",  end: 98.6 },
                    { label: "Bias Detection",   end: 0.8  },
                    { label: "Policy Alignment", end: 97.1 },
                  ] as { label: string; end: number }[]
                ).map(({ label, end }) => (
                  <div key={label}>
                    <p className="text-[7.5px] mb-0.5" style={{ color: "rgba(255,255,255,0.38)" }}>
                      {label}
                    </p>
                    <CountUp
                      end={end}
                      decimals={1}
                      suffix="%"
                      className="text-[14px] font-black text-on-surface metric-number leading-none"
                    />
                  </div>
                ))}
              </div>
              <AIGovTriangle />
            </div>
          </Panel>
        </div>

        {/* ══ LEFT CONNECTOR ZONE ══ */}
        <ConnectorZone side="left" />

        {/* ══ CENTRAL ORB ══ */}
        <div className="flex items-center justify-center px-1">
          <CentralOrb size={240} />
        </div>

        {/* ══ RIGHT CONNECTOR ZONE ══ */}
        <ConnectorZone side="right" />

        {/* ══ RIGHT PANELS ══ */}
        <div className="flex flex-col gap-2.5 py-1">

          {/* COMPLIANCE READINESS */}
          <Panel title="Compliance Readiness">
            <div className="flex items-start gap-2">
              <div className="flex flex-col gap-0.5">
                <p
                  className="text-[7.5px] tracking-[0.12em] uppercase"
                  style={{ color: "rgba(168,232,255,0.40)" }}
                >
                  Overall Readiness
                </p>
                <CountUp
                  end={92}
                  suffix="%"
                  className="text-[28px] font-black text-on-surface metric-number leading-none"
                />
                <span
                  className="text-[9px] font-bold"
                  style={{ color: "rgba(74,222,128,0.9)" }}
                >
                  STRONG
                </span>
                <p className="text-[7px] mt-0.5" style={{ color: "rgba(255,255,255,0.28)" }}>
                  Last Audit: 2 days ago
                </p>
              </div>
              <div className="ml-auto mt-0.5">
                <MiniRingGauge percent={92} colour="#4ade80" size={56} />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              {(
                [
                  { name: "GDPR",           status: "Compliant" },
                  { name: "UK DPA 2018",    status: "Compliant" },
                  { name: "NIS2",           status: "Compliant" },
                  { name: "ISO 27001",      status: "Aligned"   },
                  { name: "Data Retention", status: "Compliant" },
                ] as { name: string; status: string }[]
              ).map(({ name, status }) => (
                <div key={name} className="flex items-center justify-between">
                  <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.42)" }}>
                    {name}
                  </span>
                  <span
                    className="text-[7.5px] font-semibold"
                    style={{ color: "rgba(0,212,255,0.85)" }}
                  >
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          {/* ACTION TRACKER */}
          <Panel title="Action Tracker">
            <div className="flex items-start gap-3">
              <div>
                <CountUp
                  end={23}
                  className="text-[28px] font-black text-on-surface metric-number leading-none"
                />
                <p className="text-[8px] mt-0.5" style={{ color: "rgba(255,255,255,0.38)" }}>
                  Open
                </p>
              </div>
              <div className="ml-auto mt-0.5">
                <MiniRingGauge percent={72} colour="#f59e0b" size={52} />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              {(
                [
                  { label: "Critical", val: 2,  col: "rgba(255,90,70,0.9)"   },
                  { label: "High",     val: 6,  col: "rgba(251,191,36,0.9)"  },
                  { label: "Medium",   val: 10, col: "rgba(168,232,255,0.8)" },
                  { label: "Low",      val: 5,  col: "rgba(74,222,128,0.8)"  },
                ] as { label: string; val: number; col: string }[]
              ).map(({ label, val, col }) => (
                <div key={label} className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: col }}
                    aria-hidden="true"
                  />
                  <span className="text-[8px] flex-1" style={{ color: "rgba(255,255,255,0.42)" }}>
                    {label}
                  </span>
                  <span className="text-[8px] font-bold text-on-surface metric-number">
                    {val}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="flex items-center justify-between">
              <span className="text-[7.5px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                Due This Week
              </span>
              <CountUp
                end={7}
                className="text-[18px] font-black text-on-surface metric-number leading-none"
              />
            </div>
          </Panel>

          {/* FILTERING & MONITORING */}
          <Panel title="Filtering & Monitoring">
            <p
              className="text-[7.5px] tracking-[0.12em] uppercase -mt-0.5"
              style={{ color: "rgba(168,232,255,0.40)" }}
            >
              Threats Blocked (24h)
            </p>
            <div className="flex items-end gap-2">
              <CountUp
                end={1247}
                className="text-[28px] font-black text-on-surface metric-number leading-none"
              />
              <span
                className="text-[8px] font-bold mb-0.5"
                style={{ color: "rgba(74,222,128,0.9)" }}
              >
                +15.5%
              </span>
            </div>
            <WaveformChart width={120} height={26} />
            <div className="h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="flex items-center justify-between">
              <span className="text-[7.5px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                Policies Active
              </span>
              <CountUp
                end={42}
                className="text-[18px] font-black text-on-surface metric-number leading-none"
              />
            </div>
          </Panel>
        </div>
      </div>

      {/* ── ACCESSIBILITY BAR ── */}
      <div
        className="relative z-10 mx-4 sm:mx-5 mb-4 sm:mb-5 p-3 overflow-hidden"
        style={{
          borderRadius: "20px",
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(0,6,20,0.75) 100%)",
          borderTop: "1px solid rgba(255,255,255,0.30)",
          borderLeft: "1px solid rgba(255,255,255,0.18)",
          borderRight: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "inset 0 2px 0 rgba(255,255,255,0.12), inset 0 0 40px rgba(0,20,60,0.4), 0 10px 50px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.04)",
        }}
      >
        {/* Specular top line */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(0,212,255,0.5) 30%, rgba(200,240,255,0.7) 50%, rgba(0,212,255,0.5) 70%, transparent)",
          }}
          aria-hidden="true"
        />
        {/* Header row */}
        <div className="flex items-center gap-1.5 mb-2">
          <div
            style={{
              width: 12,
              height: 12,
              background: "rgba(0,212,255,0.12)",
              border: "1px solid rgba(0,212,255,0.35)",
              borderRadius: "3px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "rgba(0,212,255,0.9)",
                boxShadow: "0 0 4px rgba(0,212,255,0.8)",
              }}
            />
          </div>
          <span
            className="text-[8.5px] font-bold tracking-[0.20em] uppercase"
            style={{ color: "rgba(168,232,255,0.75)" }}
          >
            Accessibility
          </span>
        </div>

        <div className="flex items-center gap-6 sm:gap-10">
          {/* WCAG */}
          <div className="flex items-center gap-2.5">
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "8px",
                background: "rgba(0,212,255,0.07)",
                border: "1px solid rgba(0,212,255,0.22)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              <span className="text-[10px]" style={{ color: "rgba(0,212,255,0.7)" }}>⬡</span>
            </div>
            <div>
              <p className="text-[7.5px]" style={{ color: "rgba(255,255,255,0.35)" }}>WCAG 2.2</p>
              <p className="text-[12px] font-black text-on-surface metric-number leading-tight">AA</p>
              <p className="text-[7.5px]" style={{ color: "rgba(0,212,255,0.65)" }}>Compliant</p>
            </div>
          </div>

          {/* Language */}
          <div className="flex items-center gap-2.5">
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "8px",
                background: "rgba(0,212,255,0.07)",
                border: "1px solid rgba(0,212,255,0.22)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              <span className="text-[10px]" style={{ color: "rgba(0,212,255,0.7)" }}>◈</span>
            </div>
            <div>
              <p className="text-[7.5px]" style={{ color: "rgba(255,255,255,0.35)" }}>Language Support</p>
              <p className="text-[12px] font-black text-on-surface metric-number leading-tight">12</p>
              <p className="text-[7.5px]" style={{ color: "rgba(0,212,255,0.65)" }}>Languages</p>
            </div>
          </div>

          {/* Assistive Mode */}
          <div className="flex items-center gap-2.5">
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "8px",
                background: "rgba(0,212,255,0.07)",
                border: "1px solid rgba(0,212,255,0.22)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              <span className="text-[10px]" style={{ color: "rgba(0,212,255,0.7)" }}>⬥</span>
            </div>
            <div>
              <p className="text-[7.5px]" style={{ color: "rgba(255,255,255,0.35)" }}>Assistive Mode</p>
              <p className="text-[12px] font-black text-on-surface metric-number leading-tight">Enabled</p>
            </div>
          </div>

          {/* Right: sys status */}
          <div className="ml-auto flex items-center gap-4">
            <div className="hidden sm:flex flex-col gap-1">
              {(
                [
                  { label: "SYS", val: "ACTIVE"  },
                  { label: "ENC", val: "AES-256"  },
                  { label: "NET", val: "SECURE"   },
                ] as { label: string; val: string }[]
              ).map(({ label, val }) => (
                <div key={label} className="flex items-center gap-2">
                  <span
                    className="text-[7px] font-mono font-bold tracking-[0.14em] w-6"
                    style={{ color: "rgba(255,255,255,0.30)" }}
                  >
                    {label}
                  </span>
                  <span
                    className="text-[7px] font-mono font-bold tracking-[0.08em]"
                    style={{ color: "rgba(0,212,255,0.65)" }}
                  >
                    {val}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse motion-reduce:animate-none"
                style={{
                  background: "rgba(74,222,128,0.9)",
                  boxShadow: "0 0 5px rgba(74,222,128,0.7)",
                }}
                aria-hidden="true"
              />
              <span
                className="text-[8px] font-semibold"
                style={{ color: "rgba(74,222,128,0.8)" }}
              >
                Operational
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom glow line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(0,212,255,0.25) 25%, rgba(0,212,255,0.25) 75%, transparent)",
        }}
        aria-hidden="true"
      />
    </div>
  );
}
