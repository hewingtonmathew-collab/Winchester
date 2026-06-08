"use client";
import AuthGuard from "@/components/ui/AuthGuard";
import DetectorForm from "@/components/forms/DetectorForm";
import GlassCard from "@/components/ui/GlassCard";
import { IconAIDetector } from "@/components/ui/ToolIcons";
import { useToolBanner } from "@/hooks/useToolBanner";
import SidebarVideoCard from "@/components/ui/SidebarVideoCard";
import EditableText from "@/components/ui/EditableText";
import { useEditableContent } from "@/hooks/useEditableContent";
import BannerUploadButton from "@/components/ui/BannerUploadButton";
import ToolIconWrapper from "@/components/ui/ToolIconWrapper";

const COLOR = "#38BDF8";
const SIGNALS: [string, string][] = [
  ["AI Phrase Patterns", "Detects common AI transition phrases, filler openers, and over-hedging language."],
  ["Sentence Burstiness", "AI text has low variance in sentence length — human writing is more varied."],
  ["Lexical Diversity", "Measures unique-word ratio (TTR). AI typically lands in a predictable 55–70% range."],
  ["Passive Voice", "AI-generated text uses passive voice more frequently than human writers."],
  ["Personal Pronouns", "AI rarely uses first-person voice. Very few ‘I’, ‘my’, or ‘we’ is an AI signal."],
  ["Sentence Uniformity", "High concentration of 20–30 word sentences is characteristic of AI output."],
];

export default function AiDetectorPage() {
  const { bannerUrl, setBannerUrl, isVideo, uploadBanner, uploading } = useToolBanner("ai-detector");
  const { value: bannerTitle, save: saveBannerTitle } = useEditableContent("ai-detector-title", "AI Content Detector");
  const { value: bannerDesc, save: saveBannerDesc } = useEditableContent("ai-detector-desc", "Detect whether text was written by AI or a human using six statistical signals. Indicative 0–100 confidence score.");
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
          <BannerUploadButton toolSlug="ai-detector" onUploaded={(url) => setBannerUrl(url)} uploadBanner={uploadBanner} uploading={uploading} />
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
              <ToolIconWrapper slug="ai-detector" Icon={IconAIDetector} size={64} />
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>Detection</span>
            </div>
            <h1 className="heading-luxury text-3xl sm:text-4xl mb-3 text-white drop-shadow-lg"><EditableText value={bannerTitle} onSave={saveBannerTitle} style={{ color: "white" }} /></h1>
            <div className="w-12 h-0.5 mb-4 rounded-full" style={{ background: COLOR }} />
            <p className="text-sm leading-relaxed max-w-xl drop-shadow" style={{ color: "rgba(255,255,255,0.82)" }}><EditableText value={bannerDesc} onSave={saveBannerDesc} multiline style={{ color: "rgba(255,255,255,0.82)" }} /></p>
          </div>
        </div>

        {/* Page content */}
        <AuthGuard toolSlug="ai-detector">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <DetectorForm />
            </div>
            <div className="flex flex-col gap-4">
              <SidebarVideoCard
                toolSlug="ai-detector"
                color={COLOR}
                defaultTitle="Watch: AI Detection Explained"
                defaultDescription="How statistical signals can indicate AI-generated content and the limitations of automated detection."
              />

<GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: COLOR }}>How It Works</h2>
                <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--text-muted)" }}>Six statistical signals are scored and combined into a 0&ndash;100 AI likelihood score.</p>
                <ol className="flex flex-col gap-3">
                  {SIGNALS.map(([label, desc], i) => (
                    <li key={label} className="flex items-start gap-2 text-xs">
                      <span
                        className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold shrink-0 mt-0.5"
                        style={{ background: COLOR, color: "#000" }}
                      >
                        {i + 1}
                      </span>
                      <span>
                        <span className="font-bold block" style={{ color: "var(--text-primary)" }}>{label}</span>
                        <span style={{ color: "var(--text-muted)" }}>{desc}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </GlassCard>

              <GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: COLOR }}>Privacy Note</h2>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>All analysis runs locally in your browser. No text is sent to any server.</p>
              </GlassCard>
            </div>
          </div>
          </div>
        </AuthGuard>
    </div>
  );
}
