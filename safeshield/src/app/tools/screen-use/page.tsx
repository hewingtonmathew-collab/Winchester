import AuthGuard from "@/components/ui/AuthGuard";
import ScreenUseChecker from "@/components/forms/ScreenUseChecker";
import GlassCard from "@/components/ui/GlassCard";
import { Monitor } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Screen Use & Wellbeing Review | SafeShield",
  description: "Assess your school's approach to managing screen time, promoting digital wellbeing, and supporting pupils and staff in healthy technology habits.",
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
                Assess your school's approach to managing screen time, promoting digital wellbeing, and supporting pupils and staff in healthy technology habits.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <ScreenUseChecker />
            </div>
            <div className="flex flex-col gap-4">
              <GlassCard>
                <h2 className="font-semibold text-sm uppercase tracking-wider mb-3" style={{ color: "var(--text)" }}>Assessment Areas</h2>
                <ul className="flex flex-col gap-2">
                  {[
                    "Screen Time Policies",
                    "Wellbeing Integration",
                    "Parental Engagement",
                    "Staff Training",
                    "Monitoring & Review",
                  ].map((area) => (
                    <li key={area} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-dim)" }}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#06B6D4" }} />{area}
                    </li>
                  ))}
                </ul>
              </GlassCard>
              <GlassCard>
                <h2 className="font-semibold text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text)" }}>Key Guidance</h2>
                <ul className="flex flex-col gap-1.5">
                  {[
                    "DfE Keeping Children Safe in Education 2024",
                    "WHO Screen Time Guidelines",
                    "CMO Physical Activity Guidelines",
                    "Ukie Safe & Healthy Gaming Guidelines",
                    "RSPH #StatusOfMind Report",
                    "DfE Technology in Schools Guidance",
                  ].map((l) => (
                    <li key={l} className="text-xs" style={{ color: "var(--text-faint)" }}>· {l}</li>
                  ))}
                </ul>
              </GlassCard>
              <GlassCard>
                <h2 className="font-semibold text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text)" }}>Rating Scale</h2>
                <div className="flex flex-col gap-1.5">
                  {[["Good Practice", "#22c55e"], ["Developing", "#f59e0b"], ["Requires Review", "#ef4444"]].map(([l, c]) => (
                    <div key={l} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c }} />
                      <span className="text-xs" style={{ color: "var(--text-faint)" }}>{l}</span>
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
