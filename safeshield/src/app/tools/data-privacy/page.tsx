import AuthGuard from "@/components/ui/AuthGuard";
import DataPrivacyChecker from "@/components/forms/DataPrivacyChecker";
import GlassCard from "@/components/ui/GlassCard";
import { Lock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Protection & AI Privacy | SafeShield",
  description: "Assess your school's data protection practices and AI privacy obligations against UK GDPR, the Data Protection Act 2018 and DfE AI data protection guidance.",
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
              <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>Data Protection &amp; AI Privacy</h1>
              <p className="text-sm max-w-xl leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Assess your school&apos;s data protection practices and AI privacy obligations against UK GDPR, the Data Protection Act 2018 and DfE AI data protection guidance.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <DataPrivacyChecker />
            </div>
            <div className="flex flex-col gap-4">
              <GlassCard>
                <h2 className="font-semibold text-sm uppercase tracking-wider mb-3" style={{ color: "var(--text)" }}>Areas Covered</h2>
                <ul className="flex flex-col gap-2">
                  {[
                    "Personal Data",
                    "Special Category Data",
                    "Children's Rights",
                    "International Transfers",
                    "Privacy Notices",
                    "Retention Periods",
                    "Supplier Compliance",
                    "Security Controls",
                    "DPIA Requirements",
                    "AI Obligations",
                  ].map((area) => (
                    <li key={area} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-dim)" }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] shrink-0" />
                      {area}
                    </li>
                  ))}
                </ul>
              </GlassCard>
              <GlassCard>
                <h2 className="font-semibold text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text)" }}>Framework Alignment</h2>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-faint)" }}>
                  Aligned to UK GDPR, Data Protection Act 2018, ICO guidance on children&apos;s data and AI, and DfE AI data protection guidance for schools.
                </p>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
