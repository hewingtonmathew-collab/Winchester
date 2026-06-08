"use client";
import AuthGuard from "@/components/ui/AuthGuard";
import HealthSafetyChecker from "@/components/forms/HealthSafetyChecker";
import GlassCard from "@/components/ui/GlassCard";
import { IconHealthSafety } from "@/components/ui/ToolIcons";
import { useToolBanner } from "@/hooks/useToolBanner";
import BannerUploadButton from "@/components/ui/BannerUploadButton";

const COLOR = "#F97316";
const ASSESSMENT_AREAS: [string, string][] = [
  ["Fire Safety", "#F87171"],
  ["COSHH", "#FB923C"],
  ["Premises & Facilities", "#FBBF24"],
  ["Policies & Docs", "#A78BFA"],
  ["Staff & Pupil Welfare", "#34D399"],
  ["Contractors & Visitors", "#38BDF8"],
];
const LEGISLATION = [
  "Health & Safety at Work Act 1974",
  "Regulatory Reform (Fire Safety) Order 2005",
  "COSHH Regulations 2002",
  "Management of H&S at Work Regs 1999",
  "RIDDOR 2013",
  "Electricity at Work Regs 1989",
];

export default function HealthSafetyPage() {
  const { bannerUrl, setBannerUrl, uploadBanner, uploading } = useToolBanner("health-safety");
  return (
    <AuthGuard toolSlug="health-safety">
      <div className="min-h-screen pt-16 pb-20">
        {/* Full-width video banner */}
        <div style={{ position: "relative", minHeight: 260, overflow: "hidden" }}>
          {bannerUrl.match(/\.(mp4|webm|mov)$/i) || bannerUrl === "/banner-bg.mp4" ? (
            <video
              src={bannerUrl}
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.38 }}
            />
          ) : (
            <img
              src={bannerUrl}
              alt=""
              aria-hidden="true"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.38 }}
            />
          )}
          <BannerUploadButton toolSlug="health-safety" onUploaded={(url) => setBannerUrl(url)} uploadBanner={uploadBanner} uploading={uploading} />
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
              <IconHealthSafety size={64} />
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>Health &amp; Safety</span>
            </div>
            <h1 className="heading-luxury text-3xl sm:text-4xl mb-3 text-white drop-shadow-lg">Health &amp; Safety Compliance Checker</h1>
            <div className="w-12 h-0.5 mb-4 rounded-full" style={{ background: COLOR }} />
            <p className="text-sm leading-relaxed max-w-xl drop-shadow" style={{ color: "rgba(255,255,255,0.82)" }}>
              Assess your school&apos;s compliance with health and safety legislation across six key areas: fire safety, COSHH, premises, policies and documentation, staff and pupil welfare, and contractor management.
            </p>
          </div>
        </div>

        {/* Page content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <HealthSafetyChecker />
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
                  <p className="text-xs font-bold mb-1" style={{ color: COLOR }}>Watch: H&amp;S in Schools</p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>Key health and safety obligations for school leaders and what a compliant school looks like.</p>
                </div>
              </GlassCard>

              <GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: COLOR }}>Assessment Areas</h2>
                <ul className="flex flex-col gap-2">
                  {ASSESSMENT_AREAS.map(([label, dotColor]) => (
                    <li key={label} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: dotColor }} />
                      {label}
                    </li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: COLOR }}>Legislation Covered</h2>
                <ul className="flex flex-col gap-2">
                  {LEGISLATION.map((l) => (
                    <li key={l} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: COLOR }} />
                      {l}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
