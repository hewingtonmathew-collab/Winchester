import { cn } from "@/lib/utils";

interface RAGItem {
  area: string;
  status: "green" | "amber" | "red";
  detail: string;
  action?: string;
}

interface RAGPanelProps {
  title?: string;
  eyebrow?: string;
  items: RAGItem[];
  showLegend?: boolean;
  compact?: boolean;
}

const STATUS_CONFIG = {
  green: {
    dot: "bg-rag-green",
    badge: "badge badge-green",
    label: "Assured",
  },
  amber: {
    dot: "bg-rag-amber",
    badge: "badge badge-amber",
    label: "Under review",
  },
  red: {
    dot: "bg-rag-red",
    badge: "badge badge-red",
    label: "Attention required",
  },
} as const;

export default function RAGPanel({
  title,
  eyebrow,
  items,
  showLegend = false,
  compact = false,
}: RAGPanelProps) {
  const hasError = items.some((item) => item.status === "red");

  return (
    <div
      className={cn(
        "glass-panel rounded-xl",
        hasError && "glass-panel-error",
        compact ? "p-4" : "p-6"
      )}
    >
      {/* Header */}
      {(eyebrow || title) && (
        <div className={cn("mb-4", compact && "mb-3")}>
          {eyebrow && (
            <p className="eyebrow mb-1">{eyebrow}</p>
          )}
          {title && (
            <h3 className="text-headline-md text-on-surface font-semibold">
              {title}
            </h3>
          )}
        </div>
      )}

      {/* Legend */}
      {showLegend && (
        <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b border-outline-variant/30">
          {(["green", "amber", "red"] as const).map((status) => (
            <div key={status} className="flex items-center gap-1.5">
              <span
                className={cn(
                  "inline-block w-2 h-2 rounded-full flex-shrink-0",
                  STATUS_CONFIG[status].dot
                )}
                aria-hidden="true"
              />
              <span className="text-xs text-on-surface-variant">
                {STATUS_CONFIG[status].label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Item list */}
      <ul className="divide-y divide-outline-variant/30" role="list">
        {items.map((item, index) => (
          <li
            key={`${item.area}-${index}`}
            className={cn(
              "flex items-start justify-between gap-3",
              compact ? "py-2.5" : "py-3.5",
              index === 0 && !showLegend && "pt-0",
              index === items.length - 1 && "pb-0"
            )}
          >
            {/* Left: dot + text */}
            <div className="flex items-start gap-3 min-w-0">
              {/* Status dot */}
              <span
                className={cn(
                  "inline-block w-2 h-2 rounded-full flex-shrink-0 mt-1",
                  STATUS_CONFIG[item.status].dot,
                  item.status === "red" && "animate-pulse motion-reduce:animate-none"
                )}
                aria-hidden="true"
              />

              {/* Text block */}
              <div className="min-w-0">
                <p className="text-body-sm text-on-surface font-medium leading-snug">
                  {item.area}
                </p>
                <p className="text-body-sm text-on-surface-variant mt-0.5 leading-snug">
                  {item.detail}
                </p>
                {item.action && (
                  <p className="text-xs text-primary mt-1 leading-snug">
                    {item.action}
                  </p>
                )}
              </div>
            </div>

            {/* Right: status badge */}
            <div className="flex-shrink-0 pt-0.5">
              <span className={STATUS_CONFIG[item.status].badge}>
                {STATUS_CONFIG[item.status].label}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
