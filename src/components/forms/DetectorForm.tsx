"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import { analyseTextAction, type DetectorState } from "@/app/tools-actions";
import { Loader2, ScanSearch, AlertCircle, CheckCircle2, HelpCircle } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

const initialState: DetectorState = {
  result: null,
  error: "",
  inputText: "",
};

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg
        bg-[rgba(27,36,48,0.9)] border border-[#2A3340] text-white font-inter font-medium text-sm tracking-wide
        hover:bg-[#2A3340] hover:border-[rgba(201,168,76,0.5)] transition-all duration-200
        disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <Loader2 size={15} className="animate-spin" aria-hidden="true" />
          Analysing…
        </>
      ) : (
        <>
          <ScanSearch size={15} aria-hidden="true" />
          Analyse Text
        </>
      )}
    </button>
  );
}

function ScoreGauge({ score }: { score: number }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score > 65 ? "#ef4444" : score > 35 ? "#f59e0b" : "#22c55e";

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
        {/* Background track */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="rgba(42,51,64,0.8)"
          strokeWidth="10"
        />
        {/* Progress arc — rotate so 0 is at top */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transform: "rotate(-90deg)", transformOrigin: "60px 60px", transition: "stroke-dashoffset 0.8s ease" }}
        />
        <text
          x="60"
          y="60"
          textAnchor="middle"
          dominantBaseline="central"
          fill="white"
          fontSize="22"
          fontWeight="bold"
          fontFamily="var(--font-cinzel)"
        >
          {score}
        </text>
      </svg>
      <span className="font-inter text-xs text-[#A7B1BE]">out of 100</span>
    </div>
  );
}

function LabelBadge({ label }: { label: string }) {
  const isAi = label === "Likely AI";
  const isPossibly = label === "Possibly AI";
  const isHuman = label === "Likely Human";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-inter font-semibold",
        isAi && "bg-red-500/15 border border-red-500/40 text-red-400",
        isPossibly && "bg-amber-500/15 border border-amber-500/40 text-amber-400",
        isHuman && "bg-green-500/15 border border-green-500/40 text-green-400"
      )}
    >
      {isAi && <AlertCircle size={13} aria-hidden="true" />}
      {isPossibly && <HelpCircle size={13} aria-hidden="true" />}
      {isHuman && <CheckCircle2 size={13} aria-hidden="true" />}
      {label}
    </span>
  );
}

