"use client";
import { useState } from "react";
import { CheckCircle2, ChevronRight } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import ReportMeta, { type ReportMetaData } from "@/components/report/ReportMeta";
import Certificate from "@/components/report/Certificate";
import ImprovementReport, { type Gap } from "@/components/report/ImprovementReport";
import { saveSubmission } from "@/lib/submissions";

type Answer = "yes" | "partial" | "no" | null;
type Item = { id: string; tab: string; text: string; weight: number };

const items: Item[] = [
  // Lawful Basis & Consent
  { id: "lb1", tab: "Lawful Basis & Consent", text: "Does the school have a documented lawful basis for every category of personal data it processes, recorded in its data inventory?", weight: 10 },
  { id: "lb2", tab: "Lawful Basis & Consent", text: "Where consent is relied upon, is it freely given, specific, informed, and capable of being withdrawn?", weight: 9 },
  { id: "lb3", tab: "Lawful Basis & Consent", text: "Is special category data (health, ethnicity, religion) identified and processed under an additional lawful condition?", weight: 10 },
  { id: "lb4", tab: "Lawful Basis & Consent", text: "Does the school's privacy notice clearly explain how and why personal data is processed, in plain English?", weight: 9 },

  // Data Subject Rights
  { id: "ds1", tab: "Data Subject Rights", text: "Does the school have a documented process for handling Subject Access Requests (SARs) within the statutory 1-month deadline?", weight: 9 },
  { id: "ds2", tab: "Data Subject Rights", text: "Are staff trained to recognise and escalate data subject rights requests (erasure, rectification, restriction)?", weight: 9 },
  { id: "ds3", tab: "Data Subject Rights", text: "Does the school maintain records of all SARs and rights requests received and how they were handled?", weight: 8 },
  { id: "ds4", tab: "Data Subject Rights", text: "Is there a process to verify the identity of individuals making data subject rights requests?", weight: 8 },

  // Security & Breach Management
  { id: "sb1", tab: "Security & Breach Management", text: "Does the school have a documented data breach response procedure, with the Data Protection Officer (or equivalent) notified within 24 hours of discovery?", weight: 10 },
  { id: "sb2", tab: "Security & Breach Management", text: "Is personal data encrypted in transit and at rest, and are access controls in place to restrict data to authorised users?", weight: 10 },
  { id: "sb3", tab: "Security & Breach Management", text: "Are all data breaches (including near-misses) logged in a breach register, with root cause analysis conducted?", weight: 9 },
  { id: "sb4", tab: "Security & Breach Management", text: "Does the school report reportable breaches to the ICO within 72 hours of becoming aware?", weight: 9 },

  // DPIA & AI Obligations
  { id: "da1", tab: "DPIA & AI Obligations", text: "Has a DPIA been completed for all high-risk processing activities, including use of AI tools, biometrics, or large-scale pupil profiling?", weight: 10 },
  { id: "da2", tab: "DPIA & AI Obligations", text: "Are DPIAs reviewed and updated when processing activities or AI tools change significantly?", weight: 9 },
  { id: "da3", tab: "DPIA & AI Obligations", text: "Does the school have data processing agreements with all third-party suppliers who process personal data on its behalf?", weight: 9 },
  { id: "da4", tab: "DPIA & AI Obligations", text: "Is there a process to assess international data transfers and ensure appropriate safeguards are in place?", weight: 9 },

  // Governance & Training
  { id: "gt1", tab: "Governance & Training", text: "Has the school appointed a qualified Data Protection Officer (or shared DPO service) and registered with the ICO?", weight: 10 },
  { id: "gt2", tab: "Governance & Training", text: "Have all staff received UK GDPR and data protection training within the last 2 years?", weight: 9 },
  { id: "gt3", tab: "Governance & Training", text: "Does the governing board receive an annual data protection report covering compliance, incidents, and training?", weight: 8 },
  { id: "gt4", tab: "Governance & Training", text: "Is data protection a standing agenda item for senior leadership, with risks escalated to governors?", weight: 8 },
];

const TABS = ["Lawful Basis & Consent", "Data Subject Rights", "Security & Breach Management", "DPIA & AI Obligations", "Governance & Training"];

