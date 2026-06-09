import AuthGuard from "@/components/ui/AuthGuard";
import AiRiskChecker from "@/components/forms/AiRiskChecker";
import GlassCard from "@/components/ui/GlassCard";
import { Bot } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Use Risk Assessment | SafeShield",
  description: "Formally assess the risks of AI products used in your school against DfE Generative AI Guidance, KCSIE requirements and data protection obligations. Produce a governance-ready approval record.",
};

export default function AiRiskPage() {
  return (
    <AuthGuard toolSlug="ai-risk">
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="pt-10 pb-10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)]">
              <Bot size={22} className="text-[#F59E0B]" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[#F59E0B] text-xs font-medium uppercase tracking-widest mb-1">AI Governance</p>
              <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>AI Use Risk Assessment</h1>
              <p className="text-sm max-w-xl leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Formally assess the risks of AI products used in your school against DfE Generative AI Guidance, KCSIE requirements and data protection obligations. Produce a governance-ready approval record.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <AiRiskChecker />
            </div>
            <div className="flex flex-col gap-4">
              <GlassCard>
                <h2 className="font-semibold text-sm uppercase tracking-wider mb-3" style={{ color: "var(--text)" }}>Areas Covered</h2>
                <ul className="flex flex-col gap-2">
                  {[
                    "AI Product Vetting",
                    "Supplier Compliance",
                    "Age Restrictions",
                    "Human Oversight",
                    "Data Protection",
                    "Safeguarding",
                    "Staff Training",
                    "Policy Alignment",
                  ].map((area) => (
                    <li key={area} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-dim)" }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] shrink-0" />
                      {area}
                    </li>
                  ))}
                </ul>
              </GlassCard>
              <GlassCard>
                <h2 className="font-semibold text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text)" }}>Framework Alignment</h2>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-faint)" }}>
                  Aligned to DfE Generative AI in Education guidance, KCSIE 2024, UK GDPR, and ICO guidance on AI and children&apos;s data.
                </p>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
