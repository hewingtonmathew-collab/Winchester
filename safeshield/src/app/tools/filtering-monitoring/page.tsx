import AuthGuard from "@/components/ui/AuthGuard";
import FilteringMonitoringChecker from "@/components/forms/FilteringMonitoringChecker";
import GlassCard from "@/components/ui/GlassCard";
import { ShieldAlert } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Filtering & Monitoring Assurance Review | SafeShield",
  description: "Assess whether your school's filtering and monitoring arrangements meet KCSIE 2024 requirements and provide effective safeguarding protection for all pupils.",
};

export default function FilteringMonitoringPage() {
  return (
    <AuthGuard toolSlug="filtering-monitoring">
    <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="pt-10 pb-10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)]">
              <ShieldAlert size={22} className="text-[#EF4444]" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[#EF4444] text-xs font-medium uppercase tracking-widest mb-1">Online Safety</p>
              <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>Filtering &amp; Monitoring Assurance Review</h1>
              <p className="text-sm max-w-xl leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Assess whether your school&apos;s filtering and monitoring arrangements meet KCSIE 2024 requirements and provide effective safeguarding protection for all pupils.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <FilteringMonitoringChecker />
            </div>
            <div className="flex flex-col gap-4">
              <GlassCard>
                <h2 className="font-semibold text-sm uppercase tracking-wider mb-3" style={{ color: "var(--text)" }}>Assessment Areas</h2>
                <ul className="flex flex-col gap-2">
                  {[
                    "Filtering Controls",
                    "Monitoring Systems",
                    "Incident Response",
                    "Staff Responsibilities",
                    "Review & Compliance",
                  ].map((area) => (
                    <li key={area} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-dim)" }}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#EF4444" }} />{area}
                    </li>
                  ))}
                </ul>
              </GlassCard>
              <GlassCard>
                <h2 className="font-semibold text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text)" }}>Key Standards</h2>
                <ul className="flex flex-col gap-1.5">
                  {["KCSIE 2024 Part 5", "DfE Filtering Standards 2023", "DfE Monitoring Standards 2023", "UK Safer Internet Centre Guidance", "UKCIS Online Safety Frameworks", "ICO Guidance on Monitoring"].map((l) => (
                    <li key={l} className="text-xs" style={{ color: "var(--text-faint)" }}>· {l}</li>
                  ))}
                </ul>
              </GlassCard>
              <GlassCard>
                <h2 className="font-semibold text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text)" }}>Rating Scale</h2>
                <div className="flex flex-col gap-1.5">
                  {[["Assured", "#22c55e"], ["Partially Assured", "#f59e0b"], ["Not Assured", "#ef4444"]].map(([l, c]) => (
                    <div key={l} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c }} />
                      <span className="text-xs" style={{ color: "var(--text-faint)" }}>{l}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
