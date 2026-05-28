"use client";

import { cn } from "@/lib/utils";

type EvidenceArea = "safeguarding" | "cyber" | "gdpr" | "ai" | "filtering" | "governance";
type EvidenceStatus = "complete" | "flagged" | "pending" | "approved";

interface EvidenceEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  area: EvidenceArea;
  status: EvidenceStatus;
  detail?: string;
}

interface EvidenceStreamProps {
  entries?: EvidenceEntry[];
  maxVisible?: number;
  animated?: boolean;
  title?: string;
  className?: string;
}

const defaultEntries: EvidenceEntry[] = [
  { id: "e1", timestamp: "10:42", action: "CCTV Policy ratified", actor: "DPO Jenkins", area: "gdpr", status: "approved", detail: "West Academy — annual review completed" },
  { id: "e2", timestamp: "09:15", action: "KCSIE alignment check", actor: "System scan", area: "safeguarding", status: "complete", detail: "98% alignment confirmed" },
  { id: "e3", timestamp: "08:00", action: "DPIA flagged — biometric system", actor: "ICT Manager", area: "gdpr", status: "flagged", detail: "Requires Trust Board sign-off" },
  { id: "e4", timestamp: "Yesterday", action: "Cyber posture review", actor: "System", area: "cyber", status: "complete", detail: "East Campus — 2 controls updated" },
  { id: "e5", timestamp: "Yesterday", action: "SAR processed — 3 of 5 complete", actor: "DPO Jenkins", area: "gdpr", status: "pending", detail: "Deadline: 14 days remaining" },
  { id: "e6", timestamp: "2 days ago", action: "Filter configuration reviewed", actor: "ICT Manager", area: "filtering", status: "complete", detail: "DfE standards met" },
  { id: "e7", timestamp: "3 days ago", action: "Governor training logged", actor: "Clerk to Governors", area: "governance", status: "approved", detail: "Board Autumn term — 12 attendees" },
];

const areaColour: Record<EvidenceArea, string> = {
  safeguarding: "bg-primary/70",
  cyber: "bg-error/70",
  gdpr: "bg-secondary/70",
  ai: "bg-primary-tint/70",
  filtering: "bg-rag-amber/70",
  governance: "bg-rag-green/70",
};

const areaLabel: Record<EvidenceArea, string> = {
  safeguarding: "Safeguarding",
  cyber: "Cyber",
  gdpr: "GDPR",
  ai: "AI Governance",
  filtering: "Filtering",
  governance: "Governance",
};

const statusBadge: Record<EvidenceStatus, string> = {
  complete: "badge badge-cyan",
  approved: "badge badge-green",
  pending: "badge badge-amber",
  flagged: "badge badge-red",
};

const statusLabel: Record<EvidenceStatus, string> = {
  complete: "Complete",
  approved: "Approved",
  pending: "Pending",
  flagged: "Flagged",
};

export default function EvidenceStream({
  entries = defaultEntries,
  maxVisible = 6,
  animated = false,
  title,
  className,
}: EvidenceStreamProps) {
  const visible = entries.slice(0, maxVisible);

  return (
    <div className={cn("glass-panel rounded-xl overflow-hidden", className)}>
      {title && (
        <div className="px-5 py-4 border-b border-outline-variant/30 flex items-center justify-between">
          <span className="text-body-sm font-semibold text-on-surface">{title}</span>
          <span className="badge badge-cyan">Live</span>
        </div>
      )}

      <ul role="list" className="divide-y divide-outline-variant/20">
        {visible.map((entry, i) => (
          <li
            key={entry.id}
            className={cn(
              "px-5 py-3.5 flex items-start gap-3 hover:bg-white/[0.02] transition-colors",
              i === 0 && animated && "bg-primary/[0.03]"
            )}
          >
            {/* Area colour dot */}
            <div className="flex-shrink-0 mt-1.5 flex flex-col items-center gap-1">
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  areaColour[entry.area],
                  entry.status === "flagged" && "animate-pulse motion-reduce:animate-none"
                )}
                aria-hidden="true"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-0.5">
                <p className="text-body-sm font-medium text-on-surface truncate">
                  {entry.action}
                </p>
                <span className={cn(statusBadge[entry.status], "flex-shrink-0")}>
                  {statusLabel[entry.status]}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-on-surface-variant">
                <span>{entry.actor}</span>
                <span aria-hidden="true">·</span>
                <span className="badge badge-neutral py-0">{areaLabel[entry.area]}</span>
              </div>
              {entry.detail && (
                <p className="text-[11px] text-on-surface-variant mt-0.5 italic">
                  {entry.detail}
                </p>
              )}
            </div>

            {/* Timestamp */}
            <span className="flex-shrink-0 text-[10px] font-mono text-on-surface-variant mt-0.5">
              {entry.timestamp}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
