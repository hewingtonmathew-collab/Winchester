"use client";

import { cn } from "@/lib/utils";

interface RiskDomain {
  label: string;
  value: number; // 0-100
  colour?: string;
}

interface RiskRadarProps {
  domains?: RiskDomain[];
  size?: number; // px, default 280
  title?: string;
  description?: string;
  metrics?: Array<{
    label: string;
    value: string;
    position: "tl" | "tr" | "bl" | "br";
  }>;
  className?: string;
}

const DEFAULT_DOMAINS: RiskDomain[] = [
  { label: "Safeguarding", value: 94, colour: "#a8e8ff" },
  { label: "Cyber", value: 72, colour: "#ffb4ab" },
  { label: "Privacy", value: 88, colour: "#bac3ff" },
  { label: "AI", value: 65, colour: "#a8e8ff" },
  { label: "Filtering", value: 91, colour: "#4ade80" },
  { label: "Governance", value: 80, colour: "#fbbf24" },
];

/** Convert polar to Cartesian, angle 0 = top, clockwise */
function polar(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function buildPolygon(
  cx: number,
  cy: number,
  maxR: number,
  domains: RiskDomain[]
): string {
  const n = domains.length;
  return domains
    .map((d, i) => {
      const r = (d.value / 100) * maxR;
      const { x, y } = polar(cx, cy, r, (360 / n) * i);
      return `${x},${y}`;
    })
    .join(" ");
}

const METRIC_POSITION_CLASSES: Record<string, string> = {
  tl: "top-2 left-2 text-left",
  tr: "top-2 right-2 text-right",
  bl: "bottom-2 left-2 text-left",
  br: "bottom-2 right-2 text-right",
};

export default function RiskRadar({
  domains = DEFAULT_DOMAINS,
  size = 280,
  title,
  description,
  metrics,
  className,
}: RiskRadarProps) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = (size / 2) * 0.72; // leave room for labels
  const n = domains.length;
  const rings = [0.25, 0.5, 0.75, 1];
  const polygonPoints = buildPolygon(cx, cy, maxR, domains);

  return (
    <div className={cn("glass-panel rounded-xl p-6", className)}>
      {/* Header */}
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-headline-md text-on-surface font-semibold">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-body-sm text-on-surface-variant mt-1">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Visually hidden accessible table */}
      <table className="sr-only">
        <caption>Risk domain scores</caption>
        <thead>
          <tr>
            <th scope="col">Domain</th>
            <th scope="col">Score (out of 100)</th>
          </tr>
        </thead>
        <tbody>
          {domains.map((d) => (
            <tr key={d.label}>
              <th scope="row">{d.label}</th>
              <td>{d.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Radar SVG + corner metrics */}
      <div className="relative inline-flex" style={{ width: size, height: size }}>
        {/* Corner metric labels */}
        {metrics?.map((m) => (
          <div
            key={m.position}
            className={cn(
              "absolute z-10",
              METRIC_POSITION_CLASSES[m.position]
            )}
          >
            <p className="text-metric-sm text-primary metric-number leading-none">
              {m.value}
            </p>
            <p className="text-label-caps text-on-surface-variant mt-0.5">
              {m.label}
            </p>
          </div>
        ))}

        {/* SVG radar — decorative, aria-hidden */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden="true"
          className="overflow-visible"
        >
          <defs>
            {/* Sweep gradient */}
            <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a8e8ff" stopOpacity="0.0" />
              <stop offset="60%" stopColor="#a8e8ff" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#a8e8ff" stopOpacity="0.0" />
            </radialGradient>
            {/* Polygon fill gradient */}
            <linearGradient
              id="radarFill"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#a8e8ff" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#3cd7ff" stopOpacity="0.08" />
            </linearGradient>
          </defs>

          {/* Concentric ring circles */}
          {rings.map((fraction) => (
            <circle
              key={fraction}
              cx={cx}
              cy={cy}
              r={maxR * fraction}
              fill="none"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth={0.5}
            />
          ))}

          {/* Axis lines */}
          {domains.map((_, i) => {
            const { x, y } = polar(cx, cy, maxR, (360 / n) * i);
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                stroke="rgba(255,255,255,0.07)"
                strokeWidth={0.5}
              />
            );
          })}

          {/* Filled polygon */}
          <polygon
            points={polygonPoints}
            fill="url(#radarFill)"
            stroke="#a8e8ff"
            strokeWidth={1}
            strokeLinejoin="round"
          />

          {/* Sweep line — rotating wedge */}
          <g
            style={{ transformOrigin: `${cx}px ${cy}px` }}
            className="animate-spin-slow motion-reduce:animate-none"
          >
            <path
              d={`M ${cx} ${cy} L ${cx} ${cy - maxR} A ${maxR} ${maxR} 0 0 1 ${
                polar(cx, cy, maxR, 30).x
              } ${polar(cx, cy, maxR, 30).y} Z`}
              fill="url(#radarSweep)"
            />
          </g>

          {/* Vertex dots */}
          {domains.map((d, i) => {
            const r = (d.value / 100) * maxR;
            const { x, y } = polar(cx, cy, r, (360 / n) * i);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={3}
                fill={d.colour ?? "#a8e8ff"}
                stroke="rgba(0,0,0,0.4)"
                strokeWidth={1}
              />
            );
          })}

          {/* Domain axis labels */}
          {domains.map((d, i) => {
            const angle = (360 / n) * i;
            // Push labels further out than maxR
            const labelR = maxR + 20;
            const { x, y } = polar(cx, cy, labelR, angle);
            const anchor =
              Math.abs(x - cx) < 4 ? "middle" : x < cx ? "end" : "start";
            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor={anchor}
                dominantBaseline="middle"
                fontSize={9}
                fontWeight={500}
                letterSpacing="0.06em"
                fill="rgba(187,201,207,0.8)"
                style={{ textTransform: "uppercase" }}
              >
                {d.label}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
