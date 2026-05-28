import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
}: ServiceCardProps) {
  const colours = colourMap[colour];

  return (
    <Link
      href={href}
      className="group relative flex flex-col glass-panel glass-panel-hover hud-corners rounded-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
    >
      <div className={cn("flex flex-col h-full", compact ? "p-5" : "p-6 lg:p-7")}>
        {/* Header row: icon + badge */}
        <div className="flex items-start justify-between gap-4 mb-4">
          {icon && (
            <div
              className={cn(
                "flex items-center justify-center rounded-md border shrink-0",
                colours.icon,
                colours.iconBorder,
                colours.text,
                compact ? "h-10 w-10" : "h-12 w-12"
              )}
              aria-hidden="true"
            >
              {icon}
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
            compact && "text-body-lg font-semibold"
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
