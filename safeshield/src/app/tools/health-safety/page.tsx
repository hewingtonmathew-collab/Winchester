"use client";
import AuthGuard from "@/components/ui/AuthGuard";
import HealthSafetyChecker from "@/components/forms/HealthSafetyChecker";
import GlassCard from "@/components/ui/GlassCard";
import ToolPageIcon from "@/components/ui/ToolPageIcon";
import { HardHat } from "lucide-react";

export default function HealthSafetyPage() {
  return (
    <AuthGuard toolSlug="health-safety">
    <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="pt-10 pb-10 flex items-start gap-4">
            <ToolPageIcon slug="health-safety" DefaultIcon={HardHat} color="#F97316" colorDim="rgba(249,115,22,0.1)" colorBorder="rgba(249,115,22,0.2)" />
            <div>
              <p className="text-[#F97316] text-xs font-medium uppercase tracking-widest mb-1">Health & Safety</p>
              <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>Health &amp; Safety Compliance Checker</h1>
              <p className="text-sm max-w-xl leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Assess your school's compliance with health and safety legislation across six key areas: fire safety, COSHH, premises, policies and documentation, staff and pupil welfare, and contractor management.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <HealthSafetyChecker />
            </div>
            <div className="flex flex-col gap-4">
              <GlassCard>
                <h2 className="font-semibold text-sm uppercase tracking-wider mb-3" style={{ color: "var(--text)" }}>Assessment Areas</h2>
                <ul className="flex flex-col gap-2">
                  {[
                    ["Fire Safety", "#F87171"],
                    ["COSHH", "#FB923C"],
                    ["Premises & Facilities", "#FBBF24"],
                    ["Policies & Documentation", "#A78BFA"],
                    ["Staff & Pupil Welfare", "#34D399"],
                    ["Contractors & Visitors", "#38BDF8"],
                  ].map(([area, color]) => (
                    <li key={area} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-dim)" }}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />{area}
                    </li>
                  ))}
                </ul>
              </GlassCard>
              <GlassCard>
                <h2 className="font-semibold text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text)" }}>Legislation Covered</h2>
                <ul className="flex flex-col gap-1.5">
                  {["Health & Safety at Work Act 1974", "Regulatory Reform (Fire Safety) Order 2005", "COSHH Regulations 2002", "Management of H&S at Work Regs 1999", "RIDDOR 2013", "Electricity at Work Regs 1989"].map((l) => (
                    <li key={l} className="text-xs" style={{ color: "var(--text-faint)" }}>· {l}</li>
                  ))}
                </ul>
              </GlassCard>
              <GlassCard>
                <h2 className="font-semibold text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text)" }}>Rating Scale</h2>
                <div className="flex flex-col gap-1.5">
                  {[["Broadly Compliant", "#22c55e"], ["Mostly Compliant", "#38BDF8"], ["Requires Improvement", "#f59e0b"], ["Significant Risks", "#ef4444"]].map(([l, c]) => (
                    <div key={l} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c }} />
                      <span className="text-xs" style={{ color: "var(--text-faint)" }}>{l}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