const defaultMeta: ReportMetaData = {
  schoolName: "", schoolEmail: "", consultantName: "", consultantEmail: "", staffMember: "", logoDataUrl: null,
};

const LEVELS: { value: Answer; label: string; color: string; bg: string }[] = [
  { value: "yes", label: "Yes — In Place", color: "text-green-400", bg: "bg-green-500/15 border-green-500/30" },
  { value: "partial", label: "Partially in Place", color: "text-amber-400", bg: "bg-amber-500/15 border-amber-500/30" },
  { value: "no", label: "Not in Place", color: "text-red-400", bg: "bg-red-500/15 border-red-500/30" },
];

const scoreMap: Record<NonNullable<Answer>, number> = { yes: 2, partial: 1, no: 0 };

function calcScore(answers: Record<string, Answer>): number {
  const total = items.reduce((s, i) => s + i.weight * 2, 0);
  const earned = items.reduce((s, i) => s + (scoreMap[answers[i.id] ?? "no"] ?? 0) * i.weight, 0);
  return Math.round((earned / total) * 100);
}

const COLOR = "#3B82F6";
const DIM = "rgba(59,130,246,0.12)";
const BORDER = "rgba(59,130,246,0.25)";

const TAB_COLORS: Record<string, string> = {
  "Lawful Basis & Consent": "#60A5FA",
  "Data Subject Rights": "#34D399",
  "Security & Breach Management": "#F87171",
  "DPIA & AI Obligations": "#A78BFA",
  "Governance & Training": "#FBBF24",
};

