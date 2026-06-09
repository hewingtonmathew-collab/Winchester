import AuthGuard from "@/components/ui/AuthGuard";
import SendDigitalChecker from "@/components/forms/SendDigitalChecker";
import GlassCard from "@/components/ui/GlassCard";
import { Accessibility } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEND Digital Impact Review | SafeShield",
  description: "Assess whether digital technology supports inclusion and removes barriers for SEND pupils, aligned to the SEND Code of Practice, Equality Act 2010 and DfE SEND guidance.",
};

const COLOR = "#8B5CF6";

const AREAS = [
  "Accessibility",
  "Learning Support",
  "Communication Support",
  "EHCP Alignment",
  "Independence",
  "Sensory Considerations",
  "Cognitive Load",
  "Pupil Voice",
  "Parent Engagement",
  "SENCO Review",
];

export default function SendDigitalPage() {
  return (
    <AuthGuard toolSlug="send-digital">
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="pt-10 pb-10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
              <Accessibility size={22} style={{ color: COLOR }} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: COLOR }}>SEND & Inclusion</p>
              <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>SEND Digital Impact Review</h1>
              <p className="text-sm max-w-xl leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Assess whether digital technology supports inclusion and removes barriers for SEND pupils, aligned to the SEND Code of Practice, Equality Act 2010 and DfE SEND guidance.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <SendDigitalChecker />
            </div>
            <div className="flex flex-col gap-4">
              <GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: COLOR }}>Areas Covered</h2>
                <ul className="flex flex-col gap-2">
                  {AREAS.map((a) => (
                    <li key={a} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: COLOR }} />
                      {a}
                    </li>
                  ))}
                </ul>
              </GlassCard>
              <GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: COLOR }}>Framework Alignment</h2>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  Aligned to the SEND Code of Practice 2015, Equality Act 2010, DfE SEND guidance and the Assistive Technology Good Practice Guide.
                </p>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
