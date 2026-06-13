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
  // Leadership & Policy
  { id: "lp1", tab: "Leadership & Policy", text: "Has a named Prevent lead been designated (usually the DSL or a deputy) with clear responsibility for Prevent duty compliance?", weight: 10 },
  { id: "lp2", tab: "Leadership & Policy", text: "Has a Prevent risk assessment been completed, reflecting the local threat picture and specific vulnerabilities in the school context?", weight: 10 },
  { id: "lp3", tab: "Leadership & Policy", text: "Is Prevent explicitly embedded in the school's safeguarding and child protection policy and reviewed annually?", weight: 9 },
  { id: "lp4", tab: "Leadership & Policy", text: "Does the governing board receive a Prevent update at least annually and actively exercise oversight of the school's Prevent duty?", weight: 9 },
  { id: "lp5", tab: "Leadership & Policy", text: "Has the school completed the Counter Terrorism Local Profile (CTLP) consultation with the local Prevent coordinator to understand local risks?", weight: 8 },

  // Staff Training
  { id: "st1", tab: "Staff Training", text: "Have all staff received Prevent awareness training appropriate to their role — including the free DfE/Home Office online Prevent awareness course?", weight: 10 },
  { id: "st2", tab: "Staff Training", text: "Has the Designated Safeguarding Lead (DSL) completed WRAP (Workshop to Raise Awareness of Prevent) or an equivalent Level 3 Prevent training?", weight: 10 },
  { id: "st3", tab: "Staff Training", text: "Have governors and trustees received Prevent awareness training equipping them to discharge their statutory oversight role?", weight: 9 },
  { id: "st4", tab: "Staff Training", text: "Are training records for Prevent maintained, with refresher training scheduled at least every three years or when guidance changes?", weight: 8 },
  { id: "st5", tab: "Staff Training", text: "Is Prevent awareness included in the induction programme for all new staff, including supply staff and contractors who work regularly with pupils?", weight: 9 },

  // Curriculum & SMSC
  { id: "cs1", tab: "Curriculum & SMSC", text: "Are fundamental British values (democracy, rule of law, individual liberty, mutual respect and tolerance) explicitly and meaningfully taught across the curriculum?", weight: 10 },
  { id: "cs2", tab: "Curriculum & SMSC", text: "Are pupils given opportunities to develop critical thinking skills that help them evaluate and challenge extremist narratives?", weight: 9 },
  { id: "cs3", tab: "Curriculum & SMSC", text: "Is media literacy — including how to evaluate online sources and recognise propaganda — addressed within the curriculum?", weight: 8 },
  { id: "cs4", tab: "Curriculum & SMSC", text: "Does the online safety curriculum explicitly address radicalisation, extremist content online, and grooming into extremist groups?", weight: 9 },
  { id: "cs5", tab: "Curriculum & SMSC", text: "Is there a clear SMSC (Spiritual, Moral, Social and Cultural) education mapping that evidences how the school promotes shared values?", weight: 8 },

  // Pupil Support & Referral
  { id: "ps1", tab: "Pupil Support & Referral", text: "Do staff know the process for making a Prevent referral via the local Channel programme, and have they been briefed on what to look for?", weight: 10 },
  { id: "ps2", tab: "Pupil Support & Referral", text: "Is there a documented pathway for early help and support for pupils who may be vulnerable to radicalisation, before a Channel referral is needed?", weight: 9 },
  { id: "ps3", tab: "Pupil Support & Referral", text: "Does the school's pastoral system facilitate early identification of pupils showing signs of vulnerability to extremist influence?", weight: 9 },
  { id: "ps4", tab: "Pupil Support & Referral", text: "Is mental health support accessible for pupils who may be isolated, marginalised, or vulnerable to exploitation — including radicalisation?", weight: 8 },
  { id: "ps5", tab: "Pupil Support & Referral", text: "Is there a clear escalation process from pastoral concern to DSL Prevent referral, and are staff confident using it without fear of over-reporting?", weight: 9 },

  // Online Safety
  { id: "os1", tab: "Online Safety", text: "Does the internet filtering system block extremist, terrorist, and radicalisation content in line with the Prevent duty and UKCIS guidance?", weight: 10 },
  { id: "os2", tab: "Online Safety", text: "Is monitoring of school internet use in place to identify searches related to extremism, and is there a response pathway for concerning activity?", weight: 9 },
  { id: "os3", tab: "Online Safety", text: "Are staff trained to recognise online radicalisation warning signs and know how to respond if a pupil discloses concern about online extremist content?", weight: 9 },
  { id: "os4", tab: "Online Safety", text: "Does the online safety curriculum (for pupils) include specific, age-appropriate content on recognising and reporting online radicalisation?", weight: 8 },

  // Partnership & Reporting
  { id: "pr1", tab: "Partnership & Reporting", text: "Does the school maintain an active working relationship with the local authority Prevent coordinator and receive regular updates on local risks?", weight: 9 },
  { id: "pr2", tab: "Partnership & Reporting", text: "Is there a record of any Channel referrals made, and is this information shared appropriately within safeguarding documentation?", weight: 10 },
  { id: "pr3", tab: "Partnership & Reporting", text: "Does the school participate in relevant local partnership structures — such as the Community Safety Partnership (CSP) — or receive intelligence from them?", weight: 7 },
  { id: "pr4", tab: "Partnership & Reporting", text: "Does the school complete an annual Prevent self-assessment and share it with the local authority if required?", weight: 8 },
];

