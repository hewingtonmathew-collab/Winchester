import OfstedChecker from "@/components/forms/OfstedChecker";
import GlassCard from "@/components/ui/GlassCard";
import { CheckSquare } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ofsted Ready Checker | SafeShield",
  description: "Self-evaluate your school's readiness across the Ofsted Education Inspection Framework. Free tool for school leaders.",
};

export default function OfstedPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-10 pb-10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-[rgba(74,222,128,0.1)] border border-[rgba(74,222,128,0.2)]">
            <CheckSquare size={22} className="text-[#4ADE80]" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[#4ADE80] text-xs font-medium uppercase tracking-widest mb-1">Inspection</p>
            <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>Ofsted Ready Checker</h1>
            <p className="text-sm max-w-xl leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Self-evaluate your school's readiness across all four Ofsted EIF judgement areas plus SEND and inclusion. Identify strengths, areas for improvement, and inspection risks.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            <OfstedChecker />
          </div>
          <div className="flex flex-col gap-4">
            <GlassCard>
              <h2 className="font-semibold text-sm uppercase tracking-wider mb-3" style={{ color: "var(--text)" }}>EIF Framework Areas</h2>
              <ul className="flex flex-col gap-2">
                {["Quality of Education", "Behaviour & Attitudes", "Personal Development", "Leadership & Management", "SEND & Inclusion"].map((a) => (
                  <li key={a} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-dim)" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] shrink-0" />{a}
                  </li>
                ))}
              </ul>
            </GlassCard>
            <GlassCard>
              <h2 className="font-semibold text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text)" }}>Rating Scale</h2>
              <div className="flex flex-col gap-1.5">
                {[["Outstanding", "#3B82F6"], ["Good", "#22c55e"], ["Requires Improvement", "#f59e0b"], ["Inadequate", "#ef4444"]].map(([l, c]) => (
                  <div key={l} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c }} />
                    <span className="text-xs" style={{ color: "var(--text-faint)" }}>{l}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
            <GlassCard>
              <h2 className="font-semibold text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text)" }}>Framework Alignment</h2>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-faint)" }}>
                Questions are aligned to the Ofsted Education Inspection Framework (EIF) 2023, the SEND Code of Practice, and the DfE's statutory guidance on school inspection.
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
