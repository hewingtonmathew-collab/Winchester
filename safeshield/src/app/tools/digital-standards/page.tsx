import AuthGuard from "@/components/ui/AuthGuard";
import DigitalStandardsChecker from "@/components/forms/DigitalStandardsChecker";
import GlassCard from "@/components/ui/GlassCard";
import ToolPageHeader from "@/components/ui/ToolPageHeader";
import { Monitor } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital & Technology Standards Checker | SafeShield",
  description: "Assess your school's compliance with DfE digital and technology standards across safeguarding, cyber security, data protection, Ofsted readiness, accessibility and infrastructure.",
};

const COLOR = "#818CF8";

export default function DigitalStandardsPage() {
  return (
    <AuthGuard toolSlug="digital-standards">
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ToolPageHeader
            icon={Monitor}
            badge="Standards"
            title="Digital & Technology Standards"
            description="Assess your school's compliance with DfE digital and technology standards across six key areas: digital safeguarding, cyber security, data protection, Ofsted readiness, accessibility, and infrastructure."
            color={COLOR}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <DigitalStandardsChecker />
            </div>
            <div className="flex flex-col gap-4">
              <GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: COLOR }}>Assessment Areas</h2>
                <ul className="flex flex-col gap-2">
                  {[
                    ["Digital Safeguarding", "#34D399"],
                    ["Cyber Security",       "#F87171"],
                    ["Data & GDPR",          "#FCD34D"],
                    ["Ofsted Readiness",     "#4ADE80"],
                    ["Accessibility",        "#F472B6"],
                    ["Infrastructure",       "#38BDF8"],
                  ].map(([area, color]) => (
                    <li key={area} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />{area}
                    </li>
                  ))}
                </ul>
              </GlassCard>
              <GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: COLOR }}>Rating Scale</h2>
                <div className="flex flex-col gap-1.5">
                  {[["Meeting Standards", "#22c55e"], ["Mostly Compliant", "#38BDF8"], ["Partially Compliant", "#f59e0b"], ["Significant Gaps", "#ef4444"]].map(([l, c]) => (
                    <div key={l} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c }} />
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>{l}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
              <GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: COLOR }}>Framework Alignment</h2>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  Aligned to the DfE Digital and Technology Standards for schools and colleges, KCSiE 2024, ICO guidance, WCAG 2.1, and the Ofsted EIF.
                </p>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
