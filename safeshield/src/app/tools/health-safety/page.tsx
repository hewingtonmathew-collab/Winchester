import AuthGuard from "@/components/ui/AuthGuard";
import HealthSafetyChecker from "@/components/forms/HealthSafetyChecker";
import GlassCard from "@/components/ui/GlassCard";
import ToolPageHeader from "@/components/ui/ToolPageHeader";
import { IconHealthSafety } from "@/components/ui/ToolIcons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Health & Safety Compliance Checker | SafeShield",
  description: "Assess your school's health and safety compliance across fire safety, COSHH, premises, policies, staff welfare, and contractor management.",
};

const COLOR = "#F97316";

export default function HealthSafetyPage() {
  return (
    <AuthGuard toolSlug="health-safety">
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ToolPageHeader
            icon={IconHealthSafety}
            badge="Health & Safety"
            title="Health & Safety Compliance Checker"
            description="Assess your school's compliance with health and safety legislation across six key areas: fire safety, COSHH, premises, policies and documentation, staff and pupil welfare, and contractor management."
            color={COLOR}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <HealthSafetyChecker />
            </div>
            <div className="flex flex-col gap-4">
              <GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: COLOR }}>Assessment Areas</h2>
                <ul className="flex flex-col gap-2">
                  {[
                    ["Fire Safety",           "#F87171"],
                    ["COSHH",                 "#FB923C"],
                    ["Premises & Facilities", "#FBBF24"],
                    ["Policies & Docs",       "#A78BFA"],
                    ["Staff & Pupil Welfare", "#34D399"],
                    ["Contractors & Visitors","#38BDF8"],
                  ].map(([area, color]) => (
                    <li key={area} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />{area}
                    </li>
                  ))}
                </ul>
              </GlassCard>
              <GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: COLOR }}>Legislation Covered</h2>
                <ul className="flex flex-col gap-1.5">
                  {["Health & Safety at Work Act 1974", "Regulatory Reform (Fire Safety) Order 2005", "COSHH Regulations 2002", "Management of H&S at Work Regs 1999", "RIDDOR 2013", "Electricity at Work Regs 1989"].map((l) => (
                    <li key={l} className="text-xs" style={{ color: "var(--text-muted)" }}>· {l}</li>
                  ))}
                </ul>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
