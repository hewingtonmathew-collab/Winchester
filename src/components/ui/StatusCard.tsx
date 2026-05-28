import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatusCardProps {
  label: string;
  value: string | number;
  unit?: string;
  description?: string;
  trend?: { direction: "up" | "down" | "stable"; label: string };
  status?: "green" | "amber" | "red" | "neutral" | "cyan";
  variant?: "metric" | "gauge" | "badge";
  gaugePercent?: number;
  animated?: boolean;
  icon?: React.ReactNode;
}

/* ─── Colour maps ─── */
const statusBorderMap: Record<
  NonNullable<StatusCardProps["status"]>,
  string
> = {
  green: "shadow-[0_0_16px_rgba(74,222,128,0.18)] border-rag-green/30",
  amber: "shadow-[0_0_16px_rgba(251,191,36,0.18)] border-rag-amber/30",
  red: "shadow-[0_0_16px_rgba(255,180,171,0.18)] border-error/30",
  cyan: "shadow-[0_0_16px_rgba(0,212,255,0.18)] border-primary/30",
  neutral: "",
};

const statusTextMap: Record<
  NonNullable<StatusCardProps["status"]>,
  string
> = {
  green: "text-rag-green",
  amber: "text-rag-amber",
  red: "text-error",
  cyan: "text-primary",
  neutral: "text-on-surface-variant",
};

const statusBadgeMap: Record<
  NonNullable<StatusCardProps["status"]>,
  string
> = {
  green: "badge badge-green",
  amber: "badge badge-amber",
  red: "badge badge-red",
  cyan: "badge badge-cyan",
  neutral: "badge badge-neutral",
};

const gaugeColourMap: Record<
  NonNullable<StatusCardProps["status"]>,
  { stroke: string; glow: string }
> = {
  green: { stroke: "#4ade80", glow: "rgba(74,222,128,0.4)" },
  amber: { stroke: "#fbbf24", glow: "rgba(251,191,36,0.4)" },
  red: { stroke: "#ffb4ab", glow: "rgba(255,180,171,0.4)" },
  cyan: { stroke: "#00d4ff", glow: "rgba(0,212,255,0.4)" },
  neutral: { stroke: "#bbc9cf", glow: "rgba(187,201,207,0.2)" },
};

/* ─── Trend indicator ─── */
function TrendIndicator({
  trend,
}: {
  trend: NonNullable<StatusCardProps["trend"]>;
}) {
  const icons = {
    up: TrendingUp,
    down: TrendingDown,
    stable: Minus,
  } as const;
  const colours = {
    up: "text-rag-green",
    down: "text-error",
    stable: "text-on-surface-variant",
  } as const;
  const Icon = icons[trend.direction];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-metric-sm font-medium",
        colours[trend.direction]
      )}
    >
      <Icon size={12} aria-hidden="true" />
      {trend.label}
    </span>
  );
}

