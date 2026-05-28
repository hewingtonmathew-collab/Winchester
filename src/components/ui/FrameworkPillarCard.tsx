import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FrameworkPillarCardProps {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  metrics: string[];
  colour?: "cyan" | "secondary" | "error" | "amber" | "green" | "tertiary";
  index?: number;
  href?: string;
  expanded?: boolean;
}

const colourMap = {
  cyan: {
    iconBg: "bg-primary/10 border-primary/30",
    iconText: "text-primary",
    glow: "shadow-glow-cyan",
    edge: "from-transparent via-primary-container/50 to-transparent",
    badge: "badge-cyan",
    accent: "text-primary",
    indexText: "text-primary/5",
  },
  secondary: {
    iconBg: "bg-secondary/10 border-secondary/30",
    iconText: "text-secondary",
    glow: "",
    edge: "from-transparent via-secondary/40 to-transparent",
    badge: "badge-neutral",
    accent: "text-secondary",
    indexText: "text-secondary/5",
  },
  error: {
    iconBg: "bg-error/10 border-error/30",
    iconText: "text-error",
    glow: "shadow-glow-error",
    edge: "from-transparent via-error/40 to-transparent",
    badge: "badge-red",
    accent: "text-error",
    indexText: "text-error/5",
  },
  amber: {
    iconBg: "bg-rag-amber/10 border-rag-amber/30",
    iconText: "text-rag-amber",
    glow: "",
    edge: "from-transparent via-rag-amber/40 to-transparent",
    badge: "badge-amber",
    accent: "text-rag-amber",
    indexText: "text-rag-amber/5",
  },
  green: {
    iconBg: "bg-rag-green/10 border-rag-green/30",
    iconText: "text-rag-green",
    glow: "",
    edge: "from-transparent via-rag-green/40 to-transparent",
    badge: "badge-green",
    accent: "text-rag-green",
    indexText: "text-rag-green/5",
  },
  tertiary: {
    iconBg: "bg-tertiary/10 border-tertiary/30",
    iconText: "text-tertiary",
    glow: "",
    edge: "from-transparent via-tertiary/30 to-transparent",
    badge: "badge-neutral",
    accent: "text-tertiary",
    indexText: "text-tertiary/5",
  },
};

export default function FrameworkPillarCard({
  title,
  description,
  icon,
  metrics,
  colour = "cyan",
  index,
  href,
  expanded = false,
}: FrameworkPillarCardProps) {
  const c = colourMap[colour];
  const indexStr = index !== undefined ? String(index).padStart(2, "0") : null;

  const inner = (
    <div className="glass-panel glass-panel-hover rounded-xl p-6 relative overflow-hidden group h-full flex flex-col">
      {/* Background index number */}
      {indexStr && (
        <span
          className={cn(
            "absolute top-2 right-4 text-[6rem] font-black leading-none pointer-events-none select-none",
            c.indexText
          )}
          aria-hidden="true"
        >
          {indexStr}
        </span>
      )}

      {/* Top edge glow */}
      <div
        className={cn(
          "absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r opacity-60 group-hover:opacity-100 transition-opacity",
          c.edge
        )}
        aria-hidden="true"
      />

      {/* Icon */}
      {icon && (
        <div
          className={cn(
            "w-12 h-12 rounded-lg border flex items-center justify-center mb-5 flex-shrink-0",
            c.iconBg,
            c.iconText,
            c.glow
          )}
        >
          {icon}
        </div>
      )}

      {/* Title */}
      <h3 className="text-headline-md font-semibold text-on-surface mb-3">{title}</h3>

      {/* Description */}
      <p className={cn("text-body-sm text-on-surface-variant leading-relaxed flex-1", expanded ? "mb-5" : "mb-4")}>
        {description}
      </p>

      {/* Metric chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {metrics.map((m) => (
          <span key={m} className={cn("badge", c.badge)}>
            {m}
          </span>
        ))}
      </div>

      {/* Explore link */}
      {href && (
        <div className="mt-auto pt-4 border-t border-outline-variant/20 flex items-center justify-between">
          <span className={cn("text-body-sm font-semibold", c.accent)}>Explore</span>
          <ArrowRight
            size={16}
            className={cn(
              "text-on-surface-variant group-hover:translate-x-1 transition-transform",
              "group-hover:" + c.accent
            )}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {inner}
      </Link>
    );
  }

  return inner;
}
