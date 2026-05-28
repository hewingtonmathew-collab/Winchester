import Link from "next/link";
import { cn } from "@/lib/utils";

type TimelineStatus = "complete" | "pending" | "flagged" | "approved";

interface TimelineEntry {
  date: string;
  title: string;
  description: string;
  area: string;
  actor?: string;
  status: TimelineStatus;
  isLatest?: boolean;
}

interface AuditTimelineProps {
  entries?: TimelineEntry[];
  maxEntries?: number;
  title?: string;
  showViewAll?: boolean;
  viewAllHref?: string;
}

const defaultEntries: TimelineEntry[] = [
  { date: "Today, 10:42", title: "CCTV Policy ratified", description: "Annual review completed — West Academy", area: "GDPR", actor: "DPO Jenkins", status: "approved", isLatest: true },
  { date: "Today, 09:15", title: "KCSIE alignment check", description: "Annual safeguarding policy cross-referenced against KCSIE 2024. 98% alignment confirmed.", area: "Safeguarding", actor: "System scan", status: "complete" },
  { date: "Today, 08:00", title: "DPIA flagged — biometric attendance", description: "New biometric system requires DPIA before deployment. Requires Trust Board sign-off.", area: "GDPR", actor: "ICT Manager", status: "flagged" },
  { date: "Yesterday", title: "Annual data audit commenced", description: "System-wide data mapping audit initiated across all school sites.", area: "GDPR", actor: "System", status: "pending" },
  { date: "Yesterday", title: "Cyber posture review", description: "East Campus network controls reviewed. 2 NCSC controls updated.", area: "Cyber", actor: "System", status: "complete" },
  { date: "3 days ago", title: "Governor training logged", description: "Board safeguarding training — Autumn term. 12 attendees confirmed.", area: "Governance", actor: "Clerk", status: "approved" },
  { date: "1 week ago", title: "Filter configuration reviewed", description: "DfE filtering standards met. No gaps identified.", area: "Filtering", actor: "ICT Manager", status: "complete" },
];

const statusDot: Record<TimelineStatus, string> = {
  complete: "bg-primary",
  approved: "bg-rag-green",
  pending: "bg-rag-amber",
  flagged: "bg-error animate-pulse motion-reduce:animate-none",
};

const statusBadge: Record<TimelineStatus, string> = {
  complete: "badge badge-cyan",
  approved: "badge badge-green",
  pending: "badge badge-amber",
  flagged: "badge badge-red",
};

const statusLabel: Record<TimelineStatus, string> = {
  complete: "Complete",
  approved: "Approved",
  pending: "In progress",
  flagged: "Requires action",
};

export default function AuditTimeline({
  entries = defaultEntries,
  maxEntries = 6,
  title,
  showViewAll = false,
  viewAllHref = "/platform/evidence-audit",
}: AuditTimelineProps) {
  const visible = entries.slice(0, maxEntries);

  return (
    <div className="glass-panel rounded-xl overflow-hidden">
      {(title || showViewAll) && (
        <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between">
          {title && (
            <h3 className="text-body-sm font-semibold text-on-surface">{title}</h3>
          )}
          {showViewAll && (
            <Link
              href={viewAllHref}
              className="text-label-caps text-primary hover:text-primary-tint transition-colors text-[11px] font-semibold uppercase tracking-widest"
            >
              View full ledger
            </Link>
          )}
        </div>
      )}

      <ol className="relative">
        {/* Vertical line */}
        <div
          className="absolute left-[2.25rem] top-0 bottom-0 w-px bg-outline-variant/30"
          aria-hidden="true"
        />

        {visible.map((entry, i) => (
          <li
            key={i}
            className={cn(
              "relative flex gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors",
              i < visible.length - 1 && "border-b border-outline-variant/20"
            )}
          >
            {/* Timeline dot */}
            <div className="flex-shrink-0 flex flex-col items-center pt-1">
              <div
                className={cn("w-3 h-3 rounded-full border-2 border-background", statusDot[entry.status])}
                aria-hidden="true"
              />
            </div>

            {/* Content */}
            <div
              className={cn(
                "flex-1 min-w-0 glass-panel rounded-lg p-3",
                entry.isLatest && "border-primary/30"
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-body-sm font-semibold text-on-surface">{entry.title}</p>
                <span className={cn(statusBadge[entry.status], "flex-shrink-0 text-[9px]")}>
                  {statusLabel[entry.status]}
                </span>
              </div>
              <p className="text-[12px] text-on-surface-variant mb-2 leading-relaxed">
                {entry.description}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-on-surface-variant">
                <span className="badge badge-neutral py-0">{entry.area}</span>
                {entry.actor && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{entry.actor}</span>
                  </>
                )}
                <span aria-hidden="true">·</span>
                <span className="font-mono">{entry.date}</span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
