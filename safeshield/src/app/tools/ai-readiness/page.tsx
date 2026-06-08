"use client";
import AuthGuard from "@/components/ui/AuthGuard";
import AiReadiness from "@/components/forms/AiReadiness";
import GlassCard from "@/components/ui/GlassCard";
import ToolPageHeader from "@/components/ui/ToolPageHeader";
import { IconAIReadiness } from "@/components/ui/ToolIcons";

const COLOR = "#FB923C";
const DIMS = ["AI policy (staff & student)", "Data protection & DPIAs", "Safeguarding risk awareness", "AI procurement due diligence", "Staff capability & CPD", "Board briefing & risk register"];

export default function AiReadinessPage() {
  return (
    <AuthGuard toolSlug="ai-readiness">
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ToolPageHeader
            icon={IconAIReadiness}
            badge="Readiness Assessment"
            title="AI Readiness Assessment"
            description="Rate your school's current position across five AI governance dimensions. Receive a readiness score and prioritised action list to support responsible AI adoption."
            color={COLOR}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <AiReadiness />
            </div>
            <div className="flex flex-col gap-4">
              <GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: COLOR }}>Dimensions Assessed</h2>
                <ul className="flex flex-col gap-2">
                  {DIMS.map((a) => (
                    <li key={a} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: COLOR }} />
                      {a}
                    </li>
                  ))}
                </ul>
              </GlassCard>
              <GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: COLOR }}>Rating Scale</h2>
                <div className="flex flex-col gap-2">
                  {[
                    ["Not started",    "#F87171", "Nothing is in place yet."],
                    ["Planned",        "#FB923C", "Identified but not begun."],
                    ["Partial",        "#FCD34D", "Incomplete or underdeveloped."],
                    ["Fully in place", "#4ADE80", "Robust, documented, reviewed."],
                  ].map(([label, c, desc]) => (
                    <div key={label}>
                      <span className="text-xs font-semibold" style={{ color: c }}>{label}</span>
                      <span className="text-xs" style={{ color: "var(--text-dim)" }}> — {desc}</span>
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
