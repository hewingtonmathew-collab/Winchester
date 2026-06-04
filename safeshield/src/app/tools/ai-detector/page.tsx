import DetectorForm from "@/components/forms/DetectorForm";
import GlassCard from "@/components/ui/GlassCard";
import { Bot } from "lucide-react";

const signals = [
  { name: "AI Phrase Patterns", desc: "Detects common AI transition phrases, filler openers, and over-hedging language." },
  { name: "Sentence Burstiness", desc: "AI text has low variance in sentence length — human writing is more varied." },
  { name: "Lexical Diversity", desc: "Measures unique-word ratio (TTR). AI typically lands in a predictable 55–70% range." },
  { name: "Passive Voice", desc: "AI-generated text uses passive voice more frequently than human writers." },
  { name: "Personal Pronouns", desc: "AI rarely uses first-person voice. Very few 'I', 'my', or 'we' is an AI signal." },
  { name: "Sentence Uniformity", desc: "High concentration of 20–30 word sentences is characteristic of AI output." },
];

export default function AiDetectorPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="pt-10 pb-10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-[rgba(56,189,248,0.1)] border border-[rgba(56,189,248,0.2)]">
            <Bot size={22} className="text-[#38BDF8]" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[#38BDF8] text-xs font-medium uppercase tracking-widest mb-1">Detection Tool</p>
            <h1 className="text-white text-3xl font-bold mb-2">AI Content Detector</h1>
            <p className="text-[#94A3B8] text-sm max-w-xl leading-relaxed">
              Paste any text to detect whether it was written by AI or a human. Uses six statistical signals — results are indicative only.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            <DetectorForm />
          </div>
          <div className="flex flex-col gap-4">
            <GlassCard>
              <h2 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">How It Works</h2>
              <p className="text-[#64748B] text-xs leading-relaxed mb-4">
                Six statistical signals are scored and combined into a 0–100 AI likelihood score.
              </p>
              <ol className="flex flex-col gap-3">
                {signals.map((s, i) => (
                  <li key={s.name} className="flex gap-3">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-[rgba(56,189,248,0.1)] border border-[rgba(56,189,248,0.2)] text-[#38BDF8] text-[0.6rem] font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-white text-xs font-semibold mb-0.5">{s.name}</p>
                      <p className="text-[#64748B] text-xs leading-relaxed">{s.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </GlassCard>
            <GlassCard>
              <h2 className="text-white font-semibold text-xs uppercase tracking-wider mb-2">Note</h2>
              <p className="text-[#475569] text-xs leading-relaxed">
                All analysis runs locally in your browser. No text is sent to any server.
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
