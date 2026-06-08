"use client";
import AuthGuard from "@/components/ui/AuthGuard";
import DpiaWizard from "@/components/forms/DpiaWizard";
import GlassCard from "@/components/ui/GlassCard";
import { IconDPIA } from "@/components/ui/ToolIcons";

const COLOR = "#FCD34D";
const STEPS = [
  "Processing Overview",
  "Necessity & Lawful Basis",
  "Proportionality & Data Minimisation",
  "Risk Identification",
  "Risk Mitigations",
  "Consultation & Sign-off",
];
const TRIGGERS = [
  "Systematic monitoring of pupils",
  "Processing special category data at scale",
  "Using new AI or EdTech tools",
  "Biometric data processing",
  "Profiling or automated decision-making",
];

export default function DpiaPage() {
  return (
    <AuthGuard toolSlug="dpia">
      <div className="min-h-screen pt-16 pb-20">
        {/* Full-width video banner */}
        <div style={{ position: "relative", minHeight: 260, overflow: "hidden" }}>
          <video
            src="/banner-bg.mp4"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.38 }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.52) 100%)",
              backdropFilter: "blur(2px)",
            }}
          />
          <div className="rise-in max-w-6xl mx-auto px-4 sm:px-6" style={{ position: "relative", zIndex: 1, paddingTop: 48, paddingBottom: 48 }}>
            <div className="flex items-center gap-3 mb-4">
              <IconDPIA size={64} />
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>Data Protection</span>
            </div>
            <h1 className="heading-luxury text-3xl sm:text-4xl mb-3 text-white drop-shadow-lg">DPIA Wizard</h1>
            <div className="w-12 h-0.5 mb-4 rounded-full" style={{ background: COLOR }} />
            <p className="text-sm leading-relaxed max-w-xl drop-shadow" style={{ color: "rgba(255,255,255,0.82)" }}>
              Complete a Data Protection Impact Assessment in six guided steps, aligned to UK GDPR Article 35. Produces a risk-rated summary you can save or print.
            </p>
          </div>
        </div>

        {/* Page content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <DpiaWizard />
            </div>
            <div className="flex flex-col gap-4">
              {/* Info video card */}
              <GlassCard className="p-0 overflow-hidden">
                <video
                  src="/ai-readiness-intro.mp4"
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full rounded-2xl"
                  style={{ display: "block" }}
                />
                <div className="px-4 py-3">
                  <p className="text-xs font-bold mb-1" style={{ color: COLOR }}>Watch: What is a DPIA?</p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>When a DPIA is legally required, how to complete one, and what the ICO expects from schools.</p>
                </div>
              </GlassCard>

              <GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: COLOR }}>6 Guided Steps</h2>
                <ol className="flex flex-col gap-2">
                  {STEPS.map((step, i) => (
                    <li key={step} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                      <span
                        className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold shrink-0"
                        style={{ background: COLOR, color: "#000" }}
                      >
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </GlassCard>

              <GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: COLOR }}>When is a DPIA required?</h2>
                <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--text-muted)" }}>Under UK GDPR Article 35, a DPIA is mandatory when processing is likely to result in high risk &mdash; including:</p>
                <ul className="flex flex-col gap-2">
                  {TRIGGERS.map((t) => (
                    <li key={t} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: COLOR }} />
                      {t}
                    </li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: COLOR }}>Framework Alignment</h2>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>Structured against UK GDPR Article 35, ICO DPIA guidance, and the DfE Data Protection toolkit for schools.</p>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
