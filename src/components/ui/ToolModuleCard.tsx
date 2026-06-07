import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolModuleCardProps {
  title: string;
  tagline: string;
  description: string;
  icon?: React.ReactNode;
  href: string;
  status?: "active" | "beta" | "coming-soon";
  colour?: "cyan" | "secondary" | "error" | "amber" | "green";
  metrics?: Array<{ label: string; value: string }>;
  featured?: boolean;
}

const colourMap: Record<
  NonNullable<ToolModuleCardProps["colour"]>,
  {
    iconBg: string;
    iconBorder: string;
    iconText: string;
    topGlow: string;
    hudBorder: string;
    hoverGlow: string;
    glowShadow: string;
  }
> = {
  cyan: {
    iconBg: "bg-primary/10",
    iconBorder: "border-primary/30",
    iconText: "text-primary",
    topGlow: "from-primary/50 via-primary/30 to-transparent",
    hudBorder: "border-primary/50",
    hoverGlow: "group-hover:border-primary/40",
    glowShadow: "group-hover:shadow-glow-cyan",
  },
  secondary: {
    iconBg: "bg-secondary/10",
    iconBorder: "border-secondary/30",
    iconText: "text-secondary",
    topGlow: "from-secondary/50 via-secondary/30 to-transparent",
    hudBorder: "border-secondary/50",
    hoverGlow: "group-hover:border-secondary/40",
    glowShadow: "group-hover:shadow-[0_0_20px_rgba(186,195,255,0.25)]",
  },
  error: {
    iconBg: "bg-error/10",
    iconBorder: "border-error/30",
    iconText: "text-error",
    topGlow: "from-error/50 via-error/30 to-transparent",
    hudBorder: "border-error/50",
    hoverGlow: "group-hover:border-error/40",
    glowShadow: "group-hover:shadow-glow-error",
  },
  amber: {
    iconBg: "bg-rag-amber/10",
    iconBorder: "border-rag-amber/30",
    iconText: "text-rag-amber",
    topGlow: "from-rag-amber/50 via-rag-amber/30 to-transparent",
    hudBorder: "border-rag-amber/50",
    hoverGlow: "group-hover:border-rag-amber/40",
    glowShadow: "group-hover:shadow-[0_0_20px_rgba(251,191,36,0.25)]",
  },
  green: {
    iconBg: "bg-rag-green/10",
    iconBorder: "border-rag-green/30",
    iconText: "text-rag-green",
    topGlow: "from-rag-green/50 via-rag-green/30 to-transparent",
    hudBorder: "border-rag-green/50",
    hoverGlow: "group-hover:border-rag-green/40",
    glowShadow: "group-hover:shadow-[0_0_20px_rgba(74,222,128,0.25)]",
  },
};

const statusConfig = {
  active: { label: "Active", cls: "badge-cyan" },
  beta: { label: "Beta", cls: "badge-amber" },
  "coming-soon": { label: "Coming Soon", cls: "badge-neutral" },
} as const;

