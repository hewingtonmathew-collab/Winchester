import AccessibilityChecker from "@/components/forms/AccessibilityChecker";
import GlassCard from "@/components/ui/GlassCard";
import { Globe } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web Accessibility Checker | SafeShield",
  description: "Check your school website against WCAG 2.1 and Public Sector Accessibility Regulations. Free tool for schools.",
};

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-10 pb-10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-[rgba(244,114,182,0.1)] border border-[rgba(244,114,182,0.2)]">
            <Globe size={22} className="text-[#F472B6]" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[#F472B6] text-xs font-medium uppercase tracking-widest mb-1">Accessibility</p>
            <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>Web Accessibility Checker</h1>
            <p className="text-sm max-w-xl leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Assess your school website against WCAG 2.1 AA and the Public Sector Bodies Accessibility Regulations 2018. Identify barriers and generate a prioritised action plan with certificate.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            <AccessibilityChecker />
          </div>
          <div className="flex flex-col gap-4">
            <GlassCard>
              <h2 className="font-semibold text-sm uppercase tracking-wider mb-3" style={{ color: "var(--text)" }}>Areas Covered</h2>
              <ul className="flex flex-col gap-2">
                {["Perceivable (WCAG P)", "Operable (WCAG O)", "Understandable (WCAG U)", "Robust (WCAG R)", "Legal & Compliance"].map((a) => (
                  <li key={a} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-dim)" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F472B6] shrink-0" />{a}
                  </li>
                ))}
              </ul>
            </GlassCard>
            <GlassCard>
              <h2 className="font-semibold text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text)" }}>Legal Requirement</h2>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-faint)" }}>
                Under the Public Sector Bodies Accessibility Regulations 2018, all school websites must meet WCAG 2.1 AA and publish an Accessibility Statement. Non-compliance can result in enforcement action by the Equality and Human Rights Commission.
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
