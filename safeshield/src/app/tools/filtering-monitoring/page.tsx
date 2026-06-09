import AuthGuard from "@/components/ui/AuthGuard";
import FilteringMonitoringChecker from "@/components/forms/FilteringMonitoringChecker";
import GlassCard from "@/components/ui/GlassCard";
import { ShieldAlert } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Filtering & Monitoring Assurance | SafeShield",
  description: "Evidence that your school's filtering and monitoring arrangements meet KCSIE requirements and DfE Filtering and Monitoring Standards. Generate a formal assurance report for governors.",
};

const COLOR = "#EF4444";

const AREAS = [
  "Filtering Controls",
  "Monitoring Controls",
  "Alert Management",
  "DSL Oversight",
  "AI Tool Monitoring",
  "BYOD Risks",
  "Annual Review",
  "Vulnerable Pupils",
  "SEND Considerations",
  "Governor Assurance",
];

export default function FilteringMonitoringPage() {
  return (
    <AuthGuard toolSlug="filtering-monitoring">
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="pt-10 pb-10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <ShieldAlert size={22} style={{ color: COLOR }} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: COLOR }}>Online Safety</p>
              <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>Filtering &amp; Monitoring Assurance</h1>
              <p className="text-sm max-w-xl leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Evidence that your school&apos;s filtering and monitoring arrangements meet KCSIE requirements and DfE Filtering and Monitoring Standards. Generate a formal assurance report for governors.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <FilteringMonitoringChecker />
            </div>
            <div className="flex flex-col gap-4">
              <GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: COLOR }}>Areas Covered</h2>
                <ul className="flex flex-col gap-2">
                  {AREAS.map((a) => (
                    <li key={a} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: COLOR }} />
                      {a}
                    </li>
                  ))}
                </ul>
              </GlassCard>
              <GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: COLOR }}>Framework Alignment</h2>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  Aligned to KCSIE 2024, DfE Filtering and Monitoring Standards for Schools and Colleges, and the UK Council for Internet Safety (UKCIS) framework.
                </p>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
