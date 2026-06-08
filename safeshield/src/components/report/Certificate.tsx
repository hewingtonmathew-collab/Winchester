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

  /* ── PRINT — dark liquid glass A4 ───────────────────────────────────── */
  function handlePrint() {
    const w = window.open("", "_blank");
    if (!w) return;

    const C = 2 * Math.PI * 52;
    const dash = (score / 100) * C;

    const gaugesvg = `<svg width="130" height="130" viewBox="0 0 130 130" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gt" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.07)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0.02)"/>
        </radialGradient>
        <filter id="gg"><feGaussianBlur stdDeviation="3" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/></filter>
      </defs>
      <circle cx="65" cy="65" r="60" fill="url(#gt)"/>
      <circle cx="65" cy="65" r="60" fill="none" stroke="rgba(255,255,255,0.09)" stroke-width="1"/>
      <circle cx="65" cy="65" r="52" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="10" stroke-linecap="round" stroke-dasharray="${C}" transform="rotate(-90 65 65)"/>
      <circle cx="65" cy="65" r="52" fill="none" stroke="${accentColor}" stroke-width="10" stroke-linecap="round" stroke-dasharray="${dash} ${C}" transform="rotate(-90 65 65)" filter="url(#gg)"/>
      <circle cx="65" cy="65" r="52" fill="none" stroke="rgba(255,255,255,0.20)" stroke-width="2" stroke-linecap="round" stroke-dasharray="${dash * 0.3} ${C}" transform="rotate(-90 65 65)"/>
      <text x="65" y="60" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="26" font-weight="700" font-family="system-ui,sans-serif" letter-spacing="-1">${score}</text>
      <text x="65" y="79" text-anchor="middle" dominant-baseline="middle" fill="rgba(255,255,255,0.45)" font-size="10" font-family="system-ui,sans-serif" letter-spacing="2">SCORE</text>
    </svg>`;

    const areasRows = areas && areas.length > 0
      ? areas.slice(0, 8).map(a => `
          <div class="area-row">
            <span class="area-name">${a.name}</span>
            ${a.score !== undefined ? `<span class="area-score">${a.score}%</span>` : ""}
          </div>`).join("")
      : "";

    const logoHtml = [
      displaySchoolLogo ? `<img src="${displaySchoolLogo}" class="logo-img"/>` : "",
      displayOrgLogo   ? `<img src="${displayOrgLogo}"   class="logo-img"/>` : "",
    ].join("");

    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>Certificate — ${toolName}</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
@page{size:A4 portrait;margin:0}
html,body{
  width:210mm;height:297mm;
  -webkit-print-color-adjust:exact;print-color-adjust:exact;
  font-family:system-ui,-apple-system,sans-serif;
}
.page{
  width:210mm;height:297mm;
  background:linear-gradient(145deg,#060A12 0%,#0D0A1A 50%,${accentColor}1A 100%);
  padding:14mm 14mm 10mm;
  display:flex;flex-direction:column;gap:8mm;
  position:relative;overflow:hidden;
}
/* ambient glows */
.page::before{
  content:'';position:absolute;top:-40mm;right:-40mm;
  width:120mm;height:120mm;border-radius:50%;
  background:radial-gradient(circle,${accentColor}28 0%,transparent 70%);
  pointer-events:none;
}
.page::after{
  content:'';position:absolute;bottom:-30mm;left:-30mm;
  width:100mm;height:100mm;border-radius:50%;
  background:radial-gradient(circle,rgba(167,139,250,0.18) 0%,transparent 70%);
  pointer-events:none;
}

/* top bar */
.topbar{display:flex;justify-content:space-between;align-items:center;position:relative;z-index:1}
.logo-img{height:48px;object-fit:contain;border-radius:8px;background:rgba(255,255,255,0.06);padding:4px;margin-right:8px}
.tool-pill{
  display:inline-flex;align-items:center;gap:6px;
  padding:5px 14px;border-radius:999px;
  background:rgba(255,255,255,0.08);
  border:1.5px solid ${accentColor}88;
  font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#fff;
}
.dot{width:6px;height:6px;border-radius:50%;background:${accentColor};display:inline-block}

/* body row */
.body{display:flex;gap:8mm;flex:1;position:relative;z-index:1;align-items:flex-start}

/* glass info panel */
.info-panel{
  flex:1;
  background:rgba(255,255,255,0.07);
  border:1px solid rgba(255,255,255,0.14);
  border-top-color:rgba(255,255,255,0.22);
  border-radius:16px;
  padding:7mm 8mm;
  position:relative;
}
.certifies{font-size:9px;font-weight:600;color:rgba(255,255,255,0.38);letter-spacing:.14em;text-transform:uppercase;margin-bottom:4px}
.school-name{font-size:22px;font-weight:700;color:#fff;line-height:1.2;margin-bottom:3px}
.tool-sub{font-size:11px;color:rgba(255,255,255,0.48);margin-bottom:6mm}
.tool-sub strong{color:rgba(255,255,255,0.75);font-weight:600}
.field-row{display:flex;gap:8px;margin-bottom:4px;align-items:baseline}
.field-label{font-size:8px;font-weight:700;color:rgba(255,255,255,0.32);text-transform:uppercase;letter-spacing:.12em;min-width:22mm}
.field-value{font-size:11px;color:rgba(255,255,255,0.78);font-weight:500}
.divider{height:1px;background:rgba(255,255,255,0.08);margin:5mm 0}
.sig-rule{width:40mm;height:1px;background:rgba(255,255,255,0.25);margin-bottom:4px}
.sig-name{font-size:11px;color:rgba(255,255,255,0.6);font-style:italic}
.sig-role{font-size:8px;color:rgba(255,255,255,0.28);text-transform:uppercase;letter-spacing:.08em;margin-top:2px}

/* right column */
.right-col{display:flex;flex-direction:column;align-items:center;gap:5mm;width:48mm}
.rating-pill{
  display:inline-flex;align-items:center;justify-content:center;
  padding:5px 14px;border-radius:999px;width:100%;
  background:rgba(255,255,255,0.08);
  border:1.5px solid ${ratingColor}99;
  font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;
  color:${ratingColor};
}

/* areas panel */
.areas-panel{
  background:rgba(255,255,255,0.06);
  border:1px solid rgba(255,255,255,0.12);
  border-top-color:rgba(255,255,255,0.18);
  border-radius:14px;
  padding:5mm 5mm;
  width:100%;
}
.areas-heading{font-size:8px;font-weight:700;color:rgba(255,255,255,0.32);letter-spacing:.14em;text-transform:uppercase;margin-bottom:4mm}
.area-row{display:flex;justify-content:space-between;align-items:center;padding:2px 0;border-bottom:1px solid rgba(255,255,255,0.05)}
.area-row:last-child{border-bottom:none}
.area-name{font-size:9px;color:rgba(255,255,255,0.65);flex:1;padding-right:4px}
.area-score{font-size:9px;font-weight:700;color:${accentColor};white-space:nowrap}

/* footer */
.footer{display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(255,255,255,0.06);padding-top:4mm;position:relative;z-index:1}
.footer-brand{font-size:8px;color:rgba(255,255,255,0.18);letter-spacing:.12em;font-weight:600;text-transform:uppercase}
.footer-ref{font-size:8px;color:rgba(255,255,255,0.18);letter-spacing:.1em}
</style></head><body>
<div class="page">
  <div class="topbar">
    <div style="display:flex;align-items:center">${logoHtml || '<div style="width:48px;height:48px"></div>'}</div>
    <span class="tool-pill"><span class="dot"></span>${toolName} · Assessment Certificate</span>
  </div>

  <div class="body">
    <div class="info-panel">
      <p class="certifies">This is to certify that</p>
      <p class="school-name">${meta.schoolName || "School Name"}</p>
      <p class="tool-sub">has completed the <strong>${toolName}</strong></p>

      <div class="field-row"><span class="field-label">Completed by</span><span class="field-value">${meta.staffMember || "—"}</span></div>
      <div class="field-row"><span class="field-label">Consultant</span><span class="field-value">${meta.consultantName || "Mathew Hewington"}</span></div>
      <div class="field-row"><span class="field-label">Date</span><span class="field-value">${today}</span></div>

      <div class="divider"></div>
      <div class="sig-rule"></div>
      <p class="sig-name">${meta.consultantName || "Mathew Hewington"}</p>
      <p class="sig-role">Education Consultant</p>
    </div>

    <div class="right-col">
      ${gaugesvg}
      <span class="rating-pill">${rating}</span>
      ${areasRows ? `<div class="areas-panel"><p class="areas-heading">Areas assessed</p>${areasRows}</div>` : ""}
    </div>
  </div>

  <div class="footer">
    <span class="footer-brand">SafeShield · Verified Assessment</span>
    <span class="footer-ref">${certId}</span>
  </div>
</div>
</body></html>`);
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
