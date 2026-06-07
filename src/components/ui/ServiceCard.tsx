import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const colourGlow: Record<NonNullable<ServiceCardProps["colour"]>, string> = {
  cyan: "rgba(0,212,255,",
  secondary: "rgba(186,195,255,",
  error: "rgba(255,100,80,",
  amber: "rgba(251,191,36,",
  green: "rgba(74,222,128,",
  tertiary: "rgba(150,120,255,",
};

interface ServiceCardProps {
  title: string;
  tagline: string;
  description?: string;
  icon?: React.ReactNode;
  href: string;
  colour?: "cyan" | "secondary" | "error" | "amber" | "green" | "tertiary";
  pillars?: string[];
  badge?: string;
  compact?: boolean;
  featured?: boolean;
}

const colourMap: Record<
  NonNullable<ServiceCardProps["colour"]>,
  {
    icon: string;
    iconBorder: string;
    text: string;
    hudCorner: string;
    badge: string;
  }
> = {
  cyan: {
    icon: "bg-primary/10",
    iconBorder: "border-primary/30",
    text: "text-primary",
    hudCorner: "border-primary/50",
    badge: "badge-cyan",
  },
  secondary: {
    icon: "bg-secondary/10",
    iconBorder: "border-secondary/30",
    text: "text-secondary",
    hudCorner: "border-secondary/50",
    badge: "badge-neutral",
  },
  error: {
    icon: "bg-error/10",
    iconBorder: "border-error/30",
    text: "text-error",
    hudCorner: "border-error/50",
    badge: "badge-red",
  },
  amber: {
    icon: "bg-rag-amber/10",
    iconBorder: "border-rag-amber/30",
    text: "text-rag-amber",
    hudCorner: "border-rag-amber/50",
    badge: "badge-amber",
  },
  green: {
    icon: "bg-rag-green/10",
    iconBorder: "border-rag-green/30",
    text: "text-rag-green",
    hudCorner: "border-rag-green/50",
    badge: "badge-green",
  },
  tertiary: {
    icon: "bg-tertiary/10",
    iconBorder: "border-tertiary/30",
    text: "text-tertiary",
    hudCorner: "border-tertiary/50",
    badge: "badge-neutral",
  },
};

export default function ServiceCard({
  title,
  tagline,
  description,
  icon,
  href,
  colour = "cyan",
  pillars,
  badge,
  compact = false,
  featured = false,
}: ServiceCardProps) {
  const colours = colourMap[colour];
  const glowRgb = colourGlow[colour];

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col glass-panel glass-panel-hover rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 overflow-hidden",
        featured && "ring-1 ring-white/[0.10]"
      )}
    >
      {/* Colour accent line — always visible at low opacity, brightens on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent 5%, ${glowRgb}0.35) 30%, ${glowRgb}0.5) 50%, ${glowRgb}0.35) 70%, transparent 95%)` }}
        aria-hidden="true"
      />
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg, transparent 5%, ${glowRgb}0.8) 30%, ${glowRgb}1) 50%, ${glowRgb}0.8) 70%, transparent 95%)`,
          boxShadow: `0 0 16px ${glowRgb}0.5), 0 0 32px ${glowRgb}0.2)`,
        }}
        aria-hidden="true"
      />

      {/* Ambient card glow — appears on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${glowRgb}0.08) 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Featured background pattern */}
      {featured && (
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: `radial-gradient(circle, ${glowRgb}0.15) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
          aria-hidden="true"
        />
      )}

      <div className={cn("flex flex-col h-full", compact ? "p-5" : featured ? "p-8 lg:p-10" : "p-6 lg:p-7")}>
        {/* Header row: icon + badge */}
        <div className="flex items-start justify-between gap-4 mb-5">
          {icon && (
            <div
              className={cn(
                "flex items-center justify-center rounded-xl shrink-0 relative",
                colours.text,
                compact ? "h-10 w-10" : featured ? "h-14 w-14" : "h-13 w-13"
              )}
              style={{
                background: `${glowRgb}0.07)`,
                border: `1px solid ${glowRgb}0.28)`,
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), 0 0 16px ${glowRgb}0.15)`,
                backdropFilter: "blur(8px)",
                width: compact ? "40px" : featured ? "56px" : "48px",
                height: compact ? "40px" : featured ? "56px" : "48px",
              }}
              aria-hidden="true"
            >
              {/* Inner glow dot */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `radial-gradient(circle at 50% 0%, ${glowRgb}0.18) 0%, transparent 70%)` }}
              />
              <span className="relative z-10">{icon}</span>
            </div>
          )}
          {badge && (
            <span className={cn("badge ml-auto shrink-0", colours.badge)}>
              {badge}
            </span>
          )}
        </div>

        {/* Title + tagline */}
        <h3
          className={cn(
            "text-headline-md font-semibold text-on-surface mb-1 group-hover:text-primary transition-colors duration-300",
            compact && "text-body-lg font-semibold",
            featured && "text-headline-lg"
          )}
        >
          {title}
        </h3>
        <p className="text-body-sm text-on-surface-variant mb-3">{tagline}</p>

        {/* Description */}
        {description && !compact && (
          <p className="text-body-sm text-on-surface-variant/80 mb-4 leading-relaxed">
            {description}
          </p>
        )}

        {/* Pillars */}
        {pillars && pillars.length > 0 && !compact && (
          <ul className="flex flex-col gap-1.5 mb-4" aria-label="Key pillars">
            {pillars.map((pillar) => (
              <li
                key={pillar}
                className="flex items-center gap-2 text-body-sm text-on-surface-variant"
              >
                <span
                  className={cn("h-1.5 w-1.5 rounded-full shrink-0", colours.text)}
                  aria-hidden="true"
                />
                {pillar}
              </li>
            ))}
          </ul>
        )}

        {/* Spacer + arrow */}
        <div className="mt-auto pt-4 flex justify-end">
          <ArrowRight
            size={18}
            className="text-on-surface-variant group-hover:text-primary transition-colors duration-300 group-hover:translate-x-0.5 motion-reduce:translate-x-0 transition-transform"
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  );
}
