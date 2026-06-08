"use client";
import AuthGuard from "@/components/ui/AuthGuard";
import HealthSafetyChecker from "@/components/forms/HealthSafetyChecker";
import GlassCard from "@/components/ui/GlassCard";
import { IconHealthSafety } from "@/components/ui/ToolIcons";
import { useToolBanner } from "@/hooks/useToolBanner";
import SidebarVideoCard from "@/components/ui/SidebarVideoCard";
import EditableText from "@/components/ui/EditableText";
import { useEditableContent } from "@/hooks/useEditableContent";
import BannerUploadButton from "@/components/ui/BannerUploadButton";
import ToolIconWrapper from "@/components/ui/ToolIconWrapper";

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
  const { bannerUrl, setBannerUrl, isVideo, uploadBanner, uploading } = useToolBanner("health-safety");
  const { value: bannerTitle, save: saveBannerTitle } = useEditableContent("health-safety-title", "Health & Safety Checker");
  const { value: bannerDesc, save: saveBannerDesc } = useEditableContent("health-safety-desc", "Assess compliance across fire safety, COSHH, premises, policies, staff welfare, and contractor management.");
  return (
    <div className="min-h-[100dvh] pt-16 pb-20">
        {/* Full-width video banner */}
        <div style={{ position: "relative", minHeight: 260, overflow: "hidden" }}>
          {isVideo(bannerUrl) ? (
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
              <ToolIconWrapper slug="health-safety" Icon={IconHealthSafety} size={64} />
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>Health &amp; Safety</span>
            </div>
            <h1 className="heading-luxury text-3xl sm:text-4xl mb-3 text-white drop-shadow-lg"><EditableText value={bannerTitle} onSave={saveBannerTitle} style={{ color: "white" }} /></h1>
            <div className="w-12 h-0.5 mb-4 rounded-full" style={{ background: COLOR }} />
            <p className="text-sm leading-relaxed max-w-xl drop-shadow" style={{ color: "rgba(255,255,255,0.82)" }}><EditableText value={bannerDesc} onSave={saveBannerDesc} multiline style={{ color: "rgba(255,255,255,0.82)" }} /></p>
          </div>
        </div>

        {/* Page content */}
        <AuthGuard toolSlug="health-safety">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <HealthSafetyChecker />
            </div>
            <div className="flex flex-col gap-4">
              <SidebarVideoCard
                toolSlug="health-safety"
                color={COLOR}
                defaultTitle="Watch: H&S in Schools"
                defaultDescription="Key health and safety obligations for school leaders and what a compliant school looks like."
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
        </AuthGuard>
    </div>
  );
}
