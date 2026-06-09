import AuthGuard from "@/components/ui/AuthGuard";
import GovernorDashboard from "@/components/forms/GovernorDashboard";
import GlassCard from "@/components/ui/GlassCard";
import { LayoutDashboard } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Governor Digital Assurance Dashboard | SafeShield",
  description: "A governance oversight view of your school's digital safety and compliance assessments across all SafeShield tools.",
};

export default function GovernorDashboardPage() {
  return (
    <AuthGuard toolSlug="governor-dashboard">
    <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="pt-10 pb-10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)]">
              <LayoutDashboard size={22} className="text-[#10B981]" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[#10B981] text-xs font-medium uppercase tracking-widest mb-1">Governor Assurance</p>
              <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>Governor Digital Assurance Dashboard</h1>
              <p className="text-sm max-w-xl leading-relaxed" style={{ color: "var(--text-muted)" }}>
                A governance oversight view of your school&apos;s digital safety and compliance assessments across all SafeShield tools.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <GovernorDashboard />
            </div>
            <div className="flex flex-col gap-4">
              <GlassCard>
                <h2 className="font-semibold text-sm uppercase tracking-wider mb-3" style={{ color: "var(--text)" }}>Governor Guidance</h2>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-faint)" }}>
                  This dashboard provides governors with a high-level view of the school&apos;s digital safety compliance across all assessment areas. Use the suite status panel to identify gaps, track progress, and prioritise governor questions at board meetings.
                </p>
              </GlassCard>
              <GlassCard>
                <h2 className="font-semibold text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text)" }}>Governor Responsibilities</h2>
                <ul className="flex flex-col gap-1.5">
                  {["KCSIE 2024 — Governor Oversight", "DfE Governance Handbook 2023", "Ofsted Education Inspection Framework", "UK GDPR — Controller Accountability", "DfE Digital Strategy for Schools", "ICO Accountability Framework"].map((l) => (
                    <li key={l} className="text-xs" style={{ color: "var(--text-faint)" }}>· {l}</li>
                  ))}
                </ul>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