/* ─── Gauge SVG ─── */
function CircularGauge({
  percent,
  value,
  unit,
  status = "cyan",
  animated = false,
}: {
  percent: number;
  value: string | number;
  unit?: string;
  status?: NonNullable<StatusCardProps["status"]>;
  animated?: boolean;
}) {
  const clamped = Math.min(100, Math.max(0, percent));
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const { stroke, glow } = gaugeColourMap[status];

  return (
    <div className="relative flex items-center justify-center">
      {/* Screen-reader text */}
      <span className="sr-only">
        {value}
        {unit} — {clamped}%
      </span>

      <svg
        width="140"
        height="140"
        viewBox="0 0 140 140"
        aria-hidden="true"
        role="presentation"
        className="overflow-visible"
      >
        {/* Track */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="8"
        />
        {/* Outer rotating ring */}
        <circle
          cx="70"
          cy="70"
          r={radius + 10}
          fill="none"
          stroke={stroke}
          strokeWidth="1"
          strokeOpacity="0.25"
          strokeDasharray="4 8"
          className={cn(
            animated && "animate-spin-slow motion-reduce:animate-none"
          )}
          style={{ transformOrigin: "70px 70px" }}
        />
        {/* Inner reverse ring */}
        <circle
          cx="70"
          cy="70"
          r={radius - 12}
          fill="none"
          stroke={stroke}
          strokeWidth="0.5"
          strokeOpacity="0.15"
          strokeDasharray="2 12"
          className={cn(
            animated && "animate-spin-reverse motion-reduce:animate-none"
          )}
          style={{ transformOrigin: "70px 70px" }}
        />
        {/* Progress arc */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
          style={{
            filter: `drop-shadow(0 0 6px ${glow})`,
          }}
        />
      </svg>

      {/* Center value */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn("metric-number text-metric-md font-bold", statusTextMap[status])}
        >
          {value}
          {unit && (
            <span className="text-metric-sm text-on-surface-variant font-medium ml-0.5">
              {unit}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

/* ─── Main component ─── */
export default function StatusCard({
  label,
  value,
  unit,
  description,
  trend,
  status = "neutral",
  variant = "metric",
  gaugePercent = 0,
  animated = false,
  icon,
}: StatusCardProps) {
  const borderGlow = statusBorderMap[status];

  /* ─── Metric variant ─── */
  if (variant === "metric") {
    return (
      <div
        className={cn(
          "glass-panel rounded-lg p-6 flex flex-col gap-3",
          borderGlow
        )}
      >
        {/* Label row */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-label-caps text-on-surface-variant uppercase tracking-widest">
            {label}
          </p>
          {icon && (
            <span
              className={cn("shrink-0", statusTextMap[status])}
              aria-hidden="true"
            >
              {icon}
            </span>
          )}
        </div>

        {/* Value */}
        <div className="flex items-end gap-1.5">
          <span
            className={cn(
              "metric-number text-metric-lg font-bold",
              statusTextMap[status]
            )}
          >
            {value}
          </span>
          {unit && (
            <span className="text-metric-sm text-on-surface-variant mb-1">
              {unit}
            </span>
          )}
        </div>

        {/* Trend */}
        {trend && <TrendIndicator trend={trend} />}

        {/* Description */}
        {description && (
          <p className="text-body-sm text-on-surface-variant leading-relaxed">
            {description}
          </p>
        )}
      </div>
    );
  }

  /* ─── Gauge variant ─── */
  if (variant === "gauge") {
    return (
      <div
        className={cn(
          "glass-panel rounded-lg p-6 flex flex-col items-center gap-4",
          borderGlow
        )}
      >
        <p className="text-label-caps text-on-surface-variant uppercase tracking-widest self-start">
          {label}
        </p>
        <CircularGauge
          percent={gaugePercent}
          value={value}
          unit={unit}
          status={status}
          animated={animated}
        />
        {trend && <TrendIndicator trend={trend} />}
        {description && (
          <p className="text-body-sm text-on-surface-variant text-center leading-relaxed">
            {description}
          </p>
        )}
      </div>
    );
  }

  /* ─── Badge variant ─── */
  return (
    <div
      className={cn(
        "glass-panel rounded-lg p-5 flex items-center gap-4",
        borderGlow
      )}
    >
      {icon && (
        <span
          className={cn(
            "flex items-center justify-center h-10 w-10 rounded-md shrink-0",
            "bg-surface-high border border-outline-variant",
            statusTextMap[status]
          )}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn("badge", statusBadgeMap[status])}
            aria-label={`Status: ${value}`}
          >
            {value}
            {unit && ` ${unit}`}
          </span>
        </div>
        <p className="text-body-sm font-medium text-on-surface truncate">{label}</p>
        {description && (
          <p className="text-body-sm text-on-surface-variant leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {trend && (
        <div className="ml-auto shrink-0">
          <TrendIndicator trend={trend} />
        </div>
      )}
    </div>
  );
}
