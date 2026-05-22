import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import SectionDivider from "@/components/ui/SectionDivider";
import DetectorForm from "@/components/forms/DetectorForm";

export const metadata: Metadata = {
  title: "AI Content Detector | Winchester Consultancy",
  description:
    "Free tool to detect AI-generated content. Useful for schools checking student work and compliance teams reviewing documents.",
};

const signals = [
  {
    name: "AI Phrase Patterns",
    description:
      'Detects common AI writing tells — transition phrases like "Furthermore," and "In conclusion," filler openers, and over-hedging language.',
  },
  {
    name: "Sentence Burstiness",
    description:
      "AI text has low variance in sentence length. High variance in length is a strong human-writing indicator.",
  },
  {
    name: "Lexical Diversity",
    description:
      "Measures the ratio of unique words to total words (Type-Token Ratio). AI tends toward a moderate, predictable range.",
  },
  {
    name: "Passive Voice Usage",
    description:
      "AI-generated text uses passive voice more frequently. Elevated passive voice ratio is an AI signal.",
  },
  {
    name: "Personal Pronoun Density",
    description:
      'AI text rarely uses first-person voice. Very few occurrences of "I", "my", "we", or "our" is a strong AI indicator.',
  },
];

const useCases = [
  "Checking student submissions for AI-generated content",
  "Reviewing AI-generated compliance reports before submission",
  "Auditing externally written policies for authenticity",
  "Supporting your school's AI governance framework",
];

export default function AiDetectorPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-36 pb-16 bg-[#0B1118]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="eyebrow mb-4">Free Tool</p>
          <h1 className="heading-display text-4xl lg:text-5xl mb-6">
            AI Content Detector
          </h1>
          <p className="font-inter text-[#A7B1BE] text-lg max-w-2xl leading-relaxed mb-4">
            Paste any text to analyse whether it was written by AI or a human. Designed
            for school leaders, compliance teams, and governance professionals.
          </p>
          <p className="font-inter text-[#A7B1BE] text-sm">
            This tool uses statistical analysis and pattern detection. Results are
            indicative only.
          </p>
        </div>
      </section>

      <SectionDivider />

      {/* Main tool section */}
      <section className="py-16 bg-[#111A23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left: form (2 cols wide) */}
            <div className="lg:col-span-2">
              <DetectorForm />
            </div>

            {/* Right: sidebar (1 col wide) */}
            <div className="flex flex-col gap-6">
              <GlassCard>
                <h2 className="font-cinzel font-bold text-white text-sm uppercase tracking-wider mb-4">
                  How It Works
                </h2>
                <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-4">
                  The detector analyses five statistical signals associated with AI-generated
                  text and combines them into a 0–100 score.
                </p>
                <ol className="flex flex-col gap-3">
                  {signals.map((signal, i) => (
                    <li key={signal.name} className="flex gap-3">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.3)] text-[#C9A84C] text-[0.65rem] font-cinzel font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-inter text-white text-xs font-semibold mb-0.5">
                          {signal.name}
                        </p>
                        <p className="font-inter text-[#A7B1BE] text-xs leading-relaxed">
                          {signal.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </GlassCard>

              <GlassCard>
                <h2 className="font-cinzel font-bold text-white text-sm uppercase tracking-wider mb-4">
                  Use Cases
                </h2>
                <ul className="flex flex-col gap-2.5">
                  {useCases.map((useCase) => (
                    <li key={useCase} className="flex gap-2.5 items-start">
                      <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-[#C9A84C]" aria-hidden="true" />
                      <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed">
                        {useCase}
                      </p>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Info section */}
      <section className="py-16 bg-[#0B1118]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="eyebrow mb-4">AI Governance</p>
          <h2 className="heading-display text-3xl lg:text-4xl mb-6">
            Why This Matters for Schools
          </h2>
          <p className="font-inter text-[#A7B1BE] text-base leading-relaxed mb-6">
            Generative AI is rapidly changing how students and staff interact with written
            content. Schools have a duty to uphold academic integrity, ensure compliance
            reports reflect genuine institutional thinking, and verify that externally
            sourced documentation has not been AI-generated without disclosure. A clear
            AI governance framework — covering policy, staff training, and detection
            processes — is increasingly expected by inspectors and regulators.
          </p>
          <p className="font-inter text-[#A7B1BE] text-base leading-relaxed mb-8">
            Winchester Consultancy supports schools and trusts in developing robust AI
            governance frameworks — from policy development and risk assessment to staff
            capability building and board-level briefings.
          </p>
          <Link
            href="/services/ai-governance"
            className="inline-flex items-center gap-2 font-inter text-[#C9A84C] font-medium text-sm hover:text-white transition-colors duration-200"
          >
            Learn about our AI Governance &amp; Readiness service
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
