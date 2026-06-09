import AuthGuard from "@/components/ui/AuthGuard";
import SendDigitalChecker from "@/components/forms/SendDigitalChecker";
import GlassCard from "@/components/ui/GlassCard";
import { Accessibility } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEND Digital Impact Review | SafeShield",
  description: "Review the effectiveness of your school's use of assistive technology and digital tools to support pupils with special educational needs and disabilities.",
};

export default function SendDigitalPage() {
  return (
    <AuthGuard toolSlug="send-digital">
    <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="pt-10 pb-10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.2)]">
              <Accessibility size={22} className="text-[#8B5CF6]" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[#8B5CF6] text-xs font-medium uppercase tracking-widest mb-1">SEND & Inclusion</p>
              <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>SEND Digital Impact Review</h1>
              <p className="text-sm max-w-xl leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Review the effectiveness of your school's use of assistive technology and digital tools to support pupils with special educational needs and disabilities.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <SendDigitalChecker />
            </div>
            <div className="flex flex-col gap-4">
              <GlassCard>
                <h2 className="font-semibold text-sm uppercase tracking-wider mb-3" style={{ color: "var(--text)" }}>Assessment Areas</h2>
                <ul className="flex flex-col gap-2">
                  {[
                    "Assistive Technology",
                    "EHCP & Digital Access",
                    "Staff CPD",
                    "Parental Involvement",
                    "Monitoring & Outcomes",
                  ].map((area) => (
                    <li key={area} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-dim)" }}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#8B5CF6" }} />{area}
                    </li>
                  ))}
                </ul>
              </GlassCard>
              <GlassCard>
                <h2 className="font-semibold text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text)" }}>Key Frameworks</h2>
                <ul className="flex flex-col gap-1.5">
                  {[
                    "SEND Code of Practice 2015",
                    "Equality Act 2010",
                    "Children & Families Act 2014",
                    "DfE SEND Review 2023",
                    "AbilityNet Digital Accessibility",
                    "Web Content Accessibility Guidelines (WCAG) 2.2",
                  ].map((l) => (
                    <li key={l} className="text-xs" style={{ color: "var(--text-faint)" }}>· {l}</li>
                  ))}
                </ul>
              </GlassCard>
              <GlassCard>
                <h2 className="font-semibold text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text)" }}>Rating Scale</h2>
                <div className="flex flex-col gap-1.5">
                  {[["Inclusive", "#22c55e"], ["Developing", "#f59e0b"], ["Requires Improvement", "#ef4444"]].map(([l, c]) => (
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
