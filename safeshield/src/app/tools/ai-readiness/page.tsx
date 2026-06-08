"use client";
import AuthGuard from "@/components/ui/AuthGuard";
import AiReadiness from "@/components/forms/AiReadiness";
import GlassCard from "@/components/ui/GlassCard";
import { IconAIReadiness } from "@/components/ui/ToolIcons";

const COLOR = "#FB923C";

export default function AiReadinessPage() {
  return (
    <AuthGuard toolSlug="ai-readiness">
      <div className="min-h-screen pt-16 pb-20">

        {/* ── Video banner ── */}
        <div className="relative w-full overflow-hidden" style={{ minHeight: 260 }}>
          {/* Background video — muted, autoplay, loops silently */}
          <video
            src="/ai-readiness-intro.mp4"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0.38 }}
          />

          {/* Glass overlay so content is always readable */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.52) 100%)",
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
            }}
          />

          {/* Banner content */}
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-14 rise-in">
            <div className="flex items-center gap-4 mb-5">
              <IconAIReadiness size={72} />
              <span
                className="text-[0.62rem] font-black uppercase tracking-[0.18em] px-3 py-1.5 rounded-full border"
                style={{ color: COLOR, background: `${COLOR}22`, borderColor: `${COLOR}50` }}
              >
                Readiness
              </span>
            </div>

            <h1 className="heading-luxury text-3xl sm:text-4xl mb-3 text-white drop-shadow-lg">
              AI Readiness Assessment
            </h1>

            <div className="h-0.5 w-16 rounded-full mb-4"
              style={{ background: `linear-gradient(90deg, ${COLOR}, transparent)` }} />

            <p className="text-sm leading-relaxed max-w-xl text-white/80 drop-shadow">
              Rate your school&apos;s current position across five AI governance dimensions. Receive a readiness score and prioritised action list to support responsible AI adoption.
            </p>
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <AiReadiness />
            </div>

            <div className="flex flex-col gap-4">
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