export default function DataPrivacyChecker() {
  const [meta, setMeta] = useState<ReportMetaData>(defaultMeta);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [step, setStep] = useState<"meta" | "questions">("meta");

  const answered = Object.keys(answers).filter((k) => answers[k] !== null).length;
  const score = calcScore(answers);
  const metaValid = meta.schoolName.trim() && meta.staffMember.trim() && meta.consultantName.trim();

  const rating = score >= 75 ? "Compliant" : score >= 50 ? "Partial Compliance" : "Non-Compliant";
  const ringColor = score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";

  const gaps: Gap[] = items
    .filter((i) => answers[i.id] === "no" || answers[i.id] === "partial")
    .map((i) => ({
      category: i.tab,
      text: i.text,
      priority: answers[i.id] === "no" && i.weight >= 9 ? "high" : answers[i.id] === "no" ? "medium" : "low",
    }));

  function submit() {
    setSubmitted(true);
    saveSubmission({ tool: "Data Protection & AI Privacy Assessment", ...meta, score, rating, ratingColor: ringColor });
  }

  if (step === "meta") {
    return (
      <div className="flex flex-col gap-5">
        <ReportMeta value={meta} onChange={setMeta} accentColor={COLOR} accentDim={DIM} accentBorder={BORDER} />
        <div className="flex justify-end">
          <button onClick={() => setStep("questions")} disabled={!metaValid}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: DIM, border: `1px solid ${BORDER}`, color: COLOR }}>
            Start Assessment <ChevronRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex flex-col gap-5">
        <GlassCard>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex flex-col items-center gap-1.5">
              <svg width="110" height="110" viewBox="0 0 110 110">
                <circle cx="55" cy="55" r="45" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                <circle cx="55" cy="55" r="45" fill="none" stroke={ringColor} strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 45} strokeDashoffset={2 * Math.PI * 45 - (score / 100) * 2 * Math.PI * 45}
                  style={{ transform: "rotate(-90deg)", transformOrigin: "55px 55px", transition: "stroke-dashoffset 0.8s ease" }} />
                <text x="55" y="55" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="22" fontWeight="bold">{score}</text>
              </svg>
              <span className="text-[#64748B] text-xs">out of 100</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold"
                style={{ background: "#000", border: `2px solid ${ringColor}`, color: ringColor }}>
                <CheckCircle2 size={13} /> {rating}
              </span>
              <p className="text-[#94A3B8] text-sm leading-relaxed max-w-xs">
                {score >= 75 ? "The school demonstrates strong data protection compliance against UK GDPR requirements." : score >= 50 ? "Partial compliance — important gaps in data protection controls need to be addressed." : "Non-compliant — significant gaps identified across data protection obligations requiring urgent action."}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Per-tab breakdown */}
        <GlassCard>
          <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Results by Area</h3>
          <div className="flex flex-col gap-3">
            {TABS.map((tab) => {
              const tabItems = items.filter((i) => i.tab === tab);
              const tabTotal = tabItems.reduce((s, i) => s + i.weight * 2, 0);
              const tabEarned = tabItems.reduce((s, i) => s + (scoreMap[answers[i.id] ?? "no"] ?? 0) * i.weight, 0);
              const tabScore = Math.round((tabEarned / tabTotal) * 100);
              const tc = TAB_COLORS[tab];
              return (
                <div key={tab}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-xs font-medium">{tab}</span>
                    <span className="text-xs font-semibold" style={{ color: tc }}>{tabScore}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${tabScore}%`, background: tc }} />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        <Certificate meta={meta} toolName="Data Protection & AI Privacy Assessment" score={score} rating={rating} ratingColor={ringColor} accentColor={COLOR} areas={TABS.map(tab => {
          const ti = items.filter(i => i.tab === tab);
          const tot = ti.reduce((s, i) => s + i.weight * 2, 0);
          const earn = ti.reduce((s, i) => s + (scoreMap[answers[i.id] ?? "no"] ?? 0) * i.weight, 0);
          return { name: tab, score: tot > 0 ? Math.round((earn / tot) * 100) : 0 };
        })} />
        {gaps.length > 0 && (
          <ImprovementReport meta={meta} toolName="Data Protection & AI Privacy Assessment" score={score} rating={rating} ratingColor={ringColor} gaps={gaps} accentColor={COLOR} accentDim={DIM} accentBorder={BORDER} />
        )}
        <button onClick={() => { setSubmitted(false); setAnswers({}); setStep("meta"); setMeta(defaultMeta); }}
          className="self-start text-sm hover:text-white transition-colors" style={{ color: COLOR }}>
          ← Start again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Tab navigation */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const tc = TAB_COLORS[tab];
          const tabItems = items.filter((i) => i.tab === tab);
          const answeredInTab = tabItems.filter((i) => answers[i.id] !== undefined && answers[i.id] !== null).length;
          const complete = answeredInTab === tabItems.length;
          return (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={activeTab === tab
                ? { background: `${tc}20`, border: `1px solid ${tc}60`, color: tc }
                : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: complete ? tc : "#64748B" }}>
              {complete && <CheckCircle2 size={11} />}
              {tab}
              <span className="opacity-60 text-[10px]">{answeredInTab}/{tabItems.length}</span>
            </button>
          );
        })}
      </div>

      {/* Questions */}
      <GlassCard>
        <h3 className="text-white font-semibold text-sm mb-1 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: TAB_COLORS[activeTab] }} />
          {activeTab}
        </h3>
        <p className="text-[#64748B] text-xs mb-5">Rate each area based on your current compliance.</p>
        <div className="flex flex-col divide-y divide-white/5">
          {items.filter((i) => i.tab === activeTab).map((item) => (
            <div key={item.id} className="py-4">
              <p className="text-[#CBD5E1] text-sm leading-relaxed mb-3">{item.text}</p>
              <div className="flex flex-wrap gap-2">
                {LEVELS.map(({ value, label, color, bg }) => (
                  <button key={value} onClick={() => setAnswers((a) => ({ ...a, [item.id]: value }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${answers[item.id] === value ? `${bg} ${color}` : "bg-white/3 border-white/8 text-[#475569] hover:border-white/15"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Navigation + submit */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#475569]">{answered} of {items.length} questions answered</span>
        <div className="flex gap-2">
          {TABS.indexOf(activeTab) < TABS.length - 1 ? (
            <button
              onClick={() => setActiveTab(TABS[TABS.indexOf(activeTab) + 1])}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: DIM, border: `1px solid ${BORDER}`, color: COLOR }}>
              Next Section <ChevronRight size={14} />
            </button>
          ) : (
            <button onClick={submit} disabled={answered < items.length}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: DIM, border: `1px solid ${BORDER}`, color: COLOR }}>
              Generate Report <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
