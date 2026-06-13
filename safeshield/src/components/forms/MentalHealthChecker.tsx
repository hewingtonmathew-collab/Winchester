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
  // Leadership & Strategy
  { id: "ls1", tab: "Leadership & Strategy", text: "Has a Senior Mental Health Lead (SMHL) been appointed and have they completed, or been funded to complete, the DfE-approved senior mental health lead training?", weight: 10 },
  { id: "ls2", tab: "Leadership & Strategy", text: "Does the school have a published whole-school approach to mental health and wellbeing strategy, aligned with DfE guidance?", weight: 9 },
  { id: "ls3", tab: "Leadership & Strategy", text: "Does the governing board receive a termly update on pupil and staff mental health and wellbeing, including data on referrals and support provided?", weight: 8 },
  { id: "ls4", tab: "Leadership & Strategy", text: "Is mental health and wellbeing included as a priority in the School Improvement Plan or Development Plan, with measurable targets?", weight: 8 },
  { id: "ls5", tab: "Leadership & Strategy", text: "Is the whole-school mental health strategy reviewed annually, with stakeholder input from pupils, parents, and staff?", weight: 8 },
  { id: "ls6", tab: "Leadership & Strategy", text: "Is there a named senior leader who champions staff wellbeing, with wellbeing outcomes included in performance management and strategic planning?", weight: 8 },

  // Staff Wellbeing
  { id: "sw1", tab: "Staff Wellbeing", text: "Is there a staff wellbeing policy that sets out specific commitments to protect workload, working hours, and the wellbeing of all employees?", weight: 9 },
  { id: "sw2", tab: "Staff Wellbeing", text: "Has a formal workload review been carried out in the last 12 months, with findings acted upon and outcomes shared with staff?", weight: 9 },
  { id: "sw3", tab: "Staff Wellbeing", text: "Is an Employee Assistance Programme (EAP) or equivalent confidential counselling support available to all staff?", weight: 10 },
  { id: "sw4", tab: "Staff Wellbeing", text: "Has a staff wellbeing survey been conducted in the last 12 months, with results analysed and a response plan published?", weight: 8 },
  { id: "sw5", tab: "Staff Wellbeing", text: "Are line managers trained in how to have mental health conversations, recognise distress, and signpost staff to appropriate support?", weight: 9 },
  { id: "sw6", tab: "Staff Wellbeing", text: "Are flexible working requests considered fairly and is there a culture where staff feel able to raise workload or wellbeing concerns?", weight: 7 },

  // Pupil Support Systems
  { id: "ps1", tab: "Pupil Support Systems", text: "Are pupils' social, emotional and mental health (SEMH) needs identified through the SEND process and addressed in the SEND register and EHCP where appropriate?", weight: 10 },
  { id: "ps2", tab: "Pupil Support Systems", text: "Is there a tiered support framework (universal, targeted, specialist) for pupils with mental health needs, with clear referral criteria at each level?", weight: 9 },
  { id: "ps3", tab: "Pupil Support Systems", text: "Is the CAMHS referral pathway understood by the SMHL, DSL, and relevant pastoral leads — and is there a process for tracking referrals?", weight: 10 },
  { id: "ps4", tab: "Pupil Support Systems", text: "Is there at least one trained mental health first aider or mental health lead for pupils, able to provide first-line support and signposting?", weight: 9 },
  { id: "ps5", tab: "Pupil Support Systems", text: "Is there a peer support programme or pupil wellbeing ambassador scheme that promotes positive mental health among the pupil community?", weight: 7 },

  // Curriculum & PSHE
  { id: "cp1", tab: "Curriculum & PSHE", text: "Is mental health explicitly and age-appropriately addressed within the PSHE curriculum at every key stage?", weight: 9 },
  { id: "cp2", tab: "Curriculum & PSHE", text: "Does the RSE/PSHE programme address emotional wellbeing, healthy relationships, managing stress, and seeking help?", weight: 8 },
  { id: "cp3", tab: "Curriculum & PSHE", text: "Are resilience, coping strategies, and emotional literacy skills taught across the curriculum and in form/tutor time?", weight: 8 },
  { id: "cp4", tab: "Curriculum & PSHE", text: "Does the school actively work to reduce stigma around mental health through assemblies, awareness weeks, and visible promotion of support?", weight: 8 },
  { id: "cp5", tab: "Curriculum & PSHE", text: "Is pupil voice gathered regularly on wellbeing and mental health, with outcomes fed into curriculum and pastoral planning?", weight: 7 },

  // Early Identification
  { id: "ei1", tab: "Early Identification", text: "Does the pastoral system — including form tutors, Heads of Year, and mentors — have a process to flag concerns about pupil mental health early?", weight: 9 },
  { id: "ei2", tab: "Early Identification", text: "Are form tutors and Heads of Year trained to recognise early indicators of poor mental health or emotional distress in pupils?", weight: 9 },
  { id: "ei3", tab: "Early Identification", text: "Are pupil wellbeing questionnaires or check-ins used routinely to identify pupils who may be struggling?", weight: 8 },
  { id: "ei4", tab: "Early Identification", text: "Is attendance and behaviour data regularly reviewed to identify pupils whose patterns may indicate underlying SEMH needs?", weight: 8 },
  { id: "ei5", tab: "Early Identification", text: "Are parents and carers given clear guidance on how to raise mental health concerns about their child and how the school will respond?", weight: 8 },

  // External Partnerships
  { id: "ep1", tab: "External Partnerships", text: "Does the school have an active working relationship with CAMHS or the local Mental Health Support Team (MHST), if one operates in the area?", weight: 10 },
  { id: "ep2", tab: "External Partnerships", text: "Are referral pathways to voluntary sector and community mental health organisations known and used where appropriate?", weight: 8 },
  { id: "ep3", tab: "External Partnerships", text: "Is there a documented crisis pathway for pupils experiencing acute mental health difficulties, including out-of-hours support contacts?", weight: 9 },
  { id: "ep4", tab: "External Partnerships", text: "Does the school participate in local multi-agency arrangements for children with complex SEMH needs?", weight: 7 },
];

