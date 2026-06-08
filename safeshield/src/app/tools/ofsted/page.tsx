"use client";
import AuthGuard from "@/components/ui/AuthGuard";
import OfstedChecker from "@/components/forms/OfstedChecker";
import GlassCard from "@/components/ui/GlassCard";
import { IconOfsted } from "@/components/ui/ToolIcons";
import { useToolBanner } from "@/hooks/useToolBanner";
import SidebarVideoCard from "@/components/ui/SidebarVideoCard";
import EditableText from "@/components/ui/EditableText";
import { useEditableContent } from "@/hooks/useEditableContent";
import BannerUploadButton from "@/components/ui/BannerUploadButton";
import ToolIconWrapper from "@/components/ui/ToolIconWrapper";

const COLOR = "#4ADE80";
const AREAS = ["Quality of Education", "Behaviour & Attitudes", "Personal Development", "Leadership & Management", "SEND & Inclusion"];
const RATINGS: [string, string][] = [
  ["Outstanding", "#3B82F6"],
  ["Good", "#22c55e"],
  ["Requires Improvement", "#f59e0b"],
  ["Inadequate", "#ef4444"],
];

export default function OfstedPage() {
  const { bannerUrl, setBannerUrl, isVideo, uploadBanner, uploading } = useToolBanner("ofsted");
  const { value: bannerTitle, save: saveBannerTitle } = useEditableContent("ofsted-title", "Ofsted Ready Checker");
  const { value: bannerDesc, save: saveBannerDesc } = useEditableContent("ofsted-desc", "Self-evaluate across all four Ofsted EIF judgement areas plus SEND. Identify strengths, risks, and areas for improvement before inspection.");
  return (
    <div className="min-h-[100dvh] pt-16 pb-20">
        {/* Banner */}
        <div style={{ position: "relative", paddingTop: "clamp(260px, calc(400 / 1920 * 100%), 400px)", overflow: "hidden" }}>
          {!isVideo(bannerUrl) && (
            <img
              src={bannerUrl}
              alt=""
              aria-hidden="true"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }}
            />
          )}
          <BannerUploadButton toolSlug="ofsted" onUploaded={(url) => setBannerUrl(url)} uploadBanner={uploadBanner} uploading={uploading} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.52) 100%)",
              backdropFilter: "blur(2px)",
            }}
          />
          <div className="rise-in max-w-6xl mx-auto px-4 sm:px-6" style={{ position: "absolute", inset: 0, zIndex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 48, paddingBottom: 48 }}>
            <div className="flex items-center gap-3 mb-4">
              <ToolIconWrapper slug="ofsted" Icon={IconOfsted} size={64} />
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>Inspection</span>
            </div>
            <h1 className="heading-luxury text-3xl sm:text-4xl mb-3 text-white drop-shadow-lg"><EditableText value={bannerTitle} onSave={saveBannerTitle} style={{ color: "white" }} /></h1>
            <div className="w-12 h-0.5 mb-4 rounded-full" style={{ background: COLOR }} />
            <p className="text-sm leading-relaxed max-w-xl drop-shadow" style={{ color: "rgba(255,255,255,0.82)" }}><EditableText value={bannerDesc} onSave={saveBannerDesc} multiline style={{ color: "rgba(255,255,255,0.82)" }} /></p>
          </div>
        </div>

        {/* Page content */}
        <AuthGuard toolSlug="ofsted">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <OfstedChecker />
            </div>
            <div className="flex flex-col gap-4">
              <SidebarVideoCard
                toolSlug="ofsted"
                color={COLOR}
                defaultTitle="Watch: Ofsted EIF Overview"
                defaultDescription="A summary of the Education Inspection Framework and what inspectors look for in each judgement area."
              />

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
        </AuthGuard>
    </div>
  );
}
