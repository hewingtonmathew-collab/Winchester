"use client";
import AuthGuard from "@/components/ui/AuthGuard";
import OfstedChecker from "@/components/forms/OfstedChecker";
import GlassCard from "@/components/ui/GlassCard";
import { IconOfsted } from "@/components/ui/ToolIcons";

const COLOR = "#4ADE80";
const AREAS = ["Quality of Education", "Behaviour & Attitudes", "Personal Development", "Leadership & Management", "SEND & Inclusion"];
const RATINGS: [string, string][] = [
  ["Outstanding", "#3B82F6"],
  ["Good", "#22c55e"],
  ["Requires Improvement", "#f59e0b"],
  ["Inadequate", "#ef4444"],
];

export default function OfstedPage() {
  return (
    <AuthGuard toolSlug="ofsted">
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
              <IconOfsted size={64} />
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>Inspection</span>
            </div>
            <h1 className="heading-luxury text-3xl sm:text-4xl mb-3 text-white drop-shadow-lg">Ofsted Ready Checker</h1>
            <div className="w-12 h-0.5 mb-4 rounded-full" style={{ background: COLOR }} />
            <p className="text-sm leading-relaxed max-w-xl drop-shadow" style={{ color: "rgba(255,255,255,0.82)" }}>
              Self-evaluate your school&apos;s readiness across all four Ofsted EIF judgement areas plus SEND and inclusion. Identify strengths, areas for improvement, and inspection risks.
            </p>
          </div>
        </div>

        {/* Page content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <OfstedChecker />
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
                  <p className="text-xs font-bold mb-1" style={{ color: COLOR }}>Watch: Ofsted EIF Overview</p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>A summary of the Education Inspection Framework and what inspectors look for in each judgement area.</p>
                </div>
              </GlassCard>

              <GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: COLOR }}>EIF Framework Areas</h2>
                <ul className="flex flex-col gap-2">
                  {AREAS.map((a) => (
                    <li key={a} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: COLOR }} />
                      {a}
                    </li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: COLOR }}>Rating Scale</h2>
                <ul className="flex flex-col gap-2">
                  {RATINGS.map(([label, dotColor]) => (
                    <li key={label} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: dotColor }} />
                      {label}
                    </li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: COLOR }}>Framework Alignment</h2>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>Aligned to the Ofsted Education Inspection Framework (EIF) 2023, the SEND Code of Practice, and the DfE&apos;s statutory guidance on school inspection.</p>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