function MetricGrid({
  metrics,
  colourText,
}: {
  metrics: Array<{ label: string; value: string }>;
  colourText: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-3",
        metrics.length === 2 ? "grid-cols-2" : "grid-cols-3"
      )}
      aria-label="Module metrics"
    >
      {metrics.map((m) => (
        <div
          key={m.label}
          className="glass-panel rounded-xl px-3 py-2.5 flex flex-col gap-1"
        >
          <span className="text-label-caps text-on-surface-variant">
            {m.label}
          </span>
          <span
            className={cn("text-metric-md font-bold metric-number", colourText)}
          >
            {m.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function CardInner({
  title,
  tagline,
  description,
  icon,
  status = "active",
  colour = "cyan",
  metrics,
  featured = false,
}: Omit<ToolModuleCardProps, "href">) {
  const c = colourMap[colour];
  const sc = statusConfig[status];
  const isComingSoon = status === "coming-soon";

  return (
    <div className={cn("flex h-full", featured ? "flex-row gap-8" : "flex-col")}>
      {/* Top-edge glow line */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r",
          c.topGlow,
          "opacity-60 group-hover:opacity-100 transition-opacity duration-300"
        )}
      />

      {/* Main content column */}
      <div className={cn("flex flex-col", featured ? "flex-1 min-w-0" : "h-full")}>
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-4">
          {icon && (
            <div
              aria-hidden="true"
              className={cn(
                "flex items-center justify-center rounded-md border shrink-0",
                "h-12 w-12",
                c.iconBg,
                c.iconBorder,
                c.iconText
              )}
            >
              {icon}
            </div>
          )}
          <span className={cn("badge ml-auto shrink-0", sc.cls)}>
            {sc.label}
          </span>
        </div>

        {/* Title + tagline */}
        <h3
          className={cn(
            "text-headline-md font-semibold text-on-surface mb-1",
            !isComingSoon &&
              "group-hover:text-primary transition-colors duration-300"
          )}
        >
          {title}
        </h3>
        <p className="text-body-sm text-on-surface-variant mb-3">{tagline}</p>

        {/* Description */}
        <p className="text-body-sm text-on-surface-variant/80 leading-relaxed mb-4">
          {description}
        </p>

        {/* Metrics — standard layout shows below description */}
        {!featured && metrics && metrics.length > 0 && (
          <div className="mt-auto mb-4">
            <MetricGrid metrics={metrics} colourText={c.iconText} />
          </div>
        )}

        {/* CTA */}
        <div
          className={cn(
            "mt-auto pt-4 border-t border-outline-variant/20 flex items-center",
            isComingSoon ? "justify-start" : "justify-between"
          )}
        >
          {isComingSoon ? (
            <span className="flex items-center gap-2 text-body-sm text-on-surface-variant">
              <Lock size={14} aria-hidden="true" />
              Coming Soon
            </span>
          ) : (
            <>
              <span
                className={cn(
                  "text-body-sm font-medium transition-colors duration-300",
                  c.iconText
                )}
              >
                Launch Module
              </span>
              <ArrowRight
                size={16}
                className={cn(
                  "transition-all duration-300",
                  c.iconText,
                  "group-hover:translate-x-0.5 motion-reduce:translate-x-0"
                )}
                aria-hidden="true"
              />
            </>
          )}
        </div>
      </div>

      {/* Featured right panel — metric mini-dashboard */}
      {featured && metrics && metrics.length > 0 && (
        <div
          className={cn(
            "shrink-0 flex flex-col justify-center",
            "w-56 pl-8 border-l border-outline-variant/30"
          )}
          aria-label="Module metrics dashboard"
        >
          <p className="text-label-caps text-on-surface-variant mb-3">
            Key Metrics
          </p>
          <div className="flex flex-col gap-2.5">
            {metrics.map((m) => (
              <div key={m.label} className="flex flex-col gap-0.5">
                <span className="text-xs text-on-surface-variant">{m.label}</span>
                <span
                  className={cn(
                    "text-metric-md font-bold metric-number",
                    c.iconText
                  )}
                >
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ToolModuleCard({
  title,
  tagline,
  description,
  icon,
  href,
  status = "active",
  colour = "cyan",
  metrics,
  featured = false,
}: ToolModuleCardProps) {
  const c = colourMap[colour];
  const isComingSoon = status === "coming-soon";

  const cardClasses = cn(
    "group relative glass-panel rounded-2xl overflow-hidden",
    "transition-all duration-300",
    featured ? "p-7" : "p-6",
    featured && "col-span-2",
    c.hoverGlow,
    c.glowShadow,
    !isComingSoon && "glass-panel-hover",
    isComingSoon && "opacity-75 cursor-default"
  );

  const inner = (
    <CardInner
      title={title}
      tagline={tagline}
      description={description}
      icon={icon}
      status={status}
      colour={colour}
      metrics={metrics}
      featured={featured}
    />
  );

  if (isComingSoon) {
    return (
      <div className={cardClasses} aria-label={`${title} — coming soon`}>
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        cardClasses,
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      )}
      aria-label={`Launch ${title} module`}
    >
      {inner}
    </Link>
  );
}
