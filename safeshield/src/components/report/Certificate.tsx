"use client";
import { useRef, useEffect, useState } from "react";
import { Printer, Mail } from "lucide-react";
import type { ReportMetaData } from "./ReportMeta";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

type Props = {
  meta: ReportMetaData;
  toolName: string;
  score: number;
  rating: string;
  ratingColor: string;
  date?: string;
  accentColor?: string;
  areas?: { name: string; score?: number }[];
};

/* ── SVG circular score gauge ─────────────────────────────────────────── */
function ScoreGauge({ score, accent }: { score: number; accent: string }) {
  const R = 52, C = 2 * Math.PI * R;
  const dash = (score / 100) * C;
  return (
    <svg width={130} height={130} viewBox="0 0 130 130" style={{ display: "block" }}>
      <defs>
        <filter id="gaugeGlow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feComposite in="SourceGraphic" in2="b" operator="over" />
        </filter>
        <radialGradient id="gaugeTrack" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
        </radialGradient>
      </defs>
      {/* glass disc */}
      <circle cx="65" cy="65" r="60" fill="url(#gaugeTrack)" />
      <circle cx="65" cy="65" r="60" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      {/* track */}
      <circle cx="65" cy="65" r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10"
        strokeLinecap="round" strokeDasharray={`${C}`} transform="rotate(-90 65 65)" />
      {/* arc */}
      <circle cx="65" cy="65" r={R} fill="none" stroke={accent} strokeWidth="10"
        strokeLinecap="round" strokeDasharray={`${dash} ${C}`}
        transform="rotate(-90 65 65)" filter="url(#gaugeGlow)"
        style={{ transition: "stroke-dasharray 1s cubic-bezier(.4,0,.2,1)" }} />
      {/* specular shine on arc */}
      <circle cx="65" cy="65" r={R} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5"
        strokeLinecap="round" strokeDasharray={`${dash * 0.3} ${C}`}
        transform="rotate(-90 65 65)" />
      {/* score text */}
      <text x="65" y="60" textAnchor="middle" dominantBaseline="middle"
        style={{ fill: "#fff", fontSize: 26, fontWeight: 700, fontFamily: "system-ui,sans-serif", letterSpacing: "-1px" }}>
        {score}
      </text>
      <text x="65" y="79" textAnchor="middle" dominantBaseline="middle"
        style={{ fill: "rgba(255,255,255,0.5)", fontSize: 10, fontFamily: "system-ui,sans-serif", letterSpacing: "2px" }}>
        SCORE
      </text>
    </svg>
  );
}

