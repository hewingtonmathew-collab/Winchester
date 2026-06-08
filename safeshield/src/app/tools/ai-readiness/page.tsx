"use client";
import AuthGuard from "@/components/ui/AuthGuard";
import AiReadiness from "@/components/forms/AiReadiness";
import GlassCard from "@/components/ui/GlassCard";
import { IconAIReadiness } from "@/components/ui/ToolIcons";
import { useToolBanner } from "@/hooks/useToolBanner";
import EditableText from "@/components/ui/EditableText";
import { useEditableContent } from "@/hooks/useEditableContent";
import BannerUploadButton from "@/components/ui/BannerUploadButton";
import ToolIconWrapper from "@/components/ui/ToolIconWrapper";

const COLOR = "#FB923C";
const AREAS = [
  "AI policy (staff & student)",
  "Data protection & DPIAs",
  "Safeguarding risk awareness",
  "AI procurement due diligence",
  "Staff capability & CPD",
  "Board briefing & risk register",
];
const RATINGS: [string, string, string][] = [
  ["Not started", "#ef4444", "Nothing is in place yet."],
  ["Planned", "#f97316", "Identified but not yet begun."],
  ["Partial", "#f59e0b", "Exists but incomplete or underdeveloped."],
  ["Fully in place", "#22c55e", "Robust, documented, and reviewed."],
];

export default function AiReadinessPage() {
  const { bannerUrl, setBannerUrl, isVideo, uploadBanner, uploading } = useToolBanner("ai-readiness");
  const { value: bannerTitle, save: saveBannerTitle } = useEditableContent("ai-readiness-title", "AI Readiness Assessment");
  const { value: bannerDesc, save: saveBannerDesc } = useEditableContent("ai-readiness-desc", "Score your school's readiness to adopt AI responsibly — policy, procurement, staff capability, data protection, and safeguarding.");
  return (
    <div className="min-h-[100dvh] pt-16 pb-20">
        {/* Banner */}
        <div style={{ position: "relative", minHeight: 260, overflow: "hidden" }}>
          {isVideo(bannerUrl) ? (
            <video
              key={bannerUrl}
              src={bannerUrl}
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", opacity: 0.6 }}
            />
          ) : (
            <img
              src={bannerUrl}
              alt=""
              aria-hidden="true"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", opacity: 0.6 }}
            />
          )}
          <BannerUploadButton toolSlug="ai-readiness" onUploaded={(url) => setBannerUrl(url)} uploadBanner={uploadBanner} uploading={uploading} />
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
              <ToolIconWrapper slug="ai-readiness" Icon={IconAIReadiness} size={64} />
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>Readiness</span>
            </div>
            <h1 className="heading-luxury text-3xl sm:text-4xl mb-3 text-white drop-shadow-lg"><EditableText value={bannerTitle} onSave={saveBannerTitle} style={{ color: "white" }} /></h1>
            <div className="w-12 h-0.5 mb-4 rounded-full" style={{ background: COLOR }} />
            <p className="text-sm leading-relaxed max-w-xl drop-shadow" style={{ color: "rgba(255,255,255,0.82)" }}><EditableText value={bannerDesc} onSave={saveBannerDesc} multiline style={{ color: "rgba(255,255,255,0.82)" }} /></p>
          </div>
        </div>

        {/* Page content */}
        <AuthGuard toolSlug="ai-readiness">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <AiReadiness />
            </div>
            <div className="flex flex-col gap-4">
<GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: COLOR }}>Dimensions Assessed</h2>
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
                <ul className="flex flex-col gap-3">
                  {RATINGS.map(([label, dotColor, desc]) => (
                    <li key={label} className="flex items-start gap-2 text-xs">
                      <span className="w-2 h-2 rounded-full shrink-0 mt-0.5" style={{ background: dotColor }} />
                      <span>
                        <span className="font-bold" style={{ color: "var(--text-primary)" }}>{label}</span>
                        <span className="block" style={{ color: "var(--text-muted)" }}>{desc}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>
          </div>
          </div>
        </AuthGuard>
    </div>
  );
}