const TABS = ["Leadership & Strategy", "Staff Wellbeing", "Pupil Support Systems", "Curriculum & PSHE", "Early Identification", "External Partnerships"];

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

const COLOR = "#F472B6";
const DIM = "rgba(244,114,182,0.12)";
const BORDER = "rgba(244,114,182,0.25)";

const TAB_COLORS: Record<string, string> = {
  "Leadership & Strategy": "#F472B6",
  "Staff Wellbeing": "#A78BFA",
  "Pupil Support Systems": "#38BDF8",
  "Curriculum & PSHE": "#34D399",
  "Early Identification": "#FBBF24",
  "External Partnerships": "#FB923C",
};

export default function MentalHealthChecker() {
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
    saveSubmission({ tool: "Mental Health & Wellbeing Audit", ...meta, score, rating, ratingColor: ringColor, areas, gaps, id });
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
                {score >= 80 ? "Strong whole-school approach to mental health — maintain your Senior Mental Health Lead training and CAMHS links." : score >= 60 ? "Good foundations but gaps in staff support, pupil pathways, or early identification need addressing." : score >= 40 ? "Several important wellbeing gaps identified — prioritise the Senior Mental Health Lead appointment and crisis pathway." : "Significant mental health provision gaps — urgent action required to meet DfE and Ofsted expectations."}
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

        <Certificate meta={meta} toolName="Mental Health & Wellbeing Audit" score={score} rating={rating} ratingColor={ringColor} accentColor={COLOR} areas={areas} />
        {gaps.length > 0 && (
          <ImprovementReport meta={meta} toolName="Mental Health & Wellbeing Audit" score={score} rating={rating} ratingColor={ringColor} gaps={gaps} accentColor={COLOR} accentDim={DIM} accentBorder={BORDER} reportId={submissionId ?? undefined} />
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
        <p className="text-[#64748B] text-xs mb-5">Rate each area against your current mental health and wellbeing provision.</p>
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
