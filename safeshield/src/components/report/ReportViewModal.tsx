"use client";
import { useState } from "react";
import { X, Award, BarChart3, ClipboardList, Printer, Mail } from "lucide-react";
import Certificate from "@/components/report/Certificate";
import ImprovementReport, { type Gap } from "@/components/report/ImprovementReport";
import type { ReportMetaData } from "./ReportMeta";

export type ReportViewData = {
  meta: ReportMetaData;
  toolName: string;
  score: number;
  rating: string;
  ratingColor: string;
  accentColor: string;
  date: string;
  areas?: { name: string; score?: number }[];
  gaps?: Gap[];
};

export default function ReportViewModal({ data, onClose }: { data: ReportViewData; onClose: () => void }) {
  const [tab, setTab] = useState<"certificate" | "report" | "recommendations">("certificate");
  const [emailSending, setEmailSending] = useState(false);
  const areas = data.areas ?? [];
  const gaps = data.gaps ?? [];

  const accentColor = data.accentColor || "#38BDF8";
  const ratingColor = data.ratingColor || "#22c55e";

  function buildReportDetailsHtml() {
    const barSection = areas.map(a => {
      const pct = a.score ?? 0;
      const barColor = pct >= 80 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";
      return `
        <div style="margin-bottom:14px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <span style="font-size:13px;color:#C8D8E8">${a.name}</span>
            ${a.score !== undefined ? `<span style="font-size:13px;font-weight:700;color:${barColor}">${pct}%</span>` : ""}
          </div>
          ${a.score !== undefined ? `
          <div style="height:8px;border-radius:999px;background:rgba(255,255,255,0.07);overflow:hidden">
            <div style="height:100%;border-radius:999px;width:${pct}%;background:${barColor}"></div>
          </div>` : ""}
        </div>`;
    }).join("");

    return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>Report Details — ${data.toolName}</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
@page{size:A4 portrait;margin:0}
html,body{width:210mm;-webkit-print-color-adjust:exact;print-color-adjust:exact;font-family:system-ui,-apple-system,sans-serif}
.page{width:210mm;min-height:297mm;padding:14mm 16mm;background:linear-gradient(160deg,#060A12 0%,#0C0A1C 60%,${accentColor}12 100%)}
</style></head><body>
<div class="page">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10mm">
    <div>
      <p style="font-size:9px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:${accentColor};margin-bottom:4px">Report Details</p>
      <p style="font-size:26px;font-weight:700;color:#E8EDF2;letter-spacing:-.5px;line-height:1.1">${data.toolName}</p>
      <p style="font-size:11px;color:#8A9BB0;margin-top:4px">${data.date}${data.meta.staffMember ? ` · ${data.meta.staffMember}` : ""}</p>
    </div>
    <div style="text-align:right">
      <p style="font-size:38px;font-weight:700;color:${accentColor};line-height:1">${data.score}%</p>
      <p style="font-size:13px;color:${ratingColor};font-weight:600;margin-top:2px">${data.rating}</p>
    </div>
  </div>
  <div style="height:2px;border-radius:2px;background:linear-gradient(90deg,${accentColor},rgba(167,139,250,0.6),transparent);margin-bottom:9mm"></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:4mm 8mm;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);border-radius:14px;padding:5mm 6mm;margin-bottom:9mm">
    <div><label style="font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:#8A9BB0;display:block;margin-bottom:3px">School / Trust</label><span style="font-size:12px;color:#D8E4F0;font-weight:500">${data.meta.schoolName || "—"}</span></div>
    <div><label style="font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:#8A9BB0;display:block;margin-bottom:3px">Consultant</label><span style="font-size:12px;color:#D8E4F0;font-weight:500">${data.meta.consultantName || "Mathew Hewington"}</span></div>
    ${data.meta.staffMember ? `<div><label style="font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:#8A9BB0;display:block;margin-bottom:3px">Completed By</label><span style="font-size:12px;color:#D8E4F0;font-weight:500">${data.meta.staffMember}</span></div>` : ""}
    ${data.meta.schoolEmail ? `<div><label style="font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:#8A9BB0;display:block;margin-bottom:3px">School Email</label><span style="font-size:12px;color:#D8E4F0;font-weight:500">${data.meta.schoolEmail}</span></div>` : ""}
  </div>
  ${areas.length > 0 ? `
  <p style="font-size:9px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#8A9BB0;margin-bottom:5mm;padding-bottom:3mm;border-bottom:1px solid rgba(255,255,255,0.10)">Areas Assessed</p>
  ${barSection}` : ""}
  <div style="margin-top:12mm;padding-top:4mm;border-top:1px solid rgba(255,255,255,0.10);display:flex;justify-content:space-between">
    <span style="font-size:8px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#8A9BB0">SafeShield · Verified Assessment Report</span>
    <span style="font-size:8px;color:#8A9BB0;letter-spacing:.08em">${data.date}</span>
  </div>
</div>
</body></html>`;
  }

  function handlePrintReportDetails() {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(buildReportDetailsHtml());
    w.document.close();
    setTimeout(() => w.print(), 400);
  }

  async function handleEmailReportDetails() {
    const recipients = [data.meta.schoolEmail, data.meta.consultantEmail].filter(Boolean) as string[];
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
          subject: `${data.toolName} Report Details — ${data.meta.schoolName}`,
          html: buildReportDetailsHtml(),
          type: "report",
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Send failed");
      alert(`Report emailed to ${recipients.join(", ")}`);
    } catch (err: unknown) {
      alert(`Failed to send: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setEmailSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 backdrop-blur-sm p-4 sm:p-8"
      onClick={onClose}>
      <div className="relative w-full max-w-3xl my-8" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose}
          className="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center bg-[#0F172A] border border-white/15 hover:bg-white/10 transition-all"
          title="Close">
          <X size={16} className="text-white" />
        </button>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 justify-center flex-wrap">
          {([["certificate", "Certificate", Award], ["report", "Report Details", BarChart3], ["recommendations", "Recommendations", ClipboardList]] as const).map(([key, label, Icon]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${tab === key ? "bg-[rgba(56,189,248,0.15)] border-[rgba(56,189,248,0.3)] text-[#38BDF8]" : "bg-white/5 border-white/10 text-[#94A3B8] hover:bg-white/10"}`}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {tab === "certificate" ? (
          <Certificate
            meta={data.meta}
            toolName={data.toolName}
            score={data.score}
            rating={data.rating}
            ratingColor={data.ratingColor}
            accentColor={data.accentColor}
            date={data.date}
            areas={areas}
          />
        ) : tab === "recommendations" ? (
          gaps.length > 0 ? (
            <ImprovementReport
              meta={data.meta}
              toolName={data.toolName}
              score={data.score}
              rating={data.rating}
              ratingColor={data.ratingColor}
              gaps={gaps}
              accentColor={data.accentColor}
            />
          ) : (
            <div className="rounded-2xl bg-[#0B1220] border border-white/10 p-8 text-center">
              <p className="text-sm text-[#64748B]">No improvement recommendations were saved for this assessment.</p>
              <p className="text-xs text-[#475569] mt-2">Recommendations are captured on assessments completed after this feature was added.</p>
            </div>
          )
        ) : (
          <div className="rounded-2xl bg-[#0B1220] border border-white/10 p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: accentColor }}>{data.toolName}</p>
                <h3 className="text-xl font-bold" style={{ color: "#E8EDF2" }}>{data.meta.schoolName}</h3>
                <p className="text-xs mt-0.5" style={{ color: "#8A9BB0" }}>
                  {data.date}{data.meta.staffMember ? ` · ${data.meta.staffMember}` : ""}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-3xl font-bold" style={{ color: accentColor }}>{data.score}%</p>
                <p className="text-xs font-semibold" style={{ color: ratingColor }}>{data.rating}</p>
              </div>
            </div>

            {areas.length === 0 ? (
              <p className="text-sm text-[#64748B] text-center py-8">No area breakdown was saved for this assessment.</p>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#8A9BB0" }}>Areas covered</p>
                {areas.map((a, i) => {
                  const pct = a.score ?? 0;
                  const barColor = pct >= 80 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm" style={{ color: "#C8D8E8" }}>{a.name}</span>
                        {a.score !== undefined && (
                          <span className="text-sm font-semibold" style={{ color: barColor }}>{pct}%</span>
                        )}
                      </div>
                      {a.score !== undefined && (
                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: barColor }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {(data.meta.consultantName || data.meta.schoolEmail) && (
              <div className="mt-6 pt-4 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {data.meta.schoolEmail && (
                  <div><span style={{ color: "#8A9BB0" }}>School email: </span><span style={{ color: "#C8D8E8" }}>{data.meta.schoolEmail}</span></div>
                )}
                {data.meta.consultantName && (
                  <div><span style={{ color: "#8A9BB0" }}>Consultant: </span><span style={{ color: "#C8D8E8" }}>{data.meta.consultantName}</span></div>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap gap-3 items-center">
              <button onClick={handlePrintReportDetails}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}40`, color: accentColor }}>
                <Printer size={14} /> Print / Save PDF
              </button>
              <button onClick={handleEmailReportDetails} disabled={emailSending}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#C8D8E8",
                  opacity: emailSending ? 0.6 : 1, cursor: emailSending ? "default" : "pointer" }}>
                <Mail size={14} /> {emailSending ? "Sending…" : "Email Report"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
