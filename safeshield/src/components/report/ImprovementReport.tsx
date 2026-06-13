"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Mail, Printer, ChevronDown, ChevronUp, Sparkles, Sun, Moon, Save, Check, Download, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { ReportMetaData } from "./ReportMeta";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import GUIDANCE_LINKS from "@/lib/guidanceLinks";

function generateRecommendations(
  toolName: string,
  schoolName: string,
  score: number,
  rating: string,
  gaps: Gap[]
): string {
  const high = gaps.filter((g) => g.priority === "high");
  const med = gaps.filter((g) => g.priority === "medium");
  const low = gaps.filter((g) => g.priority === "low");
  const cats = [...new Set(gaps.map((g) => g.category))];

  const urgency = score < 45 ? "significant and urgent" : score < 70 ? "moderate" : "minor";
  const timeframe = score < 45 ? "within the next 30 days" : score < 70 ? "within the next term" : "within the next 6 months";

  let text = `Following the completion of the ${toolName} for ${schoolName || "this school"}, the assessment returned a score of ${score}% (${rating}). `;
  text += `${gaps.length} area${gaps.length !== 1 ? "s" : ""} for improvement ${gaps.length !== 1 ? "have" : "has"} been identified, representing ${urgency} gaps in current provision.\n\n`;

  if (high.length > 0) {
    text += `IMMEDIATE ACTIONS (${high.length} High Priority)\n`;
    text += `The following areas require attention ${timeframe}:\n`;
    high.forEach((g) => {
      text += `• ${g.category}: ${g.text}\n`;
      const links = GUIDANCE_LINKS[g.category];
      if (links?.length) {
        links.forEach((l) => { text += `  → ${l.label}: ${l.url}\n`; });
      }
    });
    text += "\n";
  }

  if (med.length > 0) {
    text += `MEDIUM-TERM IMPROVEMENTS (${med.length} Medium Priority)\n`;
    med.forEach((g) => {
      text += `• ${g.category}: ${g.text}\n`;
      const links = GUIDANCE_LINKS[g.category];
      if (links?.length) {
        links.forEach((l) => { text += `  → ${l.label}: ${l.url}\n`; });
      }
    });
    text += "\n";
  }

  if (low.length > 0) {
    text += `ONGOING IMPROVEMENTS (${low.length} Lower Priority)\n`;
    low.forEach((g) => {
      text += `• ${g.category}: ${g.text}\n`;
    });
    text += "\n";
  }

  const uniqueLinks = cats
    .flatMap((c) => GUIDANCE_LINKS[c] ?? [])
    .filter((v, i, a) => a.findIndex((x) => x.url === v.url) === i)
    .slice(0, 6);

  if (uniqueLinks.length > 0) {
    text += `KEY GUIDANCE & RESOURCES\n`;
    uniqueLinks.forEach((l) => { text += `• ${l.label}: ${l.url}\n`; });
    text += "\n";
  }

  text += `RECOMMENDED NEXT STEPS\n`;
  text += `1. Share this report with the senior leadership team and governing board.\n`;
  text += `2. Assign a named lead for each high-priority action with a clear deadline.\n`;
  text += `3. Schedule a follow-up review in ${score < 55 ? "6-8 weeks" : "one term"} to assess progress.\n`;
  text += `4. Contact your SafeShield consultant for targeted support on any of the above areas.`;

  return text;
}

export type Gap = {
  category: string;
  text: string;
  priority: "high" | "medium" | "low";
};

type Props = {
  meta: ReportMetaData;
  toolName: string;
  score: number;
  rating: string;
  ratingColor: string;
  gaps: Gap[];
  accentColor?: string;
  accentDim?: string;
  accentBorder?: string;
  reportId?: string;
};

