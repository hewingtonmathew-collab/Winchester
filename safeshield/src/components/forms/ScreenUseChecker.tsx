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
  // Screen Time Policies
  { id: "sp1", tab: "Screen Time Policies", text: "Does the school have a written screen time and device use policy that has been reviewed within the last 12 months?", weight: 10 },
  { id: "sp2", tab: "Screen Time Policies", text: "Does the policy set clear boundaries for recreational vs educational screen use during the school day?", weight: 9 },
  { id: "sp3", tab: "Screen Time Policies", text: "Are pupils made aware of the policy in age-appropriate ways at the start of each year?", weight: 8 },
  { id: "sp4", tab: "Screen Time Policies", text: "Does the policy address personal device use (phones/tablets) including social media and messaging apps?", weight: 9 },

  // Wellbeing Integration
  { id: "wi1", tab: "Wellbeing Integration", text: "Does the school's PSHE/RSE curriculum include age-appropriate teaching on screen time, digital wellbeing, and online habits?", weight: 10 },
  { id: "wi2", tab: "Wellbeing Integration", text: "Are pupils taught strategies to manage their own screen use and recognise signs of problematic digital behaviour?", weight: 9 },
  { id: "wi3", tab: "Wellbeing Integration", text: "Does the school have a clear process for identifying and supporting pupils who show signs of screen dependency or digital distress?", weight: 9 },
  { id: "wi4", tab: "Wellbeing Integration", text: "Are mental health leads or DSLs trained to recognise screen-related wellbeing concerns?", weight: 8 },

  // Parental Engagement
  { id: "pe1", tab: "Parental Engagement", text: "Does the school provide guidance to parents on recommended screen time limits aligned to age (e.g. WHO/CMO guidelines)?", weight: 8 },
  { id: "pe2", tab: "Parental Engagement", text: "Are parents signposted to resources on managing home screen use, social media, and age-appropriate content filters?", weight: 8 },
  { id: "pe3", tab: "Parental Engagement", text: "Does the school engage parents through workshops, newsletters, or digital safety events on screen and wellbeing topics?", weight: 7 },
  { id: "pe4", tab: "Parental Engagement", text: "Is there a home-school agreement that includes expectations around screen use outside school hours?", weight: 8 },

  // Staff Training
  { id: "st1", tab: "Staff Training", text: "Have all teaching staff received CPD on digital wellbeing, screen use guidance, and identifying at-risk pupils in the last 2 years?", weight: 9 },
  { id: "st2", tab: "Staff Training", text: "Are staff aware of the school's referral process when a pupil's screen use is impacting their learning or mental health?", weight: 9 },
  { id: "st3", tab: "Staff Training", text: "Does the school's staff acceptable use policy address personal device use in classrooms and professional boundaries?", weight: 8 },
  { id: "st4", tab: "Staff Training", text: "Is there a designated lead for digital wellbeing who coordinates training and policy updates?", weight: 8 },

  // Monitoring & Review
  { id: "mr1", tab: "Monitoring & Review", text: "Does the school collect and review data on pupils' self-reported wellbeing related to screen use (e.g. via pupil voice surveys)?", weight: 8 },
  { id: "mr2", tab: "Monitoring & Review", text: "Are screen use and wellbeing outcomes reviewed by governors at least annually?", weight: 8 },
  { id: "mr3", tab: "Monitoring & Review", text: "Does the school benchmark its screen wellbeing provision against local authority or national guidance (e.g. Ukie, RSPH)?", weight: 7 },
  { id: "mr4", tab: "Monitoring & Review", text: "Is there a process to update the screen use policy in response to emerging evidence, new platforms, or safeguarding concerns?", weight: 8 },
];

const TABS = ["Screen Time Policies", "Wellbeing Integration", "Parental Engagement", "Staff Training", "Monitoring & Review"];

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

const COLOR = "#06B6D4";
const DIM = "rgba(6,182,212,0.12)";
const BORDER = "rgba(6,182,212,0.25)";

const TAB_COLORS: Record<string, string> = {
  "Screen Time Policies": "#06B6D4",
  "Wellbeing Integration": "#22d3ee",
  "Parental Engagement": "#67e8f9",
  "Staff Training": "#a5f3fc",
  "Monitoring & Review": "#0e7490",
};

export default function ScreenUseChecker() {
  const [meta, setMeta] = useState<ReportMetaData>(defaultMeta);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [step, setStep] = useState<"meta" | "questions">("meta");

  const answered = Object.keys(answers).filter((k) => answers[k] !== null).length;
  const score = calcScore(answers);
  const metaValid = meta.schoolName.trim() && meta.staffMember.trim() && meta.consultantName.trim();

  const rating = score >= 75 ? "Good Practice" : score >= 50 ? "Developing" : "Requires Review";
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
    saveSubmission({ tool: "Screen Use & Wellbeing Review", ...meta, score, rating, ratingColor: ringColor, areas, gaps });
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
                {score >= 75 ? "The school demonstrates good practice in managing screen use and digital wellbeing." : score >= 50 ? "Some positive steps in place but key areas need further development." : "Significant gaps in screen use and wellbeing provision require urgent attention."}
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

        <Certificate meta={meta} toolName="Screen Use & Wellbeing Review" score={score} rating={rating} ratingColor={ringColor} accentColor={COLOR} areas={TABS.map((tab) => {
          const ti = items.filter((i) => i.tab === tab);
          const tot = ti.reduce((s, i) => s + i.weight * 2, 0);
          const earn = ti.reduce((s, i) => s + (scoreMap[answers[i.id] ?? "no"] ?? 0) * i.weight, 0);
          return { name: tab, score: tot > 0 ? Math.round((earn / tot) * 100) : 0 };
        })} />
        {gaps.length > 0 && (
          <ImprovementReport meta={meta} toolName="Screen Use & Wellbeing Review" score={score} rating={rating} ratingColor={ringColor} gaps={gaps} accentColor={COLOR} accentDim={DIM} accentBorder={BORDER} />
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
