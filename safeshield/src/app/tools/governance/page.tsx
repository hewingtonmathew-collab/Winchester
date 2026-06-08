"use client";
import AuthGuard from "@/components/ui/AuthGuard";
import GovernanceChecker from "@/components/forms/GovernanceChecker";
import GlassCard from "@/components/ui/GlassCard";
import { IconGovernance } from "@/components/ui/ToolIcons";
import { useToolBanner } from "@/hooks/useToolBanner";
import SidebarVideoCard from "@/components/ui/SidebarVideoCard";
import EditableText from "@/components/ui/EditableText";
import { useEditableContent } from "@/hooks/useEditableContent";
import BannerUploadButton from "@/components/ui/BannerUploadButton";
import ToolIconWrapper from "@/components/ui/ToolIconWrapper";

const COLOR = "#A78BFA";
const AREAS = ["Board structure & delegation", "Skills, membership & CPD", "Statutory policy compliance", "Website publication requirements", "Accountability & challenge", "Financial oversight", "Register of interests"];

export default function GovernancePage() {
  const { bannerUrl, setBannerUrl, isVideo, uploadBanner, uploading } = useToolBanner("governance");
  const { value: bannerTitle, save: saveBannerTitle } = useEditableContent("governance-title", "Governance Compliance Checker");
  const { value: bannerDesc, save: saveBannerDesc } = useEditableContent("governance-desc", "Check your governance against the DfE Governance Handbook. Identify gaps across committee structure, skills, policies, and accountability.");
  return (
    <div className="min-h-[100dvh] pt-16 pb-20">
        {/* Banner */}
        <div style={{ position: "relative", minHeight: 260, overflow: "hidden" }}>
          {!isVideo(bannerUrl) && (
            <img
              src={bannerUrl}
              alt=""
              aria-hidden="true"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", opacity: 0.6 }}
            />
          )}
          <BannerUploadButton toolSlug="governance" onUploaded={(url) => setBannerUrl(url)} uploadBanner={uploadBanner} uploading={uploading} />
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
              <ToolIconWrapper slug="governance" Icon={IconGovernance} size={64} />
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>Compliance</span>
            </div>
            <h1 className="heading-luxury text-3xl sm:text-4xl mb-3 text-white drop-shadow-lg"><EditableText value={bannerTitle} onSave={saveBannerTitle} style={{ color: "white" }} /></h1>
            <div className="w-12 h-0.5 mb-4 rounded-full" style={{ background: COLOR }} />
            <p className="text-sm leading-relaxed max-w-xl drop-shadow" style={{ color: "rgba(255,255,255,0.82)" }}><EditableText value={bannerDesc} onSave={saveBannerDesc} multiline style={{ color: "rgba(255,255,255,0.82)" }} /></p>
          </div>
        </div>

        {/* Page content */}
        <AuthGuard toolSlug="governance">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <GovernanceChecker />
            </div>
            <div className="flex flex-col gap-4">
              <SidebarVideoCard
                toolSlug="governance"
                color={COLOR}
                defaultTitle="Watch: School Governance"
                defaultDescription="What good governance looks like in UK schools and how to evidence it for Ofsted."
              />

<GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: COLOR }}>Areas Covered</h2>
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
                <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: COLOR }}>Framework Alignment</h2>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>Aligned to the DfE Governance Handbook, the Academy Trust Handbook, and Ofsted&apos;s school inspection handbook expectations for governance.</p>
              </GlassCard>
            </div>
          </div>
          </div>
        </AuthGuard>
    </div>
  );
}