function priorityLabel(p: Gap["priority"]) {
  if (p === "high") return { label: "High Priority", bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" };
  if (p === "medium") return { label: "Medium Priority", bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" };
  return { label: "Lower Priority", bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/20" };
}

export default function ImprovementReport({
  meta,
  toolName,
  score,
  rating,
  ratingColor,
  gaps,
  accentColor = "#38BDF8",
  accentDim = "rgba(56,189,248,0.12)",
  accentBorder = "rgba(56,189,248,0.25)",
  reportId,
}: Props) {
  const [consultantNotes, setConsultantNotes] = useState("");
  const [expanded, setExpanded] = useState(true);
  const [printMode, setPrintMode] = useState<"dark" | "light">("dark");
  const [emailSending, setEmailSending] = useState(false);
  const [notesSaving, setNotesSaving] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [previousScore, setPreviousScore] = useState<number | null>(null);
  const [schoolLogoUrl, setSchoolLogoUrl] = useState<string | null>(null);
  const [orgLogoUrl, setOrgLogoUrl] = useState<string | null>(null);
  const { enabledTools, user } = useAuth();
  const isSuperAdmin = enabledTools.includes("*");

  useEffect(() => {
    if (!user) return;
    supabase.from("org_members").select("org_id, school_id").eq("user_id", user.id).maybeSingle().then(({ data: membership }) => {
      if (!membership) return;
      if (membership.org_id) {
        supabase.from("organisations").select("logo_url").eq("id", membership.org_id).single().then(({ data: org }) => {
          if (org?.logo_url) setOrgLogoUrl(org.logo_url);
        });
      }
      if (membership.school_id) {
        supabase.from("schools").select("logo_url").eq("id", membership.school_id).single().then(({ data: school }) => {
          if (school?.logo_url) setSchoolLogoUrl(school.logo_url);
        });
      }
    });
  }, [user]);

  // Load previous score for this tool from reports table
  useEffect(() => {
    if (!user || !toolName) return;
    supabase
      .from("reports")
      .select("score, created_at")
      .eq("tool_name", toolName)
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (data && data.length >= 2) {
          // Second most recent = previous run (most recent is the current)
          setPreviousScore(data[1].score);
        }
      });
  }, [user, toolName]);

  // Load saved notes for this report
  useEffect(() => {
    if (!reportId) return;
    const key = `report_notes_${reportId}`;
    supabase.from("site_content").select("value").eq("key", key).maybeSingle().then(({ data }) => {
      if (data?.value) { setConsultantNotes(data.value); return; }
      const stored = localStorage.getItem(key);
      if (stored) setConsultantNotes(stored);
    });
  }, [reportId]);

  const saveNotes = useCallback(async () => {
    if (!reportId) return;
    setNotesSaving(true);
    const key = `report_notes_${reportId}`;
    localStorage.setItem(key, consultantNotes);
    try {
      await supabase.from("site_content").upsert(
        { key, value: consultantNotes, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );
    } catch { /* graceful fallback */ }
    setNotesSaving(false);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2500);
  }, [reportId, consultantNotes]);

  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const displaySchoolLogo = meta.logoDataUrl || schoolLogoUrl;
  const displayOrgLogo = orgLogoUrl && orgLogoUrl !== displaySchoolLogo ? orgLogoUrl : null;

  const highGaps = gaps.filter((g) => g.priority === "high");
  const medGaps = gaps.filter((g) => g.priority === "medium");
  const lowGaps = gaps.filter((g) => g.priority === "low");

  const categories = [...new Set(gaps.map((g) => g.category))];

  function downloadActionPlan() {
    const ownerMap: Record<string, string> = {
      "Safeguarding": "Designated Safeguarding Lead (DSL)",
      "Online Safety": "DSL / IT Lead",
      "Data Protection": "Data Protection Officer (DPO)",
      "Data Privacy": "Data Protection Officer (DPO)",
      "GDPR": "Data Protection Officer (DPO)",
      "Governance": "Headteacher / Governors",
      "Leadership": "Headteacher / Governors",
      "Finance": "Business Manager",
      "SEND": "SENCO",
      "Curriculum": "Deputy Head / Curriculum Lead",
      "Teaching": "Deputy Head / Curriculum Lead",
      "Health": "Site Manager / H&S Lead",
      "Safety": "Site Manager / H&S Lead",
      "Infrastructure": "IT Manager",
      "Digital": "IT Lead / Digital Champion",
      "Accessibility": "Web Manager / IT Lead",
      "AI": "Headteacher / Curriculum Lead",
    };
    const timeframeMap: Record<Gap["priority"], string> = {
      high: "Within 30 days",
      medium: "Within 1 term",
      low: "Within 6 months",
    };
    const guessOwner = (category: string) => {
      for (const key of Object.keys(ownerMap)) {
        if (category.toLowerCase().includes(key.toLowerCase())) return ownerMap[key];
      }
      return "Headteacher";
    };

    const rows = [
      ["Priority", "Category", "Action Required", "Suggested Owner", "Target Timeframe", "Status"],
      ...gaps.map(g => [
        g.priority === "high" ? "HIGH" : g.priority === "medium" ? "MEDIUM" : "LOW",
        g.category,
        g.text.replace(/"/g, '""'),
        guessOwner(g.category),
        timeframeMap[g.priority],
        "Not Started",
      ]),
    ];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${toolName.replace(/\s+/g, "_")}_Action_Plan_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

async function handleEmail() {
    const recipients = [meta.schoolEmail, meta.consultantEmail].filter(Boolean) as string[];
    if (recipients.length === 0) {
      alert("No email addresses on file. Add a school or consultant email first.");
      return;
    }
    setEmailSending(true);
    try {
      const res = await fetch("/api/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipients,
          subject: `${toolName} Improvement Report — ${meta.schoolName}`,
          html: buildHtml(false),
          type: "report",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Send failed");
      alert(`Report emailed to ${recipients.join(", ")}`);
    } catch (err: unknown) {
      alert(`Failed to send: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setEmailSending(false);
    }
  }

  function handlePrintRecommendations() {
    if (!consultantNotes.trim()) return;
    const w = window.open("", "_blank");
    if (!w) return;
    const dark = printMode === "dark";
    const bg = dark ? "linear-gradient(160deg,#060A12 0%,#0C0A1C 60%,rgba(56,189,248,0.08) 100%)" : "#fff";
    const textColor = dark ? "rgba(255,255,255,0.9)" : "#1E293B";
    const mutedColor = dark ? "rgba(255,255,255,0.5)" : "#64748B";
    const panelBg = dark ? "rgba(255,255,255,0.05)" : "#F8FAFC";
    const panelBorder = dark ? "rgba(255,255,255,0.10)" : "#E2E8F0";
    const footerColor = dark ? "rgba(255,255,255,0.25)" : "#94A3B8";

    // Format the plain text into paragraphs/sections
    const formatted = consultantNotes
      .split("\n")
      .map(line => {
        if (!line.trim()) return `<div style="height:8px"></div>`;
        if (/^[A-Z][A-Z\s&()]+$/.test(line.trim()) && line.trim().length < 80) {
          return `<p style="font-size:9px;font-weight:800;color:${accentColor};letter-spacing:0.18em;text-transform:uppercase;margin:16px 0 6px;padding-bottom:4px;border-bottom:1px solid ${accentColor}40">${line.trim()}</p>`;
        }
        if (line.trim().startsWith("•") || line.trim().startsWith("-")) {
          return `<div style="display:flex;gap:8px;margin-bottom:4px"><span style="color:${accentColor};flex-shrink:0">•</span><span style="font-size:12px;color:${textColor};line-height:1.6">${line.trim().replace(/^[•\-]\s*/, "")}</span></div>`;
        }
        if (/^\d+\./.test(line.trim())) {
          const num = line.trim().match(/^(\d+)\./)?.[1];
          const text = line.trim().replace(/^\d+\.\s*/, "");
          return `<div style="display:flex;gap:8px;margin-bottom:4px;align-items:flex-start"><span style="flex-shrink:0;width:18px;height:18px;border-radius:50%;background:${accentColor};display:inline-flex;align-items:center;justify-content:center;font-size:8px;font-weight:800;color:#000">${num}</span><span style="font-size:12px;color:${textColor};line-height:1.6">${text}</span></div>`;
        }
        if (line.trim().startsWith("→")) {
          return `<div style="margin-left:16px;margin-bottom:3px;font-size:11px;color:${mutedColor};line-height:1.5">${line.trim()}</div>`;
        }
        return `<p style="font-size:12px;color:${textColor};line-height:1.7;margin-bottom:4px">${line.trim()}</p>`;
      })
      .join("");

    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>Recommendations — ${toolName}</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
@page{size:A4 portrait;margin:0}
html,body{width:210mm;min-height:297mm;-webkit-print-color-adjust:exact;print-color-adjust:exact;font-family:system-ui,-apple-system,sans-serif}
.page{width:210mm;min-height:297mm;background:${bg};padding:14mm 16mm 12mm}
.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6mm}
.title-block p:first-child{font-size:9px;font-weight:700;color:${accentColor};letter-spacing:.2em;text-transform:uppercase;margin-bottom:4px}
.title-block p:last-child{font-size:24px;font-weight:700;color:${dark ? "#fff" : "#0F172A"};letter-spacing:-.3px}
.right-block{text-align:right}
.right-block p:first-child{font-size:12px;font-weight:600;color:${dark ? "rgba(255,255,255,0.8)" : "#1E293B"}}
.right-block p:last-child{font-size:9px;color:${mutedColor};text-transform:uppercase;letter-spacing:.1em;margin-top:2px}
.rule{height:2px;border-radius:2px;background:linear-gradient(90deg,${accentColor},rgba(167,139,250,0.5),transparent);margin-bottom:6mm}
.meta{display:grid;grid-template-columns:1fr 1fr;gap:3mm 8mm;padding:4mm 5mm;border-radius:12px;background:${panelBg};border:1px solid ${panelBorder};margin-bottom:6mm}
.meta-field p:first-child{font-size:8px;font-weight:700;color:${mutedColor};text-transform:uppercase;letter-spacing:.12em;margin-bottom:2px}
.meta-field p:last-child{font-size:12px;color:${dark ? "#fff" : "#1E293B"};font-weight:500}
.section-label{font-size:9px;font-weight:800;color:${accentColor};letter-spacing:.18em;text-transform:uppercase;margin-bottom:4mm;padding-bottom:3mm;border-bottom:1px solid ${accentColor}30}
.content{font-size:12px;line-height:1.7}
.footer{display:flex;justify-content:space-between;align-items:center;padding-top:4mm;margin-top:8mm;border-top:1px solid ${dark ? "rgba(255,255,255,0.07)" : "#E2E8F0"}}
.footer span{font-size:8px;color:${footerColor};letter-spacing:.1em;text-transform:uppercase}
</style></head><body>
<div class="page">
  <div class="header">
    <div class="title-block">
      <p>Consultant Recommendations</p>
      <p>${toolName}</p>
    </div>
    <div class="right-block">
      <p>${meta.consultantName || "Mathew Hewington"}</p>
      <p>Education Consultant</p>
    </div>
  </div>
  <div class="rule"></div>
  <div class="meta">
    <div class="meta-field"><p>School / Trust</p><p>${meta.schoolName || "—"}</p></div>
    <div class="meta-field"><p>Score</p><p style="color:${ratingColor};font-weight:700">${score}% — ${rating}</p></div>
    <div class="meta-field"><p>Completed By</p><p>${meta.staffMember || "—"}</p></div>
    <div class="meta-field"><p>Date</p><p>${today}</p></div>
  </div>
  <p class="section-label">Recommendations & Guidance</p>
  <div class="content">${formatted}</div>
  <div class="footer">
    <span>SafeShield · Consultant Recommendations</span>
    <span>${today}</span>
  </div>
</div>
</body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 400);
  }

  function buildHtml(dark: boolean) {
    const pc = (p: string) => p === "high" ? "#ef4444" : p === "medium" ? "#f59e0b" : "#22c55e";
    const pl = (p: string) => p === "high" ? "High Priority" : p === "medium" ? "Medium Priority" : "Lower Priority";

    const catSections = categories.map((cat) => {
      const catGaps = gaps.filter((g) => g.category === cat);
      return `<div class="cat-block">
        <p class="cat-label">${cat}</p>
        ${catGaps.map((g) => `
          <div class="gap-row" style="border-left-color:${pc(g.priority)}">
            <span class="gap-badge" style="color:${pc(g.priority)};border-color:${pc(g.priority)}55;background:${pc(g.priority)}18">${pl(g.priority)}</span>
            <p class="gap-text">${g.text}</p>
          </div>`).join("")}
      </div>`;
    }).join("");

    const css = dark ? `
.page{background:linear-gradient(160deg,#1A1C22 0%,#21242D 60%,#1E2028 100%)}
.report-tag{color:rgba(255,255,255,0.65)}
.report-title{color:#fff}
.report-sub{color:rgba(255,255,255,0.70)}
.consultant-name{color:#fff}
.consultant-role{color:rgba(255,255,255,0.65)}
.accent-rule{background:linear-gradient(90deg,${accentColor},rgba(167,139,250,0.6),transparent)}
.meta-panel{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-top-color:rgba(255,255,255,0.20)}
.meta-field label{color:rgba(255,255,255,0.65)}
.meta-field span{color:#fff}
.section-heading{color:rgba(255,255,255,0.70);border-bottom:1px solid rgba(255,255,255,0.12)}
.summary-panel{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.10);color:rgba(255,255,255,0.85)}
.summary-panel strong{color:#fff}
.cat-label{color:rgba(255,255,255,0.70)}
.gap-row{background:rgba(255,255,255,0.04)}
.gap-text{color:rgba(255,255,255,0.85)}
.notes-panel{background:rgba(251,191,36,0.06);border:1px solid rgba(251,191,36,0.2);color:rgba(255,255,255,0.85)}
.steps-panel{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.09)}
.step-text{color:rgba(255,255,255,0.85)}
.footer{border-top:1px solid rgba(255,255,255,0.12)}
.footer span{color:rgba(255,255,255,0.65)}
` : `
.page{background:#fff}
.report-tag{color:#64748B}
.report-title{color:#0F172A}
.report-sub{color:#64748B}
.consultant-name{color:#1E293B}
.consultant-role{color:#64748B}
.accent-rule{background:linear-gradient(90deg,${accentColor},rgba(167,139,250,0.5),transparent)}
.meta-panel{background:#F8FAFC;border:1px solid #E2E8F0}
.meta-field label{color:#64748B}
.meta-field span{color:#1E293B}
.section-heading{color:#475569;border-bottom:1px solid #E2E8F0}
.summary-panel{background:#F8FAFC;border:1px solid #E2E8F0;color:#334155}
.summary-panel strong{color:#0F172A}
.cat-label{color:#475569}
.gap-row{background:#F8FAFC}
.gap-text{color:#334155}
.notes-panel{background:#FFFBEB;border:1px solid #FDE68A;color:#334155}
.steps-panel{background:#F8FAFC;border:1px solid #E2E8F0}
.step-text{color:#334155}
.footer{border-top:1px solid #E2E8F0}
.footer span{color:#94A3B8}
`;

    return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garant:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
<title>Improvement Report — ${toolName}</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
@page{size:A4 portrait;margin:0}
html,body{width:210mm;-webkit-print-color-adjust:exact;print-color-adjust:exact;font-family:system-ui,-apple-system,sans-serif}
.page{width:210mm;min-height:297mm;padding:12mm 14mm 12mm}
.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8mm}
.report-tag{font-size:9px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;margin-bottom:4px}
.report-title{font-size:32px;font-weight:600;line-height:1.05;font-family:'Cormorant Garant',Georgia,serif;letter-spacing:.01em}
.report-sub{font-size:11px;margin-top:4px}
.header-right{text-align:right}
.wordmark{font-size:12px;letter-spacing:.12em;text-transform:uppercase;line-height:1;margin-bottom:3px}
.wordmark-safe{font-weight:300;color:${dark ? "rgba(255,255,255,0.55)" : "#1E293B"}}
.wordmark-shield{font-weight:700;color:${dark ? "#fff" : "#0F172A"}}
.wordmark-tag{font-size:7px;letter-spacing:.16em;text-transform:uppercase;margin-bottom:8px;color:${dark ? "rgba(255,255,255,0.4)" : "#475569"}}
.consultant-name{font-size:13px;font-weight:600}
.consultant-role{font-size:9px;text-transform:uppercase;letter-spacing:.1em;margin-top:2px}
.accent-rule{height:2px;border-radius:2px;margin-bottom:7mm}
.meta-panel{border-radius:14px;padding:5mm 6mm;margin-bottom:7mm;display:grid;grid-template-columns:1fr 1fr;gap:4mm 8mm}
.meta-field label{font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;display:block;margin-bottom:3px}
.meta-field span{font-size:12px;font-weight:500}
.score-pill{display:inline-flex;align-items:center;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:700;color:${ratingColor};background:${ratingColor}18;border:1.5px solid ${ratingColor}88}
.section-heading{font-size:9px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;margin-bottom:4mm;padding-bottom:3mm}
.summary-panel{border-radius:12px;padding:4mm 5mm;margin-bottom:7mm;font-size:11px;line-height:1.65}
.cat-block{margin-bottom:6mm}
.cat-label{font-size:9px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;margin-bottom:3mm}
.gap-row{padding:8px 12px;border-left:3px solid;border-radius:0 10px 10px 0;margin-bottom:4px}
.gap-badge{display:inline-block;font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;padding:2px 8px;border-radius:999px;border:1px solid;margin-bottom:4px}
.gap-text{font-size:11px;line-height:1.5}
.notes-panel{border-radius:12px;padding:4mm 5mm;margin-bottom:7mm;margin-top:2mm;font-size:11px;line-height:1.6;white-space:pre-wrap}
.steps-panel{border-radius:12px;padding:4mm 5mm;margin-bottom:7mm}
.step-row{display:flex;gap:10px;margin-bottom:5px;align-items:flex-start}
.step-num{width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#000;background:${accentColor};flex-shrink:0;margin-top:1px}
.step-text{font-size:11px;line-height:1.5}
.footer{display:flex;justify-content:space-between;align-items:center;padding-top:4mm;margin-top:6mm}
.footer span{font-size:8px;letter-spacing:.1em;text-transform:uppercase}
${css}
</style></head><body>
<div class="page">
  <div class="header">
    <div>
      <p class="report-tag">School Improvement Report</p>
      <p class="report-title">${toolName}</p>
      <p class="report-sub">${today}</p>
    </div>
    <div class="header-right">
      ${displaySchoolLogo ? `<img src="${displaySchoolLogo}" style="height:48px;max-width:120px;object-fit:contain;display:block;margin-bottom:6px;margin-left:auto"/>` : ""}
      ${displayOrgLogo ? `<img src="${displayOrgLogo}" style="height:40px;max-width:110px;object-fit:contain;display:block;margin-bottom:6px;margin-left:auto"/>` : ""}
      <div class="wordmark"><span class="wordmark-safe">SAFE</span><span class="wordmark-shield">SHIELD</span></div>
      <div class="wordmark-tag">Protect · Comply · Assure</div>
    </div>
  </div>
  <div class="accent-rule"></div>
  <div class="meta-panel">
    <div class="meta-field"><label>School / Trust</label><span>${meta.schoolName || "—"}</span></div>
    <div class="meta-field"><label>Assessment Score</label><span class="score-pill">${score}% — ${rating}</span></div>
    <div class="meta-field"><label>Completed By</label><span>${meta.staffMember || "—"}</span></div>
    <div class="meta-field"><label>Consultant</label><span>${meta.consultantName || "Mathew Hewington"}</span></div>
  </div>
  <p class="section-heading">Executive Summary</p>
  <div class="summary-panel">
    This report presents findings from the <strong>${toolName}</strong> completed on <strong>${today}</strong> for <strong>${meta.schoolName}</strong>.
    The assessment returned a score of <strong>${score}%</strong>, rated <strong style="color:${ratingColor}">${rating}</strong>.
    <strong>${gaps.length}</strong> area${gaps.length !== 1 ? "s" : ""} for improvement ${gaps.length !== 1 ? "were" : "was"} identified,
    of which <strong style="color:#ef4444">${highGaps.length} high priority</strong>, <strong style="color:#f59e0b">${medGaps.length} medium</strong>, and <strong style="color:#22c55e">${lowGaps.length} lower priority</strong>.
  </div>
  <p class="section-heading">Priority Actions (${gaps.length})</p>
  ${catSections || `<div class="summary-panel" style="color:#22c55e">No gaps identified — excellent compliance across all areas.</div>`}
  ${consultantNotes ? `<p class="section-heading">Consultant Notes</p><div class="notes-panel">${consultantNotes}</div>` : ""}
  <p class="section-heading">Recommended Next Steps</p>
  <div class="steps-panel">
    <div class="step-row"><span class="step-num">1</span><span class="step-text">Share this report with the senior leadership team and governing board.</span></div>
    <div class="step-row"><span class="step-num">2</span><span class="step-text">Assign a named lead for each high-priority action with a clear deadline.</span></div>
    <div class="step-row"><span class="step-num">3</span><span class="step-text">Schedule a follow-up review in ${score < 55 ? "6–8 weeks" : "one term"} to assess progress.</span></div>
    <div class="step-row"><span class="step-num">4</span><span class="step-text">Contact your SafeShield consultant for targeted support on any of the above areas.</span></div>
  </div>
  <div class="footer">
    <span>SafeShield · Verified Assessment Report</span>
    <span>${today}</span>
  </div>
</div>
</body></html>`;
  }

  function handlePrint() {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(buildHtml(printMode === "dark"));
    w.document.close();
    setTimeout(() => w.print(), 400);
  }

  const glassPanel: React.CSSProperties = {
    background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderTopColor: "rgba(255,255,255,0.20)",
    borderRadius: 16,
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 20px rgba(0,0,0,0.3)",
  };

  const pillStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 14px",
    borderRadius: 999,
    background: `linear-gradient(135deg,rgba(255,255,255,0.10),rgba(255,255,255,0.04)) padding-box,
      conic-gradient(from 130deg at 50% 50%,
        rgba(56,189,248,0.8), rgba(167,139,250,0.7),
        rgba(52,211,153,0.6), rgba(251,146,60,0.5),
        rgba(244,114,182,0.6), rgba(56,189,248,0.8)
      ) border-box`,
    border: "1.5px solid transparent",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "#fff",
    textTransform: "uppercase" as const,
  };

  const priorityColor = (p: string) => p === "high" ? "#ef4444" : p === "medium" ? "#f59e0b" : "#22c55e";
  const priorityText = (p: string) => p === "high" ? "High Priority" : p === "medium" ? "Medium Priority" : "Lower Priority";

  return (
    <div style={{
      position: "relative",
      borderRadius: 24,
      overflow: "hidden",
      background: `linear-gradient(145deg, #1A1C22 0%, #21242D 50%, #1E2028 100%)`,
      boxShadow: `0 0 0 1px rgba(255,255,255,0.07), 0 20px 60px rgba(0,0,0,0.6), 0 0 50px ${accentColor}18`,
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      {/* Ambient glow blobs */}
      <div style={{ position: "absolute", top: -80, right: -80, width: 280, height: 280, borderRadius: "50%",
        background: `radial-gradient(circle, ${accentColor}20 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -60, left: -60, width: 220, height: 220, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Header */}
      <div style={{ padding: "28px 28px 0", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.75)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 4 }}>
              School Improvement Report
            </p>
            <p style={{ fontSize: 28, fontWeight: 600, color: "#E8EDF2", letterSpacing: "0.01em", lineHeight: 1.1, fontFamily: "'Cormorant Garant', Georgia, serif" }}>{toolName}</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.70)", marginTop: 3 }}>{today}</p>
          </div>
          {/* Logos + wordmark */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0, marginLeft: 16 }}>
            <div style={{ borderRight: "2px solid rgba(255,255,255,0.25)", paddingRight: 10, textAlign: "right" }}>
              <div style={{ fontFamily: "system-ui, sans-serif", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase" as const, lineHeight: 1 }}>
                <span style={{ fontWeight: 300, color: "rgba(255,255,255,0.55)" }}>SAFE</span><span style={{ fontWeight: 700, color: "#fff" }}>SHIELD</span>
              </div>
              <div style={{ fontSize: 7, letterSpacing: "0.16em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" as const, fontFamily: "system-ui, sans-serif", marginTop: 2 }}>PROTECT · COMPLY · ASSURE</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {displaySchoolLogo && (
                <img src={displaySchoolLogo} alt="School logo" loading="lazy" decoding="async"
                  style={{ height: 44, maxWidth: 130, objectFit: "contain" }} />
              )}
              {displayOrgLogo && (
                <img src={displayOrgLogo} alt="Org logo" loading="lazy" decoding="async"
                  style={{ height: 44, maxWidth: 130, objectFit: "contain" }} />
              )}
            </div>
          </div>
          <button
            onClick={() => setExpanded(v => !v)}
            style={{ ...glassPanel, padding: "6px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(255,255,255,0.85)", flexShrink: 0, marginLeft: 12 }}>
            {expanded ? <><ChevronUp size={14} /> Collapse</> : <><ChevronDown size={14} /> Expand</>}
          </button>
        </div>

        {/* Accent rule */}
        <div style={{ height: 2, borderRadius: 2, background: `linear-gradient(90deg,${accentColor},rgba(167,139,250,0.6),transparent)`, marginBottom: 20 }} />
      </div>

      {expanded && (
        <div style={{ padding: "0 28px 28px", position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Meta grid */}
          <div style={{ ...glassPanel, padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" }}>
            <div>
              <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.75)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 4 }}>School / Trust</p>
              <p style={{ fontSize: 12, color: "#fff", fontWeight: 500 }}>{meta.schoolName || "—"}</p>
            </div>
            <div>
              <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.75)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 4 }}>Assessment Score</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 12px", borderRadius: 999,
                  fontSize: 11, fontWeight: 700, color: ratingColor, background: `${ratingColor}18`, border: `1.5px solid ${ratingColor}88` }}>
                  {score}% — {rating}
                </span>
                {previousScore !== null && (() => {
                  const delta = score - previousScore;
                  const color = delta > 0 ? "#22c55e" : delta < 0 ? "#ef4444" : "#94a3b8";
                  const Icon = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;
                  return (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 600, color }}>
                      <Icon size={11} />
                      {delta > 0 ? "+" : ""}{delta}% vs last
                    </span>
                  );
                })()}
              </div>
            </div>
            <div>
              <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.75)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 4 }}>Completed By</p>
              <p style={{ fontSize: 12, color: "#fff", fontWeight: 500 }}>{meta.staffMember || "—"}</p>
            </div>
            <div>
              <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.75)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 4 }}>Consultant</p>
              <p style={{ fontSize: 12, color: "#fff", fontWeight: 500 }}>{meta.consultantName || "Mathew Hewington"}</p>
            </div>
          </div>

          {/* Executive summary */}
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.80)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
              Executive Summary
            </p>
            <div style={{ ...glassPanel, padding: "14px 18px", fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }}>
              Assessment completed for <strong style={{ color: "rgba(255,255,255,0.85)" }}>{meta.schoolName}</strong> on {today}.
              Score: <strong style={{ color: "rgba(255,255,255,0.85)" }}>{score}%</strong> — <strong style={{ color: ratingColor }}>{rating}</strong>.{" "}
              <strong style={{ color: "#ef4444" }}>{highGaps.length} high</strong>,{" "}
              <strong style={{ color: "#f59e0b" }}>{medGaps.length} medium</strong>, and{" "}
              <strong style={{ color: "#22c55e" }}>{lowGaps.length} lower</strong> priority areas identified.
            </div>
          </div>

          {/* Priority actions */}
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.80)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
              Priority Actions ({gaps.length})
            </p>
            {categories.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {categories.map((cat) => (
                  <div key={cat}>
                    <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 6 }}>{cat}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {gaps.filter(g => g.category === cat).map((g, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 14px",
                          borderLeft: `3px solid ${priorityColor(g.priority)}`,
                          borderRadius: "0 12px 12px 0",
                          background: `${priorityColor(g.priority)}0A` }}>
                          <span style={{ flexShrink: 0, fontSize: 8, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase",
                            padding: "2px 8px", borderRadius: 999,
                            color: priorityColor(g.priority),
                            background: `${priorityColor(g.priority)}18`,
                            border: `1px solid ${priorityColor(g.priority)}55`,
                            whiteSpace: "nowrap", marginTop: 1 }}>
                            {priorityText(g.priority)}
                          </span>
                          <p style={{ fontSize: 13, color: "#fff", lineHeight: 1.6, margin: 0 }}>{g.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ ...glassPanel, padding: "14px 18px", color: "#22c55e", fontSize: 12 }}>
                No gaps identified — excellent compliance across all areas.
              </div>
            )}
          </div>

          {/* Consultant notes */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                Consultant Notes <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>(optional)</span>
              </p>
              {isSuperAdmin && (
                <button
                  onClick={async () => {
                    setGenerating(true);
                    setConsultantNotes("");
                    try {
                      const high = gaps.filter(g => g.priority === "high");
                      const med = gaps.filter(g => g.priority === "medium");
                      const low = gaps.filter(g => g.priority === "low");

                      const toolFrameworks: Record<string, { frameworks: string; areas: string }> = {
                        "Safeguarding Risk Checker": {
                          frameworks: "KCSIE 2024 (https://www.gov.uk/government/publications/keeping-children-safe-in-education--2), Ofsted EIF (https://www.gov.uk/government/publications/education-inspection-framework), UKCIS framework (https://www.gov.uk/government/organisations/uk-council-for-internet-safety), Prevent Duty guidance (https://www.gov.uk/government/publications/prevent-duty-guidance)",
                          areas: "Online filtering & monitoring, Designated Safeguarding Lead (DSL) training, Acceptable Use Policies (AUPs), KCSIE-aligned curriculum delivery, governor oversight, staff training records, device & BYOD policies, online safety incident reporting",
                        },
                        "Governance Compliance Checker": {
                          frameworks: "DfE Governance Handbook (https://www.gov.uk/government/publications/governance-handbook), Ofsted EIF (https://www.gov.uk/government/publications/education-inspection-framework), Academy Trust Handbook (https://www.gov.uk/guidance/academy-trust-handbook), Charity Commission guidance (https://www.gov.uk/government/organisations/charity-commission)",
                          areas: "Skills audit, committee structure, finance oversight, conflict of interest registers, governor training, strategic planning, headteacher performance management, stakeholder engagement",
                        },
                        "AI Readiness Assessment": {
                          frameworks: "DfE Generative AI in Education (https://www.gov.uk/government/publications/generative-artificial-intelligence-in-education), UK AI Safety Institute (https://www.gov.uk/government/organisations/ai-safety-institute), ICO AI guidance (https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/artificial-intelligence/), JCQ AI malpractice (https://www.jcq.org.uk/exams-office/malpractice/artificial-intelligence/)",
                          areas: "AI policy, staff AI literacy, student AI use guidelines, assessment integrity, data privacy with AI tools, AI procurement due diligence, ethical AI framework",
                        },
                        "DPIA Wizard": {
                          frameworks: "UK GDPR Article 35 (https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/data-protection-impact-assessments-dpias/), ICO DPIA guidance (https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/), DfE Data Protection (https://www.gov.uk/guidance/data-protection-in-schools), DSPT toolkit (https://www.dsptoolkit.nhs.uk/)",
                          areas: "Data flows mapping, lawful basis, legitimate interests assessment, data minimisation, third-party processor agreements, subject access requests, data retention schedules, breach reporting",
                        },
                        "Web Accessibility Checker": {
                          frameworks: "WCAG 2.2 AA (https://www.w3.org/TR/WCAG22/), Public Sector Bodies Accessibility Regulations 2018 (https://www.legislation.gov.uk/uksi/2018/952/contents), Equality Act 2010 (https://www.legislation.gov.uk/ukpga/2010/15), DfE accessibility (https://www.gov.uk/guidance/accessibility-requirements-for-public-sector-websites-and-apps)",
                          areas: "Keyboard navigation, colour contrast ratios, alt text for images, ARIA labels, form accessibility, PDF accessibility, video captions, accessibility statement, mobile responsiveness, screen reader compatibility",
                        },
                        "Ofsted Ready Checker": {
                          frameworks: "Ofsted EIF 2024 (https://www.gov.uk/government/publications/education-inspection-framework), School Inspection Handbook (https://www.gov.uk/government/publications/school-inspection-handbook-eif), Ofsted Parent View (https://parentview.ofsted.gov.uk/), Ofsted myths (https://www.gov.uk/government/publications/ofsted-myths)",
                          areas: "Quality of education, curriculum intent/implementation/impact, behaviour and attitudes, personal development, leadership and management, SEND provision, safeguarding culture, staff workload",
                        },
                        "AI Content Detector": {
                          frameworks: "DfE Generative AI guidance (https://www.gov.uk/government/publications/generative-artificial-intelligence-in-education), JCQ AI malpractice guidance (https://www.jcq.org.uk/exams-office/malpractice/artificial-intelligence/), Ofsted assessment guidance (https://www.gov.uk/government/publications/education-inspection-framework)",
                          areas: "AI detection policy, student declaration processes, assessment design to reduce AI dependency, staff training on AI-generated content, academic integrity policy",
                        },
                        "Digital Standards Checker": {
                          frameworks: "DfE Digital & Technology Standards (https://www.gov.uk/guidance/digital-and-technology-standards-for-schools-and-colleges), EdTech Strategy (https://www.gov.uk/government/publications/edtech-strategy), DfE broadband/connectivity (https://www.gov.uk/government/publications/school-network-infrastructure), Cyber essentials (https://www.ncsc.gov.uk/cyberessentials/overview)",
                          areas: "Network infrastructure, broadband speeds, device ratios, cyber security (NCSC Cyber Essentials), MIS systems, cloud strategy, staff digital skills, EdTech procurement, backup & recovery",
                        },
                        "Health & Safety Checker": {
                          frameworks: "Health and Safety at Work Act 1974 (https://www.legislation.gov.uk/ukpga/1974/37), HSE Schools guidance (https://www.hse.gov.uk/services/education/index.htm), DfE H&S guidance (https://www.gov.uk/government/publications/health-and-safety-advice-for-schools), RIDDOR (https://www.hse.gov.uk/riddor/)",
                          areas: "Risk assessment records, fire safety, first aid provision, RIDDOR reporting, lone working policy, contractor management, asbestos management, educational visits approvals, DfE indoor environment standards",
                        },
                      };

                      const tf = toolFrameworks[toolName] || {
                        frameworks: "DfE guidance (https://www.gov.uk/government/organisations/department-for-education), Ofsted EIF (https://www.gov.uk/government/publications/education-inspection-framework)",
                        areas: "Compliance and quality standards relevant to UK schools",
                      };

                      const consultantName = meta.consultantName || "your SafeShield consultant";
                      const consultantEmail = meta.consultantEmail || "info@safeshieldtools.co.uk";
                      const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

                      const gapSection = gaps.length > 0
                        ? `SPECIFIC GAPS IDENTIFIED IN THIS ASSESSMENT (${gaps.length} total):
${gaps.map(g => `- [${g.priority.toUpperCase()}] ${g.category}: ${g.text}`).join("\n")}`
                        : `NOTE: Specific gap data was not recorded for this assessment (completed before gap tracking was enabled).
Based on the score of ${score}% (${rating}), generate realistic improvement recommendations covering the typical weak areas for this tool at this score level. The typical assessment areas for ${toolName} include: ${tf.areas}`;

                      const prompt = `Prepare a formal compliance improvement report for the headteacher of ${meta.schoolName || "this school"} following their ${toolName} assessment completed on ${date}.

ASSESSMENT RESULTS
School: ${meta.schoolName || "—"} | Staff: ${meta.staffMember || "—"} | Score: ${score}% (${rating}) | Gaps: ${high.length} high, ${med.length} medium, ${low.length} lower priority

${gapSection}

APPLICABLE STANDARDS
${tf.frameworks}

Write the report in formal consultant prose under these four headings only. Each section must be substantive and specific to the actual gaps and school context — no generic filler.

Executive Summary
Two to three sentences. State the score, compliance standing, and the principal risk to the school if the identified gaps are not remedied. Name the most critical gap directly.

Priority Recommendations
Address each high-priority gap first, then medium. For each: state the specific action required, cite the exact statutory provision or standard breached (with URL), and give a clear implementation timeframe. Write in firm, directive language — "The school must…", "Governors are required to…". Do not use sub-bullets; write in short paragraphs.

Key Compliance References
List the five most directly relevant official resources as: [Title](URL) — one sentence explaining its relevance to this school's gaps. Nothing generic.

Next Steps & Consultancy
Write two short paragraphs. The first: a numbered action plan of four concrete steps the school should take within the next 30 days, written as prose. The second: advise the headteacher that ${consultantName} at SafeShield is available to provide hands-on support — including on-site compliance reviews, policy audits, staff training, and Ofsted preparation. Invite them to contact ${consultantEmail} for a complimentary 30-minute discovery call. Close with one sentence on tailored consultancy packages.`;

                      const res = await fetch("/api/chat", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
                      });
                      if (!res.ok) {
                        const err = await res.text();
                        throw new Error(`API error ${res.status}: ${err}`);
                      }
                      const json = await res.json();
                      if (json.text) {
                        setConsultantNotes(json.text);
                      } else {
                        throw new Error("No text in response");
                      }
                    } catch (err) {
                      console.error("Generate recommendations failed:", err);
                      alert(`Could not generate recommendations: ${err instanceof Error ? err.message : "Unknown error"}. Please check SAFE_SHILED_APP_CHAT_GPT is set in Vercel environment variables.`);
                    } finally {
                      setGenerating(false);
                    }
                  }}
                  disabled={generating}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 10,
                    cursor: generating ? "default" : "pointer", opacity: generating ? 0.7 : 1,
                    background: `${accentColor}18`, border: `1px solid ${accentColor}40`, color: accentColor, fontSize: 11, fontWeight: 600 }}>
                  {generating
                    ? <><span style={{ display: "inline-block", width: 10, height: 10, border: `1.5px solid ${accentColor}40`, borderTopColor: accentColor, borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Generating…</>
                    : <><Sparkles size={11} /> Generate Recommendations</>}
                </button>
              )}
            </div>
            <textarea
              value={consultantNotes}
              onChange={(e) => setConsultantNotes(e.target.value)}
              rows={6}
              placeholder="Click 'Generate Recommendations' to auto-fill, or type your own notes here..."
              style={{ width: "100%", padding: "12px 14px", borderRadius: 12, fontSize: 12, color: "#fff",
                background: "rgba(255,255,255,0.04)", border: `1px solid ${consultantNotes ? accentBorder : "rgba(255,255,255,0.10)"}`,
                outline: "none", resize: "none", fontFamily: "inherit", lineHeight: 1.6 }}
            />
            {consultantNotes.trim() && (
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  onClick={saveNotes}
                  disabled={notesSaving || !reportId}
                  title={!reportId ? "Complete the assessment to enable saving" : ""}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{ background: notesSaved ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.06)", border: `1px solid ${notesSaved ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.15)"}`, color: notesSaved ? "#22c55e" : "#CBD5E1", opacity: (notesSaving || !reportId) ? 0.5 : 1 }}
                >
                  {notesSaved ? <><Check size={12} /> Saved</> : notesSaving ? "Saving…" : <><Save size={12} /> Save Notes</>}
                </button>
                <button
                  onClick={handlePrintRecommendations}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}35`, color: accentColor }}
                >
                  <Printer size={12} /> Print Recommendations
                </button>
              </div>
            )}
          </div>

          {/* Recommended next steps */}
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.80)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
              Recommended Next Steps
            </p>
            <div style={{ ...glassPanel, padding: "14px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                "Share this report with the senior leadership team and governing board.",
                "Assign a named lead for each high-priority action with a clear deadline.",
                `Schedule a follow-up review in ${score < 55 ? "6–8 weeks" : "one term"} to assess progress.`,
                "Contact your SafeShield consultant for targeted support on any of the above areas.",
              ].map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: "50%", background: accentColor,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9, fontWeight: 700, color: "#000", marginTop: 1 }}>{i + 1}</span>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", lineHeight: 1.6, margin: 0 }}>{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, paddingTop: 4 }}>
            {/* Print mode toggle */}
            <div style={{ display: "flex", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.10)", flexShrink: 0 }}>
              <button onClick={() => setPrintMode("dark")}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", cursor: "pointer", border: "none",
                  background: printMode === "dark" ? "rgba(255,255,255,0.12)" : "transparent",
                  color: printMode === "dark" ? "#fff" : "#64748B", fontSize: 11, fontWeight: 600 }}>
                <Moon size={11} /> Dark
              </button>
              <button onClick={() => setPrintMode("light")}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", cursor: "pointer", border: "none",
                  background: printMode === "light" ? "rgba(255,255,255,0.12)" : "transparent",
                  color: printMode === "light" ? "#fff" : "#64748B", fontSize: 11, fontWeight: 600 }}>
                <Sun size={11} /> Light
              </button>
            </div>
            <button onClick={handlePrint}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12, cursor: "pointer",
                background: `${accentColor}18`, border: `1px solid ${accentColor}40`, color: accentColor, fontSize: 13, fontWeight: 600 }}>
              <Printer size={14} /> Print / Save PDF
            </button>
            <button onClick={handleEmail} disabled={emailSending}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12,
                cursor: emailSending ? "default" : "pointer", opacity: emailSending ? 0.6 : 1,
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 600 }}>
              <Mail size={14} /> {emailSending ? "Sending…" : "Email Report"}
            </button>
            {gaps.length > 0 && (
              <button onClick={downloadActionPlan}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12, cursor: "pointer",
                  background: "rgba(34,197,94,0.10)", border: "1px solid rgba(34,197,94,0.30)", color: "#22c55e", fontSize: 13, fontWeight: 600 }}>
                <Download size={14} /> Action Plan (.csv)
              </button>
            )}
          </div>

          {/* Footer ref */}
          <div style={{ paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.10)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.70)", letterSpacing: "0.12em", fontWeight: 600, textTransform: "uppercase" }}>SafeShield · Verified Assessment Report</span>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.70)", letterSpacing: "0.08em" }}>{today}</span>
          </div>
        </div>
      )}
    </div>
  );
}
