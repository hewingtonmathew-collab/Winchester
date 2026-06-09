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
  // Assistive Technology
  { id: "at1", tab: "Assistive Technology", text: "Does the school maintain an up-to-date inventory of assistive technology available to SEND pupils?", weight: 9 },
  { id: "at2", tab: "Assistive Technology", text: "Are assistive technology tools (e.g. screen readers, AAC devices, speech-to-text) matched to individual pupil needs in EHCPs or SEN support plans?", weight: 10 },
  { id: "at3", tab: "Assistive Technology", text: "Is there a trained member of staff responsible for managing and maintaining assistive technology provision?", weight: 8 },
  { id: "at4", tab: "Assistive Technology", text: "Are pupils with SEND supported to develop independence in using their assistive technology?", weight: 8 },

  // EHCP & Digital Access
  { id: "ed1", tab: "EHCP & Digital Access", text: "Do all EHCPs that reference technology include specific, measurable outcomes linked to digital tools?", weight: 10 },
  { id: "ed2", tab: "EHCP & Digital Access", text: "Are digital access needs (hardware, software, internet connectivity) assessed and funded appropriately for SEND pupils?", weight: 9 },
  { id: "ed3", tab: "EHCP & Digital Access", text: "Does the school ensure SEND pupils can access the full curriculum digitally, including remote learning provision?", weight: 9 },
  { id: "ed4", tab: "EHCP & Digital Access", text: "Are SEND pupils included in all digital learning activities with appropriate adaptations in place?", weight: 9 },

  // Staff CPD
  { id: "sc1", tab: "Staff CPD", text: "Have SENCOs and key SEND staff received CPD on using technology to support SEND pupils in the last 2 years?", weight: 9 },
  { id: "sc2", tab: "Staff CPD", text: "Are all teaching and support staff trained in the specific assistive technologies used by pupils in their classes?", weight: 9 },
  { id: "sc3", tab: "Staff CPD", text: "Does CPD include training on digital accessibility standards and how to create accessible learning materials?", weight: 8 },
  { id: "sc4", tab: "Staff CPD", text: "Is there a structured process for sharing effective digital SEND practice across staff teams?", weight: 7 },

  // Parental Involvement
  { id: "pi1", tab: "Parental Involvement", text: "Are parents of SEND pupils informed about and involved in decisions regarding digital tools used to support their child?", weight: 9 },
  { id: "pi2", tab: "Parental Involvement", text: "Does the school provide guidance or training to parents on using assistive technology at home?", weight: 8 },
  { id: "pi3", tab: "Parental Involvement", text: "Are parents signposted to external digital support resources for SEND (e.g. AbilityNet, Inclusive Technology)?", weight: 7 },
  { id: "pi4", tab: "Parental Involvement", text: "Do annual EHCP reviews include a discussion of digital tool effectiveness and any changes needed?", weight: 9 },

  // Monitoring & Outcomes
  { id: "mo1", tab: "Monitoring & Outcomes", text: "Does the school track and review the impact of assistive technology on SEND pupils' attainment and participation?", weight: 9 },
  { id: "mo2", tab: "Monitoring & Outcomes", text: "Are digital access barriers identified and acted upon through the school's SEND improvement planning process?", weight: 9 },
  { id: "mo3", tab: "Monitoring & Outcomes", text: "Does the SENCO report to governors on digital inclusion and SEND technology outcomes at least annually?", weight: 8 },
  { id: "mo4", tab: "Monitoring & Outcomes", text: "Does the school assess its digital SEND provision against external frameworks such as the SEND Code of Practice?", weight: 8 },
];

const TABS = ["Assistive Technology", "EHCP & Digital Access", "Staff CPD", "Parental Involvement", "Monitoring & Outcomes"];

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

const COLOR = "#8B5CF6";
const DIM = "rgba(139,92,246,0.12)";
const BORDER = "rgba(139,92,246,0.25)";

const TAB_COLORS: Record<string, string> = {
  "Assistive Technology": "#8B5CF6",
  "EHCP & Digital Access": "#A78BFA",
  "Staff CPD": "#C4B5FD",
  "Parental Involvement": "#7C3AED",
  "Monitoring & Outcomes": "#6D28D9",
};

export default function SendDigitalChecker() {
  const [meta, setMeta] = useState<ReportMetaData>(defaultMeta);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [step, setStep] = useState<"meta" | "questions">("meta");

  const answered = Object.keys(answers).filter((k) => answers[k] !== null).length;
  const score = calcScore(answers);
  const metaValid = meta.schoolName.trim() && meta.staffMember.trim() && meta.consultantName.trim();

  const rating = score >= 75 ? "Inclusive" : score >= 50 ? "Developing" : "Requires Improvement";
  const ringColor = score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";

  const gaps: Gap[] = items
    .filter((i) => i.weight >= 9 && answers[i.id] !== "yes")
    .map((i) => ({
      category: i.tab,
      text: i.text,
      priority: i.weight >= 9 ? "high" : i.weight >= 7 ? "medium" : "low",
    }));

  function submit() {
    setSubmitted(true);
    const areas = TABS.map((tab) => {
      const ti = items.filter((i) => i.tab === tab);
      const tot = ti.reduce((s, i) => s + i.weight * 2, 0);
      const earn = ti.reduce((s, i) => s + (scoreMap[answers[i.id] ?? "no"] ?? 0) * i.weight, 0);
      return { name: tab, score: tot > 0 ? Math.round((earn / tot) * 100) : 0 };
    });
    saveSubmission({ tool: "SEND Digital Impact Review", ...meta, score, rating, ratingColor: ringColor, areas });
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
                {score >= 75 ? "The school demonstrates inclusive practice in its use of digital tools to support SEND pupils." : score >= 50 ? "Some positive provision is in place but key areas need further development." : "Significant gaps in digital SEND provision — improvement is required."}
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

        <Certificate meta={meta} toolName="SEND Digital Impact Review" score={score} rating={rating} ratingColor={ringColor} accentColor={COLOR} areas={TABS.map((tab) => {
          const ti = items.filter((i) => i.tab === tab);
          const tot = ti.reduce((s, i) => s + i.weight * 2, 0);
          const earn = ti.reduce((s, i) => s + (scoreMap[answers[i.id] ?? "no"] ?? 0) * i.weight, 0);
          return { name: tab, score: tot > 0 ? Math.round((earn / tot) * 100) : 0 };
        })} />
        {gaps.length > 0 && (
          <ImprovementReport meta={meta} toolName="SEND Digital Impact Review" score={score} rating={rating} ratingColor={ringColor} gaps={gaps} accentColor={COLOR} accentDim={DIM} accentBorder={BORDER} />
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
        <p className="text-[#64748B] text-xs mb-5">Rate each area based on your current provision.</p>
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
