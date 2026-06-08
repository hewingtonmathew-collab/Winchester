import AuthGuard from "@/components/ui/AuthGuard";
import OfstedChecker from "@/components/forms/OfstedChecker";
import GlassCard from "@/components/ui/GlassCard";
import ToolPageHeader from "@/components/ui/ToolPageHeader";
import { IconOfsted } from "@/components/ui/ToolIcons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ofsted Ready Checker | SafeShield",
  description: "Self-evaluate your school's readiness across the Ofsted Education Inspection Framework. Free tool for school leaders.",
};

const COLOR = "#4ADE80";
const AREAS = ["Quality of Education", "Behaviour & Attitudes", "Personal Development", "Leadership & Management", "SEND & Inclusion"];

export default function OfstedPage() {
  return (
    <AuthGuard toolSlug="ofsted">
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ToolPageHeader
            icon={IconOfsted}
            badge="Inspection"
            title="Ofsted Ready Checker"
            description="Self-evaluate your school's readiness across all four Ofsted EIF judgement areas plus SEND and inclusion. Identify strengths, areas for improvement, and inspection risks."
            color={COLOR}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <OfstedChecker />
            </div>
            <div className="flex flex-col gap-4">
              <GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: COLOR }}>EIF Framework Areas</h2>
                <ul className="flex flex-col gap-2">
                  {AREAS.map((a) => (
                    <li key={a} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: COLOR }} />{a}
                    </li>
                  ))}
                </ul>
              </GlassCard>
              <GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: COLOR }}>Rating Scale</h2>
                <div className="flex flex-col gap-1.5">
                  {[["Outstanding", "#3B82F6"], ["Good", "#22c55e"], ["Requires Improvement", "#f59e0b"], ["Inadequate", "#ef4444"]].map(([l, c]) => (
                    <div key={l} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c }} />
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>{l}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
              <GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: COLOR }}>Framework Alignment</h2>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  Aligned to the Ofsted Education Inspection Framework (EIF) 2023, the SEND Code of Practice, and the DfE's statutory guidance on school inspection.
                </p>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
