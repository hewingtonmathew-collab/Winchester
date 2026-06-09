import AuthGuard from "@/components/ui/AuthGuard";
import DataPrivacyChecker from "@/components/forms/DataPrivacyChecker";
import GlassCard from "@/components/ui/GlassCard";
import { Lock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Protection & AI Privacy Assessment | SafeShield",
  description: "Evaluate your school's compliance with UK GDPR and the Data Protection Act 2018, including obligations arising from the use of AI tools that process pupil and staff data.",
};

export default function DataPrivacyPage() {
  return (
    <AuthGuard toolSlug="data-privacy">
    <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="pt-10 pb-10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.2)]">
              <Lock size={22} className="text-[#3B82F6]" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[#3B82F6] text-xs font-medium uppercase tracking-widest mb-1">Data Protection</p>
              <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>Data Protection &amp; AI Privacy Assessment</h1>
              <p className="text-sm max-w-xl leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Evaluate your school&apos;s compliance with UK GDPR and the Data Protection Act 2018, including obligations arising from the use of AI tools that process pupil and staff data.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <DataPrivacyChecker />
            </div>
            <div className="flex flex-col gap-4">
              <GlassCard>
                <h2 className="font-semibold text-sm uppercase tracking-wider mb-3" style={{ color: "var(--text)" }}>Assessment Areas</h2>
                <ul className="flex flex-col gap-2">
                  {[
                    "Lawful Basis & Consent",
                    "Data Subject Rights",
                    "Security & Breach Management",
                    "DPIA & AI Obligations",
                    "Governance & Training",
                  ].map((area) => (
                    <li key={area} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-dim)" }}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#3B82F6" }} />{area}
                    </li>
                  ))}
                </ul>
              </GlassCard>
              <GlassCard>
                <h2 className="font-semibold text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text)" }}>Key Legislation</h2>
                <ul className="flex flex-col gap-1.5">
                  {["UK GDPR", "Data Protection Act 2018", "ICO Schools Guidance", "DfE Data Protection in Schools", "PECR 2003", "ICO Guidance on AI and Data Protection"].map((l) => (
                    <li key={l} className="text-xs" style={{ color: "var(--text-faint)" }}>· {l}</li>
                  ))}
                </ul>
              </GlassCard>
              <GlassCard>
                <h2 className="font-semibold text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text)" }}>Rating Scale</h2>
                <div className="flex flex-col gap-1.5">
                  {[["Compliant", "#22c55e"], ["Partial Compliance", "#f59e0b"], ["Non-Compliant", "#ef4444"]].map(([l, c]) => (
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
