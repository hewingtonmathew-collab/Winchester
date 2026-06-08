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

export default function Certificate({ meta, toolName, score, rating, ratingColor, date, accentColor = "#38BDF8", areas }: Props) {
  const certRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const [orgLogoUrl, setOrgLogoUrl] = useState<string | null>(null);
  const [schoolLogoUrl, setSchoolLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: membership } = await supabase
        .from("org_members").select("org_id, school_id").eq("user_id", user.id).limit(1).maybeSingle();
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

  // SVG circle gauge constants
  const R = 42; const C = 2 * Math.PI * R;
  const scoreDash = (score / 100) * C;

  function handlePrint() {
    const w = window.open("", "_blank");
    if (!w) return;
    const areasHtml = areas && areas.length > 0
      ? `<div class="areas-block">
          <p class="areas-heading">Audit areas covered</p>
          <table class="areas-table">
            ${areas.map(a => `<tr><td class="area-name">${a.name}</td>${a.score !== undefined ? `<td class="area-score">${a.score}%</td>` : "<td></td>"}</tr>`).join("")}
          </table>
        </div>` : "";
    const logoHtml = `<div style="display:flex;align-items:center;gap:10px;">
      ${displaySchoolLogo ? `<img src="${displaySchoolLogo}" alt="" class="school-logo-img" />` : ""}
      ${displayOrgLogo ? `<img src="${displayOrgLogo}" alt="" class="school-logo-img" />` : ""}
      ${!displaySchoolLogo && !displayOrgLogo ? `<div class="school-logo-placeholder"></div>` : ""}
    </div>`;
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Certificate — ${toolName}</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
@page{size:A4 portrait;margin:0}
html,body{width:210mm;height:297mm;background:#fff;font-family:Georgia,'Times New Roman',serif;color:#1a1a1a;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:210mm;height:297mm;padding:18mm 20mm 14mm;background:#fff;display:flex;flex-direction:column}
.top-bar{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14mm}
.school-logo-img{height:64px;object-fit:contain}
.school-logo-placeholder{width:64px;height:64px}
.consultant-brand{display:flex;flex-direction:column;align-items:flex-end;gap:2px}
.consultant-name{font-size:16px;font-weight:600;color:#1a1a1a}
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
  <div class="top-bar"><div>${logoHtml}</div><div class="consultant-brand"><span class="consultant-name">Mathew Hewington</span><span class="consultant-title">Education Consultant</span></div></div>
  <div class="cert-body">
    <div class="cert-main">
      <p class="the-text">The</p>
      <p class="cert-title">${toolName}<br/>Assessment Certificate</p>
      <p class="completed-line">has been completed by</p>
      <p class="school-name">${meta.schoolName || "School Name"}</p>
      <p class="detail-line"><span class="label">Completed by: </span>${meta.staffMember || "—"}</p>
      <div class="score-wrap"><span class="label">Assessment score:</span><span class="score-badge">${score}% — ${rating}</span></div>
      <p class="date-line">${today}</p>
    </div>
    ${areasHtml}
  </div>
  <div class="sig-section"><div class="sig-block"><div class="sig-rule"></div><p class="sig-name">${meta.consultantName || "Mathew Hewington"}</p><p class="sig-role">Education Consultant</p></div></div>
  <p class="cert-ref">${certId}</p>
</div></body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 600);
  }

  function handleEmail() {
    const subject = encodeURIComponent(`${toolName} Certificate — ${meta.schoolName}`);
    const areasLine = areas && areas.length > 0 ? `\nAudit areas covered:\n${areas.map(a => `  • ${a.name}${a.score !== undefined ? ` — ${a.score}%` : ""}`).join("\n")}` : "";
    const body = encodeURIComponent(`Dear ${meta.schoolName},\n\nPlease find attached your ${toolName} assessment certificate.\n\nAssessment Summary\n──────────────────\nSchool: ${meta.schoolName}\nCompleted by: ${meta.staffMember}\nScore: ${score}% — ${rating}${areasLine}\nDate: ${today}\nCertificate: ${certId}\n\nKind regards,\n${meta.consultantName || "Mathew Hewington"}\nEducation Consultant`);
    const recipients = [meta.schoolEmail, meta.consultantEmail].filter(Boolean).join(",");
    window.location.href = `mailto:${recipients}?subject=${subject}&body=${body}`;
  }

  return (
    <div className="flex flex-col gap-4">

      {/* ── Liquid Glass Certificate — on-screen preview ── */}
      <div
        ref={certRef}
        className="glass-cert-canvas"
        style={{
          background: `linear-gradient(145deg, #06080F 0%, #0D0A18 40%, ${accentColor}18 100%)`,
          padding: "2px",
        }}
      >
        <div style={{ borderRadius: 18, overflow: "hidden", padding: "32px 36px", display: "flex", flexDirection: "column", gap: 24 }}>

          {/* ── Tool name glass pill (like the reference image) ── */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <span
              className="glass-pill"
              style={{
                fontSize: 13, fontWeight: 700, letterSpacing: "0.04em",
                color: "#fff", textAlign: "center", gap: 8,
              }}
            >
              <span style={{
                display: "inline-block", width: 8, height: 8, borderRadius: "50%",
                background: accentColor, boxShadow: `0 0 8px ${accentColor}`,
                flexShrink: 0,
              }} />
              {toolName} · Assessment Certificate
            </span>
          </div>

          {/* ── Main content row ── */}
          <div style={{ display: "flex", gap: 20, alignItems: "stretch" }}>

            {/* Left: School info glass panel */}
            <div className="glass" style={{ flex: 1, borderRadius: 16, padding: "24px 28px", display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Logos row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {displaySchoolLogo && <img src={displaySchoolLogo} alt="" style={{ height: 44, objectFit: "contain" }} />}
                  {displayOrgLogo && <img src={displayOrgLogo} alt="" style={{ height: 44, objectFit: "contain" }} />}
                  {!displaySchoolLogo && !displayOrgLogo && (
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${accentColor}18`, border: `1px solid ${accentColor}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
                    </div>
                  )}
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#fff", opacity: 0.9 }}>Mathew Hewington</p>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", letterSpacing: "0.04em" }}>Education Consultant</p>
                </div>
              </div>

              {/* School name + details */}
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: accentColor, marginBottom: 6, opacity: 0.85 }}>
                  has been completed by
                </p>
                <p style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 12 }}>
                  {meta.schoolName || "School Name"}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {meta.staffMember && (
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
                      <span style={{ color: "rgba(255,255,255,0.35)" }}>Staff: </span>{meta.staffMember}
                    </p>
                  )}
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
                    <span style={{ color: "rgba(255,255,255,0.35)" }}>Date: </span>{today}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }} />

              {/* Signature */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ width: 80, height: 1, background: "rgba(255,255,255,0.3)", marginBottom: 4 }} />
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", fontStyle: "italic" }}>
                    {meta.consultantName || "Mathew Hewington"}
                  </p>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Education Consultant</p>
                </div>
                <p style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: "0.08em", fontFamily: "monospace" }}>{certId}</p>
              </div>
            </div>

            {/* Right: Score + Areas */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 180, flexShrink: 0 }}>

              {/* Score gauge glass panel */}
              <div className="glass" style={{ borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Score</p>
                <svg width={100} height={100} viewBox="0 0 100 100">
                  {/* Track */}
                  <circle cx={50} cy={50} r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={8} />
                  {/* Score arc */}
                  <circle
                    cx={50} cy={50} r={R}
                    fill="none"
                    stroke={accentColor}
                    strokeWidth={8}
                    strokeLinecap="round"
                    strokeDasharray={`${scoreDash} ${C}`}
                    strokeDashoffset={C * 0.25}
                    style={{ filter: `drop-shadow(0 0 6px ${accentColor}99)`, transition: "stroke-dasharray 1s ease" }}
                  />
                  {/* Score text */}
                  <text x={50} y={46} textAnchor="middle" fontSize={22} fontWeight={800} fill="#fff" fontFamily="system-ui">{score}</text>
                  <text x={50} y={62} textAnchor="middle" fontSize={10} fill={accentColor} fontFamily="system-ui" fontWeight={600}>%</text>
                </svg>
                {/* Rating pill */}
                <span
                  className="glass-pill"
                  style={{ fontSize: 10, fontWeight: 700, color: ratingColor, padding: "3px 12px" }}
                >
                  {rating}
                </span>
              </div>

              {/* Areas panel */}
              {areas && areas.length > 0 && (
                <div className="glass" style={{ borderRadius: 16, padding: "16px 14px", flex: 1 }}>
                  <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)", marginBottom: 10 }}>Areas</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {areas.slice(0, 7).map(a => (
                      <div key={a.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.60)", flex: 1, marginRight: 6, lineHeight: 1.3 }}>{a.name}</span>
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
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div className="flex flex-wrap gap-3">
        <button onClick={handlePrint}
          className="glass-btn inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium"
          style={{ color: accentColor }}>
          <Printer size={14} /> Print / Save PDF
        </button>
        {(meta.schoolEmail || meta.consultantEmail) && (
          <button onClick={handleEmail}
            className="glass-btn inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium"
            style={{ color: "var(--text-muted)" }}>
            <Mail size={14} /> Email Certificate
          </button>
        )}
      </div>
      <p style={{ fontSize: 11, color: "var(--text-dim)" }}>
        Print / Save PDF opens a clean A4 certificate ready to save as PDF or print.
      </p>
    </div>
  );
}
