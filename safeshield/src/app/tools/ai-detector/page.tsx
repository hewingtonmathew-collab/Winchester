"use client";
import AuthGuard from "@/components/ui/AuthGuard";
import DetectorForm from "@/components/forms/DetectorForm";
import GlassCard from "@/components/ui/GlassCard";
import ToolPageHeader from "@/components/ui/ToolPageHeader";
import { IconAIDetector } from "@/components/ui/ToolIcons";

const COLOR = "#38BDF8";

const signals = [
  { name: "AI Phrase Patterns",  desc: "Detects common AI transition phrases, filler openers, and over-hedging language." },
  { name: "Sentence Burstiness", desc: "AI text has low variance in sentence length — human writing is more varied." },
  { name: "Lexical Diversity",   desc: "Measures unique-word ratio (TTR). AI typically lands in a predictable 55–70% range." },
  { name: "Passive Voice",       desc: "AI-generated text uses passive voice more frequently than human writers." },
  { name: "Personal Pronouns",   desc: "AI rarely uses first-person voice. Very few 'I', 'my', or 'we' is an AI signal." },
  { name: "Sentence Uniformity", desc: "High concentration of 20–30 word sentences is characteristic of AI output." },
];

export default function AiDetectorPage() {
  return (
    <AuthGuard toolSlug="ai-detector">
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ToolPageHeader
            icon={IconAIDetector}
            badge="Detection"
            title="AI Content Detector"
            description="Paste any text to detect whether it was written by AI or a human. Uses six statistical signals — results are indicative only."
            color={COLOR}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <DetectorForm />
            </div>
            <div className="flex flex-col gap-4">
              <GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: COLOR }}>How It Works</h2>
                <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
                  Six statistical signals are scored and combined into a 0–100 AI likelihood score.
                </p>
                <ol className="flex flex-col gap-3">
                  {signals.map((s, i) => (
                    <li key={s.name} className="flex gap-3">
                      <span className="shrink-0 w-5 h-5 rounded-full text-[0.6rem] font-bold flex items-center justify-center mt-0.5"
                        style={{ background: `${COLOR}18`, border: `1px solid ${COLOR}35`, color: COLOR }}>
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-xs font-semibold mb-0.5" style={{ color: "var(--text)" }}>{s.name}</p>
                        <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{s.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </GlassCard>
              <GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: COLOR }}>Privacy Note</h2>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  All analysis runs locally in your browser. No text is sent to any server.
                </p>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
