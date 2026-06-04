"use client";
import { useRef } from "react";
import { Printer, Mail, ShieldCheck } from "lucide-react";
import type { ReportMetaData } from "./ReportMeta";

type Props = {
  meta: ReportMetaData;
  toolName: string;
  score: number;
  rating: string;
  ratingColor: string;
  date?: string;
  accentColor?: string;
};

export default function Certificate({
  meta,
  toolName,
  score,
  rating,
  ratingColor,
  date,
  accentColor = "#38BDF8",
}: Props) {
  const certRef = useRef<HTMLDivElement>(null);
  const today = date ?? new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  function handlePrint() {
    const content = certRef.current?.innerHTML;
    if (!content) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`
      <html><head><title>Certificate — ${toolName}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #fff; color: #1e293b; }
        .cert { width: 210mm; min-height: 148mm; padding: 16mm 20mm; border: 3px solid #0f172a; position: relative; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10mm; }
        .logo-wrap img { height: 48px; object-fit: contain; }
        .brand { display: flex; align-items: center; gap: 8px; }
        .brand-name { font-size: 14px; font-weight: 700; color: #0f172a; }
        .title-section { text-align: center; margin-bottom: 8mm; }
        .cert-label { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #64748b; margin-bottom: 4px; }
        .cert-title { font-size: 22px; font-weight: 700; color: #0f172a; margin-bottom: 2px; }
        .cert-sub { font-size: 12px; color: #64748b; }
        .school-name { font-size: 28px; font-weight: 800; color: #0f172a; text-align: center; margin: 6mm 0; }
        .score-row { display: flex; justify-content: center; align-items: center; gap: 16px; margin: 6mm 0; }
        .score-circle { width: 72px; height: 72px; border-radius: 50%; border: 3px solid #0f172a; display: flex; align-items: center; justify-content: flex-direction: column; flex-direction: column; justify-content: center; align-items: center; }
        .score-num { font-size: 24px; font-weight: 800; }
        .score-label { font-size: 8px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; }
        .rating { font-size: 18px; font-weight: 700; }
        .footer { display: grid; grid-template-columns: 1fr 1fr; gap: 8mm; margin-top: 8mm; padding-top: 6mm; border-top: 1px solid #e2e8f0; }
        .sig-block { }
        .sig-label { font-size: 8px; text-transform: uppercase; letter-spacing: 2px; color: #94a3b8; margin-bottom: 6px; }
        .sig-name { font-size: 13px; font-weight: 600; color: #0f172a; }
        .sig-role { font-size: 10px; color: #64748b; }
        .date-row { text-align: center; font-size: 10px; color: #94a3b8; margin-top: 4mm; }
        .watermark { position: absolute; bottom: 12mm; right: 16mm; font-size: 8px; color: #cbd5e1; letter-spacing: 1px; }
      </style>
      </head><body>${content}</body></html>
    `);
    w.document.close();
    w.print();
  }

  function handleEmail() {
    const subject = encodeURIComponent(`${toolName} Certificate — ${meta.schoolName}`);
    const body = encodeURIComponent(
      `Dear ${meta.schoolName},\n\nPlease find attached the ${toolName} certificate completed on ${today}.\n\nAssessment Summary:\n• Score: ${score}%\n• Rating: ${rating}\n• Staff Member: ${meta.staffMember}\n• Consultant: ${meta.consultantName}\n\nThis certificate was generated via SafeShield Tools.\n\nKind regards,\n${meta.consultantName}`
    );
    const recipients = [meta.schoolEmail, meta.consultantEmail].filter(Boolean).join(",");
    window.location.href = `mailto:${recipients}?subject=${subject}&body=${body}`;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Certificate preview */}
      <div
        ref={certRef}
        className="cert bg-white text-[#1e293b] rounded-2xl overflow-hidden"
        style={{ border: "3px solid #0f172a", padding: "40px 48px", fontFamily: "system-ui, sans-serif" }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            {meta.logoDataUrl ? (
              <img src={meta.logoDataUrl} alt="School logo" style={{ height: 48, objectFit: "contain" }} />
            ) : (
              <div style={{ width: 48, height: 48, background: "#f1f5f9", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 10, color: "#94a3b8", textAlign: "center", lineHeight: 1.2 }}>School<br/>Logo</span>
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, background: "#0f172a", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShieldCheck size={16} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>SafeShield</span>
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <p style={{ fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: "#94a3b8", marginBottom: 6 }}>Certificate of Assessment</p>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>{toolName}</h1>
          <p style={{ fontSize: 11, color: "#64748b" }}>This certifies that the following institution has completed an assessment</p>
        </div>

        {/* School name */}
        <div style={{ textAlign: "center", margin: "20px 0", padding: "16px", background: "#f8fafc", borderRadius: 12 }}>
          <p style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#94a3b8", marginBottom: 4 }}>School / Trust</p>
          <p style={{ fontSize: 26, fontWeight: 800, color: "#0f172a" }}>{meta.schoolName || "—"}</p>
        </div>

        {/* Score */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 24, margin: "20px 0" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", border: `3px solid ${ratingColor}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: ratingColor }}>{score}%</span>
            </div>
            <span style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: 1, color: "#94a3b8" }}>Score</span>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 22, fontWeight: 800, color: ratingColor }}>{rating}</p>
            <span style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: 1, color: "#94a3b8" }}>Rating</span>
          </div>
        </div>

        {/* Footer signatures */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 24, paddingTop: 20, borderTop: "1px solid #e2e8f0" }}>
          <div>
            <p style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: 2, color: "#94a3b8", marginBottom: 6 }}>Staff Member</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{meta.staffMember || "—"}</p>
          </div>
          <div>
            <p style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: 2, color: "#94a3b8", marginBottom: 6 }}>Consultant</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{meta.consultantName || "—"}</p>
            <p style={{ fontSize: 10, color: "#64748b" }}>Winchester Consultancy</p>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 9, color: "#94a3b8", marginTop: 16 }}>
          Completed: {today} · Generated by SafeShield Tools · safeshield-tool-app.vercel.app
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ background: `rgba(56,189,248,0.1)`, border: `1px solid rgba(56,189,248,0.25)`, color: accentColor }}
        >
          <Printer size={14} /> Print / Save PDF
        </button>
        {(meta.schoolEmail || meta.consultantEmail) && (
          <button
            onClick={handleEmail}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all bg-white/5 border border-white/10 text-[#94A3B8] hover:text-white hover:border-white/20"
          >
            <Mail size={14} /> Email Certificate
          </button>
        )}
      </div>
    </div>
  );
}
