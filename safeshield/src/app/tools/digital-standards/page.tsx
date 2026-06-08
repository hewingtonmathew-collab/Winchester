"use client";
import AuthGuard from "@/components/ui/AuthGuard";
import DigitalStandardsChecker from "@/components/forms/DigitalStandardsChecker";
import GlassCard from "@/components/ui/GlassCard";
import { IconDigitalStandards } from "@/components/ui/ToolIcons";
import { useToolBanner } from "@/hooks/useToolBanner";
import SidebarVideoCard from "@/components/ui/SidebarVideoCard";
import EditableText from "@/components/ui/EditableText";
import { useEditableContent } from "@/hooks/useEditableContent";
import BannerUploadButton from "@/components/ui/BannerUploadButton";
import ToolIconWrapper from "@/components/ui/ToolIconWrapper";

const COLOR = "#818CF8";
const ASSESSMENT_AREAS: [string, string][] = [
  ["Digital Safeguarding", "#34D399"],
  ["Cyber Security", "#F87171"],
  ["Data & GDPR", "#FCD34D"],
  ["Ofsted Readiness", "#4ADE80"],
  ["Accessibility", "#F472B6"],
  ["Infrastructure", "#38BDF8"],
];
const RATINGS: [string, string][] = [
  ["Meeting Standards", "#22c55e"],
  ["Mostly Compliant", "#38BDF8"],
  ["Partially Compliant", "#f59e0b"],
  ["Significant Gaps", "#ef4444"],
];

export default function DigitalStandardsPage() {
  const { bannerUrl, setBannerUrl, isVideo, uploadBanner, uploading } = useToolBanner("digital-standards");
  const { value: bannerTitle, save: saveBannerTitle } = useEditableContent("digital-standards-title", "Digital & Technology Standards");
  const { value: bannerDesc, save: saveBannerDesc } = useEditableContent("digital-standards-desc", "Compliance across safeguarding, cyber security, data protection, Ofsted readiness, accessibility, and infrastructure.");
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
          <BannerUploadButton toolSlug="digital-standards" onUploaded={(url) => setBannerUrl(url)} uploadBanner={uploadBanner} uploading={uploading} />
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
              <ToolIconWrapper slug="digital-standards" Icon={IconDigitalStandards} size={64} />
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>Standards</span>
            </div>
            <h1 className="heading-luxury text-3xl sm:text-4xl mb-3 text-white drop-shadow-lg"><EditableText value={bannerTitle} onSave={saveBannerTitle} style={{ color: "white" }} /></h1>
            <div className="w-12 h-0.5 mb-4 rounded-full" style={{ background: COLOR }} />
            <p className="text-sm leading-relaxed max-w-xl drop-shadow" style={{ color: "rgba(255,255,255,0.82)" }}><EditableText value={bannerDesc} onSave={saveBannerDesc} multiline style={{ color: "rgba(255,255,255,0.82)" }} /></p>
          </div>
        </div>

        {/* Page content */}
        <AuthGuard toolSlug="digital-standards">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <DigitalStandardsChecker />
            </div>
            <div className="flex flex-col gap-4">
              <SidebarVideoCard
                toolSlug="digital-standards"
                color={COLOR}
                defaultTitle="Watch: DfE Digital Standards"
                defaultDescription="An overview of the DfE digital and technology standards for schools and what compliance requires."
              />

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
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>Aligned to the DfE Digital and Technology Standards for schools and colleges, KCSiE 2024, ICO guidance, WCAG 2.1, and the Ofsted EIF.</p>
              </GlassCard>
            </div>
          </div>
          </div>
        </AuthGuard>
    </div>
  );
}