const TABS = ["Leadership & Policy", "Staff Training", "Curriculum & SMSC", "Pupil Support & Referral", "Online Safety", "Partnership & Reporting"];

const defaultMeta: ReportMetaData = {
  schoolName: "", schoolEmail: "", consultantName: "", consultantEmail: "", staffMember: "", logoDataUrl: null,
};

const LEVELS: { value: Answer; label: string; color: string; bg: string }[] = [
  { value: "yes", label: "Yes — Compliant", color: "text-green-400", bg: "bg-green-500/15 border-green-500/30" },
  { value: "partial", label: "Partially Compliant", color: "text-amber-400", bg: "bg-amber-500/15 border-amber-500/30" },
  { value: "no", label: "Not Compliant", color: "text-red-400", bg: "bg-red-500/15 border-red-500/30" },
];

const scoreMap: Record<NonNullable<Answer>, number> = { yes: 2, partial: 1, no: 0 };

function calcScore(answers: Record<string, Answer>): number {
  const total = items.reduce((s, i) => s + i.weight * 2, 0);
  const earned = items.reduce((s, i) => s + (scoreMap[answers[i.id] ?? "no"] ?? 0) * i.weight, 0);
  return Math.round((earned / total) * 100);
}

const COLOR = "#FBBF24";
const DIM = "rgba(251,191,36,0.12)";
const BORDER = "rgba(251,191,36,0.25)";

const TAB_COLORS: Record<string, string> = {
  "Leadership & Policy": "#FBBF24",
  "Staff Training": "#FB923C",
  "Curriculum & SMSC": "#34D399",
  "Pupil Support & Referral": "#38BDF8",
  "Online Safety": "#F87171",
  "Partnership & Reporting": "#A78BFA",
};

export default function PreventChecker() {
  const [meta, setMeta] = useState<ReportMetaData>(defaultMeta);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [step, setStep] = useState<"meta" | "questions">("meta");

  const answered = Object.keys(answers).filter((k) => answers[k] !== null).length;
  const score = calcScore(answers);
  const metaValid = meta.schoolName.trim() && meta.staffMember.trim() && meta.consultantName.trim();

  const rating = score >= 80 ? "Broadly Compliant" : score >= 60 ? "Mostly Compliant" : score >= 40 ? "Requires Improvement" : "Significant Risks";
  const ringColor = score >= 80 ? "#22c55e" : score >= 60 ? "#38BDF8" : score >= 40 ? "#f59e0b" : "#ef4444";

  const gaps: Gap[] = items
    .filter((i) => answers[i.id] === "no" || answers[i.id] === "partial")
    .map((i) => ({
      category: i.tab,
      text: i.text,
      priority: answers[i.id] === "no" && i.weight >= 9 ? "high" : answers[i.id] === "no" ? "medium" : "low",
    }));

  const areas = TABS.map(tab => {
    const ti = items.filter(i => i.tab === tab);
    const tot = ti.reduce((s, i) => s + i.weight * 2, 0);
    const earn = ti.reduce((s, i) => s + (scoreMap[answers[i.id] ?? "no"] ?? 0) * i.weight, 0);
    return { name: tab, score: tot > 0 ? Math.round((earn / tot) * 100) : 0 };
  });

  function submit() {
    const id = crypto.randomUUID();
    setSubmissionId(id);
    setSubmitted(true);
    saveSubmission({ tool: "Prevent & Radicalisation Self-Assessment", ...meta, score, rating, ratingColor: ringColor, areas, gaps, id });
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
                {score >= 80 ? "Strong Prevent duty compliance — maintain staff training and keep the risk assessment updated." : score >= 60 ? "Good foundations but gaps in training, referral pathways or curriculum content need addressing." : score >= 40 ? "Several key Prevent duty requirements need urgent attention — prioritise DSL training and Channel referral awareness." : "Significant gaps in Prevent duty compliance identified — immediate leadership action required."}
              </p>
            </div>
          </div>
        </GlassCard>

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

        <Certificate meta={meta} toolName="Prevent & Radicalisation Self-Assessment" score={score} rating={rating} ratingColor={ringColor} accentColor={COLOR} areas={areas} />
        {gaps.length > 0 && (
          <ImprovementReport meta={meta} toolName="Prevent & Radicalisation Self-Assessment" score={score} rating={rating} ratingColor={ringColor} gaps={gaps} accentColor={COLOR} accentDim={DIM} accentBorder={BORDER} reportId={submissionId ?? undefined} />
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

      <GlassCard>
        <h3 className="text-white font-semibold text-sm mb-1 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: TAB_COLORS[activeTab] }} />
          {activeTab}
        </h3>
        <p className="text-[#64748B] text-xs mb-5">Rate each area based on your current Prevent duty compliance.</p>
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

      <div className="flex items-center justify-between">
        <span className="text-xs text-[#475569]">{answered} of {items.length} questions answered</span>
        <div className="flex gap-2">
          {TABS.indexOf(activeTab) < TABS.length - 1 ? (
            <button onClick={() => setActiveTab(TABS[TABS.indexOf(activeTab) + 1])}
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
