import AuthGuard from "@/components/ui/AuthGuard";
import AccessibilityChecker from "@/components/forms/AccessibilityChecker";
import GlassCard from "@/components/ui/GlassCard";
import ToolPageHeader from "@/components/ui/ToolPageHeader";
import { Globe } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web Accessibility Checker | SafeShield",
  description: "Check your school website against WCAG 2.1 and Public Sector Accessibility Regulations. Free tool for schools.",
};

const COLOR = "#F472B6";
const AREAS = ["Perceivable (WCAG P)", "Operable (WCAG O)", "Understandable (WCAG U)", "Robust (WCAG R)", "Legal & Compliance"];

export default function AccessibilityPage() {
  return (
    <AuthGuard toolSlug="accessibility">
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ToolPageHeader
            icon={Globe}
            badge="Accessibility"
            title="Web Accessibility Checker"
            description="Assess your school website against WCAG 2.1 AA and the Public Sector Bodies Accessibility Regulations 2018. Identify barriers and generate a prioritised action plan with certificate."
            color={COLOR}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <AccessibilityChecker />
            </div>
            <div className="flex flex-col gap-4">
              <GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: COLOR }}>Areas Covered</h2>
                <ul className="flex flex-col gap-2">
                  {AREAS.map((a) => (
                    <li key={a} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: COLOR }} />{a}
                    </li>
                  ))}
                </ul>
              </GlassCard>
              <GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: COLOR }}>Legal Requirement</h2>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  Under the Public Sector Bodies Accessibility Regulations 2018, all school websites must meet WCAG 2.1 AA and publish an Accessibility Statement. Non-compliance can result in enforcement action by the EHRC.
                </p>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
