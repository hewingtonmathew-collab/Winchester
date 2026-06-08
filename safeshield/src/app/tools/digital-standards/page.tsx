"use client";
import AuthGuard from "@/components/ui/AuthGuard";
import DigitalStandardsChecker from "@/components/forms/DigitalStandardsChecker";
import GlassCard from "@/components/ui/GlassCard";
import ToolPageIcon from "@/components/ui/ToolPageIcon";
import { Monitor } from "lucide-react";

export default function DigitalStandardsPage() {
  return (
    <AuthGuard toolSlug="digital-standards">
    <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="pt-10 pb-10 flex items-start gap-4">
            <ToolPageIcon slug="digital-standards" DefaultIcon={Monitor} color="#818CF8" colorDim="rgba(129,140,248,0.1)" colorBorder="rgba(129,140,248,0.2)" />
            <div>
              <p className="text-[#818CF8] text-xs font-medium uppercase tracking-widest mb-1">Standards</p>
              <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>Digital &amp; Technology Standards</h1>
              <p className="text-sm max-w-xl leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Assess your school's compliance with DfE digital and technology standards across six key areas: digital safeguarding, cyber security, data protection, Ofsted readiness, accessibility, and infrastructure.
              </p>
            </div>
          </div>
  
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <DigitalStandardsChecker />
            </div>
            <div className="flex flex-col gap-4">
              <GlassCard>
                <h2 className="font-semibold text-sm uppercase tracking-wider mb-3" style={{ color: "var(--text)" }}>Assessment Areas</h2>
                <ul className="flex flex-col gap-2">
                  {[
                    ["Digital Safeguarding", "#34D399"],
                    ["Cyber Security", "#F87171"],
                    ["Data & GDPR", "#FCD34D"],
                    ["Ofsted Readiness", "#4ADE80"],
                    ["Accessibility", "#F472B6"],
                    ["Infrastructure", "#38BDF8"],
                  ].map(([area, color]) => (
                    <li key={area} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-dim)" }}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />{area}
                    </li>
                  ))}
                </ul>
              </GlassCard>
              <GlassCard>
                <h2 className="font-semibold text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text)" }}>Rating Scale</h2>
                <div className="flex flex-col gap-1.5">
                  {[["Meeting Standards", "#22c55e"], ["Mostly Compliant", "#38BDF8"], ["Partially Compliant", "#f59e0b"], ["Significant Gaps", "#ef4444"]].map(([l, c]) => (
                    <div key={l} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c }} />
                      <span className="text-xs" style={{ color: "var(--text-faint)" }}>{l}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
              <GlassCard>
                <h2 className="font-semibold text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text)" }}>Framework Alignment</h2>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-faint)" }}>
                  Questions are aligned to the DfE Digital and Technology Standards for schools and colleges, KCSiE 2024, ICO guidance, WCAG 2.1, and the Ofsted Education Inspection Framework.
                </p>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}