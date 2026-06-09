import AuthGuard from "@/components/ui/AuthGuard";
import ScreenUseChecker from "@/components/forms/ScreenUseChecker";
import GlassCard from "@/components/ui/GlassCard";
import { Monitor } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Screen Use & Wellbeing Review | SafeShield",
  description: "Assess your school's approach to screen use against UK Chief Medical Officers' guidance and Department of Health recommendations. Generate a Digital Wellbeing Report.",
};

export default function ScreenUsePage() {
  return (
    <AuthGuard toolSlug="screen-use">
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="pt-10 pb-10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-[rgba(6,182,212,0.1)] border border-[rgba(6,182,212,0.2)]">
              <Monitor size={22} className="text-[#06B6D4]" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[#06B6D4] text-xs font-medium uppercase tracking-widest mb-1">Digital Wellbeing</p>
              <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>Screen Use &amp; Wellbeing Review</h1>
              <p className="text-sm max-w-xl leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Assess your school&apos;s approach to screen use against UK Chief Medical Officers&apos; guidance and Department of Health recommendations. Generate a Digital Wellbeing Report.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <ScreenUseChecker />
            </div>
            <div className="flex flex-col gap-4">
              <GlassCard>
                <h2 className="font-semibold text-sm uppercase tracking-wider mb-3" style={{ color: "var(--text)" }}>Areas Covered</h2>
                <ul className="flex flex-col gap-2">
                  {[
                    "Educational Benefit",
                    "Screen Exposure",
                    "Physical Health",
                    "Sleep & Wellbeing",
                    "Age Suitability",
                    "SEND Considerations",
                    "Governance & Policy",
                    "Parental Engagement",
                  ].map((area) => (
                    <li key={area} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-dim)" }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] shrink-0" />
                      {area}
                    </li>
                  ))}
                </ul>
              </GlassCard>
              <GlassCard>
                <h2 className="font-semibold text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text)" }}>Framework Alignment</h2>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-faint)" }}>
                  Assessment aligned to UK Chief Medical Officers&apos; guidance on screen time, Department of Health and Social Care recommendations, and DfE digital wellbeing resources.
                </p>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
