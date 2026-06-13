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
  // Communication
  { id: "co1", tab: "Communication", text: "Does the school send regular, consistent communications to parents and carers — at least fortnightly during term — covering key updates, events, and curriculum?", weight: 8 },
  { id: "co2", tab: "Communication", text: "Are multiple communication channels used (e.g. school app, email, text, newsletter, website) to maximise reach and accessibility?", weight: 8 },
  { id: "co3", tab: "Communication", text: "Is the school website kept up to date with required statutory information and easy to navigate for parents seeking key documents?", weight: 8 },
  { id: "co4", tab: "Communication", text: "Is translation or interpretation support available for families where English is not the first language, including for key letters and meetings?", weight: 9 },
  { id: "co5", tab: "Communication", text: "Is a formal complaints procedure published, accessible, and followed in practice — with complaints acknowledged within the timescales set out?", weight: 9 },
  { id: "co6", tab: "Communication", text: "Is there a published response-time standard for parent communications, and is it adhered to by staff?", weight: 7 },

  // Safeguarding Communication
  { id: "sc1", tab: "Safeguarding Communication", text: "Is the child protection and safeguarding policy made available to parents and carers at least annually, including how to report concerns?", weight: 10 },
  { id: "sc2", tab: "Safeguarding Communication", text: "Do parents and carers know how to contact the DSL and how to raise a safeguarding concern about their child or another child?", weight: 10 },
  { id: "sc3", tab: "Safeguarding Communication", text: "Does the school provide parents with guidance on online safety — including age-appropriate content, screen time, and social media risks?", weight: 9 },
  { id: "sc4", tab: "Safeguarding Communication", text: "Are parental consent processes clear and documented — particularly for photography, trips, medical treatment, and data sharing?", weight: 9 },
  { id: "sc5", tab: "Safeguarding Communication", text: "Where relevant, is information on Contextual Safeguarding or local risks (e.g. exploitation, gangs) shared with parents in an accessible way?", weight: 7 },

  // Involvement in Learning
  { id: "il1", tab: "Involvement in Learning", text: "Are parents' evenings or progress review meetings held at least twice per year, with attendance monitored and follow-up for non-attenders?", weight: 9 },
  { id: "il2", tab: "Involvement in Learning", text: "Is guidance provided to parents on how to support reading, literacy, and numeracy at home — including resources or workshops?", weight: 8 },
  { id: "il3", tab: "Involvement in Learning", text: "Is clear, jargon-free pupil progress data shared with parents in a format they can understand and act upon?", weight: 8 },
  { id: "il4", tab: "Involvement in Learning", text: "Are curriculum events — such as open mornings, learning showcases, and phonics meetings — offered to give parents insight into school life?", weight: 7 },
  { id: "il5", tab: "Involvement in Learning", text: "Are parents involved in reviewing homework expectations and any changes to the curriculum or how subjects are taught?", weight: 6 },

  // Hard-to-Reach Families
  { id: "hr1", tab: "Hard-to-Reach Families", text: "Does the school have a documented strategy for engaging families who are difficult to reach — including persistent non-attendees at events and meetings?", weight: 9 },
  { id: "hr2", tab: "Hard-to-Reach Families", text: "Is a home visit policy in place, with trained staff able to conduct welfare or engagement visits to families of concern?", weight: 8 },
  { id: "hr3", tab: "Hard-to-Reach Families", text: "Are early help pathways and family support services signposted to parents — including for housing, benefits, domestic abuse, and mental health?", weight: 9 },
  { id: "hr4", tab: "Hard-to-Reach Families", text: "Is the attendance escalation process transparent to parents, with clear written communication at each stage before legal action is considered?", weight: 8 },
  { id: "hr5", tab: "Hard-to-Reach Families", text: "Are families eligible for free school meals (FSM) actively identified and supported to apply, with information provided sensitively?", weight: 8 },

  // Governance & Parental Voice
  { id: "gv1", tab: "Governance & Parental Voice", text: "Are parent governor(s) elected and in post, with a clear role in representing the parental community to the governing board?", weight: 10 },
  { id: "gv2", tab: "Governance & Parental Voice", text: "Is there a parent forum, parent council, or equivalent structure that meets regularly and feeds into school development?", weight: 8 },
  { id: "gv3", tab: "Governance & Parental Voice", text: "Is an annual parent satisfaction survey conducted, with results analysed, shared with governors, and acted upon?", weight: 9 },
  { id: "gv4", tab: "Governance & Parental Voice", text: "Are parents consulted on key policies — such as behaviour, uniform, homework, and the SEN information report — before they are adopted or reviewed?", weight: 8 },

  // SEND & Inclusion
  { id: "se1", tab: "SEND & Inclusion", text: "Are parents and carers of pupils with EHCPs fully involved in Annual Review meetings, with sufficient notice and accessible documentation?", weight: 10 },
  { id: "se2", tab: "SEND & Inclusion", text: "Is the SEND information report published on the school website and reviewed annually, including details of how parents can access support?", weight: 10 },
  { id: "se3", tab: "SEND & Inclusion", text: "Are parents of pupils with SEND signposted to SENDIASS (Special Educational Needs and Disability Information Advice and Support Service)?", weight: 9 },
  { id: "se4", tab: "SEND & Inclusion", text: "Is transition support — from primary to secondary, or from school to further education — planned with full parental involvement for pupils with SEND?", weight: 8 },
  { id: "se5", tab: "SEND & Inclusion", text: "Is the process for requesting an EHC needs assessment clearly explained to parents, including how to request one themselves?", weight: 8 },
];

const TABS = ["Communication", "Safeguarding Communication", "Involvement in Learning", "Hard-to-Reach Families", "Governance & Parental Voice", "SEND & Inclusion"];

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

const COLOR = "#A78BFA";
const DIM = "rgba(167,139,250,0.12)";
const BORDER = "rgba(167,139,250,0.25)";

const TAB_COLORS: Record<string, string> = {
  "Communication": "#A78BFA",
  "Safeguarding Communication": "#F87171",
  "Involvement in Learning": "#34D399",
  "Hard-to-Reach Families": "#FBBF24",
  "Governance & Parental Voice": "#38BDF8",
  "SEND & Inclusion": "#FB923C",
};

export default function ParentalEngagementChecker() {
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
    saveSubmission({ tool: "Parental Engagement Tracker", ...meta, score, rating, ratingColor: ringColor, areas, gaps, id });
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
                {score >= 80 ? "Strong parental engagement across the school — maintain your communication channels and parental voice structures." : score >= 60 ? "Good engagement in many areas but gaps in hard-to-reach families, SEND communication, or parental voice need addressing." : score >= 40 ? "Several important engagement gaps identified — prioritise safeguarding communication and SEND parental involvement." : "Significant weaknesses in parental engagement — Ofsted may identify this as a concern. Immediate action needed."}
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

        <Certificate meta={meta} toolName="Parental Engagement Tracker" score={score} rating={rating} ratingColor={ringColor} accentColor={COLOR} areas={areas} />
        {gaps.length > 0 && (
          <ImprovementReport meta={meta} toolName="Parental Engagement Tracker" score={score} rating={rating} ratingColor={ringColor} gaps={gaps} accentColor={COLOR} accentDim={DIM} accentBorder={BORDER} reportId={submissionId ?? undefined} />
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
        <p className="text-[#64748B] text-xs mb-5">Rate each area against your current parental engagement practice.</p>
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
