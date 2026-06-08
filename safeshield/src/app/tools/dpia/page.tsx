import AuthGuard from "@/components/ui/AuthGuard";
import DpiaWizard from "@/components/forms/DpiaWizard";
import GlassCard from "@/components/ui/GlassCard";
import ToolPageHeader from "@/components/ui/ToolPageHeader";
import { IconDPIA } from "@/components/ui/ToolIcons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DPIA Wizard | SafeShield",
  description: "Step-by-step Data Protection Impact Assessment wizard aligned to UK GDPR Article 35. Free tool for schools and trusts.",
};

const COLOR = "#FCD34D";
const STEPS = ["Processing Overview", "Necessity & Lawful Basis", "Proportionality & Data Minimisation", "Risk Identification", "Risk Mitigations", "Consultation & Sign-off"];
const TRIGGERS = ["Systematic monitoring of pupils", "Processing special category data at scale", "Using new AI or EdTech tools", "Biometric data processing", "Profiling or automated decision-making"];

export default function DpiaPage() {
  return (
    <AuthGuard toolSlug="dpia">
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ToolPageHeader
            icon={IconDPIA}
            badge="Data Protection"
            title="DPIA Wizard"
            description="Complete a Data Protection Impact Assessment in six guided steps, aligned to UK GDPR Article 35. Produces a risk-rated summary you can save or print."
            color={COLOR}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <DpiaWizard />
            </div>
            <div className="flex flex-col gap-4">
              <GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: COLOR }}>6 Guided Steps</h2>
                <ul className="flex flex-col gap-2">
                  {STEPS.map((step, i) => (
                    <li key={step} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                      <span className="w-4 h-4 rounded-full text-[0.6rem] font-bold flex items-center justify-center shrink-0"
                        style={{ background: `${COLOR}18`, border: `1px solid ${COLOR}35`, color: COLOR }}>
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
              </GlassCard>
              <GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: COLOR }}>When is a DPIA required?</h2>
                <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--text-muted)" }}>
                  Under UK GDPR Article 35, a DPIA is mandatory when processing is likely to result in high risk — including:
                </p>
                <ul className="flex flex-col gap-1.5">
                  {TRIGGERS.map((t) => (
                    <li key={t} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                      <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: COLOR }} />
                      {t}
                    </li>
                  ))}
                </ul>
              </GlassCard>
              <GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: COLOR }}>Framework Alignment</h2>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  Structured against UK GDPR Article 35, ICO DPIA guidance, and the DfE Data Protection toolkit for schools.
                </p>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
