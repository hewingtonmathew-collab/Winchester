import AuthGuard from "@/components/ui/AuthGuard";
import AiRiskChecker from "@/components/forms/AiRiskChecker";
import GlassCard from "@/components/ui/GlassCard";
import { Bot } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Use Risk Assessment | SafeShield",
  description: "Evaluate your school's governance, data protection practices, and safeguarding controls around the use of artificial intelligence tools by staff and pupils.",
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
                Evaluate your school's governance, data protection practices, and safeguarding controls around the use of artificial intelligence tools by staff and pupils.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <AiRiskChecker />
            </div>
            <div className="flex flex-col gap-4">
              <GlassCard>
                <h2 className="font-semibold text-sm uppercase tracking-wider mb-3" style={{ color: "var(--text)" }}>Assessment Areas</h2>
                <ul className="flex flex-col gap-2">
                  {[
                    "AI Governance & Policy",
                    "Pupil Data & Privacy",
                    "Staff Training",
                    "Curriculum Integration",
                    "Safeguarding & Ethics",
                  ].map((area) => (
                    <li key={area} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-dim)" }}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#F59E0B" }} />{area}
                    </li>
                  ))}
                </ul>
              </GlassCard>
              <GlassCard>
                <h2 className="font-semibold text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text)" }}>Key Frameworks</h2>
                <ul className="flex flex-col gap-1.5">
                  {[
                    "DfE Generative AI in Education Guidance 2023",
                    "ICO Guidance on AI and Data Protection",
                    "UK GDPR / DPA 2018",
                    "DfE KCSIE 2024",
                    "Alan Turing Institute AI Ethics Guidelines",
                    "DfE Acceptable Use Policies",
                  ].map((l) => (
                    <li key={l} className="text-xs" style={{ color: "var(--text-faint)" }}>· {l}</li>
                  ))}
                </ul>
              </GlassCard>
              <GlassCard>
                <h2 className="font-semibold text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text)" }}>Rating Scale</h2>
                <div className="flex flex-col gap-1.5">
                  {[["Approved", "#22c55e"], ["Conditional", "#f59e0b"], ["Not Approved", "#ef4444"]].map(([l, c]) => (
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
