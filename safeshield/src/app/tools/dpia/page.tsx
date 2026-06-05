import AuthGuard from "@/components/ui/AuthGuard";
import DpiaWizard from "@/components/forms/DpiaWizard";
import GlassCard from "@/components/ui/GlassCard";
import { FileSearch } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DPIA Wizard | SafeShield",
  description:
    "Step-by-step Data Protection Impact Assessment wizard aligned to UK GDPR Article 35. Free tool for schools and trusts.",
};

export default function DpiaPage() {
  return (
    <AuthGuard toolSlug="dpia">
    <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="pt-10 pb-10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-[rgba(251,191,36,0.1)] border border-[rgba(251,191,36,0.2)]">
              <FileSearch size={22} className="text-amber-400" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-amber-400 text-xs font-medium uppercase tracking-widest mb-1">Data Protection</p>
              <h1 className="text-white text-3xl font-bold mb-2">DPIA Wizard</h1>
              <p className="text-[#94A3B8] text-sm max-w-xl leading-relaxed">
                Complete a Data Protection Impact Assessment in six guided steps, aligned to UK GDPR Article 35 obligations. Produces a risk-rated summary you can save or print.
              </p>
            </div>
          </div>
  
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <DpiaWizard />
            </div>
            <div className="flex flex-col gap-4">
              <GlassCard>
                <h2 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">6 Guided Steps</h2>
                <ul className="flex flex-col gap-2">
                  {[
                    "Processing Overview",
                    "Necessity & Lawful Basis",
                    "Proportionality & Data Minimisation",
                    "Risk Identification",
                    "Risk Mitigations",
                    "Consultation & Sign-off",
                  ].map((step, i) => (
                    <li key={step} className="flex items-center gap-2 text-[#64748B] text-xs">
                      <span className="w-4 h-4 rounded-full bg-[rgba(251,191,36,0.1)] border border-[rgba(251,191,36,0.2)] text-amber-400 text-[0.6rem] font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
              </GlassCard>
              <GlassCard>
                <h2 className="text-white font-semibold text-xs uppercase tracking-wider mb-2">When is a DPIA required?</h2>
                <p className="text-[#475569] text-xs leading-relaxed mb-3">
                  Under UK GDPR Article 35, a DPIA is mandatory when processing is likely to result in high risk — including:
                </p>
                <ul className="flex flex-col gap-1.5">
                  {[
                    "Systematic monitoring of pupils",
                    "Processing special category data at scale",
                    "Using new AI or EdTech tools",
                    "Biometric data processing",
                    "Profiling or automated decision-making",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[#475569] text-xs">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </GlassCard>
              <GlassCard>
                <h2 className="text-white font-semibold text-xs uppercase tracking-wider mb-2">Framework Alignment</h2>
                <p className="text-[#475569] text-xs leading-relaxed">
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