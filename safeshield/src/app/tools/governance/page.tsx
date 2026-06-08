"use client";
import AuthGuard from "@/components/ui/AuthGuard";
import GovernanceChecker from "@/components/forms/GovernanceChecker";
import GlassCard from "@/components/ui/GlassCard";
import { IconGovernance } from "@/components/ui/ToolIcons";
import { useToolBanner } from "@/hooks/useToolBanner";
import BannerUploadButton from "@/components/ui/BannerUploadButton";

const COLOR = "#A78BFA";
const AREAS = ["Board structure & delegation", "Skills, membership & CPD", "Statutory policy compliance", "Website publication requirements", "Accountability & challenge", "Financial oversight", "Register of interests"];

export default function GovernancePage() {
  const { bannerUrl, setBannerUrl, uploadBanner, uploading } = useToolBanner("governance");
  return (
    <AuthGuard toolSlug="governance">
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
              <IconGovernance size={64} />
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>Compliance</span>
            </div>
            <h1 className="heading-luxury text-3xl sm:text-4xl mb-3 text-white drop-shadow-lg">Governance Compliance Checker</h1>
            <div className="w-12 h-0.5 mb-4 rounded-full" style={{ background: COLOR }} />
            <p className="text-sm leading-relaxed max-w-xl drop-shadow" style={{ color: "rgba(255,255,255,0.82)" }}>
              Check your governance arrangements against the DfE Governance Handbook. Identify gaps across board structure, skills, statutory compliance, accountability, and financial oversight.
            </p>
          </div>
        </div>

        {/* Page content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <GovernanceChecker />
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
                  <p className="text-xs font-bold mb-1" style={{ color: COLOR }}>Watch: School Governance</p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>What good governance looks like in UK schools and how to evidence it for Ofsted.</p>
                </div>
              </GlassCard>

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
      </div>
    </AuthGuard>
  );
}
