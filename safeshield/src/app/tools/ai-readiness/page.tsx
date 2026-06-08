import AuthGuard from "@/components/ui/AuthGuard";
import AiReadiness from "@/components/forms/AiReadiness";
import GlassCard from "@/components/ui/GlassCard";
import ToolPageHeader from "@/components/ui/ToolPageHeader";
import { IconAIReadiness } from "@/components/ui/ToolIcons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Readiness Assessment | SafeShield",
  description: "Rate your school's readiness to adopt AI responsibly across policy, data protection, safeguarding, procurement, and staff capability.",
};

const COLOR = "#FB923C";

export default function AiReadinessPage() {
  return (
    <AuthGuard toolSlug="ai-readiness">
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ToolPageHeader
            icon={IconAIReadiness}
            badge="Readiness"
            title="AI Readiness Assessment"
            description="Rate your school's current position across five AI governance dimensions. Receive a readiness score and prioritised action list to support responsible AI adoption."
            color={COLOR}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <AiReadiness />
            </div>

            <div className="flex flex-col gap-4">
              {/* Intro video */}
              <GlassCard className="p-0 overflow-hidden">
                <video
                  src="/ai-readiness-intro.mp4"
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full rounded-2xl"
                  aria-label="AI Readiness Assessment introduction video"
                  style={{ display: "block" }}
                />
                <div className="px-4 py-3">
                  <p className="text-xs font-semibold mb-0.5" style={{ color: COLOR }}>Watch: AI in Schools</p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    A short overview of AI adoption in UK education and what responsible readiness looks like.
                  </p>
                </div>
              </GlassCard>

              <GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: COLOR }}>Dimensions Assessed</h2>
                <ul className="flex flex-col gap-2">
                  {[
                    "AI policy (staff & student)",
                    "Data protection & DPIAs",
                    "Safeguarding risk awareness",
                    "AI procurement due diligence",
                    "Staff capability & CPD",
                    "Board briefing & risk register",
                  ].map((a) => (
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
                    ["Not started",    "#ef4444", "Nothing is in place yet."],
                    ["Planned",        "#f97316", "Identified but not yet begun."],
                    ["Partial",        "#f59e0b", "Exists but incomplete or underdeveloped."],
                    ["Fully in place", "#22c55e", "Robust, documented, and reviewed."],
                  ].map(([label, color, desc]) => (
                    <div key={label} className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ background: color }} />
                      <div>
                        <span className="text-xs font-semibold" style={{ color }}>{label}</span>
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}> — {desc}</span>
                      </div>
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