function HighlightedText({ text, phrases }: { text: string; phrases: string[] }) {
  if (phrases.length === 0 || !text) {
    return (
      <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed whitespace-pre-wrap break-words">
        {text}
      </p>
    );
  }

  // Build a regex to highlight all flagged phrases (case-insensitive)
  const escaped = phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(pattern);

  return (
    <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed whitespace-pre-wrap break-words">
      {parts.map((part, i) => {
        const isMatch = phrases.some(
          (ph) => ph.toLowerCase() === part.toLowerCase()
        );
        return isMatch ? (
          <mark
            key={i}
            className="bg-amber-400/20 text-amber-300 rounded px-0.5"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </p>
  );
}

export default function DetectorForm() {
  const [state, formAction] = useFormState(analyseTextAction, initialState);
  const [wordCount, setWordCount] = useState(0);

  function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    const count = val
      .toLowerCase()
      .replace(/[^a-z0-9'\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 0).length;
    setWordCount(count);
  }

  const { result } = state;

  return (
    <div className="flex flex-col gap-6">
      <GlassCard>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="detector-text"
              className="font-inter text-[#A7B1BE] text-xs tracking-wider uppercase"
            >
              Text to Analyse
            </label>
            <textarea
              id="detector-text"
              name="text"
              rows={8}
              defaultValue={state.inputText}
              onChange={handleTextChange}
              placeholder="Paste your text here to analyse whether it was written by AI…"
              className="bg-[rgba(11,17,24,0.6)] border border-[#2A3340] rounded-lg px-4 py-3
                font-inter text-white text-sm placeholder-[#4a5568]
                focus:outline-none focus:border-[rgba(201,168,76,0.5)] transition-colors
                w-full resize-y min-h-[200px]"
            />
            <div className="flex items-center justify-between">
              <span className="font-inter text-xs text-[#A7B1BE]">
                {wordCount} word{wordCount !== 1 ? "s" : ""}{" "}
                {wordCount > 0 && wordCount < 50 && (
                  <span className="text-amber-400">(minimum 50 required)</span>
                )}
              </span>
            </div>
          </div>

          {state.error && (
            <p
              role="alert"
              className="font-inter text-red-400 text-sm flex items-center gap-1.5"
            >
              <AlertCircle size={14} aria-hidden="true" />
              {state.error}
            </p>
          )}

          <SubmitBtn />
        </form>
      </GlassCard>

      {result && (
        <div className="flex flex-col gap-6">
          {/* Score & verdict */}
          <GlassCard className="flex flex-col sm:flex-row items-center gap-6">
            <ScoreGauge score={result.score} />
            <div className="flex flex-col gap-3 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <LabelBadge label={result.label} />
                <span
                  className={cn(
                    "inline-block px-2.5 py-0.5 rounded-full text-[0.65rem] font-inter font-semibold uppercase tracking-widest",
                    "bg-[rgba(201,168,76,0.12)] border border-[rgba(201,168,76,0.25)] text-[#C9A84C]"
                  )}
                >
                  {result.confidence} Confidence
                </span>
              </div>
              <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed">
                {result.label === "Likely AI"
                  ? "This text exhibits strong indicators of AI generation. Multiple statistical signals align with AI writing patterns."
                  : result.label === "Possibly AI"
                  ? "This text shows some AI writing characteristics but also has human-like qualities. Exercise caution."
                  : "This text shows strong indicators of human authorship. Few or no AI writing patterns were detected."}
              </p>
            </div>
          </GlassCard>

          {/* Stats strip */}
          <GlassCard>
            <h3 className="font-cinzel font-bold text-white text-sm mb-4 uppercase tracking-wider">
              Text Statistics
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { label: "Words", value: result.stats.wordCount.toString() },
                { label: "Sentences", value: result.stats.sentenceCount.toString() },
                {
                  label: "Avg Sentence",
                  value: `${result.stats.avgSentenceLength} words`,
                },
                {
                  label: "Lexical Diversity",
                  value: `${result.stats.lexicalDiversity}%`,
                },
                {
                  label: "Passive Voice",
                  value: `${result.stats.passiveVoiceRatio}%`,
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex flex-col gap-1 p-3 rounded-lg bg-[rgba(11,17,24,0.4)] border border-[#2A3340]"
                >
                  <span className="font-inter text-[#A7B1BE] text-xs uppercase tracking-wider">
                    {label}
                  </span>
                  <span className="font-cinzel font-bold text-white text-lg">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Signal breakdown */}
          <GlassCard>
            <h3 className="font-cinzel font-bold text-white text-sm mb-4 uppercase tracking-wider">
              Signal Breakdown
            </h3>
            <div className="flex flex-col divide-y divide-[#2A3340]">
              {result.breakdown.map((item) => (
                <div key={item.signal} className="py-3 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-inter text-white text-sm font-medium">
                      {item.signal}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-24 h-1.5 bg-[#2A3340] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#C9A84C] transition-all duration-700"
                          style={{ width: `${item.weight}%` }}
                        />
                      </div>
                      <span className="font-inter text-[#C9A84C] text-xs font-semibold w-6 text-right">
                        {item.weight}
                      </span>
                    </div>
                  </div>
                  <p className="font-inter text-[#A7B1BE] text-xs leading-relaxed">
                    {item.explanation}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Flagged phrases */}
          {result.flaggedPhrases.length > 0 && (
            <GlassCard>
              <h3 className="font-cinzel font-bold text-white text-sm mb-4 uppercase tracking-wider">
                Flagged AI Phrases ({result.flaggedPhrases.length})
              </h3>
              <div className="flex flex-wrap gap-2 mb-5">
                {result.flaggedPhrases.map((phrase) => (
                  <span
                    key={phrase}
                    className="inline-block px-2.5 py-1 rounded text-xs font-inter bg-amber-400/10 border border-amber-400/30 text-amber-300"
                  >
                    {phrase}
                  </span>
                ))}
              </div>
              <h4 className="font-inter text-[#A7B1BE] text-xs uppercase tracking-wider mb-3">
                Highlighted Text
              </h4>
              <div className="bg-[rgba(11,17,24,0.5)] rounded-lg p-4 border border-[#2A3340] max-h-72 overflow-y-auto">
                <HighlightedText
                  text={state.inputText}
                  phrases={result.flaggedPhrases}
                />
              </div>
            </GlassCard>
          )}
        </div>
      )}
    </div>
  );
}