export default function Certificate({ meta, toolName, score, rating, ratingColor, date, accentColor = "#38BDF8", areas }: Props) {
  const { user } = useAuth();
  const [orgLogoUrl, setOrgLogoUrl] = useState<string | null>(null);
  const [schoolLogoUrl, setSchoolLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: membership } = await supabase.from("org_members").select("org_id, school_id")
        .eq("user_id", user.id).limit(1).maybeSingle();
      if (!membership) return;
      if (membership.org_id) {
        const { data: org } = await supabase.from("organisations").select("logo_url").eq("id", membership.org_id).single();
        if (org?.logo_url) setOrgLogoUrl(org.logo_url);
      }
      if (membership.school_id) {
        const { data: school } = await supabase.from("schools").select("logo_url").eq("id", membership.school_id).single();
        if (school?.logo_url) setSchoolLogoUrl(school.logo_url);
      }
    })();
  }, [user]);

  const today = date ?? new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const certId = `MH-${Date.now().toString(36).toUpperCase().slice(-5)}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  const displaySchoolLogo = meta.logoDataUrl || schoolLogoUrl;
  const displayOrgLogo = orgLogoUrl && orgLogoUrl !== displaySchoolLogo ? orgLogoUrl : null;

  /* ── PRINT ──────────────────────────────────────────────────────────── */
  function handlePrint() {
    const w = window.open("", "_blank");
    if (!w) return;
    const areasHtml = areas && areas.length > 0
      ? `<div class="areas-block">
          <p class="areas-heading">Audit areas covered</p>
          <table class="areas-table">
            ${areas.map(a => `<tr><td class="area-name">${a.name}</td>${a.score !== undefined ? `<td class="area-score">${a.score}%</td>` : "<td></td>"}</tr>`).join("")}
          </table>
        </div>`
      : "";
    const logoHtml = `<div style="display:flex;align-items:center;gap:10px;">
      ${displaySchoolLogo ? `<img src="${displaySchoolLogo}" class="school-logo-img" />` : ""}
      ${displayOrgLogo ? `<img src="${displayOrgLogo}" class="school-logo-img" />` : ""}
      ${!displaySchoolLogo && !displayOrgLogo ? `<div class="school-logo-placeholder"></div>` : ""}
    </div>`;
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Certificate — ${toolName}</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
@page{size:A4 portrait;margin:0}
html,body{width:210mm;height:297mm;background:#fff;font-family:Georgia,'Times New Roman',serif;color:#1a1a1a;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:210mm;height:297mm;padding:18mm 20mm 14mm;background:#fff;display:flex;flex-direction:column}
.top-bar{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14mm}
.school-logo-img{height:64px;object-fit:contain}.school-logo-placeholder{width:64px;height:64px}
.consultant-brand{display:flex;flex-direction:column;align-items:flex-end;gap:2px}
.consultant-name{font-size:16px;font-weight:600;color:#1a1a1a;letter-spacing:.3px}
.consultant-title{font-size:10px;color:#888;letter-spacing:.5px}
.cert-body{flex:1;display:flex;gap:14mm}
.cert-main{flex:1}
.the-text{font-size:14px;color:#1a1a1a;margin-bottom:6px}
.cert-title{font-size:22px;font-weight:600;text-transform:uppercase;letter-spacing:1px;line-height:1.3;color:#1a1a1a;margin-bottom:8mm;max-width:120mm}
.completed-line{font-size:14px;font-style:italic;color:#555;margin-bottom:5mm}
.school-name{font-size:30px;font-style:italic;font-weight:600;color:#1a1a1a;margin-bottom:6mm}
.detail-line{font-size:13px;color:#444;margin-bottom:4px}
.label{color:#888}
.score-wrap{font-size:13px;color:#444;margin-bottom:8mm;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.score-badge{color:${ratingColor};background:#000;border:2px solid ${ratingColor};padding:3px 12px;border-radius:5px;font-weight:700;font-size:13px;display:inline-block}
.date-line{font-size:13px;color:#1a1a1a;margin-top:8mm}
.areas-block{width:62mm;flex-shrink:0;border-left:3px solid #e5e7eb;padding-left:8mm;padding-top:2mm}
.areas-heading{font-size:10px;font-weight:700;color:#888;letter-spacing:1px;text-transform:uppercase;font-family:Arial,sans-serif;margin-bottom:5mm}
.areas-table{border-collapse:collapse;width:100%}
.areas-table tr{border-bottom:1px solid #f0f0f0}
.areas-table tr:last-child{border-bottom:none}
.area-name{font-size:11px;color:#333;padding:3px 0}
.area-score{font-size:11px;font-weight:700;color:#1a1a1a;text-align:right;padding:3px 0;white-space:nowrap}
.sig-section{display:flex;justify-content:flex-end;margin-top:10mm}
.sig-block{text-align:left;min-width:52mm}
.sig-rule{width:52mm;height:1px;background:#1a1a1a;margin-bottom:4px}
.sig-name{font-size:12px;font-style:italic;color:#1a1a1a}
.sig-role{font-size:10px;color:#888;margin-top:2px}
.cert-ref{text-align:right;font-size:9px;color:#bbb;letter-spacing:1px;font-family:Arial,sans-serif;margin-top:auto;padding-top:8mm}
</style></head><body>
<div class="page">
<div class="top-bar"><div>${logoHtml}</div>
<div class="consultant-brand"><span class="consultant-name">Mathew Hewington</span><span class="consultant-title">Education Consultant</span></div></div>
<div class="cert-body"><div class="cert-main">
<p class="the-text">The</p>
<p class="cert-title">${toolName}<br/>Assessment Certificate</p>
<p class="completed-line">has been completed by</p>
<p class="school-name">${meta.schoolName || "School Name"}</p>
<p class="detail-line"><span class="label">Completed by: </span>${meta.staffMember || "—"}</p>
<div class="score-wrap"><span class="label">Assessment score:</span><span class="score-badge">${score}% — ${rating}</span></div>
<p class="date-line">${today}</p>
</div>${areasHtml}</div>
<div class="sig-section"><div class="sig-block"><div class="sig-rule"></div>
<p class="sig-name">${meta.consultantName || "Mathew Hewington"}</p>
<p class="sig-role">Education Consultant</p></div></div>
<p class="cert-ref">${certId}</p>
</div></body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 600);
  }

  /* ── EMAIL ──────────────────────────────────────────────────────────── */
  function handleEmail() {
    const subject = encodeURIComponent(`${toolName} Certificate — ${meta.schoolName}`);
    const areasLine = areas && areas.length > 0
      ? `\nAudit areas:\n${areas.map(a => `  • ${a.name}${a.score !== undefined ? ` — ${a.score}%` : ""}`).join("\n")}` : "";
    const body = encodeURIComponent(
      `Dear ${meta.schoolName},\n\nPlease find your ${toolName} assessment certificate below.\n\nAssessment Summary\n──────────────────\nSchool:       ${meta.schoolName}\nCompleted by: ${meta.staffMember}\nConsultant:   ${meta.consultantName}\nScore:        ${score}% — ${rating}${areasLine}\nDate:         ${today}\nRef:          ${certId}\n\nKind regards,\n${meta.consultantName || "Mathew Hewington"}\nEducation Consultant`
    );
    const recipients = [meta.schoolEmail, meta.consultantEmail].filter(Boolean).join(",");
    window.location.href = `mailto:${recipients}?subject=${subject}&body=${body}`;
  }

  /* ── ON-SCREEN LIQUID GLASS PREVIEW ─────────────────────────────────── */
  const glassPanel: React.CSSProperties = {
    background: "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)",
    border: "1px solid rgba(255,255,255,0.13)",
    borderTopColor: "rgba(255,255,255,0.22)",
    borderRadius: 20,
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.12), 0 4px 24px rgba(0,0,0,0.35)",
    padding: "20px 24px",
  };

  const pillStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 16px",
    borderRadius: 999,
    background: `linear-gradient(135deg,rgba(255,255,255,0.10),rgba(255,255,255,0.04)) padding-box,
      conic-gradient(from 130deg at 50% 50%,
        rgba(56,189,248,0.8), rgba(167,139,250,0.7),
        rgba(52,211,153,0.6), rgba(251,146,60,0.5),
        rgba(244,114,182,0.6), rgba(56,189,248,0.8)
      ) border-box`,
    border: "1.5px solid transparent",
    backdropFilter: "blur(16px) saturate(200%)",
    WebkitBackdropFilter: "blur(16px) saturate(200%)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.15), 0 2px 12px rgba(0,0,0,0.3)",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.06em",
    color: "#fff",
    textTransform: "uppercase" as const,
  };

  return (
    <div className="flex flex-col gap-5">

      {/* ── Liquid Glass Certificate Canvas ─────────────────────────────── */}
      <div style={{
        position: "relative",
        borderRadius: 28,
        overflow: "hidden",
        background: `linear-gradient(145deg, #060A12 0%, #0D0A1A 45%, ${accentColor}1A 100%)`,
        boxShadow: `0 0 0 1px rgba(255,255,255,0.07), 0 24px 80px rgba(0,0,0,0.7), 0 0 60px ${accentColor}22`,
        minHeight: 520,
        padding: "36px 36px 32px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}>

        {/* Ambient glow blobs */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}25 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Top: logos + tool pill */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, position: "relative", zIndex: 1 }}>
          {/* School / org logos */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {displaySchoolLogo && (
              <img src={displaySchoolLogo} alt="School logo"
                style={{ height: 52, objectFit: "contain", borderRadius: 10, background: "rgba(255,255,255,0.06)", padding: 4 }} />
            )}
            {displayOrgLogo && (
              <img src={displayOrgLogo} alt="Org logo"
                style={{ height: 52, objectFit: "contain", borderRadius: 10, background: "rgba(255,255,255,0.06)", padding: 4 }} />
            )}
            {!displaySchoolLogo && !displayOrgLogo && (
              <div style={{ width: 52, height: 52, borderRadius: 12, ...glassPanel, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 22 }}>🏫</span>
              </div>
            )}
          </div>

          {/* Tool name pill */}
          <span style={pillStyle}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: accentColor, boxShadow: `0 0 6px ${accentColor}` }} />
            {toolName}
          </span>
        </div>

        {/* Main body: left text + right gauge */}
        <div style={{ display: "flex", gap: 28, alignItems: "flex-start", position: "relative", zIndex: 1, flexWrap: "wrap" }}>

          {/* Left — school info glass panel */}
          <div style={{ ...glassPanel, flex: 1, minWidth: 220 }}>
            {/* Specular top highlight */}
            <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 1,
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)", borderRadius: 1 }} />

            <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6 }}>
              This is to certify that
            </p>
            <p style={{ fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 4, lineHeight: 1.2 }}>
              {meta.schoolName || "School Name"}
            </p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 20 }}>
              has completed the <span style={{ color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>{toolName}</span>
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {meta.staffMember && (
                <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", minWidth: 80 }}>Completed by</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{meta.staffMember}</span>
                </div>
              )}
              {(meta.consultantName) && (
                <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", minWidth: 80 }}>Consultant</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{meta.consultantName || "Mathew Hewington"}</span>
                </div>
              )}
              <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", minWidth: 80 }}>Date</span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{today}</span>
              </div>
            </div>

            {/* Signature line */}
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ height: 1, width: 120, background: "rgba(255,255,255,0.25)", marginBottom: 6 }} />
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}>{meta.consultantName || "Mathew Hewington"}</p>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.08em" }}>Education Consultant</p>
            </div>
          </div>

          {/* Right — score gauge + rating pill + areas */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, minWidth: 160 }}>
            <ScoreGauge score={score} accent={accentColor} />

            {/* Rating pill */}
            <span style={{ ...pillStyle, background: `linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.05)) padding-box, conic-gradient(from 130deg, ${ratingColor}cc, ${accentColor}cc, ${ratingColor}cc) border-box`, fontSize: 12 }}>
              {rating}
            </span>

            {/* Areas glass panel */}
            {areas && areas.length > 0 && (
              <div style={{ ...glassPanel, padding: "14px 16px", width: "100%", minWidth: 160 }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>
                  Areas assessed
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {areas.slice(0, 7).map(a => (
                    <div key={a.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", flex: 1, paddingRight: 8, lineHeight: 1.3 }}>{a.name}</span>
                      {a.score !== undefined && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: accentColor, whiteSpace: "nowrap" }}>{a.score}%</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom ref */}
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.18)", letterSpacing: "0.12em", fontWeight: 600, textTransform: "uppercase" }}>SafeShield · Verified Assessment</span>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.18)", letterSpacing: "0.1em" }}>{certId}</span>
        </div>
      </div>

      {/* ── Action buttons ───────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        <button onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}40`, color: accentColor }}>
          <Printer size={14} /> Print / Save PDF
        </button>
        {(meta.schoolEmail || meta.consultantEmail) && (
          <button onClick={handleEmail}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all bg-white/5 border border-white/10"
            style={{ color: "#94A3B8" }}>
            <Mail size={14} /> Email Certificate
          </button>
        )}
      </div>
      <p className="text-[0.7rem]" style={{ color: "var(--text-dim)" }}>
        To email the PDF: use "Print / Save PDF" first, then attach the saved file.
      </p>
    </div>
  );
}
